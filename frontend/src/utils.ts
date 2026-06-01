import type {
  BusServiceInfo,
  BusStopTimings,
  BusTimingResponse,
  NextBusDetails,
  BusArrivalInfo,
} from './types/bus';

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
  serviceNos: string[],
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
    busServices: cleanedData.sort((a, b) =>
      a.serviceNo.localeCompare(b.serviceNo, 'en', {
        numeric: true,
        sensitivity: 'base',
      }),
    ),
  };
}
