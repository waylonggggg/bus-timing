import { useEffect, useState } from "react"
import BusStopList from "@/components/BusStopList"
import type { RawBusTimingData, BusServiceInfo, BusStopTimings, NextBusDetails, BusArrivalInfo } from "@/types/bus";

function cleanData(data: RawBusTimingData): BusStopTimings {
  const cleaned: BusServiceInfo[] = data.Services.map(busService => {
    const nowTime = new Date().getTime();

    const parseTiming = (estimatedArrival: string) => {
      const arrivalTime = new Date(estimatedArrival).getTime();

      const timing = Math.floor((arrivalTime - nowTime) / 1000 / 60);
      return timing <= 0 ? "Arriving" : timing;
    }

    const parseBusInfo = (nextBusDetails: NextBusDetails): BusArrivalInfo => {
      const timing = nextBusDetails.EstimatedArrival 
                     ? parseTiming(nextBusDetails.EstimatedArrival)
                     : "-"
      const load = nextBusDetails.Load ? nextBusDetails.Load : "-";

      return {
        timing: timing,
        load: load
      }
    }

    return {
      serviceNo: busService.ServiceNo,
      nextBusOne: parseBusInfo(busService.NextBus),
      nextBusTwo: parseBusInfo(busService.NextBus2),
      nextBusThree: parseBusInfo(busService.NextBus3),
    }
  })

  return {
    busStopCode: data.BusStopCode,
    busServices: cleaned
  }
}

type Coordinates = {
  latitude: number;
  longitude: number;
}

export default function BusTiming() {
    const [busTiming, setBusTiming] = useState<BusStopTimings>();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [geolocation, setGeolocation] = useState<Coordinates>();
    const [nearestBusStopCode, setNearestBusStopCode] = useState<string>();
    const [nearestBusStopName, setNearestBusStopName] = useState<string>();
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

    useEffect(() => {
      const success = (pos: GeolocationPosition) => {
        console.log(pos);
        const coords: Coordinates = {
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        }
        setGeolocation(coords);
        fetchNearestBusStop(coords);
      }

      const fail = (err: GeolocationPositionError) => {
        console.log(err);
        return
      }
      navigator.geolocation.getCurrentPosition(success, fail);

      const fetchNearestBusStop = async (coord: Coordinates) => {
        const url = new URL(BACKEND_URL + '/nearest-bus-stop');
        url.searchParams.append("latitude", coord.latitude.toString());
        url.searchParams.append("longitude", coord.longitude.toString());

        try {
          const response = await fetch(url);

          if (!response.ok) {
            throw new Error("Error fetching nearest bus stop");
          }
          
          const data = await response.json();
          const { nearestBusStopCode, nearestBusStopName } = data;
          
          setNearestBusStopCode(nearestBusStopCode);
          setNearestBusStopName(nearestBusStopName);

          console.log(nearestBusStopCode);
          console.log(nearestBusStopName);

          fetchBusTiming(nearestBusStopCode);
          
        } catch (error) {
          console.log(error);
        } finally {

        }
      }
      
			const fetchBusTiming = async (nearestBusStopCode: string) => {
        try {
          setIsLoading(true);

          const url = new URL(BACKEND_URL + "/bus-timings");
          url.searchParams.append("busStopCode", nearestBusStopCode);

          const response = await fetch(url);

          if (!response.ok) {
            throw new Error()
          }

          const data = await response.json();
          const busTimingData = cleanData(data);
          setBusTiming(busTimingData);
          
        } catch (error) {
          console.log(error);
        } finally {
          setIsLoading(false);
        }
      }
      
		}, [])

    return (
        <div className="flex flex-col items-center">
          {isLoading || !busTiming || !nearestBusStopName ? (
            <div>Loading</div>
          ) : (
          <>
            <BusStopList busStopName={nearestBusStopName!} busTimingData={busTiming!}></BusStopList>
          </>
          )}
        </div>
    )
}


