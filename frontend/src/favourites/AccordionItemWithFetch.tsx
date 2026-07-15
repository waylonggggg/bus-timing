import { fetchBusMetadata, fetchBusTiming } from '@/api/bus';
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { useEffect } from 'react';
import type { BusStopTimings, BusMetadataResponse } from '@/types/bus';
import { useState } from 'react';
import ErrorAlert from '@/ErrorAlert';
import SkeletonLoader from '@/skeletonLoader';

const loadColor: Record<'SEA' | 'SDA' | 'LSD' | '-', string> = {
  SEA: 'text-green-500',
  SDA: 'text-yellow-500',
  LSD: 'text-red-500',
  '-': '',
};

type AccordionItemWithFetchProps = {
  busStopCode: string;
  busStopName: string;
  isOpen: boolean;
};

export default function AccordionItemWithFetch({
  busStopCode,
  busStopName,
  isOpen,
}: AccordionItemWithFetchProps) {
  const [busTimingData, setBusTimingData] = useState<BusStopTimings>();
  const [busMetaData, setBusMetaData] = useState<BusMetadataResponse>();
  const [isLoadingServices, setIsLoadingServices] = useState<boolean>(true);
  const [isLoadingTimings, setIsLoadingTimings] = useState<boolean>(true);
  const [error, setError] = useState<string>();

  useEffect(() => {
    const loadMetadata = async () => {
      try {
        const busMetaData = await fetchBusMetadata(busStopCode);
        setBusMetaData(busMetaData);
      } catch (error) {
        if (error instanceof Error) {
          console.error(error);
          setError(error.message);
        }
      } finally {
        setIsLoadingServices(false);
      }
    };

    loadMetadata();
  }, [busStopCode]);

  useEffect(() => {
    if (!isOpen || isLoadingServices || error) return;

    const loadTimings = async () => {
      try {
        setIsLoadingTimings(true);
        const data: BusStopTimings = await fetchBusTiming(busStopCode);
        setBusTimingData(data);
      } catch (error) {
        if (error instanceof Error) {
          console.error(error);
          setError(error.message);
        }
      } finally {
        setIsLoadingTimings(false);
      }
    };

    loadTimings();
  }, [isOpen, isLoadingServices, error, busStopCode]);

  const renderContent = () => {
    if (error) return <ErrorAlert errorDescription={error} />;

    if (isLoadingTimings) return <SkeletonLoader busMetadata={busMetaData!} />;

    return (
      <div className='flex flex-col border rounded-md p-3 gap-y-3'>
        {busTimingData!.busServices.map((busService) => {
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
    );
  };

  return (
    <AccordionItem value={busStopCode} className='px-4'>
      <AccordionTrigger>{busStopName}</AccordionTrigger>
      <AccordionContent>{renderContent()}</AccordionContent>
    </AccordionItem>
  );
}
