import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Grid, Alert } from '@mui/material';
import { addCategory } from '../services/allApi';

function AddCategory() {
  const [categoryName, setCategoryName] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [categoryImage, setCategoryImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    setCategoryImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    setError(null);
    setSuccess(false);
    try {
      const formData = new FormData();
      formData.append('name', categoryName);
      if (categoryImage) {
        formData.append('image', categoryImage);
      }

      const result = await addCategory(formData);
      setSuccess(true);
      console.log('Category Added:', result);
      setCategoryName('');
      setCategoryImage(null);
      setImagePreview(null);
    } catch (err) {
      setError(err.name ? err.name[0] : 'An error occurred');
    }
  };

  return (
    <Box 
      sx={{ 
        maxWidth: 1600, 
        margin: 'auto', 
        p: 3, 
        border: '1px solid #ccc', 
        borderRadius: 2, 
        boxShadow: 3 
      }}
    >
      <Typography variant="h4" gutterBottom>
        Add Category
      </Typography>
      {error && <Alert severity='error'>{error}</Alert>}
      {success && <Alert severity='success'>Category added successfully</Alert>}
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Category Name"
            variant="outlined"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
          />
        </Grid>
        <Grid item xs={12}>
          <Button
            variant="contained"
            component="label"
          >
            Upload Category Image
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={handleImageUpload}
            />
          </Button>
        </Grid>
        <Grid item xs={12}>
          {imagePreview && (
            <Box mt={2} textAlign="center">
              <img 
                src={imagePreview} 
                alt="Selected Category" 
                style={{ maxHeight: 200, objectFit: 'contain' }} 
              />
            </Box>
          )}
        </Grid>
        <Grid item xs={12}>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            onClick={handleSubmit}
          >
            Add
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}

export default AddCategory;
