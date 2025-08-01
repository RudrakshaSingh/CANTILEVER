/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GoogleMap, Marker } from "@react-google-maps/api";
import { Loader, AlertCircle, RefreshCcw } from "lucide-react";
import { updateUserLocation } from "../Redux/Slices/UserSlice";

const mapContainerStyle = {
  width: "100%",
  height: "100%",
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
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state) => state.user);

  const [currentLocation, setCurrentLocation] = useState(null);
  const [error, setError] = useState(null);
  const [isUpdatingLocation, setIsUpdatingLocation] = useState(false);

  // Function to update location in backend
  const updateLocationInBackend = async (lat, lng) => {
    if (!user) return;
    setIsUpdatingLocation(true);
    try {
      await dispatch(updateUserLocation({ lat, lng })).unwrap();
    } finally {
      setIsUpdatingLocation(false);
    }
  };

  // Get current location
  const getCurrentLocation = (updateBackend = true) => {
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
        console.log(location);
        
        setCurrentLocation(location);
        setError(null);
        if (updateBackend && user) {
          updateLocationInBackend(location.lat, location.lng);
        }
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

  // Initial location setup
  useEffect(() => {
    getCurrentLocation(true);
  }, []);

  // Handle manual refresh
  const handleRefreshLocation = () => {
    getCurrentLocation(true);
  };

  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-50">
        <div className="text-center p-6">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-700 font-semibold text-lg">Location Error</p>
          <p className="text-red-600 text-sm max-w-md mb-4">{error}</p>
          <button
            onClick={() => getCurrentLocation(false)}
            className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-colors duration-200"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!currentLocation) {
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

  return (
    <div className="relative w-full h-full">
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={currentLocation}
        options={mapOptions}
      >
        <Marker position={currentLocation} />
      </GoogleMap>
      <button
        onClick={handleRefreshLocation}
        disabled={isUpdatingLocation || loading}
        className={`absolute bottom-6 left-4 bg-white border border-gray-300 rounded-full p-2 shadow-md transition z-10 ${
          isUpdatingLocation || loading
            ? "opacity-50 cursor-not-allowed"
            : "hover:bg-gray-100"
        }`}
        title="Reload Location"
      >
        <RefreshCcw
          className={`w-5 h-5 text-blue-600 ${
            isUpdatingLocation ? "animate-spin" : ""
          }`}
        />
      </button>
      {!user && (
        <div className="absolute top-4 right-4 z-10">
          <div className="flex items-center space-x-2 px-3 py-2 rounded-full shadow-md text-sm bg-gray-100 text-gray-600 border border-gray-200">
            <AlertCircle className="w-4 h-4" />
            <span>Login to save location</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default CurrentLocationGoogleMap;
