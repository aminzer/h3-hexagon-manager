import { useJsApiLoader } from '@react-google-maps/api';
import { googleMapsApiKey } from './config';

const useLoadGoogleMapsApi = (): { isGoogleMapsApiLoaded: boolean } => {
  const { isLoaded: isGoogleMapsApiLoaded } = useJsApiLoader({
    googleMapsApiKey,
  });

  return { isGoogleMapsApiLoaded };
};

export default useLoadGoogleMapsApi;
