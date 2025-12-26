// A polygon is an array of [longitude, latitude] pairs
// The first and last pairs should be the same to close the polygon
export type Polygon = [number, number][];

export interface PolygonArea {
  id: string;
  name: string;
  polygon: Polygon;
  exclusionPolygons?: Polygon[];
}
