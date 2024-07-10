/* eslint-disable prettier/prettier */
import React from 'react';
import {LineLayer, ShapeSource} from '@rnmapbox/maps';
import {Position} from '@rnmapbox/maps/lib/typescript/src/types/Position';
import {StyleSheet} from 'react-native';

interface LineRouteProps {
  coordinates: Position[];
  id?: string;
}

const LineRoute: React.FC<LineRouteProps> = ({
  coordinates,
  id = 'routeSource',
}) => {
  return (
    <ShapeSource
      id={id}
      lineMetrics
      shape={{
        type: 'Feature',
        geometry: {
          type: 'LineString',
          coordinates: coordinates,
        },
        properties: {},
      }}>
      <LineLayer id="exampleLineLayer" style={styles.line} />
    </ShapeSource>
  );
};

const styles = StyleSheet.create({
  line: {
    lineColor: 'blue',
    lineCap: 'round',
    lineJoin: 'round',
    lineWidth: 7,
  },
});

export default LineRoute;
