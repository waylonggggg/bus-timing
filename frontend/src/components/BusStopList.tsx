import type { BusStopTimings } from "@/types/bus"

const loadColor: Record<"SEA" | "SDA" | "LSD" | "-", string> = {
  SEA: "text-green-500",
  SDA: "text-orange-500",
  LSD: "text-red-500",
  "-": ""
}

export default function BusStopList({ busTimingData } : { busTimingData: BusStopTimings}) {
  return (
    <div className="w-2xl rounded-box shadow-md">
      <div className="text-3xl font-semibold text-center p-4 pb-2 tracking-wide">{busTimingData.busStopCode}</div>
      <div className="flex flex-col border rounded-md p-2 gap-y-3">
        {busTimingData.busServices.map((busService) => {
          return (
              <div key={busService.serviceNo} className="flex border-b-gray-950">
                <div className="w-16 text-2xl">{busService.serviceNo}</div>
                <div className="flex-1 grid grid-cols-3">
                  <div className={`${loadColor[busService.nextBusOne.load]} flex justify-center items-center`}>
                    {busService.nextBusOne.timing}
                  </div>
                  <div className={`${loadColor[busService.nextBusTwo.load]} flex justify-center items-center`}>{busService.nextBusTwo.timing}</div>
                  <div className={`${loadColor[busService.nextBusThree.load]} flex justify-center items-center`}>{busService.nextBusThree.timing}</div>
                </div>
              </div>
          )
        })}
      </div>
    </div>
  )
}