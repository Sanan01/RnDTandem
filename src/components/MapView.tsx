/* eslint-disable prettier/prettier */
import React from 'react';
import {StyleSheet} from 'react-native';
import {MapView, Camera, LocationPuck, PointAnnotation} from '@rnmapbox/maps';
import LineRoute from './LineRoute';

interface MapViewProps {
  routeCoordinates: [number, number][];
}

const MapViewComponent: React.FC<MapViewProps> = ({routeCoordinates}) => {
  return (
    <MapView style={styles.map}>
      <Camera followZoomLevel={15} followUserLocation />
      <LocationPuck
        puckBearingEnabled
        puckBearing="heading"
        pulsing={{isEnabled: true, color: 'blue'}}
      />
      {routeCoordinates.length > 0 && (
        <>
          <LineRoute id="rideRoute" coordinates={routeCoordinates} />
          <PointAnnotation
            id="destination"
            coordinate={routeCoordinates[routeCoordinates.length - 1]}
          />
        </>
      )}
    </MapView>
  );
};

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
});

export default MapViewComponent;
