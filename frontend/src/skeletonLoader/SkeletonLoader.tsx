import { Skeleton } from '@/components/ui/skeleton';
import type { BusMetadataResponse } from '@/types/bus';

type SkeletonLoaderProps = {
  busMetadata: BusMetadataResponse;
};

export default function SkeletonLoader({ busMetadata }: SkeletonLoaderProps) {
  return (
    <div className='flex flex-col p-4 w-2xl rounded-xl gap-y-3'>
      <div className='text-3xl font-semibold text-center tracking-wide'>
        {busMetadata.busStopName} - {busMetadata.busStopCode}
      </div>
      <div className='flex flex-col border rounded-md p-3 gap-y-3'>
        {busMetadata.serviceNos.map((serviceNo) => {
          return (
            <div key={serviceNo} className='flex border-b-gray-950'>
              <div className='w-16 text-2xl'>{serviceNo}</div>
              <div className='flex-1'>
                <Skeleton className='h-full w-full' />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
