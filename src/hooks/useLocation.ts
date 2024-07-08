/* eslint-disable prettier/prettier */
import {useState} from 'react';
import {PermissionsAndroid, Platform} from 'react-native';
import Geolocation from '@react-native-community/geolocation';

type Location = [number, number];

interface UseLocation {
  currentLocation: Location | null;
  currentSpeed: number | null;
  requestLocationPermission: () => Promise<void>;
  getCurrentLocation: (setCameraCenter: (location: Location) => void) => void;
}

const useLocation = (): UseLocation => {
  const [dest, setDest] = useState<[number, number] | null>(null);
  const [cameraCenter, setCameraCenter] = useState<[number, number] | null>(
    null,
  );
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null);
  const [currentSpeed, setCurrentSpeed] = useState<number | null>(null);

  const requestLocationPermission = async () => {
    if (Platform.OS === 'ios') {
      getCurrentLocation();
    } else {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message: 'This app needs access to your location',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          getCurrentLocation();
        } else {
          console.log('Location permission denied');
        }
      } catch (err) {
        console.warn(err);
      }
    }
  };

  const getCurrentLocation = () => {
    Geolocation.watchPosition(
      position => {
        console.log('watch position', position);
        const {latitude, longitude, speed} = position.coords;
        const newLocation: Location = [longitude, latitude];
        setCurrentLocation(newLocation);
        setCameraCenter(newLocation);
        setCurrentSpeed(speed || 0);
      },
      error => console.log(error),
      {distanceFilter: 10},
    );
  };

  return {
    dest,
    setDest,
    cameraCenter,
    setCameraCenter,
    currentSpeed,
    currentLocation,
    requestLocationPermission,
    getCurrentLocation,
  };
};

export default useLocation;
