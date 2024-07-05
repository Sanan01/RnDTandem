/* eslint-disable prettier/prettier */
import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

interface LocationInfoProps {
  distance: number | null;
  duration: number | null;
  currentSpeed: number | null;
}

const LocationInfo: React.FC<LocationInfoProps> = ({
  distance,
  duration,
  currentSpeed,
}) => {
  return (
    <View style={styles.infoContainer}>
      {distance !== null && duration !== null && (
        <>
          <Text>Distance: {(distance / 1000).toFixed(2)} km</Text>
          <Text>Duration: {(duration / 60).toFixed(2)} mins</Text>
        </>
      )}
      {currentSpeed !== null && (
        <Text>Speed: {(currentSpeed * 3.6).toFixed(2)} km/h</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  infoContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
  },
});

export default LocationInfo;
