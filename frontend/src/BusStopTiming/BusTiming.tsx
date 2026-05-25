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

export default function BusTiming() {
  const [busTiming, setBusTiming] = useState<BusStopTimings>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [nearestBusStopName, setNearestBusStopName] = useState<string>();

  useEffect(() => {
    const loadBusTiming = async (coords: Coordinates) => {
      try {
        setIsLoading(true);

        const nearestBusStop: NearestBusStopResponse = await fetchNearestBusStop(coords);
        const { nearestBusStopCode, nearestBusStopName } = nearestBusStop;
        setNearestBusStopName(nearestBusStopName);

        const busTimingData: BusTimingResponse = await fetchBusTiming(nearestBusStopCode);
        setBusTiming(cleanData(busTimingData));

      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    }

    const getPosSuccess = (pos: GeolocationPosition) => {
      const coords: Coordinates = {
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
      };
      loadBusTiming(coords);
    };

    const getPosError = (err: GeolocationPositionError) => {
      console.log(err);
      return;
    };
    navigator.geolocation.getCurrentPosition(getPosSuccess, getPosError);

  }, []);

  return (
    <div className="flex flex-col items-center">
      {isLoading || !busTiming || !nearestBusStopName ? (
        <div>Loading</div>
      ) : (
        <>
          <BusStopList
            busStopName={nearestBusStopName!}
            busTimingData={busTiming!}
          ></BusStopList>
        </>
      )}
    </div>
  );
}
