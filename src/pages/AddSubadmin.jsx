import React, { useState } from 'react';
import { TextField, Button, Checkbox, FormControlLabel, FormGroup, Typography, Box, Grid, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { addSubAdmin, addMainAdmin } from '../services/allApi'; // Assuming you have an API service

function AddSubAdmin() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    permissions: {
      products: false,
      orders: false,
      users: false,
    },
  });

  const [mainAdminData, setMainAdminData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({
    name: '',
    email: '',
    password: '',
  });

  const [isModalOpen, setModalOpen] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleMainAdminInputChange = (e) => {
    const { name, value } = e.target;
    setMainAdminData({ ...mainAdminData, [name]: value });
  };

  const handlePermissionChange = (e) => {
    const { name, checked } = e.target;
    setFormData({
      ...formData,
      permissions: { ...formData.permissions, [name]: checked },
    });
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
      valid = false;
    }

    if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
      valid = false;
    }

    if (formData.password.length < 6) {
      newErrors.password = 'Password should be at least 6 characters';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const response = await addSubAdmin(formData);
        toast.success('Sub Admin added successfully!');
        setFormData({
          name: '',
          email: '',
          password: '',
          permissions: {
            products: false,
            orders: false,
            users: false,
          },
        });
        setErrors({});
      } catch (error) {
        toast.error('Failed to add Sub Admin. Please try again.');
      }
    }
  };

  const handleMainAdminSubmit = async () => {
    if (!validateEmail(mainAdminData.email) || mainAdminData.password.length < 6 || !mainAdminData.name.trim()) {
      toast.error('Please fill out all fields correctly for Main Admin.');
      return;
    }

    const mainAdminPayload = {
      ...mainAdminData,
      is_verified: true,
      is_active: true,
      is_staff: true,
      is_superuser: true,
    };

    try {
      const response = await addMainAdmin(mainAdminPayload);
      toast.success('Main Admin added successfully!');
      setMainAdminData({
        name: '',
        email: '',
        password: '',
      });
      setModalOpen(false);
    } catch (error) {
      toast.error('Failed to add Main Admin. Please try again.');
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Grid container justifyContent="space-between" alignItems="center">
        <Typography variant="h4" gutterBottom>
          <b>Add Sub Admin</b>
        </Typography>
        <Button variant="contained" color="secondary" onClick={() => setModalOpen(true)}>
          Add Main Admin
        </Button>
      </Grid>

      {/* Modal for adding Main Admin */}
      <Dialog open={isModalOpen} onClose={() => setModalOpen(false)}>
        <DialogTitle>Add Main Admin</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Name"
            name="name"
            value={mainAdminData.name}
            onChange={handleMainAdminInputChange}
            variant="outlined"
            margin="normal"
          />
          <TextField
            fullWidth
            label="Email"
            name="email"
            value={mainAdminData.email}
            onChange={handleMainAdminInputChange}
            variant="outlined"
            margin="normal"
          />
          <TextField
            fullWidth
            label="Password"
            name="password"
            type="password"
            value={mainAdminData.password}
            onChange={handleMainAdminInputChange}
            variant="outlined"
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setModalOpen(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleMainAdminSubmit} color="primary">
            Add Main Admin
          </Button>
        </DialogActions>
      </Dialog>

      <form onSubmit={handleSubmit} >
        <Grid container spacing={2} sx={{mt:1}}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              error={!!errors.name}
              helperText={errors.name}
              variant="outlined"
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              error={!!errors.email}
              helperText={errors.email}
              variant="outlined"
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleInputChange}
              error={!!errors.password}
              helperText={errors.password}
              variant="outlined"
            />
          </Grid>

          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              <b>Permissions</b>
            </Typography>
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.permissions.products}
                    onChange={handlePermissionChange}
                    name="products"
                  />
                }
                label="Products"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.permissions.users}
                    onChange={handlePermissionChange}
                    name="users"
                  />
                }
                label="Users"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.permissions.orders}
                    onChange={handlePermissionChange}
                    name="orders"
                  />
                }
                label="Orders"
              />
            </FormGroup>
          </Grid>

          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary">
              Add Sub Admin
            </Button>
          </Grid>
        </Grid>
      </form>

      <ToastContainer />
    </Box>
  );
}

export default AddSubAdmin;