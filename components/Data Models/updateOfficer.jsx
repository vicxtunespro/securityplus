'use client';
import React, { useEffect, useState } from 'react';
import { addOfficer, updateOfficer } from '@/libs/database';
import InputField from './input-field';
import { InfoIcon } from 'lucide-react';
import useModalStore from '@/store/modalStore';
import { getOfficer } from '@/libs/officerGateway';



const UpdateOfficerModal = ({id}) => {


  const {closeModal} = useModalStore()

  const [officerInfo, setOfficerInfo] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    residence: '',
    department: '',
    status: 'off-duty',
    password: '',
    confirmPassword: '', // Add confirmPassword field
  });


  useEffect(() =>{
    const fetchData = async () => {
      try {
        const officer = await getOfficer(id);
        setOfficerInfo({...officer});
      } catch (error) {
       console.error(error.message) 
      }
    }

    fetchData();
  }, []);

  const handleChange = (e) => {
    setOfficerInfo({ ...officerInfo, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Password confirmation check
    if (officerInfo.password !== officerInfo.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    try {
      await updateOfficer(id, officerInfo);
      
      alert('Officer infomation updated successfully!');
      closeModal()
      window.location.reload();
      setOfficerInfo({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        residence: '',
        department: '',
        status: 'off-duty',
        password: '',
        confirmPassword: '', // Reset confirmPassword field
      });
    } catch (error) {
      alert('Error adding officer');
    }
  };

 
  return (
    <form className="h-full" onSubmit={handleSubmit}>
      <div className="modal-header-section flex flex-col gap-2">
        <h1 className="md:text-xl lg:text-2xl font-bold md:font-bold">
          Registration Form - Security Personnel
        </h1>
        <p className="text-xs font-light text-slate-500">
          All Security guards information must be collected accurately for complete registration.
        </p>
      </div>

      <div className="form-section py-4 overflow-auto h-[90%]">
        <div>
          <div className="profile-section-header flex gap-2 items-center mb-4">
            <span className="bg-main rounded-full size-5 lg:size-6 text-white flex items-center justify-center lg:text-xl font-bold">
              1
            </span>
            <span className="font-bold text-2xl lg:text-3xl text-slate-300">PROFILE</span>
          </div>
          <div className="form-area grid grid-cols-12 md:gap-4 lg:gap-8">
            {/* First Name */}
            <InputField
              label={"First Name"}
              type={"text"}
              placeholder={"Enter first name ..."}
              onChange={handleChange}
              value={officerInfo.first_name}
              name="first_name"
            />

            {/* Last Name */}
            <InputField
              label={"Last Name"}
              type={"text"}
              placeholder={"Enter last name ..."}
              onChange={handleChange}
              value={officerInfo.last_name}
              name="last_name"
            />

            {/* Email */}
            <InputField
              label={"Email"}
              type={"text"}
              placeholder={"Active email"}
              onChange={handleChange}
              value={officerInfo.email}
              name="email"
            />

            {/* Phone */}
            <InputField
              label={"Phone"}
              type={"text"}
              placeholder={"Active phone number"}
              onChange={handleChange}
              value={officerInfo.phone}
              name="phone"
            />

            {/* Department */}
            <InputField
              label={"Department"}
              type={"text"}
              placeholder={"Initial department"}
              onChange={handleChange}
              value={officerInfo.department}
              name="department"
            />

            {/* Residence */}
            <InputField
              label={"Residence"}
              type={"text"}
              placeholder={"Residence"}
              onChange={handleChange}
              value={officerInfo.residence}
              name="residence"
            />
          </div>
        </div>

        <div>
          <div className="profile-section-header flex gap-2 items-center mt-6 mb-4">
            <span className="bg-main rounded-full size-5 lg:size-6 text-white flex items-center justify-center lg:text-xl font-bold">
              2
            </span>
            <span className="font-bold text-2xl lg:text-3xl text-slate-300">UPDATE PASSWORD</span>
          </div>
          <div className="form-area grid grid-cols-12 md:gap-4 lg:gap-8">
            {/* Password */}
            <InputField
              label={"New Password"}
              type={"password"}
              placeholder={"8 characters and more"}
              onChange={handleChange}
              value={officerInfo.password}
              name="password"
            />

            {/* Confirm Password */}
            <InputField
              label={"Confirm Password"}
              type={"password"}
              placeholder={"Repeat Password"}
              onChange={handleChange}
              value={officerInfo.confirmPassword}
              name="confirmPassword"
            />
          </div>
        </div>

        <div className="w-full flex flex-col gap-4 items-center justify-between bg-slate-200 py-12 px-8 mt-8">
          <div className="flex flex-col md:flex-row gap-2">
            <div className="flex justify-start gap-2 md:text-lg items-start font-medium">
              <InfoIcon className="text-blue-400" />
              <p>Department can be changed after training programs</p>
            </div>
            <p className="text-xs text-slate-500">
              By pressing the submit button, the individual agrees to our{" "}
              <a href="#">Privacy Policy Guidelines</a>
            </p>
          </div>
          <button className="w-full py-2 px-4 rounded-full bg-main text-white md:w-32" type="submit">
            Submit
          </button>
        </div>
      </div>
    </form>
  );
};

export default UpdateOfficerModal;
