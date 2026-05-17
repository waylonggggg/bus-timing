import type { BusServiceTiming } from "@/types/bus"

export default function List({ busTimingData } : { busTimingData: BusServiceTiming}) {
  return (
    <ul className="w-2xl list bg-base-100 rounded-box shadow-md">
  
      {/* <li className="p-4 pb-2 text-xs opacity-60 tracking-wide">Most played songs this week</li> */}
      {busTimingData.busServices.map((busService) => {
        return (
            <li key={busService.serviceNo} className="list-row">
              <div>{busService.serviceNo}</div>
              <div className="flex justify-between">
                <div>{busService.busOneTiming}</div>
                <div>{busService.busTwoTiming}</div>
                <div>{busService.busThreeTiming}</div>
              </div>
            </li>
        )
      })}
      
      
    </ul>
  )
}