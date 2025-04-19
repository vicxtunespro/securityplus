'use client';

import React, { useState } from 'react';
import { clientManager } from '@/libs/resourceManagement';
import InputField from './input-field';
import { InfoIcon } from 'lucide-react';
import useModalStore from '@/store/modalStore';
import {
  GoogleMap,
  useJsApiLoader,
  Marker,
  StandaloneSearchBox,
} from '@react-google-maps/api';

// Function to generate a 10-character security code (alphanumeric)
const generateSecurityCode = () => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 10; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters[randomIndex];
  }
  return result;
};

const AddClientModal = () => {
  const { closeModal } = useModalStore();

  const [locationMethod, setLocationMethod] = useState('map');
  const [location, setLocation] = useState({ lat: '', lng: '' });
  const [clientType, setClientType] = useState('individual');

  const [individualInfo, setIndividualInfo] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    clientType: 'individual',
    company_name: '',
    client_address: '',
  });

  const [companyInfo, setCompanyInfo] = useState({
    company_name: '',
    email: '',
    phone: '',
    client_address: '',
    contact_person_name: '',
    contact_number: '',
    clientType: 'company',
  });

  const [loading, setLoading] = useState(false);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    libraries: ['places'],
  });

  // Geocode coordinates to city name/address
  const getAddressFromCoords = async (lat, lng) => {
    try {
      const res = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
      );
      const data = await res.json();
      if (data.results.length > 0) {
        return data.results[0].formatted_address;
      }
      return '';
    } catch (err) {
      console.error('Geocoding error:', err);
      return '';
    }
  };

  const handleMapClick = async (e) => {
    if (!e.latLng) return;
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();
    setLocation({ lat, lng });

    const address = await getAddressFromCoords(lat, lng);

    if (clientType === 'individual') {
      setIndividualInfo((prev) => ({
        ...prev,
        location: { lat, lng },
        client_address: address,
      }));
    } else {
      setCompanyInfo((prev) => ({
        ...prev,
        location: { lat, lng },
        client_address: address,
      }));
    }
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

    if (clientType === 'individual') {
      setIndividualInfo((prev) => ({ ...prev, [name]: value }));
    } else {
      setCompanyInfo((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const individualData = {
      ...individualInfo,
      first_name: individualInfo.first_name.toUpperCase(),
      last_name: individualInfo.last_name.toUpperCase(),
    };

    const companyData = {
      ...companyInfo,
      contact_person_name: companyInfo.contact_person_name.toUpperCase(),
    };

    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(clientType === 'individual' ? individualInfo.phone : companyInfo.phone)) {
      alert('Phone number must be exactly 10 digits.');
      return;
    }

    const securityCode = generateSecurityCode();
    let dataToSubmit = clientType === 'individual' ? individualData : companyData;
    dataToSubmit.security_code = securityCode;

    if (locationMethod === 'manual') {
      dataToSubmit.location = {
        lat: Number(location.lat),
        lng: Number(location.lng),
      };
    }

    setLoading(true);

    try {
      await clientManager.addResource(dataToSubmit);
      alert('Client added successfully!');
      closeModal();
      window.location.reload();
    } catch (error) {
      alert('Error adding client');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="h-full" onSubmit={handleSubmit}>
      <div className="modal-header-section flex flex-col gap-2">
        <h1 className="md:text-xl lg:text-2xl font-bold">Registration Form - Client</h1>
        <p className="text-xs font-light text-slate-500">
          Choose the client type and fill in the required fields.
        </p>

        <div className="flex gap-4 mt-4">
          {['individual', 'company'].map((type) => (
            <label key={type} className="flex items-center gap-2">
              <input
                type="radio"
                name="clientType"
                value={type}
                checked={clientType === type}
                onChange={() => setClientType(type)}
              />
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </label>
          ))}
        </div>
      </div>

      <div className="form-section py-4 overflow-auto h-[90%]">
        {clientType === 'individual' ? (
          <>
            <div className="profile-section-header flex gap-2 items-center mb-4">
              <span className="font-bold text-2xl lg:text-3xl text-slate-300">INDIVIDUAL PROFILE</span>
            </div>
            <div className="form-area grid grid-cols-12 md:gap-4 lg:gap-8">
              <InputField label="First Name" name="first_name" value={individualInfo.first_name} onChange={handleChange} />
              <InputField label="Last Name" name="last_name" value={individualInfo.last_name} onChange={handleChange} />
              <InputField label="Email" name="email" value={individualInfo.email} onChange={handleChange} />
              <InputField label="Phone" name="phone" value={individualInfo.phone} onChange={handleChange} />
              <InputField label="Address" name="client_address" value={individualInfo.client_address} onChange={handleChange} />
            </div>
          </>
        ) : (
          <>
            <div className="profile-section-header flex gap-2 items-center mb-4">
              <span className="font-bold text-2xl lg:text-3xl text-slate-300">COMPANY PROFILE</span>
            </div>
            <div className="form-area grid grid-cols-12 md:gap-4 lg:gap-8">
              <InputField label="Company Name" name="company_name" value={companyInfo.company_name} onChange={handleChange} />
              <InputField label="Email" name="email" value={companyInfo.email} onChange={handleChange} />
              <InputField label="Phone" name="phone" value={companyInfo.phone} onChange={handleChange} />
              <InputField label="Company Address" name="client_address" value={companyInfo.client_address} onChange={handleChange} />
              <InputField label="Contact Person" name="contact_person_name" value={companyInfo.contact_person_name} onChange={handleChange} />
              <InputField label="Contact Number" name="contact_number" value={companyInfo.contact_number} onChange={handleChange} />
            </div>
          </>
        )}

        <div className="profile-section-header flex gap-2 items-center mt-6 mb-4">
          <span className="font-bold text-2xl lg:text-3xl text-slate-300">LOCATION</span>
        </div>

        <div className="w-full h-[350px] mb-4 relative">
          {isLoaded ? (
            <>
              <div className="absolute top-2 left-2 z-10 w-full max-w-md">
                <StandaloneSearchBox
                  onLoad={(ref) => (window.searchBox = ref)}
                  onPlacesChanged={async () => {
                    const places = window.searchBox.getPlaces();
                    if (!places.length) return;
                    const place = places[0];
                    const lat = place.geometry.location.lat();
                    const lng = place.geometry.location.lng();
                    const address = await getAddressFromCoords(lat, lng);

                    setLocation({ lat, lng });

                    if (clientType === 'individual') {
                      setIndividualInfo((prev) => ({
                        ...prev,
                        location: { lat, lng },
                        client_address: address,
                      }));
                    } else {
                      setCompanyInfo((prev) => ({
                        ...prev,
                        location: { lat, lng },
                        client_address: address,
                      }));
                    }
                  }}
                >
                  <input
                    type="text"
                    placeholder="Search for a location"
                    className="w-full px-4 py-2 rounded shadow text-sm border border-gray-300"
                  />
                </StandaloneSearchBox>
              </div>

              <GoogleMap
                mapContainerStyle={{ width: '100%', height: '100%' }}
                center={
                  location.lat && location.lng
                    ? { lat: Number(location.lat), lng: Number(location.lng) }
                    : { lat: 0.3476, lng: 32.5825 }
                }
                zoom={30}
                onClick={handleMapClick}
              >
                {location.lat && location.lng && (
                  <Marker position={{ lat: Number(location.lat), lng: Number(location.lng) }} />
                )}
              </GoogleMap>
            </>
          ) : (
            <p>Loading map...</p>
          )}
          {location.lat && location.lng && (
            <p className="text-sm mt-2">
              Selected: {Number(location.lat).toFixed(4)}, {Number(location.lng).toFixed(4)}
            </p>
          )}
        </div>

        <div className="w-full flex flex-col gap-4 items-center justify-between bg-slate-200 py-12 px-8 mt-8">
          <div className="flex flex-col md:flex-row gap-2">
            <div className="flex justify-start gap-2 md:text-lg items-start font-medium">
              <InfoIcon className="text-blue-400" />
              <p>
                {clientType === 'individual'
                  ? 'Department is subject to change after training.'
                  : 'Company contracts are reviewed annually.'}
              </p>
            </div>
          </div>

          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg mt-4 hover:bg-blue-700 transition relative"
            disabled={loading}
          >
            {loading ? (
              <span className="spinner-border spinner-border-sm text-white"></span>
            ) : (
              'Submit'
            )}
          </button>
        </div>
      </div>
    </form>
  );
};

export default AddClientModal;
