import type { BusTimingResponse, NearestBusStopResponse, Coordinates } from "@/types/bus";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export async function fetchNearestBusStop(
  coord: Coordinates
): Promise<NearestBusStopResponse> {
  const url = new URL(BACKEND_URL + "/nearest-bus-stop");
  url.searchParams.append("latitude", coord.latitude.toString());
  url.searchParams.append("longitude", coord.longitude.toString());

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Error fetching nearest bus stop");
  }

  const data = await response.json();
  return data
};

export async function fetchBusTiming(
  nearestBusStopCode: string
): Promise<BusTimingResponse> {
  const url = new URL(BACKEND_URL + "/bus-timings");
  url.searchParams.append("busStopCode", nearestBusStopCode);

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Error fetching bus timings");
  }

  const data = await response.json();
  return data;
};