import type { PolygonArea } from '../types';
import type { GeoJson } from './types';
import getGeoJsonPolygonAreaId from './getGeoJsonPolygonAreaId';
import getGeoJsonPolygonAreaName from './getGeoJsonPolygonAreaName';

const getGeoJsonPolygonAreas = (geoJson: GeoJson): PolygonArea[] => {
  return geoJson.features.flatMap((feature, featureIndex) => {
    const name = getGeoJsonPolygonAreaName(feature);
    const geometryType = feature.geometry.type;
    const coordinates = feature.geometry.coordinates;

    if (geometryType === 'Polygon') {
      return [
        {
          id: getGeoJsonPolygonAreaId(name, featureIndex),
          name,
          polygon: (coordinates as [number, number][][])[0],
          exclusionPolygons: (coordinates as [number, number][][]).slice(1),
        },
      ];
    }

    if (geometryType === 'MultiPolygon') {
      return (coordinates as [number, number][][][]).map((coords, coordsIndex) => {
        return {
          id: getGeoJsonPolygonAreaId(name, featureIndex, coordsIndex),
          name,
          polygon: coords[0],
          exclusionPolygons: coords.slice(1),
        };
      });
    }

    return [];
  });
};

export default getGeoJsonPolygonAreas;
