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
import { getGuards } from '@/lib/database';

const MyTable = () => {
  const [officers, setOfficers] = useState([]);
  const [loading, setLoading] = useState(true); // State to track loading
  const [filter, setFilter] = useState('');

  useEffect(() => {
    async function fetchData() {
      setLoading(true); // Set loading to true before fetching data
      const officerData = await getGuards();
      setOfficers(officerData);
      setLoading(false); // Set loading to false after data is fetched
      console.log("Dataaaaa: ", officerData);
    }

    fetchData();
  }, []);

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

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
                <TableCell className="font-bold text-gray-700">First Name</TableCell>
                <TableCell className="font-bold text-gray-700">Last Name</TableCell>
                <TableCell className="font-bold text-gray-700">Email</TableCell>
                <TableCell className="font-bold text-gray-700">Phone</TableCell>
                <TableCell className="font-bold text-gray-700">Residence</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredData.map((row) => (
                <TableRow key={row.id} className="hover:bg-gray-100">
                  <TableCell className="border-b border-gray-300">{officers.indexOf(row) + 1}</TableCell>
                  <TableCell className="border-b border-gray-300">{row.first_name}</TableCell>
                  <TableCell className="border-b border-gray-300">{row.last_name}</TableCell>
                  <TableCell className="border-b border-gray-300">{row.email}</TableCell>
                  <TableCell className="border-b border-gray-300">{row.phone}</TableCell>
                  <TableCell className="border-b border-gray-300">{row.residence}</TableCell>
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