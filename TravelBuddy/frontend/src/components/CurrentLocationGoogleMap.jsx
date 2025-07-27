import React, { useState, useEffect } from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { Loader, AlertCircle, RefreshCcw } from "lucide-react";

const mapContainerStyle = {
  width: "100%",
  height: "100%", // Changed from '100vh' to '100%' to fit parent container
};

const mapOptions = {
  zoomControl: true,
  mapTypeControl: true,
  scaleControl: true,
  streetViewControl: true,
  rotateControl: true,
  fullscreenControl: true,
  zoom: 16,
};

const CurrentLocationGoogleMap = () => {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [error, setError] = useState(null);

  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  // Get current location
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by this browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        setCurrentLocation(location);

        setError(null);
      },
      (error) => {
        let errorMessage = "Unable to get your location";

        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage =
              "Location access denied. Please allow location access.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information is unavailable";
            break;
          case error.TIMEOUT:
            errorMessage = "Location request timed out";
            break;
        }

        setError(errorMessage);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  // Initial location and 30-second updates
  useEffect(() => {
    if (isLoaded) {
      getCurrentLocation();
    }
  }, [isLoaded]);

  if (loadError) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-50">
        <div className="text-center p-6">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-700 font-semibold text-lg">
            Failed to load Google Maps
          </p>
          <p className="text-red-600 text-sm mt-2">Please check your API key</p>
        </div>
      </div>
    );
  }

  if (!isLoaded || !currentLocation) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="text-center p-6">
          <Loader className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-blue-700 font-semibold text-lg">
            Getting your location...
          </p>
          <p className="text-blue-500 text-sm mt-2">
            Please allow location access when prompted
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-50">
        <div className="text-center p-6">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-700 font-semibold text-lg">Location Error</p>
          <p className="text-red-600 text-sm max-w-md mb-4">{error}</p>
          <button
            onClick={getCurrentLocation}
            className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-colors duration-200"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      center={currentLocation}
      options={mapOptions}
    >
      <Marker position={currentLocation} />
    </GoogleMap>

    {/* Reload Button at Bottom Left */}
    <button
      onClick={getCurrentLocation}
      className="absolute bottom-6 left-4 bg-white border border-gray-300 rounded-full p-2 shadow-md hover:bg-gray-100 transition z-10"
      title="Reload Location"
    >
      <RefreshCcw className="w-5 h-5 text-blue-600" />
    </button>
  </div>

  );
};

export default CurrentLocationGoogleMap;
