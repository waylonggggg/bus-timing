export type BusTimingResponse = {
  'odata.metadata': string;
  BusStopCode: string;
  Services: BusService[];
};

type BusService = {
  ServiceNo: string;
  Operator: string;
  NextBus: NextBusDetails;
  NextBus2: NextBusDetails;
  NextBus3: NextBusDetails;
};

export type NextBusDetails = {
  OriginCode: string;
  DestinationCode: string;
  EstimatedArrival: string;
  Monitored: number;
  Latitude: string;
  Longitude: string;
  VisitNumber: string;
  Load: 'SEA' | 'SDA' | 'LSD' | '';
  Feature: string;
  Type: string;
};

export type BusStopTimings = {
  busStopCode: string;
  busStopName: string;
  busServices: BusServiceInfo[];
};

export type BusServiceInfo = {
  serviceNo: string;
  nextBusOne: BusArrivalInfo;
  nextBusTwo: BusArrivalInfo;
  nextBusThree: BusArrivalInfo;
};

export type BusArrivalInfo = {
  timing: number | 'Arr' | '-';
  load: 'SEA' | 'SDA' | 'LSD' | '-';
};

export type BusStopJson = {
  BusStopCode: string;
  RoadName: string;
  Description: string;
  Latitude: number;
  Longitude: number;
  ServiceNos: string[];
};
