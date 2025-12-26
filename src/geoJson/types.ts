export interface GeoJsonFeature {
  properties: {
    NAME_2?: string;
    NAME_1?: string;
    NAME?: string;
    GID_2?: string;
    GID_1?: string;
  };
  geometry: {
    type: string;
    coordinates: unknown;
  };
}

export interface GeoJson {
  features: GeoJsonFeature[];
}
