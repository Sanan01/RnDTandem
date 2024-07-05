import React from 'react';
import {View, StyleSheet} from 'react-native';
import MapboxGL from '@rnmapbox/maps';
import {MAPBOX_ACCESS_TOKEN} from '../mapboxConfig.js';
import SearchBar from './components/SearchBar';
import LocationInfo from './components/LocationInfo';
import MapView from './components/MapView';
import useApp from './hooks/useApp.ts';

MapboxGL.setAccessToken(MAPBOX_ACCESS_TOKEN);

const App: React.FC = () => {
  const {
    dest,
    distance,
    duration,
    cameraCenter,
    currentSpeed,
    currentLocation,
    routeCoordinates,
    handleSearchResultPress,
  } = useApp();

  return (
    <View style={styles.container}>
      <SearchBar onSearchResultPress={handleSearchResultPress} />
      <MapView
        cameraCenter={cameraCenter}
        currentLocation={currentLocation}
        routeCoordinates={routeCoordinates}
        dest={dest}
      />
      <LocationInfo
        distance={distance}
        duration={duration}
        currentSpeed={currentSpeed}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
