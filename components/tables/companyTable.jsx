"use client";
import React, { useEffect, useState } from "react";
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
} from "@mui/material";
import { clientManager } from "@/libs/resourceManagement";
import { Eye, Trash2, Pencil } from "lucide-react";
import Link from "next/link";
import useModalStore from "@/store/modalStore";
import UpdateOfficerModal from "../Data Models/updateOfficer";

const CompanyTable = () => {
  const [officers, setOfficers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const { openModal } = useModalStore();

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const data = await clientManager.getAll();
        const companyData = data.filter(
          (company) => company.clientType === "company"
        );
        setOfficers(companyData);
      } catch (error) {
        console.error("Error fetching officers:", error);
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  const handleUpdate = (id) => {
    openModal(<UpdateOfficerModal id={id} />);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this officer?"
    );
    if (confirmDelete) {
      try {
        await clientManager.delete(id); // <-- Make sure this method exists in clientManager
        setOfficers((prev) => prev.filter((o) => o.id !== id));
      } catch (error) {
        console.log("Delete error:", error.message);
      }
    }
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

  const filteredData = officers.filter((row) =>
    `${row.company_name}`.toLowerCase().includes(filter.toLowerCase()) ||
    row.email.toLowerCase().includes(filter.toLowerCase()) ||
    row.phone.includes(filter)
  );

  const paginatedData = filteredData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <div>
      <TextField
        label="Quick Search"
        variant="outlined"
        fullWidth
        margin="normal"
        value={filter}
        onChange={handleFilterChange}
        className="lg:w-72"
      />

      {loading ? (
        <div className="flex justify-center items-center mt-4">
          <CircularProgress />
        </div>
      ) : filteredData.length === 0 ? (
        <p className="text-center text-gray-500 mt-4">
          No companies match your search.
        </p>
      ) : (
        <>
          <TableContainer
            component={Paper}
            className="shadow-lg rounded-lg border-t-2 border-t-blue-500 mt-4"
          >
            <Table>
              <TableHead>
                <TableRow className="bg-gray-200">
                  <TableCell className="font-bold text-gray-700 hidden md:table-cell">
                    #
                  </TableCell>
                  <TableCell className="font-bold text-gray-700">
                    Company Name
                  </TableCell>
                  <TableCell className="font-bold text-gray-700 hidden md:table-cell">
                    Email
                  </TableCell>
                  <TableCell className="font-bold text-gray-700 hidden md:table-cell">
                    Phone
                  </TableCell>
                  <TableCell className="font-bold text-gray-700 hidden md:table-cell">
                    Residence
                  </TableCell>
                  <TableCell className="font-bold text-gray-700 hidden md:table-cell">
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedData.map((row, index) => (
                  <TableRow key={row.id} className="hover:bg-gray-100">
                    <TableCell className="hidden md:table-cell">
                    <Link
                        href={`/dashboard/officers/overview/officer/${row.id}`}
                        className="text-blue-600 hover:underline hover:cursor-pointer"
                      >
                      {row.security_code}
                    </Link>
                    </TableCell>
                    <TableCell>
                        {row.company_name}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {row.email}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {row.phone}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {row.client_address}
                    </TableCell>
                    <TableCell className="hidden md:flex gap-2">
                      <IconButton onClick={() => handleUpdate(row.id)}>
                        <Pencil size={18} />
                      </IconButton>
                      <IconButton onClick={() => handleDelete(row.id)}>
                        <Trash2 size={18} />
                      </IconButton>
                      <IconButton
                        onClick={() =>
                          openModal(
                            <UpdateOfficerModal id={row.id} viewOnly />
                          )
                        }
                      >
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

export default CompanyTable;
