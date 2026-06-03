import fs from 'node:fs';
import path from 'node:path';

type BusStopDetails = {
  BusStopCode: string;
  RoadName: string;
  Description: string;
  Latitude: number;
  Longitude: number;
};

// Fetches the details for each bus stop
async function fetchBusStops() {
  let skips = 0;
  const busStops: BusStopDetails[] = [];

  while (true) {
    const url = new URL(
      'https://datamall2.mytransport.sg/ltaodataservice/BusStops',
    );
    if (skips != 0) url.searchParams.append('$skip', skips.toString());

    try {
      const response = await fetch(url.toString(), {
        headers: { AccountKey: process.env.DATAMALL_API_KEY! },
      });

      if (!response.ok) {
        throw new Error('Error fetching from lta');
        break;
      }

      const data = await response.json();
      const length = data.value.length;

      busStops.push(...data.value);

      if (length < 500) break;
    } catch (error) {
      console.log(error);
      break;
    } finally {
      skips += 500;
    }
  }

  return busStops;
}

type BusRouteDetails = {
  ServiceNo: string;
  Operator: string;
  Direction: number;
  StopSequence: number;
  BusStopCode: string;
  Distance: number;
  WD_FirstBus: string;
  WD_LastBus: string;
  SAT_FirstBus: string;
  SAT_LastBus: string;
  SUN_FirstBus: string;
  SUN_LastBus: string;
};

// fetch all bus routes to see all buses and the bus stops they stop at
async function fetchBusRoutes() {
  let skips = 0;
  const busRoutes: BusRouteDetails[] = [];

  while (true) {
    try {
      const url = new URL(
        'https://datamall2.mytransport.sg/ltaodataservice/BusRoutes',
      );
      if (skips != 0) url.searchParams.append('$skip', skips.toString());

      const response = await fetch(url, {
        headers: { AccountKey: process.env.DATAMALL_API_KEY! },
      });

      if (!response.ok) {
        throw new Error('Error fetching bus routes from LTA Datamall API');
      }

      const data = await response.json();
      const length = data.value.length;

      busRoutes.push(...data.value);
      if (length < 500) break;
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
      }
    } finally {
      skips += 500;
    }
  }

  return busRoutes;
}

type BusStopCode = string;
type ServiceNo = string;

// Cleans the fetchBusRoutes() return value, and returns a map of each
// bus stop to the bus service numbers they serve
function getBusStopServiceNos(
  busRoutes: BusRouteDetails[],
): Record<BusStopCode, ServiceNo[]> {
  const stopToServices: Record<string, string[]> = {};

  for (const busRoute of busRoutes) {
    const busStopCode = busRoute.BusStopCode;
    const serviceNo = busRoute.ServiceNo;

    console.log(`Updating service no. ${serviceNo} map`);

    if (!stopToServices[busStopCode]) {
      stopToServices[busStopCode] = [serviceNo];
    } else {
      stopToServices[busStopCode].push(serviceNo);
    }
  }

  for (const busStop in stopToServices) {
    stopToServices[busStop] = stopToServices[busStop].sort((a, b) =>
      a.localeCompare(b, 'en', {
        numeric: true,
        sensitivity: 'base',
      }),
    );
  }

  return stopToServices;
}

// Call this function to update the json database lmao
async function updateJson() {
  try {
    const busStopData: BusStopDetails[] = await fetchBusStops();
    const busRoutesData: BusRouteDetails[] = await fetchBusRoutes();

    const busStopServiceNos: Record<BusStopCode, ServiceNo[]> =
      getBusStopServiceNos(busRoutesData);

    const busStopDataWithServiceNos = busStopData.map((busStop) => ({
      ...busStop,
      ServiceNos: busStopServiceNos[busStop.BusStopCode],
    }));

    const busStopJson = JSON.stringify(
      { busStops: busStopDataWithServiceNos },
      null,
      2,
    );

    fs.writeFile(
      path.resolve('.', 'data/bus_stops.json'),
      busStopJson,
      (err) => {},
    );
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
    } else {
      console.log('Error updating json');
    }
  }
}
