"use client";
import React, { useEffect, useState } from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "400px",
};

const GoogleMapComponent = () => {
  const [location, setLocation] = useState(null);
  
  // Load Google Maps API
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
  });

  // Get User's Current Location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  }, []);

  if (!isLoaded) return <p>Loading...</p>;

  return (
    <div>
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={location || { lat: 0, lng: 0 }}
          zoom={location ? 15 : 2}
        >
          {location && <Marker position={location} />}
        </GoogleMap>
    </div>
  );
};

export default GoogleMapComponent;
