export interface GeoJsonFeature {
  properties: {
    NAME_1?: string | null;
    NAME_2?: string | null;
    GID_1?: string | null;
    GID_2?: string | null;
  };
  geometry: {
    type: string;
    coordinates: unknown;
  };
}

export interface GeoJson {
  features: GeoJsonFeature[];
}
