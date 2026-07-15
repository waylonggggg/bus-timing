import ErrorAlert from '@/ErrorAlert';
import { useState } from 'react';
import BusStopAccordion from './BusStopAccordion';
import type { FavouritedBusStop } from '@/types/bus';

export default function Favourites() {
  const [error, setError] = useState<string>();
  const [favourites, setFavourites] = useState<FavouritedBusStop[]>(() =>
    JSON.parse(localStorage.getItem('favourites') ?? '[]'),
  );
  const hasFavourites = favourites.length > 0;

  if (!hasFavourites) return <div>no favourites u twat</div>;

  if (error) return <ErrorAlert errorDescription={error} />;

  return <BusStopAccordion favourites={favourites!} />;
}
