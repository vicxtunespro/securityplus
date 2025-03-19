"use client";
import React, { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  CircularProgress, // Import CircularProgress for the loader
} from '@mui/material';
import { deleteOffice, getOfficers } from '@/lib/officerGateway';
import { Delete, DeleteIcon, Pen, Recycle, RecycleIcon, View } from 'lucide-react';
import Link from 'next/link';
import useModalStore from '@/store/modalStore';
import UpdateOfficerModal from '../Data Models/updateOfficer';

const MyTable = () => {
  const [officers, setOfficers] = useState([]);
  const [loading, setLoading] = useState(true); // State to track loading
  const [filter, setFilter] = useState('');
  const { openModal } = useModalStore();

  const handleUpdate = (id) => {
    openModal(<UpdateOfficerModal id={id}/>);
  };

  useEffect(() => {
    async function fetchData() {
      setLoading(true); // Set loading to true before fetching data
      const officerData = await getOfficers();
      setOfficers(officerData);
      setLoading(false); // Set loading to false after data is fetched
      console.log("Dataaaaa: ", officerData);
    }

    fetchData();
  }, []);

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const handleDelete = async (id) =>{
    const confirmDelete = window.confirm("Are you sure you want to delete this officer?");
    if(confirmDelete){
      try {
        await deleteOffice(id);
        setOfficers((prevOfficers) => prevOfficers.filter((officer) => officer.id !== id))
      } catch (error) {
        console.log(error.message);
      }
    }
  }

  const filteredData = officers.filter((row) => {
    return (
      row.first_name.toLowerCase().includes(filter.toLowerCase()) ||
      row.email.toLowerCase().includes(filter.toLowerCase()) ||
      row.phone.includes(filter)
    );
  });

  return (
    <div>
      <TextField
        label="Quick Search"
        variant="outlined"
        fullWidth
        margin = "normal"
        value={filter}
        onChange={handleFilterChange}
        className='lg:w-72'
      />
      {loading ? ( // Conditional rendering based on loading state
        <div className="flex justify-center items-center mt-4">
          <CircularProgress /> {/* Loader */}
        </div>
      ) : (
        <TableContainer component={Paper} className="shadow-lg rounded-lg border-t-2 border-t-blue-500 mt-4">
          <Table>
            <TableHead>
              <TableRow className="bg-gray-200">
                <TableCell className="font-bold text-gray-700">ID</TableCell>
                <TableCell className="font-bold text-gray-700">Full Name</TableCell>
                <TableCell className="hidden md:block font-bold text-gray-700">First Name</TableCell>
                <TableCell className="hidden md:block font-bold text-gray-700">Last Name</TableCell>
                <TableCell className="hidden md:visible font-bold text-gray-700">Email</TableCell>
                <TableCell className="hidden md:visible font-bold text-gray-700">Phone</TableCell>
                <TableCell className="hidden md:visible font-bold text-gray-700">Residence</TableCell>
                <TableCell className="font-bold text-gray-700">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredData.map((row) => (
                <TableRow key={row.id} className="hover:bg-gray-100">
                  <TableCell className="border-b border-gray-300">{officers.indexOf(row) + 1}</TableCell>
                  <TableCell className="md:hidden border-b border-gray-300"><Link href={`/dashboard/officers/overview/officer/:${row.id}`}>{`${row.first_name} ${row.last_name}`}</Link></TableCell>
                  <TableCell className="hidden md:block border-b border-gray-300"><Link href={`/dashboard/officers/overview/officer/:${row.id}`}>{row.first_name}</Link></TableCell>
                  <TableCell className="hidden md:block border-b border-gray-300">{row.last_name}</TableCell>
                  <TableCell className="hidden md:block border-b border-gray-300">{row.email}</TableCell>
                  <TableCell className="hidden md:block border-b border-gray-300">{row.phone}</TableCell>
                  <TableCell className="hidden md:block border-b border-gray-300">{row.residence}</TableCell>
                  <TableCell className="border-b border-gray-300 flex gap-1">
                    <View />
                    <Pen onClick={() => handleUpdate(row.id)}/>
                    <RecycleIcon onClick={() => handleDelete(row.id)}/>
                  </TableCell>
                  
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  );
};

export default MyTable;