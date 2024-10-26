import React, { useState, useEffect } from 'react';
import {
  Box, TextField, Button, Typography, Container, Grid, Paper, Snackbar, Alert,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { deleteHomeImage, getHomeImage, updateHomeImage, uploadHomeImage } from '../services/allApi';

function AddHomeImage() {
  const [homeHeading, setHomeHeading] = useState('');
  const [homeTitle, setHomeTitle] = useState('');
  const [homeSubTitle, setHomeSubTitle] = useState('');
  const [image, setImage] = useState(null);
  const [selectedImageURL, setSelectedImageURL] = useState(''); // New state to store the current image URL
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [homeImages, setHomeImages] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedHomeImage, setSelectedHomeImage] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [homeImageToDelete, setHomeImageToDelete] = useState(null);

  useEffect(() => {
    loadHomeImages();
  }, []);

  const loadHomeImages = async () => {
    try {
      const data = await getHomeImage(); // Ensure this returns an array of home images
      setHomeImages(data || []);
    } catch (error) {
      console.error('Failed to fetch home images:', error);
    }
  };

  const handleHeadingChange = (event) => {
    setHomeHeading(event.target.value);
  };

  const handleTitleChange = (event) => {
    setHomeTitle(event.target.value);
  };

  const handleSubTitleChange = (event) => {
    setHomeSubTitle(event.target.value);
  };

  const handleImageChange = (event) => {
    setImage(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    // Check if all fields are filled
    if (!homeHeading || !homeTitle || !homeSubTitle || (!image && !isEditing)) {
      setError('All fields are required.');
      return;
    }

    const formData = new FormData();
    formData.append('Home_heading', homeHeading);
    formData.append('Home_title', homeTitle);
    formData.append('Home_sub_title', homeSubTitle);
    if (image) {
      formData.append('Home_image', image);
    }

    try {
      let response;
      if (isEditing) {
        // Update logic
        response = await updateHomeImage(selectedHomeImage.id, formData);
      } else {
        // Add logic
        response = await uploadHomeImage(formData);
      }

      if (response && (response.message === "Images uploaded successfully" || response.success || response.id)) {
        setSuccess(true);
        setOpenSnackbar(true);
        setImage(null);
        setHomeHeading('');
        setHomeTitle('');
        setHomeSubTitle('');
        setIsEditing(false);  // Reset editing state after successful update
        setSelectedHomeImage(null);
        setSelectedImageURL('');  // Clear the selected image URL
        loadHomeImages();
      } else {
        setError('Failed to upload or update home image. Please check the required fields.');
      }
    } catch (error) {
      setError('An error occurred while uploading or updating the home image. Please try again.');
      console.error('Upload or update error:', error);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteHomeImage(homeImageToDelete.id);
      loadHomeImages();
      setOpenDeleteDialog(false);
      setHomeImageToDelete(null);
    } catch (error) {
      console.error('Failed to delete home image:', error);
    }
  };

  const handleOpenDeleteDialog = (homeImage) => {
    setHomeImageToDelete(homeImage);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setHomeImageToDelete(null);
  };

  const handleEdit = (homeImage) => {
    setSelectedHomeImage(homeImage);
    setHomeHeading(homeImage.Home_heading);
    setHomeTitle(homeImage.Home_title);
    setHomeSubTitle(homeImage.Home_sub_title);
    setSelectedImageURL(homeImage.Home_image);  // Set the current image URL
    setIsEditing(true);  // Set editing mode
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <Container component="main" maxWidth="md" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography component="h1" variant="h5" align="center" gutterBottom>
          {isEditing ? 'Edit Home Image' : 'Add Home Image'}
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="homeHeading"
            label="Home Image Heading"
            name="homeHeading"
            value={homeHeading}
            onChange={handleHeadingChange}
            error={!!error && !homeHeading}
            helperText={!!error && !homeHeading ? 'Home image heading is required' : ''}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="homeTitle"
            label="Home Image Title"
            name="homeTitle"
            value={homeTitle}
            onChange={handleTitleChange}
            error={!!error && !homeTitle}
            helperText={!!error && !homeTitle ? 'Home image title is required' : ''}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="homeSubTitle"
            label="Home Image Subtitle"
            name="homeSubTitle"
            value={homeSubTitle}
            onChange={handleSubTitleChange}
            error={!!error && !homeSubTitle}
            helperText={!!error && !homeSubTitle ? 'Home image subtitle is required' : ''}
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

          {/* Display current image if in edit mode */}
          {isEditing && selectedImageURL && (
            <Grid container justifyContent="center" sx={{ mb: 2 }}>
              <img
                src={selectedImageURL}
                alt="Current Home Image"
                style={{ maxWidth: '100%', maxHeight: 200 }}
              />
            </Grid>
          )}

          {/* Display selected new image */}
          {image && (
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
            disabled={!isEditing && homeImages.length > 0}
          >
            {isEditing ? 'Update' : 'Submit'}
          </Button>
        </Box>
      </Paper>

      <TableContainer component={Paper} sx={{ mt: 4 }}>
        <Table>
          <TableHead sx={{ backgroundColor: "lightblue" }}>
            <TableRow>
              <TableCell>Heading</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Subtitle</TableCell>
              <TableCell>Image</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.isArray(homeImages) && homeImages.map((homeImage) => (
              <TableRow key={homeImage.id}>
                <TableCell>{homeImage.Home_heading}</TableCell>
                <TableCell>{homeImage.Home_title}</TableCell>
                <TableCell>{homeImage.Home_sub_title}</TableCell>
                <TableCell>
                  {homeImage.Home_image ? (
                    <img
                      src={homeImage.Home_image}
                      alt="Home"
                      style={{ maxWidth: '150px', maxHeight: '100px' }}
                    />
                  ) : 'No Image'}
                </TableCell>
                <TableCell align="right">
                  <IconButton color="primary" onClick={() => handleEdit(homeImage)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton color="secondary" onClick={() => handleOpenDeleteDialog(homeImage)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Delete confirmation dialog */}
      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Delete Home Image</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this home image?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
          <Button onClick={handleDelete} color="secondary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for success notification */}
      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          {isEditing ? 'Home Image updated successfully!' : 'Home Image added successfully!'}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default AddHomeImage;
