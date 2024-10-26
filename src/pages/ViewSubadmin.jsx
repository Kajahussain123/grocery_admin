import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton,
  Button, CircularProgress
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import {  deleteSubAdmin, editSubAdmin, getSubAdmins } from '../services/allApi';

function ViewSubAdmin() {
  const [subAdmins, setSubAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1); // Track total pages
  const [selectedSubAdmin, setSelectedSubAdmin] = useState(null);
  const [error, setError] = useState(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [count, setCount] = useState(0); // Track total sub-admin count
  const resultsPerPage = 10;

  const startSubAdminIndex = (currentPage - 1) * resultsPerPage + 1;
  const endSubAdminIndex = Math.min(startSubAdminIndex + resultsPerPage - 1, count);

  useEffect(() => {
    const loadSubAdmins = async () => {
      try {
        setLoading(true);
        const data = await getSubAdmins(currentPage, resultsPerPage);
        setSubAdmins(data.results);
        setCount(data.count); // Set total sub-admin count
        setTotalPages(Math.ceil(data.count / resultsPerPage)); // Calculate total pages
      } catch (error) {
        console.error('Failed to fetch data', error);
        setError('Failed to load sub-admins. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    loadSubAdmins();
  }, [currentPage]);

  const handleDelete = async (subAdminId) => {
    try {
      await deleteSubAdmin(subAdminId);
      setSubAdmins(subAdmins.filter((subAdmin) => subAdmin.id !== subAdminId));
      setError(null); // Clear any previous errors
    } catch (error) {
      console.error('Failed to delete sub-admin', error);
      setError('Failed to delete sub-admin. Please try again.');
    }
  };

  const handleOpenEditDialog = (subAdmin) => {
    setSelectedSubAdmin(subAdmin);
    setOpenEditDialog(true);
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: '100%', margin: 'auto' }}>
      {/* Error Alert */}
      {error && (
        <Box mb={2}>
          <Typography variant="body1" color="error">
            {error}
          </Typography>
        </Box>
      )}

      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4" gutterBottom>
          <b>View Sub Admins</b>
        </Typography>
      </Box>

      {/* Sub Admins Table */}
      <TableContainer component={Paper} sx={{ overflowX: 'auto' }}>
        <Table>
          <TableHead sx={{backgroundColor:"lightblue"}}>
            <TableRow>
              <TableCell><b>SI NO</b></TableCell>
              <TableCell><b>Name</b></TableCell>
              <TableCell><b>Email</b></TableCell>
              <TableCell><b>Permissions</b></TableCell>
              <TableCell><b>Status</b></TableCell>
              <TableCell><b>Actions</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {subAdmins?.map((subAdmin, index) => (
              <TableRow key={subAdmin.id}>
                <TableCell>{startSubAdminIndex + index}</TableCell>
                <TableCell>{subAdmin.name}</TableCell>
                <TableCell>{subAdmin.email}</TableCell>
                <TableCell>{subAdmin.role}</TableCell>
                <TableCell>{subAdmin.is_active ? 'Active' : 'Inactive'}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpenEditDialog(subAdmin)} aria-label={`Edit ${subAdmin.name}`}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(subAdmin.id)} aria-label={`Delete ${subAdmin.name}`}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination Controls */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 3 }}>
        <Button
          variant="contained"
          onClick={handlePrevPage}
          disabled={currentPage === 1}
        >
          Previous
        </Button>

        <Box sx={{ display: 'flex', alignItems: 'center', ml: 'auto' }}>
          <Typography sx={{ mr: 2 }}>
            {`Showing ${startSubAdminIndex} to ${endSubAdminIndex} of ${count}`}
          </Typography>
          <Button
            variant="contained"
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </Box>
      </Box>
      {/* Edit Sub Admin Modal */}
    </Box>
  );
}

export default ViewSubAdmin;
