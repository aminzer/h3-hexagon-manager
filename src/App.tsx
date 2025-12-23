import { useEffect, useRef } from 'react';
import './App.css';
// import { GoogleMapsOverlay } from '@deck.gl/google-maps';
// import { ScatterplotLayer } from '@deck.gl/layers';
import { latLngToCell, cellToBoundary } from 'h3-js';
import { useLoadGoogleMapsApi } from './googleMaps';

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

    // const overlay = new GoogleMapsOverlay({
    //   layers: [
    //     new ScatterplotLayer({
    //       id: 'scatter-1',
    //       data: [{ position: [-0.1278, 51.5074], size: 1000 }],
    //       getPosition: (d: { position: [number, number]; size: number }) => d.position,
    //       getFillColor: [255, 0, 0, 100],
    //       getRadius: (d: { position: [number, number]; size: number }) => d.size,
    //     }),
    //   ],
    // });
    // overlay.setMap(map.current);

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
