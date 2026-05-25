import { useEffect, useState } from "react";
import BusStopList from "@/BusStopTiming/BusStopList";
import type {
  BusTimingResponse,
  BusServiceInfo,
  BusStopTimings,
  NextBusDetails,
  BusArrivalInfo,
  NearestBusStopResponse,
  Coordinates
} from "@/types/bus";
import { fetchNearestBusStop, fetchBusTiming } from "../api/bus";

function cleanData(data: BusTimingResponse): BusStopTimings {
  const cleaned: BusServiceInfo[] = data.Services.map((busService) => {
    const nowTime = new Date().getTime();

    const parseTiming = (estimatedArrival: string) => {
      const arrivalTime = new Date(estimatedArrival).getTime();

      const timing = Math.floor((arrivalTime - nowTime) / 1000 / 60);
      return timing <= 0 ? "Arriving" : timing;
    };

    const parseBusInfo = (nextBusDetails: NextBusDetails): BusArrivalInfo => {
      const timing = nextBusDetails.EstimatedArrival
        ? parseTiming(nextBusDetails.EstimatedArrival)
        : "-";
      const load = nextBusDetails.Load ? nextBusDetails.Load : "-";

      return {
        timing: timing,
        load: load,
      };
    };

    return {
      serviceNo: busService.ServiceNo,
      nextBusOne: parseBusInfo(busService.NextBus),
      nextBusTwo: parseBusInfo(busService.NextBus2),
      nextBusThree: parseBusInfo(busService.NextBus3),
    };
  });

  return {
    busStopCode: data.BusStopCode,
    busServices: cleaned,
  };
}

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
