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
  CircularProgress,
  IconButton,
  TablePagination,
  Button,
  Menu,
  MenuItem,
} from '@mui/material';
import { Eye, Trash2, Pencil, Download } from 'lucide-react';
import Link from 'next/link';
import useModalStore from '@/store/modalStore';
import { clientManager } from '@/libs/resourceManagement';
import UpdateClientModal from '../Data Models/updateWeapon';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable'; // Import autoTable separately

const ClientsTable = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const { openModal } = useModalStore();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const data = await clientManager.getAll();
        const individualsOnly = data.filter(client => client.clientType === 'individual');
        setClients(individualsOnly);
      } catch (error) {
        console.error('Failed to fetch clients:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleUpdate = (id) => {
    openModal(<UpdateClientModal id={id} />);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this officer?");
    if (confirmDelete) {
      try {
        await clientManager.deleteResource(id);
        setClients((prev) => prev.filter((o) => o.id !== id));
      } catch (error) {
        console.log(error.message);
      }
    }
  };

  // Filter function
  const handleFilterChange = (event) => {
    setFilter(event.target.value);
    setPage(0); // Reset to first page on new search
  };

  // Pagination functions
  const handleChangePage = (_, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Export functions
  const handleExportClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleExportClose = () => {
    setAnchorEl(null);
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredData.map(row => ({
      'Security Code': row.security_code,
      'Full Name': `${row.first_name} ${row.last_name}`,
      'Email': row.email,
      'Phone': row.phone,
      'Site Location': row.client_address
    })));
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Clients");
    XLSX.writeFile(workbook, "Clients.xlsx");
    handleExportClose();
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    
    // Add title
    doc.text('Clients List', 14, 15);
    
    // Prepare data for PDF
    const headers = [['Security Code', 'Full Name', 'Email', 'Phone', 'Site Location']];
    const pdfData = filteredData.map(row => [
      row.security_code,
      `${row.first_name} ${row.last_name}`,
      row.email,
      row.phone,
      row.client_address
    ]);
    
    // Add table to PDF using the imported autoTable function
    autoTable(doc, {
      head: headers,
      body: pdfData,
      startY: 20,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [41, 128, 185] }
    });
    
    doc.save('Clients.pdf');
    handleExportClose();
  };

  // Data filtering and pagination
  const filteredData = clients.filter((row) =>
    `${row.first_name} ${row.last_name}`.toLowerCase().includes(filter.toLowerCase()) ||
    row.email.toLowerCase().includes(filter.toLowerCase()) ||
    row.phone.includes(filter)
  );

  const paginatedData = filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <div>
      <div className="flex justify-between items-center">
        <TextField
          label="Quick Search"
          variant="outlined"
          margin="normal"
          value={filter}
          onChange={handleFilterChange}
          className="lg:w-72"
        />
        <Button
          variant="contained"
          color="primary"
          startIcon={<Download size={18} />}
          onClick={handleExportClick}
          sx={{ mt: 2 }}
        >
          Export
        </Button>
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleExportClose}
        >
          <MenuItem onClick={exportToExcel}>Export as Excel</MenuItem>
          <MenuItem onClick={exportToPDF}>Export as PDF</MenuItem>
        </Menu>
      </div>

      {loading ? (
        <div className="flex justify-center items-center mt-4">
          <CircularProgress />
        </div>
      ) : (
        <>
          <TableContainer component={Paper} className="shadow-lg rounded-lg border-t-2 border-t-blue-500 mt-4">
            <Table>
              <TableHead>
                <TableRow className="bg-gray-200">
                  <TableCell className="font-bold text-gray-700 hidden md:table-cell">#</TableCell>
                  <TableCell className="font-bold text-gray-700">Full Name</TableCell>
                  <TableCell className="font-bold text-gray-700 hidden md:table-cell">Email</TableCell>
                  <TableCell className="font-bold text-gray-700 hidden md:table-cell">Phone</TableCell>
                  <TableCell className="font-bold text-gray-700 hidden md:table-cell">Site Location</TableCell>
                  <TableCell className="font-bold text-gray-700 hidden md:table-cell">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedData.map((row, index) => (
                  <TableRow key={row.id} className="hover:bg-gray-100">
                    <TableCell className="hidden md:table-cell">
                      <Link
                        href={`/dashboard/clients/overview/officer/${row.id}`}
                        className="text-blue-600 hover:underline hover:cursor-pointer"
                      >
                        {row.security_code}
                      </Link>
                    </TableCell>
                    <TableCell>
                        {`${row.first_name} ${row.last_name}`}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">{row.email}</TableCell>
                    <TableCell className="hidden md:table-cell">{row.phone}</TableCell>
                    <TableCell className="hidden md:table-cell">{row.client_address}</TableCell>
                    <TableCell className="hidden md:flex gap-2">
                      <IconButton onClick={() => handleUpdate(row.id)}>
                        <Pencil size={18} />
                      </IconButton>
                      <IconButton onClick={() => handleDelete(row.id)}>
                        <Trash2 size={18} />
                      </IconButton>
                      <IconButton onClick={() => openModal(<UpdateClientModal id={row.id} />)}>
                        <Eye size={18} />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

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
    </div>
  );
};

export default ClientsTable;