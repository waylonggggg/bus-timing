import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import type { BusStopTimings } from '@/types/bus';

const loadColor: Record<'SEA' | 'SDA' | 'LSD' | '-', string> = {
  SEA: 'text-green-500',
  SDA: 'text-yellow-500',
  LSD: 'text-red-500',
  '-': '',
};

type BusStopAccordionProps = {
  busTimingsData: BusStopTimings[];
};

export default function BusStopAccordion({
  busTimingsData,
}: BusStopAccordionProps) {
  return (
    <Accordion
      type='multiple'
      className='max-w-xl rounded-lg border'
      defaultValue={['notifications']}
    >
      {busTimingsData.map((item) => (
        <AccordionItem
          key={item.busStopCode}
          value={item.busStopCode}
          className='px-4'
        >
          <AccordionTrigger>{item.busStopName}</AccordionTrigger>
          <AccordionContent>
            {item.busServices.map((busService) => {
              return (
                <div
                  key={busService.serviceNo}
                  className='flex border-b-gray-950'
                >
                  <div className='w-16 text-xl'>{busService.serviceNo}</div>
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
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
