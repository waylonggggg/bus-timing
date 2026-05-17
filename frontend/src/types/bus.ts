export type RawBusTimingData = {
  "odata.metadata": string;
  BusStopCode: string;
  Services: BusService[];
}

type BusService = {
  ServiceNo: string;
  Operator: string;
  NextBus: NextBusDetails;
  NextBus2: NextBusDetails;
  NextBus3: NextBusDetails;
}

type NextBusDetails = {
  OriginCode: string;
  DestinationCode: string;
  EstimatedArrival: string;
  Monitored: number;
  Latitude: string;
  Longitude: string;
  VisitNumber: string;
  Load: string;
  Feature: string;
  Type: string;
}

export type CleanedBusTimingData = {
  serviceNo: string,
  busOneTiming: number | "-",
  busTwoTiming: number | "-",
  busThreeTiming: number | "-"
}