import 'dotenv/config';
import type {
  BusTimingResponse,
  BusStopTimings,
  BusServiceInfo,
  NextBusDetails,
  BusArrivalInfo,
  BusStopJson,
} from './types.js';

export function getDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
) {
  // haversine formnula that calculates great-circle distance between 2 coordinates using
  // latitude and longitude
  // https://www.movable-type.co.uk/scripts/latlong.html

  const earthRadius = 6317e3; // metres
  const latDelta = ((lat1 - lat2) * Math.PI) / 180;
  const lonDelta = ((lon1 - lon2) * Math.PI) / 180;

  const a =
    Math.sin(latDelta / 2) * Math.sin(latDelta / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(lonDelta / 2) *
      Math.sin(lonDelta / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return earthRadius * c;
}

const parseTiming = (estimatedArrival: string) => {
  const nowTime = new Date().getTime();
  const arrivalTime = new Date(estimatedArrival).getTime();

  const timing = Math.floor((arrivalTime - nowTime) / 1000 / 60);
  return timing <= 0 ? 'Arr' : timing;
};

const parseBusInfo = (nextBusDetails: NextBusDetails): BusArrivalInfo => {
  const timing = nextBusDetails.EstimatedArrival
    ? parseTiming(nextBusDetails.EstimatedArrival)
    : '-';
  const load = nextBusDetails.Load ? nextBusDetails.Load : '-';

  return {
    timing: timing,
    load: load,
  };
};

export function cleanData(
  data: BusTimingResponse,
  busStopJson: BusStopJson[],
): BusStopTimings {
  const seen = new Set();
  const cleanedData: BusServiceInfo[] = [];

  data.Services.forEach((busService) => {
    seen.add(busService.ServiceNo);
    cleanedData.push({
      serviceNo: busService.ServiceNo,
      nextBusOne: parseBusInfo(busService.NextBus),
      nextBusTwo: parseBusInfo(busService.NextBus2),
      nextBusThree: parseBusInfo(busService.NextBus3),
    });
  });

  const { busStopName, serviceNos } = getNameAndServiceNos(
    data.BusStopCode,
    busStopJson,
  );
  // O(n)
  for (const serviceNo of serviceNos) {
    if (seen.has(serviceNo)) continue;
    cleanedData.push({
      serviceNo: serviceNo,
      nextBusOne: { timing: '-', load: '-' },
      nextBusTwo: { timing: '-', load: '-' },
      nextBusThree: { timing: '-', load: '-' },
    });
  }

  // O(nlgn)
  return {
    busStopCode: data.BusStopCode,
    busStopName: busStopName,
    busServices: cleanedData.sort((a, b) =>
      a.serviceNo.localeCompare(b.serviceNo, 'en', {
        numeric: true,
        sensitivity: 'base',
      }),
    ),
  };
}

function getNameAndServiceNos(busStopCode: string, busStopJson: BusStopJson[]) {
  const busStop = busStopJson.find(
    (busStop) => busStop.BusStopCode === busStopCode,
  )!;
  return {
    busStopName: busStop.Description,
    serviceNos: busStop.ServiceNos,
  };
}
