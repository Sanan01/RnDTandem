/* eslint-disable prettier/prettier */
import React from 'react';
import {View, StyleSheet, Image} from 'react-native';
import MapboxGL from '@rnmapbox/maps';

interface MapViewProps {
  cameraCenter: [number, number] | null;
  currentLocation: [number, number] | null;
  routeCoordinates: [number, number][];
  dest: [number, number] | null;
}

const MapView: React.FC<MapViewProps> = ({
  cameraCenter,
  currentLocation,
  routeCoordinates,
  dest,
}) => {
  return (
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
            <Image
              source={require('../assets/icons/bicycle.png')}
              style={styles.destinationMarker}
            />
          </View>
        </MapboxGL.PointAnnotation>
      )}
      {dest && (
        <MapboxGL.PointAnnotation id="destination" coordinate={dest}>
          <View style={styles.markerContainer}>
            <Image
              source={require('../assets/icons/destination.png')}
              style={styles.destinationMarker}
            />
          </View>
        </MapboxGL.PointAnnotation>
      )}
    </MapboxGL.MapView>
  );
};

const styles = StyleSheet.create({
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
  line: {
    lineColor: 'blue',
    lineWidth: 5,
  },
  destinationMarker: {
    height: 30,
    width: 30,
  },
});

export default MapView;
