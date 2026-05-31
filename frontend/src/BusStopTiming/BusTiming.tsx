import { useEffect, useState } from 'react';
import BusStopList from '@/BusStopTiming/BusStopList';
import type {
  BusTimingResponse,
  BusStopTimings,
  NearestBusStopResponse,
  Coordinates
} from '@/types/bus';
import { cleanData } from '@/utils';
import { fetchNearestBusStop, fetchBusTiming } from '../api/bus';
import SkeletonLoader from '@/SkeletonLoader';
import ErrorAlert from '@/ErrorAlert';

export default function BusTiming() {
  const [busTiming, setBusTiming] = useState<BusStopTimings>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [nearestBusStopName, setNearestBusStopName] = useState<string>();
  const [error, setError] = useState<string>();

  const loadBusTiming = async (coords: Coordinates) => {
    try {
      const nearestBusStop: NearestBusStopResponse =
        await fetchNearestBusStop(coords);
      const { nearestBusStopCode, nearestBusStopName } = nearestBusStop;
      setNearestBusStopName(nearestBusStopName);

      const busTimingData: BusTimingResponse =
        await fetchBusTiming(nearestBusStopCode);
      const cleanedData = cleanData(busTimingData);
      setBusTiming(cleanedData);
    } catch (error) {
      console.log('Error: ', error);

      if (error instanceof Error) {
        setError(error.message);
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
      longitude: pos.coords.longitude
    };
    loadBusTiming(coords);
  };

  const getPosError = (err: GeolocationPositionError) => {
    const date = new Date();
    console.log(err.message, date);

    // only sets geo error when no successful fetches were made beforehand,
    // we dont want the geo error to popup after the first initial successful geo fetch
    if (!busTiming) {
      setError(err.message);
    }
    // setIsLoading(false)
  };

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;

    function loadBusTimingLoop() {
      const date = new Date();
      console.log('fetching :', date);
      navigator.geolocation.getCurrentPosition(getPosSuccess, getPosError, {
        enableHighAccuracy: false,
        timeout: 30000,
        maximumAge: 60000
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
    <BusStopList busStopName={nearestBusStopName!} busTimingData={busTiming!} />
  );
}
