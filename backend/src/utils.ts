import fs from "node:fs";
import path from "node:path"

export function getDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  // haversine formnula that calculates great-circle distance between 2 coordinates using
  // latitude and longitude
  // https://www.movable-type.co.uk/scripts/latlong.html

  const earthRadius = 6317e3; // metres
  const latDelta = (lat1 - lat2) * Math.PI / 180;
  const lonDelta = (lon1 - lon2) * Math.PI / 180;

  const a = Math.sin(latDelta / 2) * Math.sin(latDelta / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(lonDelta / 2) * Math.sin(lonDelta / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return earthRadius * c;
}

// Util function to fetch all available bus stops and write to a json file in same dir.
// LTA only returns 500 records at a time, have to manually keep fetching until
// get all records
type BusStopDetails = {
  BusStopCode: string;
  RoadName: string;
  Description: string;
  Latitude: number;
  Longitude: number;
}

async function fetchAllBusStops() {
  let skips = 0;
  let busStops: BusStopDetails[] = [];

  while (true) {
    const url = new URL("https://datamall2.mytransport.sg/ltaodataservice/BusStops");
    if (skips != 0) url.searchParams.append("$skip", skips.toString());

    try {
      const response = await fetch(url.toString(), {
        headers: { "AccountKey": process.env.DATAMALL_API_KEY! }
      });

      if (!response.ok) {
        throw new Error("Error fetching from lta");
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

  const busStopsJson = JSON.stringify( { busStops: busStops }, null, 2);

  fs.writeFile(path.resolve(".", "bus_stops.json"), busStopsJson, err => {
    console.log(err);
  })
}