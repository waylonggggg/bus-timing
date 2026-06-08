import { useEffect, useRef, useState } from 'react';
import BusStopList from '@/busStopTiming/BusStopList';
import type {
  BusStopTimings,
  NearestBusStopResponse,
  Coordinates,
} from '@/types/bus';
import { fetchNearestBusStop, fetchBusTiming } from '../api/bus';
import SkeletonLoader from '@/SkeletonLoader';
import ErrorAlert from '@/ErrorAlert';

export default function BusTiming() {
  const [busTiming, setBusTiming] = useState<BusStopTimings>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  useState<string[]>();
  const [error, setError] = useState<string>();
  const isFirstSuccessfulLoad = useRef<boolean>(null);

  // Not required honestly but good practice, especially if the value were to be computationally expensive
  // i.e. useref is called every render but when it sees a current value, its ignored, but the value to be
  // passed in is always evaluted, hence can be expensive if its like a huge object
  if (isFirstSuccessfulLoad.current == null) {
    isFirstSuccessfulLoad.current = false;
  }

  const loadBusTiming = async (coords: Coordinates) => {
    try {
      const nearestBusStop: NearestBusStopResponse =
        await fetchNearestBusStop(coords);
      const { nearestBusStopCode } = nearestBusStop;

      const busTimingData: BusStopTimings =
        await fetchBusTiming(nearestBusStopCode);
      setBusTiming(busTimingData);

      if (!isFirstSuccessfulLoad.current) {
        isFirstSuccessfulLoad.current = true;
      }
    } catch (error) {
      console.log('Error: ', error);

      if (error instanceof Error) {
        // dont want error to popup after the first successful load
        if (!isFirstSuccessfulLoad.current) {
          setError(error.message);
        }
      } else {
        return;
      }
    } finally {
      setIsLoading(false);
    }
  };

  const getPosSuccess = (pos: GeolocationPosition) => {
    console.log('Position gotten');

    // sometimes the geolocation api timeouts and sets an error,
    // so if we are repolling and its successful, seterror to empty
    setError('');
    const coords: Coordinates = {
      latitude: pos.coords.latitude,
      longitude: pos.coords.longitude,
    };
    loadBusTiming(coords);
  };

  const getPosError = (err: GeolocationPositionError) => {
    const date = new Date();
    console.log(err.message, date);

    // only sets geo error when no successful fetches were made beforehand,
    // we dont want the geo error to popup after the first initial successful geo fetch
    if (!isFirstSuccessfulLoad.current) {
      setError(err.message);
    }
    // setIsLoading(false)
  };

  const handleRefreshBusTimings = () => {
    console.log('manually fetching');
    navigator.geolocation.getCurrentPosition(getPosSuccess, getPosError, {
      enableHighAccuracy: false,
      timeout: 30000,
      maximumAge: 60000,
    });
  };

  const handleAddToFavourites = (busStopCode: string) => {
    const favouritedBusStops = JSON.parse(
      localStorage.getItem('favourites') ?? '[]',
    );

    if (favouritedBusStops.includes(busStopCode)) {
      const updated = favouritedBusStops.filter(
        (busStop: string) => busStop != busStopCode,
      );
      localStorage.setItem('favourites', JSON.stringify(updated));
    } else {
      favouritedBusStops.push(busStopCode);
      localStorage.setItem('favourites', JSON.stringify(favouritedBusStops));
    }
  };

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;

    function loadBusTimingLoop() {
      console.log('successfully loaded: ', isFirstSuccessfulLoad);
      const date = new Date();
      console.log('fetching :', date);
      navigator.geolocation.getCurrentPosition(getPosSuccess, getPosError, {
        enableHighAccuracy: false,
        timeout: 30000,
        maximumAge: 60000,
      });

      timeoutId = setTimeout(loadBusTimingLoop, 30000);
    }

    loadBusTimingLoop();

    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  if (error) return <ErrorAlert errorDescription={error} />;

  if (isLoading) return <SkeletonLoader />;

  return (
    <BusStopList
      busTimingData={busTiming!}
      handleRefreshBusTiming={handleRefreshBusTimings}
      handleAddToFavourites={handleAddToFavourites}
    />
  );
}
