'use client';

import React, { useState, useEffect } from 'react';
import { clientManager } from '@/libs/resourceManagement';
import InputField from './input-field';
import useModalStore from '@/store/modalStore';
import {
  GoogleMap,
  useJsApiLoader,
  Marker,
  StandaloneSearchBox,
} from '@react-google-maps/api';

const UpdateClientModal = ({ client, clientId }) => {
  const { closeModal } = useModalStore();

  const [locationMethod, setLocationMethod] = useState('map');
  const [location, setLocation] = useState(client.location || { lat: '', lng: '' });
  const [clientType, setClientType] = useState(client.clientType || 'individual');

  const [formData, setFormData] = useState({});

  useEffect(() => {
    setFormData(client);
  }, [client]);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    libraries: ['places'],
  });

  const handleMapClick = (e) => {
    if (!e.latLng) return;
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();
    setLocation({ lat, lng });
    setFormData((prev) => ({ ...prev, location: { lat, lng } }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (locationMethod === 'manual' && (name === 'latitude' || name === 'longitude')) {
      setLocation((prev) => ({
        ...prev,
        [name === 'latitude' ? 'lat' : 'lng']: value,
      }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedData = {
      ...formData,
      location:
        locationMethod === 'manual'
          ? {
              lat: Number(location.lat),
              lng: Number(location.lng),
            }
          : formData.location,
    };

    try {
      await clientManager.updateResource(clientId, updatedData);
      alert('Client updated successfully!');
      closeModal();
      window.location.reload();
    } catch (error) {
      alert('Failed to update client.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="h-full">
      <div className="modal-header-section">
        <h1 className="md:text-xl lg:text-2xl font-bold">Update Client Information</h1>
        <p className="text-sm text-gray-500">Edit the fields and save changes.</p>

        <div className="flex gap-4 mt-4">
          {['individual', 'company'].map((type) => (
            <label key={type}>
              <input
                type="radio"
                name="clientType"
                value={type}
                checked={clientType === type}
                onChange={() => setClientType(type)}
              />{' '}
              {type}
            </label>
          ))}
        </div>
      </div>

      <div className="form-section py-4 overflow-auto h-[90%]">
        {clientType === 'individual' ? (
          <div className="grid grid-cols-12 gap-4">
            <InputField label="First Name" name="first_name" value={formData.first_name || ''} onChange={handleChange} />
            <InputField label="Last Name" name="last_name" value={formData.last_name || ''} onChange={handleChange} />
            <InputField label="Email" name="email" value={formData.email || ''} onChange={handleChange} />
            <InputField label="Phone" name="phone" value={formData.phone || ''} onChange={handleChange} />
          </div>
        ) : (
          <div className="grid grid-cols-12 gap-4">
            <InputField label="Company Name" name="company_name" value={formData.company_name || ''} onChange={handleChange} />
            <InputField label="Email" name="email" value={formData.email || ''} onChange={handleChange} />
            <InputField label="Phone" name="phone" value={formData.phone || ''} onChange={handleChange} />
            <InputField label="Address" name="company_address" value={formData.company_address || ''} onChange={handleChange} />
            <InputField label="Contact Person" name="contact_person_name" value={formData.contact_person_name || ''} onChange={handleChange} />
            <InputField label="Contact Number" name="contact_number" value={formData.contact_number || ''} onChange={handleChange} />
          </div>
        )}

        <div className="mt-6">
          <h2 className="font-semibold text-lg mb-2">Location</h2>

          <div className="flex gap-6 mb-4">
            {['map', 'manual'].map((method) => (
              <label key={method}>
                <input
                  type="radio"
                  value={method}
                  checked={locationMethod === method}
                  onChange={() => setLocationMethod(method)}
                />{' '}
                {method === 'map' ? 'Pick from Map' : 'Enter Manually'}
              </label>
            ))}
          </div>

          {locationMethod === 'map' ? (
            <div className="w-full h-[350px] mb-4 relative">
              {isLoaded ? (
                <>
                  <StandaloneSearchBox
                    onLoad={(ref) => (window.searchBox = ref)}
                    onPlacesChanged={() => {
                      const places = window.searchBox.getPlaces();
                      if (!places.length) return;
                      const place = places[0];
                      const lat = place.geometry.location.lat();
                      const lng = place.geometry.location.lng();
                      setLocation({ lat, lng });
                      setFormData((prev) => ({ ...prev, location: { lat, lng } }));
                    }}
                  >
                    <input
                      type="text"
                      placeholder="Search location"
                      className="w-full p-2 border border-gray-300 rounded shadow"
                    />
                  </StandaloneSearchBox>

                  <GoogleMap
                    mapContainerStyle={{ width: '100%', height: '100%' }}
                    center={location.lat && location.lng ? location : { lat: 0.3476, lng: 32.5825 }}
                    zoom={10}
                    onClick={handleMapClick}
                  >
                    <Marker position={location} />
                  </GoogleMap>
                </>
              ) : (
                <p>Loading map...</p>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-12 gap-4">
              <InputField label="Latitude" name="latitude" value={location.lat} onChange={handleChange} />
              <InputField label="Longitude" name="longitude" value={location.lng} onChange={handleChange} />
            </div>
          )}
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="submit"
            className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
          >
            Update Client
          </button>
        </div>
      </div>
    </form>
  );
};

export default UpdateClientModal;
