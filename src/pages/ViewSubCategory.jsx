import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  IconButton, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
  Button, TextField, FormControlLabel, Checkbox, Select, MenuItem, InputLabel,
  FormControl
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { deleteSubcategory, editSubcategory, fetchSubCategory, getCategories } from '../services/allApi';

function ViewSubcategory() {
  const [subcategories, setSubcategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState(null);
  const [subcategoryName, setSubcategoryName] = useState('');
  const [subcategoryImage, setSubcategoryImage] = useState(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [enableSubcategory, setEnableSubcategory] = useState(true);

  useEffect(() => {
    const loadSubcategories = async () => {
      try {
        const data = await fetchSubCategory();
        setSubcategories(data);
      } catch (error) {
        console.log('Failed to fetch subcategories', error);
      } finally {
        setLoading(false);
      }
    };

    const loadCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (error) {
        console.log('Failed to fetch categories', error);
      }
    };

    loadSubcategories();
    loadCategories();
  }, []);

  const handleEdit = (subcategory) => {
    setSelectedSubcategoryId(subcategory.id);
    setSubcategoryName(subcategory.name);
    setSubcategoryImage(null);
    setSelectedCategoryId(subcategory.Category); // Set selected category for edit
    setEnableSubcategory(subcategory.Enable_subcategory); // Set enable status for edit
    setOpenEditDialog(true);
  };

  const handleDelete = (id) => {
    setSelectedSubcategoryId(id);
    setOpenDialog(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteSubcategory(selectedSubcategoryId);
      setSubcategories(subcategories.filter(subcategory => subcategory.id !== selectedSubcategoryId));
    } catch (error) {
      console.log('Failed to delete subcategory', error);
    } finally {
      setOpenDialog(false);
      setSelectedSubcategoryId(null);
    }
  };

  const cancelDelete = () => {
    setOpenDialog(false);
    setSelectedSubcategoryId(null);
  };

  const handleEditSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append('name', subcategoryName);
      if (subcategoryImage) {
        formData.append('Sub_category_image', subcategoryImage);
      }
      formData.append('Category', selectedCategoryId); // Add selected category to formData
      formData.append('Enable_subcategory', enableSubcategory); // Add enabled status to formData

      const updatedSubcategory = await editSubcategory(selectedSubcategoryId, formData);
      setSubcategories(subcategories.map(subcategory =>
        subcategory.id === selectedSubcategoryId ? updatedSubcategory : subcategory
      ));
    } catch (error) {
      console.log('Failed to update subcategory', error);
    } finally {
      setOpenEditDialog(false);
      setSelectedSubcategoryId(null);
      setSubcategoryName('');
      setSubcategoryImage(null);
      setEnableSubcategory(true); // Reset enable status
    }
  };

  const handleImageUpload = (event) => {
    setSubcategoryImage(event.target.files[0]);
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: '100%', margin: 'auto', p: 3 }}>
      <Typography variant="h4" gutterBottom>
        View Subcategories
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{backgroundColor:"lightblue"}}>
            <TableRow>
              <TableCell>Image</TableCell>
              <TableCell>Subcategory Name</TableCell>
              <TableCell>Main Category</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {subcategories.length > 0 ? (
              subcategories.map((subcategory) => (
                <TableRow key={subcategory.id}>
                  <TableCell>
                    <img
                      src={subcategory.Sub_category_image || 'https://via.placeholder.com/50'}
                      alt={subcategory.name}
                      style={{ width: 50, height: 50, objectFit: 'cover' }}
                    />
                  </TableCell>
                  <TableCell>{subcategory.name}</TableCell>
                  <TableCell>{subcategory.category_name}</TableCell>
                  <TableCell>
                    {subcategory.Enable_subcategory ? "Enabled" : "Disabled"}
                  </TableCell>
                  <TableCell>
                    <IconButton color="primary" onClick={() => handleEdit(subcategory)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton color="secondary" onClick={() => handleDelete(subcategory.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5}>No subcategories available</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDialog} onClose={cancelDelete}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this subcategory? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelDelete} color="primary">
            Cancel
          </Button>
          <Button onClick={confirmDelete} color="secondary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Subcategory Dialog */}
      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
        <DialogTitle>Edit Subcategory</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            margin="normal"
            label="Subcategory Name"
            variant="outlined"
            value={subcategoryName}
            onChange={(e) => setSubcategoryName(e.target.value)}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Main Category</InputLabel>
            <Select
              value={selectedCategoryId}
              onChange={(e) => setSelectedCategoryId(e.target.value)}
              label="Main Category"
            >
              {categories.map(category => (
                <MenuItem key={category.id} value={category.id}>
                  {category.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControlLabel
            control={
              <Checkbox
                checked={enableSubcategory}
                onChange={(e) => setEnableSubcategory(e.target.checked)}
              />
            }
            label="Enable Subcategory"
          />
          <Button variant="contained" component="label">
            Upload New Image
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={handleImageUpload}
            />
          </Button>
          {subcategoryImage && (
            <Box mt={2}>
              <img
                src={URL.createObjectURL(subcategoryImage)}
                alt="Selected Subcategory"
                style={{ maxHeight: 200, objectFit: 'contain' }}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleEditSubmit} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default ViewSubcategory;
