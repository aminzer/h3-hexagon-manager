import type { MapArea } from '../types';
import type { GeoJson } from './types';

const getGeoJsonAreas = (geoJson: GeoJson): MapArea[] => {
  return geoJson.features.flatMap((feature, featureIndex) => {
    const name =
      feature.properties.NAME_2 ||
      feature.properties.NAME_1 ||
      feature.properties.NAME ||
      String(feature.properties.GID_2 || feature.properties.GID_1 || featureIndex);

    const geometryType = feature.geometry.type;

    const coords = feature.geometry.coordinates;

    if (geometryType === 'Polygon') {
      return [
        {
          id: `${name}_${String(featureIndex)}_0`,
          name,
          polygon: coords as [number, number][][],
        },
      ];
    }

    if (geometryType === 'MultiPolygon') {
      return (coords as [number, number][][][]).map((poly, polyIndex) => ({
        id: `${name}_${String(featureIndex)}_${String(polyIndex)}`,
        name,
        polygon: poly,
      }));
    }

    return [];
  });
};

export default getGeoJsonAreas;
