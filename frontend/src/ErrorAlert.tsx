import { AlertCircleIcon } from 'lucide-react';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

type ErrorAlertProps = {
  errorDescription: string;
};

export default function ErrorAlert({ errorDescription }: ErrorAlertProps) {
  return (
    <Alert variant='destructive' className='max-w-md p-4'>
      <AlertCircleIcon />
      <AlertTitle>Oopsies...</AlertTitle>
      <AlertDescription>{errorDescription}</AlertDescription>
    </Alert>
  );
}
