"use client";
import React, { use, useEffect, useState } from "react";
import {
  GoogleMap,
  Marker,
  useJsApiLoader,
  Polyline,
} from "@react-google-maps/api";
import { clientManager, officerManager, shiftManager } from "@/libs/resourceManagement";

// Map container style
const containerStyle = {
  width: "100%",
  height: "600px",
};

// Mock data
// const initialOffices = [
//   { id: 1, name: "Officer A", lat: 0.3136, lng: 32.5811, clientId: 101 },
//   { id: 2, name: "Officer B", lat: 0.3476, lng: 32.5825, clientId: 102 },
//   { id: 3, name: "Officer C", lat: 0.321, lng: 32.586, clientId: 103 },
// ];

// const initialClients = [
//   { id: 101, name: "Client Alpha", lat: 0.3142, lng: 32.582 },
//   { id: 102, name: "Client Beta", lat: 0.3468, lng: 32.5805 },
//   { id: 103, name: "Client Gamma", lat: 0.3205, lng: 32.5845 },
// ];

const GoogleMapComponent = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [officers, setOfficers] = useState([]);
  const [clients, setClient] = useState([]);
  const [shifts, setShifts] = useState([]);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
  });

  // Get user location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) =>
          setUserLocation({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          }),
        (err) => console.error("Geolocation error:", err)
      );
    }
  }, []);

  // Simulate real-time officer movement
  useEffect(() => {
    const interval = setInterval(() => {
      setOfficers((prev) =>
        prev.map((o) => ({
          ...o,
          lat: o.lat + (Math.random() - 0.5) * 0.0005,
          lng: o.lng + (Math.random() - 0.5) * 0.0005,
        }))
      );
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const getClientById = (id) => clients.find((c) => c.id === id);

  


  useEffect(() => {
    // Fetch officers and clients from the resource managers
    const fetchOfficers = async () => {
      const fetchedOfficers = await officerManager.getAll();
      const shiftData = await shiftManager.getAll();
      const clientData = await clientManager.getAll();

      //Get clients on map
      

      const updatedOfficers = fetchedOfficers.map((officer) => {

        if(officer?.status === 'checked-in'){
          console.log("Officer is checked-in:", officer);
          // find client
          const shiftAttached = shiftData.find(shift => shift.id === officer.shiftId);
          const clientAttached = clientData.find(client => client.id === shiftAttached?.client.id);
          console.log("Client for officer:", clientAttached);
          return {
          id: officer.id,
          name: `${officer.firstName} || ${officer?.officerNumber}`,
          lat: officer?.location?.lat || 0, // Default to a specific location if not set
          lng: officer?.location?.lng || 0,  // Default to a specific location if not set
          clientId: clientAttached?.id,// clientName: client ? client.name : "Unknown Client",
        };
        }

        return {
          id: officer.id,
          name: officer.firstName,
          lat: officer?.location?.lat || 0, // Default to a specific location if not set
          lng: officer?.location?.lng || 0,  // Default to a specific location if not set
          clientId: null, // No client assigned
        };
      });
      setOfficers(updatedOfficers);
      console.log("Fetched Officers:", updatedOfficers);
    };

    const fetchClients = async () => {
      const fetchedClients = await clientManager.getAll();
      const updatedClients = fetchedClients.map(client => ({
        id: client.id,
        name: client.first_name || client.company_name,
        lat: client?.location?.lat || 0, // Default to a specific location if not set
        lng: client?.location?.lng || 0,  // Default to a specific location if not set
      })); 
      setClient(updatedClients);
      console.log("Fetched Clients:", updatedClients);
    };

    fetchOfficers();
    fetchClients();

  }, []);

  if (!isLoaded) return <p>Loading map...</p>;

  return (
    <div>
      <h2 className="text-xl font-bold mb-3">Officer Deployment Map</h2>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={userLocation || { lat: 0.3136, lng: 32.5811 }}
        zoom={13}
      >
        {/* User location */}
        {userLocation && (
          <Marker
            position={userLocation}
            label="You"
            icon={{
              url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
            }}
          />
        )}

        {/* Client markers */}
        {clients.map((client) => (
          <Marker
            key={client.id}
            position={{ lat: client.lat, lng: client.lng }}
            label={client.name}
            icon={{
              url: "http://maps.google.com/mapfiles/ms/icons/green-dot.png",
            }}
          />
        ))}

        {/* Officer markers and lines to clients */}
        {officers.map((officer) => {
          const client = getClientById(officer.clientId);
          const path = client
            ? [
                { lat: officer.lat, lng: officer.lng },
                { lat: client.lat, lng: client.lng },
              ]
            : [];

          return (
            <React.Fragment key={officer.id}>
              <Marker
                position={{ lat: officer.lat, lng: officer.lng }}
                label={officer.name}
                icon={{
                  url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
                }}
              />
              {client && (
                <Polyline
                  path={path}
                  options={{
                    strokeColor: "#FF0000",
                    strokeOpacity: 0.8,
                    strokeWeight: 2,
                  }}
                />
              )}
            </React.Fragment>
          );
        })}
      </GoogleMap>
    </div>
  );
};

export default GoogleMapComponent;
