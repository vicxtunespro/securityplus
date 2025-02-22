'use client';
import React, { useState } from 'react';
import { addOfficer } from '@/lib/database'

export default function AddGuardForm() {

  const [officerInfo, setOfficerInfo] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    residence: '',
    department: '',
   status: 'off-duty',
  });

  const handleChange = (e) => {
    setOfficerInfo({ ...officerInfo, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addOfficer(officerInfo);
    alert(`'Guard added successfully!' ${officerInfo}`);
    setOfficerInfo({ 
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      residence: '',
      department: '',
      status: 'off-duty',
     });
  };

  return (
      <form onSubmit={handleSubmit} className="p-4 bg-white shadow-md rounded-md">
        <h2 className="text-xl font-bold mb-2">Add Guard</h2>
        <input
          type="text"
          name="first_name"
          value={officerInfo.first_name}
          onChange={handleChange}
          placeholder="First Name"
          className="w-full p-2 border rounded mb-2"
          required
        />
        <input
          type="text"
          name="last_name"
          value={officerInfo.last_name}
          onChange={handleChange}
          placeholder="Last Name"
          className="w-full p-2 border rounded mb-2"
          required
        />
        <input
          type="email"
          name="email"
          value={officerInfo.email}
          onChange={handleChange}
          placeholder="Email"
          className="w-full p-2 border rounded mb-2"
          required
        />
        <input
          type="text"
          name="phone"
          value={officerInfo.phone}
          onChange={handleChange}
          placeholder="Phone"
          className="w-full p-2 border rounded mb-2"
          required
        />
        <input
          type="text"
          name="residence"
          value={officerInfo.residence}
          onChange={handleChange}
          placeholder="Residence"
          className="w-full p-2 border rounded mb-2"
          required
        />
        <input
          type="text"
          name="department"
          value={officerInfo.department}
          onChange={handleChange}
          placeholder="Department"
          className="w-full p-2 border rounded mb-2"
          required
        />
        <select
          name="status"
          value={officerInfo.status}
          onChange={handleChange}
          className="w-full p-2 border rounded mb-2"
        >
          <option value="off-duty">Off-duty</option>
          <option value="on-duty">On-duty</option>
        </select>
        <button type="submit" className="bg-blue-500 text-white p-2 rounded w-full">
          Add Officer
        </button>
      </form>
  );
}
