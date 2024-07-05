/* eslint-disable prettier/prettier */
import {useState} from 'react';
import {MAPBOX_ACCESS_TOKEN} from '../../mapboxConfig';

type Location = [number, number];

interface UseRouting {
  routeCoordinates: Location[];
  distance: number | null;
  duration: number | null;
  fetchRoute: (origin: Location, destination: Location) => Promise<void>;
  updateRoute: (origin: Location, destination: Location) => Promise<void>;
  checkIfDestinationReached: (
    newLocation: Location,
    destination: Location,
    onDestinationReached: () => void,
  ) => void;
}

const useRouting = (): UseRouting => {
  const [routeCoordinates, setRouteCoordinates] = useState<Location[]>([]);
  const [distance, setDistance] = useState<number | null>(null);
  const [duration, setDuration] = useState<number | null>(null);

  const fetchRoute = async (origin: Location, destination: Location) => {
    const response = await fetch(
      `https://api.mapbox.com/directions/v5/mapbox/cycling/${origin[0]},${origin[1]};${destination[0]},${destination[1]}?annotations=distance%2Cduration&geometries=geojson&overview=full&steps=false&access_token=${MAPBOX_ACCESS_TOKEN}`,
    );
    const data = await response.json();
    const route = data.routes[0];
    setRouteCoordinates(route.geometry.coordinates);
    setDistance(route.distance);
    setDuration(route.duration);
  };

  const updateRoute = async (origin: Location, destination: Location) => {
    const response = await fetch(
      `https://api.mapbox.com/directions/v5/mapbox/cycling/${origin[0]},${origin[1]};${destination[0]},${destination[1]}?annotations=distance%2Cduration&geometries=geojson&overview=full&steps=false&access_token=${MAPBOX_ACCESS_TOKEN}`,
    );
    const data = await response.json();
    const route = data.routes[0];
    setRouteCoordinates(route.geometry.coordinates);
    setDistance(route.distance);
    setDuration(route.duration);
  };

  const checkIfDestinationReached = (
    newLocation: Location,
    destination: Location,
    onDestinationReached: () => void,
  ) => {
    const dis = getDistance(newLocation, destination);
    if (dis < 50) {
      // within 50 meters
      onDestinationReached();
    }
  };

  const getDistance = (coord1: Location, coord2: Location): number => {
    const [lon1, lat1] = coord1;
    const [lon2, lat2] = coord2;
    const R = 6371e3; // metres
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const dis = R * c; // in metres
    return dis;
  };

  return {
    routeCoordinates,
    distance,
    duration,
    fetchRoute,
    updateRoute,
    checkIfDestinationReached,
  };
};

export default useRouting;
