import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Button, Modal, TextField, MenuItem, Grid, IconButton
} from '@mui/material';
import { addDeliveryBoy, getDeliveryBoys } from '../services/allApi';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';


function DeliveryBoyManagement() {
  const [deliveryBoys, setDeliveryBoys] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    mobile_number: "",
    name: "",
    vehicle_type: "",
    vehicle_number: "",
    gender: "",
    dob: "",
    identity_proof: null,
  });
  const [identityProofPreview, setIdentityProofPreview] = useState(null);

  useEffect(() => {
    fetchDeliveryBoys();
  }, []);

  const fetchDeliveryBoys = async () => {
    try {
      const data = await getDeliveryBoys();
      setDeliveryBoys(data);
    } catch (error) {
      console.error("Error loading delivery boys:", error);
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setFormData((prev) => ({ ...prev, identity_proof: file }));
    setIdentityProofPreview(URL.createObjectURL(file));
  };

  const handleRemoveFile = () => {
    setFormData((prev) => ({ ...prev, identity_proof: null }));
    setIdentityProofPreview(null);
  };

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddDeliveryBoy = async () => {
    const formDataToSend = new FormData();
    Object.keys(formData).forEach((key) => {
      formDataToSend.append(key, formData[key]);
    });

    try {
      await addDeliveryBoy(formDataToSend);
      toast.success("Delivery boy added successfully!");
      handleCloseModal();
      fetchDeliveryBoys();  // Refresh delivery boys list after adding
    } catch (error) {
      console.error("Error adding delivery boy:", error);
      toast.error("Failed to add delivery boy.");
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <ToastContainer />
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4">Manage Delivery Boys</Typography>
        <Button variant="contained" onClick={handleOpenModal}>Add Delivery Boy</Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ backgroundColor: "lightgray" }}>
            <TableRow>
              <TableCell><b>ID</b></TableCell>
              <TableCell><b>Name</b></TableCell>
              <TableCell><b>Email</b></TableCell>
              <TableCell><b>Mobile Number</b></TableCell>
              <TableCell><b>Vehicle Type</b></TableCell>
              <TableCell><b>Vehicle Number</b></TableCell>
              <TableCell><b>Gender</b></TableCell>
              <TableCell><b>Date of Birth</b></TableCell>
              <TableCell><b>Identity Proof</b></TableCell>
              <TableCell><b>Working</b></TableCell>
              <TableCell><b>Created AT</b></TableCell>
              <TableCell><b>Actions</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
  {deliveryBoys.map((boy) => (
    <TableRow key={boy.id}>
      <TableCell>{boy.id}</TableCell>
      <TableCell>{boy.name}</TableCell>
      <TableCell>{boy.email}</TableCell>
      <TableCell>{boy.mobile_number}</TableCell>
      <TableCell>{boy.vehicle_type}</TableCell>
      <TableCell>{boy.vehicle_number}</TableCell>
      <TableCell>{boy.gender}</TableCell>
      <TableCell>{boy.dob}</TableCell>
      <TableCell>
        <a href={boy.identity_proof} target="_blank" rel="noopener noreferrer">View Proof</a>
      </TableCell>
      <TableCell>{boy.is_working ? 'Yes' : 'No'}</TableCell>
      <TableCell>{new Date(boy.created_at).toLocaleDateString()}</TableCell>
      <TableCell>
        <IconButton color="primary" aria-label="edit">
          <EditIcon />
        </IconButton>
        <IconButton color="secondary" aria-label="delete">
          <DeleteIcon />
        </IconButton>
      </TableCell>
    </TableRow>
  ))}
</TableBody>

        </Table>
      </TableContainer>

      <Modal open={openModal} onClose={handleCloseModal}>
        <Box sx={{
          maxWidth: 600, p: 3, m: 'auto', mt: '10vh',
          bgcolor: 'white', boxShadow: 24, borderRadius: 2,
          maxHeight: '80vh', overflow: 'auto'
        }}>
          <Typography variant="h6" gutterBottom>Add Delivery Boy</Typography>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField label="Name" name="name" value={formData.name} onChange={handleInputChange} fullWidth />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Email" name="email" value={formData.email} onChange={handleInputChange} fullWidth />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Mobile Number" name="mobile_number" value={formData.mobile_number} onChange={handleInputChange} fullWidth />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Vehicle Type" name="vehicle_type" value={formData.vehicle_type} onChange={handleInputChange} fullWidth />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Vehicle Number" name="vehicle_number" value={formData.vehicle_number} onChange={handleInputChange} fullWidth />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Gender" name="gender" value={formData.gender} onChange={handleInputChange} select fullWidth>
                <MenuItem value="M">Male</MenuItem>
                <MenuItem value="F">Female</MenuItem>
                <MenuItem value="O">Other</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Date of Birth" name="dob" type="date" value={formData.dob} onChange={handleInputChange} fullWidth InputLabelProps={{ shrink: true }} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Button variant="contained" component="label" fullWidth>Upload Identity Proof<input type="file" hidden onChange={handleFileChange} /></Button>
              {identityProofPreview && (
                <Box display="flex" alignItems="center" mt={1}>
                  <img src={identityProofPreview} alt="Identity Proof" width="100" height="100" style={{ marginRight: 10 }} />
                  <IconButton onClick={handleRemoveFile}>
                    <DeleteIcon color="error" />
                  </IconButton>
                </Box>
              )}
            </Grid>
          </Grid>

          <Button variant="contained" fullWidth sx={{ mt: 3 }} onClick={handleAddDeliveryBoy}>Add</Button>
        </Box>
      </Modal>
    </Box>
  );
}

export default DeliveryBoyManagement;
