import React, { useState, useEffect } from 'react';
import {
  Box, TextField, Button, Typography, Container, Grid, Paper, Snackbar, Alert,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle
} from '@mui/material';
import { uploadImage, fetchImages, deleteImage, updateImage } from '../services/allApi';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

function AddImagePage() {
  const [title, setTitle] = useState('');
  const [image, setImage] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [images, setImages] = useState([]);
  const [isEditing, setIsEditing] = useState(false); // To track if we're editing
  const [selectedImage, setSelectedImage] = useState(null); // To track selected image for editing
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false); // State for delete confirmation dialog
  const [imageToDelete, setImageToDelete] = useState(null); // To track the image to delete

  useEffect(() => {
    loadImages();
  }, []);

  const loadImages = async () => {
    try {
      const data = await fetchImages(); // Ensure this returns an array
      console.log('Fetched images:', data); // Debugging line
      setImages(data || []); // Fallback to an empty array if data is undefined
    } catch (error) {
      console.error('Failed to fetch images:', error);
    }
  };
  
  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const handleImageChange = (event) => {
    setImage(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(''); // Clear previous error messages
  
    // Ensure required fields are filled
    if (!title || !image) {
      setError('Title and image are required.');
      return;
    }
  
    // Create FormData to send to the server
    const formData = new FormData();
    formData.append('title', title);
    formData.append('image', image);
  
    try {
      let response;
      if (isEditing) {
        response = await updateImage(selectedImage.id, formData);
      } else {
        response = await uploadImage(formData);
      }
  
      // Log the full API response for better debugging
      console.log('Full API Response:', response);
  
      // Check if the response is an array and has elements
      if (Array.isArray(response) && response.length > 0) {
        const responseData = response[0]; // Get the first item from the array
  
        // You can add additional checks if needed
        if (responseData.id && responseData.title && responseData.image) {
          setSuccess(true);
          setOpenSnackbar(true);
          resetForm(); // Reset the form upon successful upload or update
          console.log(isEditing ? 'Image updated successfully' : 'Image uploaded successfully', responseData);
        } else {
          setError('Failed to upload or update image. Please check the required fields.');
          console.error('Unexpected response data:', responseData);
        }
      } else {
        setError('Failed to upload or update image. Please check the required fields.');
        console.error('Unexpected API response format:', response);
      }
    } catch (error) {
      console.error('An error occurred during upload or update:', error);
      handleError(error);
    }
  };
  
  // Function to reset the form
  const resetForm = () => {
    setImage(null);
    setTitle('');
    setIsEditing(false);
    setSelectedImage(null);
    loadImages(); // Reload images after successful operation
  };
  
  // Function to handle errors
  const handleError = (error) => {
    if (error.response && error.response.data) {
      setError(error.response.data.message || 'An unexpected error occurred. Please try again.');
      console.error('Error response from server:', error.response.data);
    } else {
      setError('An error occurred while uploading or updating the image. Please try again.');
    }
  };

  const handleDelete = async () => {
    try {
      await deleteImage(imageToDelete.id);
      loadImages(); // Reload images after deletion
      setOpenDeleteDialog(false);
      setImageToDelete(null);
    } catch (error) {
      console.error('Failed to delete image:', error);
    }
  };

  const handleOpenDeleteDialog = (image) => {
    setImageToDelete(image);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setImageToDelete(null);
  };

  const handleEdit = (image) => {
    setSelectedImage(image);
    setTitle(image.title);
    setImage(null); // Clear the image state to avoid displaying the file input image
    setIsEditing(true);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <Container component="main" maxWidth="md" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography component="h1" variant="h5" align="center" gutterBottom>
          {isEditing ? 'Edit Image' : 'Add Carousel'}
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="title"
            label="Title"
            name="title"
            autoFocus
            value={title}
            onChange={handleTitleChange}
            error={!!error && !title}
            helperText={!!error && !title ? 'Title is required' : ''}
          />
          <Button
            variant="contained"
            component="label"
            fullWidth
            sx={{ mt: 2, mb: 2 }}
          >
            {isEditing ? 'Change Image' : 'Upload Image'}
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={handleImageChange}
            />
          </Button>
          {isEditing && selectedImage ? (
            <Grid container justifyContent="center" sx={{ mb: 2 }}>
              <img
                src={selectedImage.image} // Assuming this is the URL to the existing image
                alt={selectedImage.title}
                style={{ maxWidth: '100%', maxHeight: 200 }}
              />
            </Grid>
          ) : image && (
            <Grid container justifyContent="center" sx={{ mb: 2 }}>
              <img
                src={URL.createObjectURL(image)}
                alt="Selected"
                style={{ maxWidth: '100%', maxHeight: 200 }}
              />
            </Grid>
          )}
          {error && (
            <Typography color="error" sx={{ mb: 2 }}>
              {error}
            </Typography>
          )}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
          >
            {isEditing ? 'Update' : 'Submit'}
          </Button>
        </Box>
      </Paper>

      <TableContainer component={Paper} sx={{ mt: 4 }}>
        <Table>
          <TableHead sx={{backgroundColor:"lightblue"}}>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Image</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.isArray(images) && images.map((img) => (
              <TableRow key={img.id}>
                <TableCell>{img.title}</TableCell>
                <TableCell>
                  <img src={img.image} alt={img.title} style={{ height: "50px", width: "60px" }} />
                </TableCell>
                <TableCell align="right">
                  <IconButton color="primary" onClick={() => handleEdit(img)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton color="error" onClick={() => handleOpenDeleteDialog(img)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this image?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDelete} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          {isEditing ? 'Image updated successfully!' : 'Image uploaded successfully!'}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default AddImagePage;
