  export function getDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
    // haversine formnula that calculates great-circle distance between 2 coordinates using
    // latitude and longitude
    // https://www.movable-type.co.uk/scripts/latlong.html

    const earthRadius = 6317e3; // metres
    const latDelta = (lat1 - lat2) * Math.PI / 180;
    const lonDelta = (lon1 - lon2) * Math.PI / 180;

    const a = Math.sin(latDelta / 2) * Math.sin(latDelta / 2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(lonDelta / 2) * Math.sin(lonDelta / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return earthRadius * c;
  }