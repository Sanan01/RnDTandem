/* eslint-disable prettier/prettier */
import React from 'react';
import {View, StyleSheet} from 'react-native';
import {MAPBOX_ACCESS_TOKEN} from '../mapboxConfig.js';
import SearchBar from './components/SearchBar';
import LocationInfo from './components/LocationInfo';
import useApp from './hooks/useApp.ts';
import Mapbox from '@rnmapbox/maps';
import MapViewComponent from './components/MapView';

Mapbox.setAccessToken(MAPBOX_ACCESS_TOKEN);

const App: React.FC = () => {
  const {
    distance,
    duration,
    currentSpeed,
    routeCoordinates,
    handleSearchResultPress,
  } = useApp();

  return (
    <View style={styles.container}>
      <SearchBar onSearchResultPress={handleSearchResultPress} />
      <MapViewComponent routeCoordinates={routeCoordinates} />
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
