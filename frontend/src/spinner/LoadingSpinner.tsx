import { Spinner } from '@/components/ui/spinner';

type LoadingSpinnerProps = {
  message?: string;
};

export default function LoadingSpinner({ message }: LoadingSpinnerProps) {
  return (
    <div className='flex flex-col items-center justify-center min-h-40'>
      <Spinner />
      {message && <div>{message}</div>}
    </div>
  );
}
