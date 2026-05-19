import type { BusServiceTiming } from "@/types/bus"

export default function BusStopList({ busTimingData } : { busTimingData: BusServiceTiming}) {
  return (
    <div className="w-2xl rounded-box shadow-md">
      <div className="text-3xl font-semibold text-center p-4 pb-2 tracking-wide">{busTimingData.busStopCode}</div>
      <div className="flex flex-col border rounded-md p-2 gap-y-3">
        {busTimingData.busServices.map((busService) => {
          return (
              <div key={busService.serviceNo} className="flex border-b-gray-950">
                <div className="w-16 text-2xl">{busService.serviceNo}</div>
                <div className="flex-1 grid grid-cols-3">
                  <div className="flex justify-center items-center">{busService.busOneTiming}</div>
                  <div className="flex justify-center items-center">{busService.busTwoTiming}</div>
                  <div className="flex justify-center items-center">{busService.busThreeTiming}</div>
                </div>
              </div>
          )
        })}
      </div>
    </div>
  )
}