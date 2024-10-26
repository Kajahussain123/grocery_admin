import React, { useState, useEffect } from 'react';
import {
  Box, Button, TextField, MenuItem, FormControl, InputLabel, Select, Typography,
  CircularProgress, Grid, FormControlLabel, Checkbox
} from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import CSS
import { addSubcategory, getCategories } from '../services/allApi';

const AddSubcategory = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [subcategoryName, setSubcategoryName] = useState('');
  const [subcategoryImage, setSubcategoryImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null); // State for image preview
  const [loading, setLoading] = useState(false);
  const [isEnabled, setIsEnabled] = useState(true); // State for enabled status

  useEffect(() => {
    // Fetch categories from the API
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (error) {
        toast.error('Error fetching categories.');
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setSubcategoryImage(file);
    setImagePreview(URL.createObjectURL(file)); // Set image preview
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    if (!selectedCategory || !subcategoryName || !subcategoryImage) {
      toast.error('Please fill all fields and upload an image.');
      return;
    }

    const formData = new FormData();
    formData.append('Category', selectedCategory); // Send the category ID, not the name
    formData.append('name', subcategoryName); // Ensure correct field name for subcategory
    formData.append('Sub_category_image', subcategoryImage); // Ensure correct field name for image
    formData.append('Enable_subcategory', isEnabled); // Add enabled status

    setLoading(true);

    try {
      // Add subcategory using the API
      await addSubcategory(formData);
      toast.success('Subcategory added successfully!');
      // Reset form
      setSelectedCategory('');
      setSubcategoryName('');
      setSubcategoryImage(null);
      setImagePreview(null); // Clear the image preview
      setIsEnabled(true); // Reset enabled status to default
    } catch (error) {
      toast.error('Error adding subcategory.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Add Subcategory
      </Typography>

      <form onSubmit={handleFormSubmit}>
        <Grid container spacing={2}>
          {/* Category Dropdown */}
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Select Category</InputLabel>
              <Select
                value={selectedCategory}
                onChange={handleCategoryChange}
                label="Select Category"
                required
              >
                {categories.map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Subcategory Name */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="Subcategory Name"
              value={subcategoryName}
              onChange={(e) => setSubcategoryName(e.target.value)}
              fullWidth
              required
            />
          </Grid>

          {/* Image Upload */}
          <Grid item xs={12}>
            <Button variant="contained" component="label">
              Upload Subcategory Image
              <input
                type="file"
                hidden
                onChange={handleImageChange}
                accept="image/*"
                required
              />
            </Button>
            {subcategoryImage && <Typography>{subcategoryImage.name}</Typography>}
          </Grid>

          {/* Image Preview */}
          <Grid item xs={12}>
            {imagePreview && (
              <Box sx={{ mt: 2 }}>
                <Typography>Image Preview:</Typography>
                <img
                  src={imagePreview}
                  alt="Subcategory Preview"
                  style={{ maxWidth: '50%', height: '200px' }}
                />
              </Box>
            )}
          </Grid>

          {/* Enable/Disable Checkbox */}
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={isEnabled}
                  onChange={(e) => setIsEnabled(e.target.checked)}
                />
              }
              label="Enable Subcategory"
            />
          </Grid>

          {/* Submit Button */}
          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary" disabled={loading}>
              {loading ? <CircularProgress size={24} /> : 'Add Subcategory'}
            </Button>
          </Grid>
        </Grid>
      </form>

      <ToastContainer /> {/* Add ToastContainer for toast notifications */}
    </Box>
  );
};

export default AddSubcategory;
