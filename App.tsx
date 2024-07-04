import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  PermissionsAndroid,
  Platform,
  Image,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import {MAPBOX_ACCESS_TOKEN} from './mapboxConfig';
import MapboxGL from '@rnmapbox/maps';

MapboxGL.setAccessToken(MAPBOX_ACCESS_TOKEN);

const App = () => {
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [dest, setDest] = useState([]);
  const [distance, setDistance] = useState(null);
  const [duration, setDuration] = useState(null);
  const [currentSpeed, setCurrentSpeed] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [cameraCenter, setCameraCenter] = useState(null);

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
    Geolocation.watchPosition(
      position => {
        const {latitude, longitude, speed} = position.coords;
        const newLocation = [longitude, latitude];
        setCurrentLocation(newLocation);
        setCameraCenter(newLocation);
        setCurrentSpeed(speed);
        if (dest.length > 0) {
          updateRoute(newLocation, dest);
          checkIfDestinationReached(newLocation, dest);
        }
      },
      error => console.log(error),
      {enableHighAccuracy: true, distanceFilter: 10},
    );
  };

  const fetchRoute = async (origin, destination) => {
    const response = await fetch(
      `https://api.mapbox.com/directions/v5/mapbox/driving/${origin[0]},${origin[1]};${destination[0]},${destination[1]}?geometries=geojson&access_token=${MAPBOX_ACCESS_TOKEN}`,
    );
    const data = await response.json();
    const route = data.routes[0];
    setRouteCoordinates(route.geometry.coordinates);
    setDistance(route.distance);
    setDuration(route.duration);
  };

  const updateRoute = async (origin, destination) => {
    const response = await fetch(
      `https://api.mapbox.com/directions/v5/mapbox/driving/${origin[0]},${origin[1]};${destination[0]},${destination[1]}?geometries=geojson&access_token=${MAPBOX_ACCESS_TOKEN}`,
    );
    const data = await response.json();
    const route = data.routes[0];
    setRouteCoordinates(route.geometry.coordinates);
    setDistance(route.distance);
    setDuration(route.duration);
  };

  const searchLocation = async query => {
    const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${query}.json?access_token=${MAPBOX_ACCESS_TOKEN}&autocomplete=true&limit=5`,
    );
    const data = await response.json();
    setSearchResults(data.features);
  };

  const onSearchResultPress = result => {
    const [longitude, latitude] = result.geometry.coordinates;
    setDest([longitude, latitude]);
    setCameraCenter([longitude, latitude]);
    fetchRoute(currentLocation, [longitude, latitude]);
    setSearchResults([]);
    setSearchQuery('');
  };

  const checkIfDestinationReached = (newLocation, destination) => {
    const dis = getDistance(newLocation, destination);
    if (dis < 50) {
      // within 50 meters
      setCurrentSpeed(0);
      setDest([]);
      setRouteCoordinates([]);
      Alert.alert('You have reached your destination');
    }
  };

  const getDistance = (coord1, coord2) => {
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

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search for a place"
        value={searchQuery}
        onChangeText={text => {
          setSearchQuery(text);
          searchLocation(text);
        }}
      />
      {searchResults.length > 0 && (
        <FlatList
          data={searchResults}
          keyExtractor={item => item.id}
          renderItem={({item}) => (
            <TouchableOpacity
              style={styles.searchResultItem}
              onPress={() => onSearchResultPress(item)}>
              <Text>{item.place_name}</Text>
            </TouchableOpacity>
          )}
          style={styles.searchResultsContainer}
        />
      )}
      <MapboxGL.MapView style={styles.map}>
        {cameraCenter && (
          <MapboxGL.Camera
            pitch={45}
            zoomLevel={14}
            centerCoordinate={cameraCenter}
            animationMode={'flyTo'}
            animationDuration={2000}
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

        {dest.length > 0 && (
          <MapboxGL.PointAnnotation id="destination" coordinate={dest}>
            <View style={styles.markerContainer}>
              <Image
                source={require('./src/assets/icons/destination.png')}
                style={styles.destinationMarker}
              />
            </View>
          </MapboxGL.PointAnnotation>
        )}
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
    height: 40,
    width: 40,
    backgroundColor: 'blue',
    borderRadius: 20,
    borderColor: 'white',
    borderWidth: 5,
  },
  infoContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
  },
  line: {
    lineColor: 'blue',
    lineWidth: 5,
  },
  destinationMarker: {
    height: 30,
    width: 30,
  },
  searchInput: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
  },
  searchResultsContainer: {},
  searchResultItem: {
    backgroundColor: 'white',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
});

export default App;
