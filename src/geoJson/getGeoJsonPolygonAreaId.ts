const getGeoJsonPolygonAreaId = (
  name: string,
  featureIndex: number,
  multiPolygonIndex?: number,
): string => {
  const base = `${name}__${String(featureIndex)}`;

  if (typeof multiPolygonIndex === 'number') {
    return `${base}__${String(multiPolygonIndex)}`;
  }

  return base;
};

export default getGeoJsonPolygonAreaId;
