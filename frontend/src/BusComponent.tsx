import { useEffect, useState } from "react"
import List from "@/components/BusStopList"
import type { RawBusTimingData, BusServiceTiming, BusStopTimings } from "@/types/bus";

function cleanData(parsedData: RawBusTimingData) {
  let cleaned: BusStopTimings[] = [];

  parsedData.Services.forEach(busService => {
    const nowTime = new Date().getTime();
    const toMinutes = (arrival: string) => {
      return arrival ? Math.floor((new Date(arrival).getTime() - nowTime) / 1000 / 60)
              : "-"
    };

    const [busOneTiming, busTwoTiming, busThreeTiming] = 
        [busService.NextBus, busService.NextBus2, busService.NextBus3].map(bus => toMinutes(bus.EstimatedArrival));

    cleaned.push({
      serviceNo: busService.ServiceNo,
      busOneTiming: busOneTiming,
      busTwoTiming: busTwoTiming,
      busThreeTiming: busThreeTiming
    })
  })

  return {
    busStopCode: parsedData.BusStopCode,
    busServices: cleaned
  };
}

export default function BusComponent() {
    const [busTiming, setBusTiming] = useState<BusServiceTiming>();
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


