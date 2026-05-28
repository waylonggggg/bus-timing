import { useEffect, useState } from "react";
import BusStopList from "@/BusStopTiming/BusStopList";
import type {
  BusTimingResponse,
  BusStopTimings,
  NearestBusStopResponse,
  Coordinates
} from "@/types/bus";
import { cleanData } from "@/utils";
import { fetchNearestBusStop, fetchBusTiming } from "../api/bus";
import SkeletonLoader from "@/SkeletonLoader";
import ErrorAlert from "@/ErrorALert";

export default function BusTiming() {
  const [busTiming, setBusTiming] = useState<BusStopTimings>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [nearestBusStopName, setNearestBusStopName] = useState<string>();
  const [error, setError] = useState<string>();

  useEffect(() => {
    const loadBusTiming = async (coords: Coordinates) => {
      try {
        console.log("Loading bus timings");

        const nearestBusStop: NearestBusStopResponse = await fetchNearestBusStop(coords);
        const { nearestBusStopCode, nearestBusStopName } = nearestBusStop;
        setNearestBusStopName(nearestBusStopName);
        console.log("fetched nearest bus stop: ", nearestBusStopName);

        const busTimingData: BusTimingResponse = await fetchBusTiming(nearestBusStopCode);
        const cleanedData = cleanData(busTimingData);
        setBusTiming(cleanedData);
        console.log("fetched bus timings: ", cleanedData);

      } catch (error) {
        console.log(error);

        if (error instanceof Error) {
          setError(error.message);
        } else {
          return
        }
      } finally {
        setIsLoading(false);
      }
    }

    const getPosSuccess = (pos: GeolocationPosition) => {
      console.log("Position gotten");
      const coords: Coordinates = {
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
      };
      loadBusTiming(coords);
    };

    const getPosError = (err: GeolocationPositionError) => {
      setError(err.message);
      setIsLoading(false);
    };
    console.log("fetching current pos");
    navigator.geolocation.getCurrentPosition(getPosSuccess, getPosError);

  }, []);

  if (isLoading) return <SkeletonLoader/>

  if (error) return <ErrorAlert errorDescription={error}/>

  return (
    <BusStopList busStopName={nearestBusStopName!} busTimingData={busTiming!}></BusStopList>
  );
}
