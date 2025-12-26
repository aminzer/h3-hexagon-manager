import prepareGeoJsonPropertyValue from './prepareGeoJsonPropertyValue';
import type { GeoJsonFeature } from './types';

const getGeoJsonPolygonAreaName = (feature: GeoJsonFeature): string => {
  return (
    prepareGeoJsonPropertyValue(feature.properties.NAME_2) ??
    prepareGeoJsonPropertyValue(feature.properties.GID_2) ??
    self.crypto.randomUUID()
  );
};

export default getGeoJsonPolygonAreaName;
