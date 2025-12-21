import { useEffect, useRef } from 'react';
import './App.css';
import { GoogleMapsOverlay } from '@deck.gl/google-maps';
import { ScatterplotLayer } from '@deck.gl/layers';
import { useLoadGoogleMapsApi } from './googleMaps';

function App() {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const map = useRef<google.maps.Map>(null);

  const { isGoogleMapsApiLoaded } = useLoadGoogleMapsApi();

  useEffect(() => {
    if (!isGoogleMapsApiLoaded || !mapContainerRef.current) {
      return;
    }

    map.current = new window.google.maps.Map(mapContainerRef.current, {
      center: { lat: 51.5074, lng: -0.1278 }, // London
      zoom: 11,
      mapTypeId: 'roadmap',
      disableDefaultUI: true,
    });

    // Example deck.gl overlay: a single red dot in SF
    const overlay = new GoogleMapsOverlay({
      layers: [
        new ScatterplotLayer({
          id: 'scatter-1',
          data: [{ position: [-0.1278, 51.5074], size: 1000 }],
          getPosition: (d: { position: [number, number]; size: number }) => d.position,
          getFillColor: [255, 0, 0, 100],
          getRadius: (d: { position: [number, number]; size: number }) => d.size,
        }),
      ],
    });
    overlay.setMap(map.current);
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
