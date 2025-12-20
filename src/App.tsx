import { useEffect, useRef } from 'react';
import './App.css';
import { GOOGLE_MAPS_API_KEY } from './googleMapsApiKey';
import { GoogleMapsOverlay } from '@deck.gl/google-maps';
import { ScatterplotLayer } from '@deck.gl/layers';

function App() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<google.maps.Map | null>(null);

  useEffect(() => {
    const initializeMap = () => {
      if (mapRef.current && window.google) {
        mapInstance.current = new window.google.maps.Map(mapRef.current, {
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
              data: [
                { position: [-0.1278, 51.5074], size: 1000 }
              ],
              getPosition: d => d.position,
              getFillColor: [255, 0, 0, 200],
              getRadius: d => d.size,
            })
          ]
        });
        overlay.setMap(mapInstance.current);
      }
    };

    if (!window.google && !document.getElementById('google-maps-script')) {
      const script = document.createElement('script');
      script.id = 'google-maps-script';
      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}`;
      script.async = true;
      script.onload = initializeMap;
      document.body.appendChild(script);
    } else if (window.google && mapRef.current) {
      initializeMap();
    }
  }, []);

  return (
    <div ref={mapRef} style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh' }} />
  );
}

export default App
