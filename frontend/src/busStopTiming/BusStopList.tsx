import type { BusStopTimings } from '@/types/bus';
import { Button } from '@/components/ui/button';
import { LocateFixedIcon } from 'lucide-react';

const loadColor: Record<'SEA' | 'SDA' | 'LSD' | '-', string> = {
  SEA: 'text-green-500',
  SDA: 'text-yellow-500',
  LSD: 'text-red-500',
  '-': ''
};

type BusStopListProps = {
  busStopName: string;
  busTimingData: BusStopTimings;
  handleClick: () => void;
};

export default function BusStopList({
  busStopName,
  busTimingData,
  handleClick
}: BusStopListProps) {
  return (
    <div className='flex flex-col p-4 w-2xl rounded-xl gap-y-3'>
      <div className='text-3xl font-semibold text-center tracking-wide'>
        {busStopName} - {busTimingData.busStopCode}
      </div>
      <div className='flex flex-col border rounded-md p-3 gap-y-3'>
        {busTimingData.busServices.map(busService => {
          return (
            <div key={busService.serviceNo} className='flex border-b-gray-950'>
              <div className='w-16 text-2xl'>{busService.serviceNo}</div>
              <div className='flex-1 grid grid-cols-3'>
                <div
                  className={`${loadColor[busService.nextBusOne.load]} flex justify-center items-center`}
                >
                  {busService.nextBusOne.timing}
                </div>
                <div
                  className={`${loadColor[busService.nextBusTwo.load]} flex justify-center items-center`}
                >
                  {busService.nextBusTwo.timing}
                </div>
                <div
                  className={`${loadColor[busService.nextBusThree.load]} flex justify-center items-center`}
                >
                  {busService.nextBusThree.timing}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <Button
        onClick={handleClick}
        className='fixed bottom-10 right-10 size-12 rounded-full cursor-pointer'
      >
        <LocateFixedIcon />
      </Button>
    </div>
  );
}
