import React, { useEffect, useState } from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button, TextField, Checkbox, FormControlLabel, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { deleteCategory, fetchCategories, editCategory } from '../services/allApi';

function ViewCategory() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [categoryName, setCategoryName] = useState('');
  const [categoryImage, setCategoryImage] = useState(null);
  const [enableCategory, setEnableCategory] = useState(true);
  const [filter, setFilter] = useState('all');  // State for filter (all, enabled, disabled)

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await fetchCategories();
        setCategories(data);
      } catch (error) {
        console.log('Failed to fetch categories', error);
      } finally {
        setLoading(false);
      }
    };
    loadCategories();
  }, []);

  const handleEdit = (category) => {
    setSelectedCategoryId(category.id);
    setCategoryName(category.name);
    setCategoryImage(null);
    setEnableCategory(category.Enable_category);
    setOpenEditDialog(true);
  };

  const handleDelete = (id) => {
    setSelectedCategoryId(id);
    setOpenDialog(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteCategory(selectedCategoryId);
      setCategories(categories.filter(category => category.id !== selectedCategoryId));
      console.log('Category deleted successfully');
    } catch (error) {
      console.log('Failed to delete category', error);
    } finally {
      setOpenDialog(false);
      setSelectedCategoryId(null);
    }
  };

  const cancelDelete = () => {
    setOpenDialog(false);
    setSelectedCategoryId(null);
  };

  const handleEditSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append('name', categoryName);
      if (categoryImage) {
        formData.append('image', categoryImage);
      }
      formData.append('Enable_category', enableCategory);

      const updatedCategory = await editCategory(selectedCategoryId, formData);
      setCategories(categories.map(category => (category.id === selectedCategoryId ? updatedCategory : category)));
      console.log('Category updated successfully');
    } catch (error) {
      console.log('Failed to update category', error);
    } finally {
      setOpenEditDialog(false);
      setSelectedCategoryId(null);
      setCategoryName('');
      setCategoryImage(null);
      setEnableCategory(true);
    }
  };

  const handleImageUpload = (event) => {
    setCategoryImage(event.target.files[0]);
  };

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  // Filter categories based on the selected filter
  const filteredCategories = categories.filter((category) => {
    if (filter === 'enabled') {
      return category.Enable_category;
    } else if (filter === 'disabled') {
      return !category.Enable_category;
    }
    return true; // 'all' option
  });

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: '100%', margin: 'auto', p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">
          View Categories
        </Typography>

        {/* Filter Dropdown on Right Side */}
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Filter</InputLabel>
          <Select value={filter} onChange={handleFilterChange}>
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="enabled">Enabled</MenuItem>
            <MenuItem value="disabled">Disabled</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{backgroundColor:"lightblue"}}>
            <TableRow>
              <TableCell><b>Image</b></TableCell>
              <TableCell><b>Category Name</b></TableCell>
              <TableCell><b>Status</b></TableCell>
              <TableCell><b>Actions</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredCategories.map((category) => (
              <TableRow key={category.id}>
                <TableCell>
                  <img
                    src={category.image || 'https://via.placeholder.com/50'}
                    alt={category.name}
                    style={{ width: 50, height: 50, objectFit: 'cover' }}
                  />
                </TableCell>
                <TableCell>{category.name}</TableCell>
                <TableCell>{category.Enable_category ? 'Enabled' : 'Disabled'}</TableCell>
                <TableCell>
                  <IconButton color="primary" onClick={() => handleEdit(category)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton color="secondary" onClick={() => handleDelete(category.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDialog} onClose={cancelDelete}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this category? This action cannot be undone.
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

      {/* Edit Category Dialog */}
      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
        <DialogTitle>Edit Category</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            margin="normal"
            label="Category Name"
            variant="outlined"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
          />
          <Button
            variant="contained"
            component="label"
          >
            Upload New Image
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={handleImageUpload}
            />
          </Button>
          {categoryImage && (
            <Box mt={2}>
              <img
                src={URL.createObjectURL(categoryImage)}
                alt="Selected Category"
                style={{ maxHeight: 200, objectFit: 'contain' }}
              />
            </Box>
          )} <br />
          <FormControlLabel
            control={
              <Checkbox
                checked={enableCategory}
                onChange={(e) => setEnableCategory(e.target.checked)}
                color="primary"
              />
            }
            label="Enable Category"
          />
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

export default ViewCategory;
