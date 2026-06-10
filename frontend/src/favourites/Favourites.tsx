import ErrorAlert from '@/ErrorAlert';
import SkeletonLoader from '@/SkeletonLoader';
import { useEffect, useState } from 'react';
import type { BusStopTimings } from '@/types/bus';
import { fetchBusTiming } from '@/api/bus';
import BusStopAccordion from './BusStopAccordion';

export default function Favourites() {
  const [busTiming, setBusTiming] = useState<BusStopTimings[]>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>();
  const [favourites, setFavourites] = useState<string[]>(() =>
    JSON.parse(localStorage.getItem('favourites') ?? '[]'),
  );
  const hasFavourites = favourites.length > 0;

  useEffect(() => {
    console.log(favourites);
    const fetchFavourites = async () => {
      try {
        const data = await fetchBusTiming(favourites[0]);
        setBusTiming([data]);
        console.log('Data: ', data);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
          console.error(error.message);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchFavourites();
  }, []);

  if (!hasFavourites) return <div>no favourites u twat</div>;

  if (error) return <ErrorAlert errorDescription={error} />;

  if (isLoading) return <SkeletonLoader />;

  return <BusStopAccordion busTimingsData={busTiming!} />;
}
