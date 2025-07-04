'use client';
import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, CircularProgress, IconButton, TablePagination } from '@mui/material';
import { Eye, Trash2, Pencil } from 'lucide-react';
import useModalStore from '@/store/modalStore';
import { db } from '@/libs/firebase'; // Import Firestore instance
import { collection, onSnapshot } from 'firebase/firestore'; // Import Firestore methods
import AddWeaponModal from '@/components/Data Models/addWeapon';
import UpdateWeaponModal from '@/components/Data Models/updateWeapon';
import Modal from '@/components/Data Models/modal';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import TableExport from '@/components/tables/exportTable';

export default function WeaponInventoryPage() {
  const [weapons, setWeapons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const { openModal } = useModalStore();

  useEffect(() => {
    // Real-time listener for Firestore collection
    const unsubscribe = onSnapshot(
      collection(db, 'weapons'), // Replace 'weapons' with your Firestore collection name
      (snapshot) => {
        const weaponsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setWeapons(weaponsData);
        setLoading(false);
        toast.success('Weapons data updated in real-time!'); // Success toast
      },
      (error) => {
        console.error('Failed to fetch weapons in real-time:', error);
        toast.error('Failed to fetch weapons in real-time.'); // Error toast
        setLoading(false);
      }
    );

    // Cleanup listener on component unmount
    return () => unsubscribe();
  }, []);

  const handleUpdate = (id) => {
    openModal(<UpdateWeaponModal id={id} />);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this weapon?');
    if (confirmDelete) {
      try {
        // Add your delete logic here
        toast.success('Weapon deleted successfully.'); // Success toast
      } catch (error) {
        console.error('Failed to delete weapon:', error);
        toast.error('Failed to delete weapon.'); // Error toast
      }
    }
  };

  const handleOpenModal = () => {
    openModal(<AddWeaponModal />);
    toast.info('Add Weapon Modal opened.'); // Info toast
  };

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
    setPage(0); // Reset to first page on new search
  };

  const handleChangePage = (_, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredData = weapons.filter((row) =>
    `${row.name} ${row.type}`.toLowerCase().includes(filter.toLowerCase()) ||
    row.status.toLowerCase().includes(filter.toLowerCase())
  );

  const paginatedData = filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <div className="max-w-screen-xl mx-auto pt-4">

      {/* Search Input */}
      <div className='flex justify-between items-center mb-4'>
        <TextField
          label="Search Weapons"
          variant="outlined"
          fullWidth
          margin="normal"
          value={filter}
          onChange={handleFilterChange}
          className="lg:w-72"
        />

        <TableExport
          data={weapons}
          columns={[
            { header: 'Serial Number', accessor: 'serial' },
            { header: 'Weapon Name', accessor: 'name' },
            { header: 'Type', accessor: 'type' },
            { header: 'Status', accessor: 'status' },
            { header: 'Assigned To', accessor: 'assignedTo' },
          ]}
          title="Weapons Data @{new Date().toLocaleDateString()}"
          buttonText='Export'
          className="mb-4"
          />
      </div>

      {/* Loading Spinner */}
      {loading ? (
        <div className="flex justify-center items-center mt-4">
          <CircularProgress />
        </div>
      ) : (
        <>
          {/* Table for Displaying Weapons */}
          <TableContainer component={Paper} className="shadow-lg rounded-lg mt-4">
            <Table>
              <TableHead>
                <TableRow className="bg-gray-200">
                  <TableCell className="font-bold text-gray-700">Serial Number</TableCell>
                  <TableCell className="font-bold text-gray-700">Weapon Name</TableCell>
                  <TableCell className="font-bold text-gray-700">Type</TableCell>
                  <TableCell className="font-bold text-gray-700">Status</TableCell>
                  <TableCell className="font-bold text-gray-700">Assigned To</TableCell>
                  <TableCell className="font-bold text-gray-700">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedData.map((row) => (
                  <TableRow key={row.id} className="hover:bg-gray-100">
                    <TableCell>{row.serial}</TableCell>
                    <TableCell>{row.name}</TableCell>
                    <TableCell>{row.type}</TableCell>
                    <TableCell>{row.status}</TableCell>
                    <TableCell>{row.assignedTo || 'Unassigned'}</TableCell>
                    <TableCell className="flex gap-2">
                      <IconButton onClick={() => handleUpdate(row.id)}>
                        <Pencil size={18} />
                      </IconButton>
                      <IconButton onClick={() => handleDelete(row.id)}>
                        <Trash2 size={18} />
                      </IconButton>
                      <IconButton>
                        <Eye size={18} />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pagination Controls */}
          <TablePagination
            component="div"
            count={filteredData.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25]}
          />
        </>
      )}

      {/* Modal Component */}
      <Modal />
    </div>
  );
}
