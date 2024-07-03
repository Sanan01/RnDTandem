import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import {MAPBOX_ACCESS_TOKEN} from './mapboxConfig';
import MapboxGL from '@rnmapbox/maps';

MapboxGL.setAccessToken(MAPBOX_ACCESS_TOKEN);

const App = () => {
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [dest] = useState([67.15551060199695, 24.894371358061537]);
  const [distance, setDistance] = useState(null);
  const [duration, setDuration] = useState(null);
  const [currentSpeed, setCurrentSpeed] = useState(null); // New state for speed

  useEffect(() => {
    requestLocationPermission();
  }, []);

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
    Geolocation.watchPosition(position => {
      console.log('Getting location', position);
      const {latitude, longitude, speed} = position.coords;
      setCurrentLocation([longitude, latitude]);
      fetchRoute([longitude, latitude], dest);
      setCurrentSpeed(speed);
    });
  };

  const fetchRoute = async (origin, destination) => {
    const response = await fetch(
      `https://api.mapbox.com/directions/v5/mapbox/driving/${origin[0]},${origin[1]};${destination[0]},${destination[1]}?geometries=geojson&access_token=${MAPBOX_ACCESS_TOKEN}`,
    );
    const data = await response.json();
    const route = data.routes[0];
    setRouteCoordinates(route.geometry.coordinates);
    setDistance(route.distance); // Distance in meters
    setDuration(route.duration); // Duration in seconds
  };

  return (
    <View style={styles.container}>
      <MapboxGL.MapView style={styles.map}>
        {currentLocation && (
          <MapboxGL.Camera
            pitch={45}
            zoomLevel={14} // Zoom level for a closer view
            centerCoordinate={currentLocation}
            animationMode={'flyTo'}
            animationDuration={2000} // 2 seconds animation duration
          />
        )}

        {routeCoordinates.length > 0 && (
          <MapboxGL.ShapeSource
            id="routeSource"
            shape={{
              type: 'Feature',
              geometry: {
                type: 'LineString',
                coordinates: routeCoordinates,
              },
            }}>
            <MapboxGL.LineLayer id="routeLayer" style={styles.line} />
          </MapboxGL.ShapeSource>
        )}

        {currentLocation && (
          <MapboxGL.PointAnnotation
            id="currentLocation"
            coordinate={currentLocation}>
            <View style={styles.markerContainer}>
              <View style={styles.marker} />
            </View>
          </MapboxGL.PointAnnotation>
        )}

        <MapboxGL.PointAnnotation id="destination" coordinate={dest}>
          <View style={styles.markerContainer}>
            <View style={styles.marker} />
          </View>
        </MapboxGL.PointAnnotation>
      </MapboxGL.MapView>

      <View style={styles.infoContainer}>
        {distance && duration && (
          <>
            <Text>Distance: {(distance / 1000).toFixed(2)} km</Text>
            <Text>Duration: {(duration / 60).toFixed(2)} mins</Text>
          </>
        )}
        {currentSpeed !== null && (
          <Text>Speed: {(currentSpeed * 3.6).toFixed(2)} km/h</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  markerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  marker: {
    height: 20,
    width: 20,
    backgroundColor: 'red',
    borderRadius: 10,
    borderColor: 'white',
    borderWidth: 2,
  },
  infoContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: 10,
    borderRadius: 5,
  },
  line: {lineColor: 'blue', lineWidth: 3},
});

export default App;
