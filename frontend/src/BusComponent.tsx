import { useEffect, useState } from "react"
import List from "@/components/BusStopList"
import type { RawBusTimingData, BusServiceInfo, BusStopTimings, NextBusDetails, BusArrivalInfo } from "@/types/bus";

function cleanData(parsedData: RawBusTimingData): BusStopTimings {
  const cleaned: BusServiceInfo[] = parsedData.Services.map(busService => {
    const nowTime = new Date().getTime();

    const parseBusInfo = (nextBusDetails: NextBusDetails): BusArrivalInfo => {
      const timing = nextBusDetails.EstimatedArrival 
                     ? Math.floor((new Date(nextBusDetails.EstimatedArrival).getTime() - nowTime) / 1000 / 60)
                     : "-"
      const load = nextBusDetails.Load;
      
      return {
        timing: timing,
        load: load || "-"
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
    busStopCode: parsedData.BusStopCode,
    busServices: cleaned
  }
}

export default function BusComponent() {
    const [busTiming, setBusTiming] = useState<BusStopTimings>();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
    console.log("Backend url: ", BACKEND_URL);

    useEffect(() => {
			const fetchData = async () => {
        try {
          setIsLoading(true);

          const url = BACKEND_URL + "/bus-timings";
          const response = await fetch(url);

          if (!response.ok) {
            throw new Error()
          }

          const data = await response.json();
          console.log("Bus data: ", data);
          const busTimingData = cleanData(data);
          console.log(busTimingData);
          setBusTiming(busTimingData);
          
        } catch (error) {
          console.log(error);
        } finally {
          setIsLoading(false);
        }
      }

      fetchData();
		}, [])

    return (
        <div className="flex flex-col items-center">
          {isLoading || !busTiming ? (
            <div>Loading</div>
          ) : (
          <>
            <List busTimingData={busTiming!}></List>
          </>
          )}
        </div>
    )
}


