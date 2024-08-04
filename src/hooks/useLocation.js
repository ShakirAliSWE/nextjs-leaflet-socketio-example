import { useGeolocated } from "react-geolocated";

const DEFAULT_LOCATION = { latitude: 0, longitude: 0 };

const useLocation = () => {
  const { coords, isGeolocationAvailable, isGeolocationEnabled } = useGeolocated({
    positionOptions: {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
    },
    // userDecisionTimeout: 5000,
  });

  if (!isGeolocationAvailable || !isGeolocationEnabled || !coords) {
    return DEFAULT_LOCATION;
  }

  return { latitude: coords.latitude, longitude: coords.longitude };
};

export default useLocation;
