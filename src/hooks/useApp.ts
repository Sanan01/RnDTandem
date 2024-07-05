/* eslint-disable prettier/prettier */
/* eslint-disable react-hooks/exhaustive-deps */
import {useEffect} from 'react';
import useLocation from './useLocation';
import useRouting from './useRouting';
import {Alert} from 'react-native';

export default useApp = () => {
  const {
    dest,
    setDest,
    cameraCenter,
    setCameraCenter,
    currentLocation,
    currentSpeed,
    requestLocationPermission,
  } = useLocation();

  const {
    routeCoordinates,
    distance,
    duration,
    fetchRoute,
    updateRoute,
    checkIfDestinationReached,
  } = useRouting();

  useEffect(() => {
    requestLocationPermission();
  }, []);

  useEffect(() => {
    if (dest && currentLocation) {
      updateRoute(currentLocation, dest);
      checkIfDestinationReached(
        currentLocation,
        dest,
        handleDestinationReached,
      );
    }
  }, [dest, currentLocation]);

  const handleSearchResultPress = (longitude: number, latitude: number) => {
    setDest([longitude, latitude]);
    setCameraCenter([longitude, latitude]);
    fetchRoute(currentLocation as [number, number], [longitude, latitude]);
  };

  const handleDestinationReached = () => {
    setDest(null);
    Alert.alert('You have reached your destination');
  };

  return {
    dest,
    setDest,
    distance,
    duration,
    fetchRoute,
    updateRoute,
    cameraCenter,
    currentSpeed,
    setCameraCenter,
    currentLocation,
    routeCoordinates,
    requestLocationPermission,
    handleSearchResultPress,
    checkIfDestinationReached,
  };
};
