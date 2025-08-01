// src/components/GoogleMapsProvider.jsx
import React from 'react';
import { LoadScript } from '@react-google-maps/api';

const libraries = ['places']; // Include all required libraries

const GoogleMapsProvider = ({ children }) => {
  return (
    <LoadScript
      googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
      libraries={libraries}
      id="google-maps-script"
    >
      {children}
    </LoadScript>
  );
};

export default GoogleMapsProvider;