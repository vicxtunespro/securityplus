'use client';
import React, { useState, useRef } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/libs/firebase'; // Ensure you have firebase initialized
import InputField from './input-field';
import { InfoIcon, Dog, Upload, User, FileText } from 'lucide-react';
import useModalStore from '@/store/modalStore';
import Image from 'next/image';

const AddOfficerModal = () => {
  const { closeModal } = useModalStore();
  const [activeTab, setActiveTab] = useState('officer');
  const [photoPreview, setPhotoPreview] = useState(null);
  const [idPreview, setIdPreview] = useState(null);
  const [documentsPreview, setDocumentsPreview] = useState([]);
  const fileInputRef = useRef(null);
  const idFileInputRef = useRef(null);
  const documentsFileInputRef = useRef(null);

  // Departments
  const departments = [
    'Patrol',
    'K-9 Unit', 
    'Surveillance',
    'Access Control',
    'Executive Protection',
    'Event Security',
    'Investigations'
  ];

  // Dog breeds
  const dogBreeds = [
    'German Shepherd',
    'Belgian Malinois',
    'Rottweiler',
    'Doberman Pinscher',
    'Dutch Shepherd'
  ];

  // Officer form state
  const [officerInfo, setOfficerInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    nin: '',
    gender: '',
    department: '',
    officerNumber: '',
    maritalStatus: '',
    age: '',
    photo: null,
    nationalId: null,
    documents: []
  });

  // Dog form state
  const [dogInfo, setDogInfo] = useState({
    name: '',
    breed: '',
    handler: '',
    age: '',
    specialization: 'general',
    photo: null
  });

  // Generate random officer number
  const generateOfficerNumber = () => {
    const randomDigits = Math.floor(10000 + Math.random() * 90000);
    return `SP${randomDigits}`;
  };

  // Handle file uploads
  const handleFileUpload = (e, type) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (type === 'photo') {
      const file = files[0];
      if (activeTab === 'officer') {
        setOfficerInfo({...officerInfo, photo: file});
      } else {
        setDogInfo({...dogInfo, photo: file});
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    } 
    else if (type === 'nationalId') {
      const file = files[0];
      setOfficerInfo({...officerInfo, nationalId: file});
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setIdPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
    else if (type === 'documents') {
      const filesArray = Array.from(files);
      setOfficerInfo({...officerInfo, documents: [...officerInfo.documents, ...filesArray]});
      
      const previews = [];
      filesArray.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          previews.push(reader.result);
          if (previews.length === filesArray.length) {
            setDocumentsPreview([...documentsPreview, ...previews]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  // Upload file to Firebase Storage
  const uploadFile = async (file, path) => {
    try {
      const storageRef = ref(storage, path);
      const snapshot = await uploadBytes(storageRef, file);
      return await getDownloadURL(snapshot.ref);
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  };

  // Validate phone number
  const validatePhone = (phone) => {
    return /^\+256\d{9}$/.test(phone);
  };

  // Validate NIN
  const validateNIN = (nin) => {
    return /^\d{14}$/.test(nin);
  };

  // Validate name (no whitespace)
  const validateName = (name) => {
    return /^\S+$/.test(name);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (activeTab === 'officer') {
        // Validate officer data
        if (!validateName(officerInfo.firstName) || !validateName(officerInfo.lastName)) {
          alert('Names cannot contain whitespace');
          return;
        }
        if (!validatePhone(officerInfo.phone)) {
          alert('Phone must start with +256 and have 13 total digits');
          return;
        }
        if (!validateNIN(officerInfo.nin)) {
          alert('NIN must be exactly 14 digits');
          return;
        }
        if (parseInt(officerInfo.age) < 18) {
          alert('Officer must be at least 18 years old');
          return;
        }
        if (!officerInfo.photo || !officerInfo.nationalId) {
          alert('Photo and National ID are required');
          return;
        }

        // Generate officer number if not exists
        const officerNumber = officerInfo.officerNumber || generateOfficerNumber();

        // Upload files
        const photoURL = await uploadFile(officerInfo.photo, `officers/${officerNumber}/photo`);
        const nationalIdURL = await uploadFile(officerInfo.nationalId, `officers/${officerNumber}/nationalId`);
        
        const documentsURLs = [];
        for (const doc of officerInfo.documents) {
          const url = await uploadFile(doc, `officers/${officerNumber}/documents/${doc.name}`);
          documentsURLs.push(url);
        }

        // Save to Firestore
        await addDoc(collection(db, 'officers'), {
          firstName: officerInfo.firstName,
          lastName: officerInfo.lastName,
          email: officerInfo.email,
          phone: officerInfo.phone,
          nin: officerInfo.nin,
          gender: officerInfo.gender,
          department: officerInfo.department,
          officerNumber,
          maritalStatus: officerInfo.maritalStatus,
          age: parseInt(officerInfo.age),
          photoURL,
          nationalIdURL,
          documentsURLs,
          location: { lat: null, lng: null }, // Empty coordinates as requested
          createdAt: new Date(),
          status: 'off-duty'
        });

        alert('Officer registered successfully!');
      } else {
        // Validate dog data
        if (!dogInfo.name || !dogInfo.breed || !dogInfo.handler || !dogInfo.age || !dogInfo.photo) {
          alert('All fields are required for dog registration');
          return;
        }

        // Upload dog photo
        const photoURL = await uploadFile(dogInfo.photo, `dogs/${dogInfo.name}-${Date.now()}/photo`);

        // Save to Firestore
        await addDoc(collection(db, 'dogs'), {
          name: dogInfo.name,
          breed: dogInfo.breed,
          handler: dogInfo.handler,
          age: parseInt(dogInfo.age),
          specialization: dogInfo.specialization,
          photoURL,
          location: { lat: null, lng: null }, // Empty coordinates as requested
          createdAt: new Date(),
          status: 'active'
        });

        alert('Security dog registered successfully!');
      }

      closeModal();
      window.location.reload();
    } catch (error) {
      console.error('Registration error:', error);
      alert(`Error registering ${activeTab === 'officer' ? 'officer' : 'dog'}`);
    }
  };

  return (
    <form className="h-full" onSubmit={handleSubmit}>
      <div className="modal-header-section flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <h1 className="md:text-xl lg:text-2xl font-bold">
            {activeTab === 'officer' ? 'Security Officer Registration' : 'Security Dog Registration'}
          </h1>
          <div className="flex gap-2">
            <button 
              type="button"
              className={`px-3 py-1 rounded-full ${activeTab === 'officer' ? 'bg-main text-white' : 'bg-gray-200'}`}
              onClick={() => setActiveTab('officer')}
            >
              <User size={16} />
            </button>
            <button 
              type="button"
              className={`px-3 py-1 rounded-full ${activeTab === 'dog' ? 'bg-main text-white' : 'bg-gray-200'}`}
              onClick={() => setActiveTab('dog')}
            >
              <Dog size={16} />
            </button>
          </div>
        </div>
        <p className="text-xs font-light text-slate-500">
          {activeTab === 'officer' 
            ? 'All security personnel information must be collected accurately for complete registration.'
            : 'All security dog information must be collected accurately for complete registration.'}
        </p>
      </div>

      <div className="form-section py-4 overflow-auto h-[90%]">
        {/* Photo Upload Section */}
        <div className="mb-6 flex flex-col items-center">
          <div 
            className="relative w-24 h-24 rounded-full bg-gray-200 mb-2 cursor-pointer overflow-hidden"
            onClick={() => fileInputRef.current.click()}
          >
            {photoPreview ? (
              <Image 
                src={photoPreview} 
                alt="Preview" 
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                {activeTab === 'officer' ? <User size={40} /> : <Dog size={40} />}
              </div>
            )}
          </div>
          <button
            type="button"
            className="flex items-center gap-2 text-sm text-main"
            onClick={() => fileInputRef.current.click()}
          >
            <Upload size={16} />
            {photoPreview ? 'Change Photo' : 'Upload Photo'}
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => handleFileUpload(e, 'photo')}
            accept="image/*"
            className="hidden"
            required
          />
        </div>

        {activeTab === 'officer' ? (
          <>
            <div className="form-area grid grid-cols-12 md:gap-4 lg:gap-8">
              <InputField 
                label="First Name" 
                type="text" 
                placeholder="Firstname (no spaces)" 
                onChange={(e) => setOfficerInfo({...officerInfo, firstName: e.target.value})} 
                value={officerInfo.firstName} 
                required 
              />
              <InputField 
                label="Last Name" 
                type="text" 
                placeholder="Lastname (no spaces)" 
                onChange={(e) => setOfficerInfo({...officerInfo, lastName: e.target.value})} 
                value={officerInfo.lastName} 
                required 
              />
              <InputField 
                label="Email" 
                type="email" 
                placeholder="Active email" 
                onChange={(e) => setOfficerInfo({...officerInfo, email: e.target.value})} 
                value={officerInfo.email} 
                required 
              />
              <InputField 
                label="Phone (+256...)" 
                type="tel" 
                placeholder="+256XXXXXXXXX" 
                onChange={(e) => setOfficerInfo({...officerInfo, phone: e.target.value})} 
                value={officerInfo.phone} 
                required 
              />
              <InputField 
                label="NIN (14 digits)" 
                type="text" 
                placeholder="National Identification Number" 
                onChange={(e) => setOfficerInfo({...officerInfo, nin: e.target.value})} 
                value={officerInfo.nin} 
                required 
              />
              
              <div className="col-span-12 md:col-span-6 lg:col-span-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                <select
                  value={officerInfo.gender}
                  onChange={(e) => setOfficerInfo({...officerInfo, gender: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-main focus:border-main"
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>

              <div className="col-span-12 md:col-span-6 lg:col-span-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                <select
                  value={officerInfo.department}
                  onChange={(e) => setOfficerInfo({...officerInfo, department: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-main focus:border-main"
                  required
                >
                  <option value="">Select Department</option>
                  {departments.map((dept) => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>

              <InputField 
                label="Officer Number" 
                type="text" 
                placeholder="Will be auto-generated" 
                value={officerInfo.officerNumber || generateOfficerNumber()} 
                readOnly 
              />

              <div className="col-span-12 md:col-span-6 lg:col-span-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Marital Status</label>
                <select
                  value={officerInfo.maritalStatus}
                  onChange={(e) => setOfficerInfo({...officerInfo, maritalStatus: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-main focus:border-main"
                  required
                >
                  <option value="">Select Status</option>
                  <option value="single">Single</option>
                  <option value="married">Married</option>
                </select>
              </div>

              <InputField 
                label="Age (18+)" 
                type="number" 
                min="18" 
                placeholder="Age" 
                onChange={(e) => setOfficerInfo({...officerInfo, age: e.target.value})} 
                value={officerInfo.age} 
                required 
              />

              {/* National ID Upload */}
              <div className="col-span-12 mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">National ID Copy</label>
                <div className="flex items-center gap-4">
                  {idPreview ? (
                    <div className="w-16 h-16 border border-gray-300 rounded overflow-hidden">
                      <Image 
                        src={idPreview} 
                        alt="ID Preview" 
                        width={64}
                        height={64}
                        className="object-contain"
                      />
                    </div>
                  ) : (
                    <div className="w-16 h-16 border border-gray-300 rounded flex items-center justify-center text-gray-400">
                      <FileText size={24} />
                    </div>
                  )}
                  <button
                    type="button"
                    className="flex items-center gap-2 text-sm text-main"
                    onClick={() => idFileInputRef.current.click()}
                  >
                    <Upload size={16} />
                    Upload National ID
                  </button>
                  <input
                    type="file"
                    ref={idFileInputRef}
                    onChange={(e) => handleFileUpload(e, 'nationalId')}
                    accept="image/*,application/pdf"
                    className="hidden"
                    required
                  />
                </div>
              </div>

              {/* Additional Documents Upload */}
              <div className="col-span-12 mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Educational Documents</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {documentsPreview.map((doc, index) => (
                    <div key={index} className="w-16 h-16 border border-gray-300 rounded overflow-hidden">
                      <Image 
                        src={doc} 
                        alt={`Document ${index + 1}`} 
                        width={64}
                        height={64}
                        className="object-contain"
                      />
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  className="flex items-center gap-2 text-sm text-main"
                  onClick={() => documentsFileInputRef.current.click()}
                >
                  <Upload size={16} />
                  Upload Documents
                </button>
                <input
                  type="file"
                  ref={documentsFileInputRef}
                  onChange={(e) => handleFileUpload(e, 'documents')}
                  accept="image/*,application/pdf"
                  className="hidden"
                  multiple
                />
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="form-area grid grid-cols-12 md:gap-4 lg:gap-8">
              <InputField 
                label="Dog Name" 
                type="text" 
                placeholder="Enter dog name" 
                onChange={(e) => setDogInfo({...dogInfo, name: e.target.value})} 
                value={dogInfo.name} 
                required 
              />
              
              <div className="col-span-12 md:col-span-6 lg:col-span-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Breed</label>
                <select
                  value={dogInfo.breed}
                  onChange={(e) => setDogInfo({...dogInfo, breed: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-main focus:border-main"
                  required
                >
                  <option value="">Select Breed</option>
                  {dogBreeds.map((breed) => (
                    <option key={breed} value={breed}>{breed}</option>
                  ))}
                </select>
              </div>

              <div className="col-span-12 md:col-span-6 lg:col-span-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Handler</label>
                <select
                  value={dogInfo.handler}
                  onChange={(e) => setDogInfo({...dogInfo, handler: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-main focus:border-main"
                  required
                >
                  <option value="">Select Handler</option>
                  {/* In a real app, you would fetch handlers from your database */}
                  <option value="handler1">John Doe (SP12345)</option>
                  <option value="handler2">Jane Smith (SP54321)</option>
                </select>
              </div>

              <InputField 
                label="Age" 
                type="number" 
                placeholder="Enter age" 
                onChange={(e) => setDogInfo({...dogInfo, age: e.target.value})} 
                value={dogInfo.age} 
                required 
              />

              <div className="col-span-12 md:col-span-6 lg:col-span-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Specialization</label>
                <select
                  value={dogInfo.specialization}
                  onChange={(e) => setDogInfo({...dogInfo, specialization: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-main focus:border-main"
                  required
                >
                  <option value="general">General Security</option>
                  <option value="narcotics">Narcotics Detection</option>
                  <option value="explosives">Explosives Detection</option>
                  <option value="search_rescue">Search & Rescue</option>
                </select>
              </div>
            </div>
          </>
        )}

        <div className="w-full flex flex-col gap-4 items-center justify-between bg-slate-200 py-12 px-8 mt-8">
          <div className="flex flex-col md:flex-row gap-2">
            <div className="flex justify-start gap-2 md:text-lg items-start font-medium">
              <InfoIcon className="text-blue-400" />
              <p>{activeTab === 'officer' 
                ? 'All information provided will be verified before approval' 
                : 'Dogs must complete certification for their specialization'}</p>
            </div>
            <p className="text-xs text-slate-500">
              By submitting, you agree to our <a href="#" className="text-main">Terms of Service</a>
            </p>
          </div>
          <button 
            className="w-full py-2 px-4 rounded-full bg-main text-white md:w-32 hover:bg-blue-700 transition-colors" 
            type="submit"
          >
            Submit
          </button>
        </div>
      </div>
    </form>
  );
};

export default AddOfficerModal;