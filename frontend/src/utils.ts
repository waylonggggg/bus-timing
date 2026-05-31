import type { BusServiceInfo, BusStopTimings, BusTimingResponse, NextBusDetails, BusArrivalInfo } from "./types/bus";

export function cleanData(data: BusTimingResponse): BusStopTimings {
  const cleaned: BusServiceInfo[] = data.Services.map((busService) => {
    const nowTime = new Date().getTime();

    const parseTiming = (estimatedArrival: string) => {
      const arrivalTime = new Date(estimatedArrival).getTime();

      const timing = Math.floor((arrivalTime - nowTime) / 1000 / 60);
      return timing <= 0 ? "Arr" : timing;
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
    busServices: cleaned.sort((a, b) => a.serviceNo.localeCompare(b.serviceNo, "en", {
      numeric: true,
      sensitivity: "base"
    }))
  };
}