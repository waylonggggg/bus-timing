import { Skeleton } from '@/components/ui/skeleton';

export default function SkeletonLoader() {
  return (
    <div className='flex flex-col items-center p-4 w-2xl rounded-xl gap-y-3 h-full'>
      <Skeleton className='h-10 w-3/4' />
      <Skeleton className='h-80 border rounded-md p-3 w-full' />
    </div>
  );
}
