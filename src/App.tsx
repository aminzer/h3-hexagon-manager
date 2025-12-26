import { useEffect, useRef } from 'react';
import './App.css';
import { GoogleMapsOverlay } from '@deck.gl/google-maps';
import { PolygonLayer } from '@deck.gl/layers';
import { latLngToCell, cellToBoundary } from 'h3-js';
import { useLoadGoogleMapsApi } from './googleMaps';
import ukAreas from './resources/uk_areas.json';

function App() {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const map = useRef<google.maps.Map>(null);

  const { isGoogleMapsApiLoaded } = useLoadGoogleMapsApi();

  useEffect((): (() => void) => {
    if (!isGoogleMapsApiLoaded || !mapContainerRef.current) {
      return () => undefined;
    }

    map.current = new window.google.maps.Map(mapContainerRef.current, {
      center: { lat: 51.5074, lng: -0.1278 }, // London
      zoom: 11,
      mapTypeId: 'roadmap',
      disableDefaultUI: true,
    });

    type GeoFeature = {
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
    };
    type UkGeo = { features: GeoFeature[] };
    type PolygonEntry = { id: string; regionName: string; polygon: [number, number][][] };

    const features = (ukAreas as UkGeo).features;

    const polygonsData: PolygonEntry[] = features.flatMap((feature, featureIndex) => {
      console.log(feature);
      const regionName =
        feature.properties.NAME_2 ||
        feature.properties.NAME_1 ||
        feature.properties.NAME ||
        String(feature.properties.GID_2 || feature.properties.GID_1 || featureIndex);
      const geomType = feature.geometry.type;
      const coords = feature.geometry.coordinates;

      if (geomType === 'Polygon') {
        return [
          {
            id: `${regionName}_${String(featureIndex)}_0`,
            regionName,
            polygon: coords as [number, number][][],
          },
        ];
      }

      if (geomType === 'MultiPolygon') {
        return (coords as [number, number][][][]).map((poly, polyIndex) => ({
          id: `${regionName}_${String(featureIndex)}_${String(polyIndex)}`,
          regionName,
          polygon: poly,
        }));
      }

      return [];
    });

    console.log(polygonsData.length);

    const overlay = new GoogleMapsOverlay({
      layers: [
        new PolygonLayer<PolygonEntry>({
          id: 'deck-polygons',
          data: polygonsData,
          pickable: true,
          stroked: true,
          filled: true,
          extruded: false,
          getPolygon: (d: PolygonEntry) => d.polygon,
          getFillColor: [0, 120, 255, 80],
          getLineColor: [0, 0, 0, 200],
          lineWidthMinPixels: 1,
          onClick: (info) => {
            const obj = info.object as PolygonEntry | null;
            if (obj) {
              console.log('Polygon clicked:', obj.id, obj.regionName);
            }
          },
          onHover: (info) => {
            const obj = info.object as PolygonEntry | null;
            if (obj) {
              console.log('Hover polygon:', obj.id);
            }
          },
        }),
      ],
    });

    overlay.setMap(map.current);

    const handleClick = (e: google.maps.MapMouseEvent) => {
      const latLng = e.latLng;

      if (!latLng || !map.current) {
        return;
      }

      const lat = latLng.lat();
      const lng = latLng.lng();

      console.log('Map clicked at: ', lat, lng);

      const h3Indexes = [];

      const MIN_RESOLUTION = 5;
      const MAX_RESOLUTION = 9;

      for (let resolution = MIN_RESOLUTION; resolution <= MAX_RESOLUTION; resolution++) {
        h3Indexes.push(latLngToCell(lat, lng, resolution));
      }

      console.log('H3 Indexes: ', h3Indexes);

      h3Indexes.forEach((h3Index) => {
        const boundary = cellToBoundary(h3Index);
        const coordinatePairs = boundary.map(([lat, lng]) => ({ lat, lng }));

        const polygon = new google.maps.Polygon({
          paths: coordinatePairs,
          strokeColor: '#000000',
          strokeOpacity: 1,
          strokeWeight: 1,
          fillColor: '#fff000',
          fillOpacity: 0.2,
        });

        polygon.setMap(map.current);
      });

      const circle = new google.maps.Circle({
        strokeColor: '#000000',
        strokeOpacity: 1,
        strokeWeight: 1,
        fillColor: '#ff0000',
        fillOpacity: 0.5,
        map: map.current,
        center: latLng,
        radius: 50,
      });

      circle.setMap(map.current);
    };

    const listener = map.current.addListener('click', handleClick);

    return () => {
      // cleanup
      // overlay.setMap(null);
      listener.remove();
    };
  }, [isGoogleMapsApiLoaded]);

  if (!isGoogleMapsApiLoaded) {
    return null;
  }

  return (
    <div
      ref={mapContainerRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
      }}
    />
  );
}

export default App;
