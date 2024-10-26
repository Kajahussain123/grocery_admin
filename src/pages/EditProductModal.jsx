import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField, FormControl, InputLabel, Select, MenuItem,
  FormLabel, RadioGroup, FormControlLabel, Radio, IconButton, Box, CircularProgress, Grid, Typography
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

import { fetchCategories, fetchSubCategories } from '../services/allApi'; // Ensure fetchSubCategories is correctly imported

function EditProductModal({ open, onClose, product, onChange, onSubmit, categories: propCategories, // Pass categories as props to avoid redundant fetching
}) {
  const [subcategories, setSubcategories] = useState([]);
  const [imagePreview, setImagePreview] = useState(product.image || null);
  const [weight, setWeight] = useState('');
  const [weightPrice, setWeightPrice] = useState('');
  const [weights, setWeights] = useState(product.weights || []);
  const [weightQuantity, setWeightQuantity] = useState('');
  const [isWeightInStock, setIsWeightInStock] = useState(true); // Default to in stock
  const [isEditing, setIsEditing] = useState(false);
  const [editIndex, setEditIndex] = useState(null);


  const [loading, setLoading] = useState(false);

  // Fetch subcategories whenever the category changes
  useEffect(() => {
    const loadSubcategories = async () => {
      if (product.category) {
        try {
          const data = await fetchSubCategories(product.category);
          setSubcategories(data);
        } catch (error) {
          console.log('Failed to fetch subcategories', error);
        }
      } else {
        setSubcategories([]);
      }
    };
    if (open) {
      loadSubcategories();
    }
  }, [product.category, open]);

  // Reset form fields when a different product is loaded or modal is closed
  useEffect(() => {
    if (open && product) {
      setImagePreview(product.image || null);
      setWeights(product.weights || []);
    } else {
      setImagePreview(null);
      setWeights([]);
    }
  }, [product, open]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    onChange(name, value);
  };

  const handleProductImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      onChange('image', file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Add weights logic
  const handleAddWeight = () => {
    let updatedWeights;
    if (isEditing) {
      // Update the existing weight
      updatedWeights = weights.map((w, index) =>
        index === editIndex
          ? {
              weight,
              price: weightPrice,
              quantity: weightQuantity,
              is_in_stock: isWeightInStock === 'yes',
            }
          : w
      );
      setIsEditing(false);
      setEditIndex(null);
    } else {
      // Add a new weight
      updatedWeights = [
        ...weights,
        {
          weight,
          price: weightPrice,
          quantity: weightQuantity,
          is_in_stock: isWeightInStock === 'yes',
        },
      ];
    }
  
    // Update the local state
    setWeights(updatedWeights);
  
    // Pass the updated weights to the parent component
    onChange('weights', updatedWeights);
  
    // Clear the form
    setWeight('');
    setWeightPrice('');
    setWeightQuantity('');
    setIsWeightInStock('yes');
  };
  
  const handleRemoveWeight = (index) => {
    const updatedWeights = weights.filter((_, i) => i !== index);
    setWeights(updatedWeights);
    onChange('weights', updatedWeights); // Pass updated weights to parent component
  };
  
  
  const handleEditWeight = (index) => {
    const weightToEdit = weights[index];
    setWeight(weightToEdit.weight);
    setWeightPrice(weightToEdit.price);
    setWeightQuantity(weightToEdit.quantity);
    setIsWeightInStock(weightToEdit.is_in_stock ? 'yes' : 'no');
    setIsEditing(true);
    setEditIndex(index);
  };





  const handleSave = () => {
    setLoading(true);
    // Ensure weights are updated before submitting
    onChange('weights', weights);
    onChange('Available', product.Available); // Ensure this is correct
    onSubmit(); // Trigger the parent submit action
    setLoading(false);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Edit Product</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          {/* Product Name */}
          <Grid item xs={6}>
            <TextField
              margin="dense"
              label="Product Name"
              name="name"
              fullWidth
              variant="outlined"
              value={product.name || ''}
              onChange={handleInputChange}
              required
            />
          </Grid>
          {/* Category */}
          <Grid item xs={6}>
            <FormControl fullWidth variant="outlined" margin="dense" required>
              <InputLabel>Category</InputLabel>
              <Select
                name="category"
                value={product.category || ''}
                onChange={handleInputChange}
                label="Category"
              >
                {propCategories.map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          {/* Subcategory */}
          <Grid item xs={6}>
            <FormControl
              fullWidth
              variant="outlined"
              margin="dense"
              required
              disabled={!product.category || subcategories.length === 0}
            >
              <InputLabel>Subcategory</InputLabel>
              <Select
                name="sub_category"
                value={product.sub_category || ''}
                onChange={handleInputChange}
                label="Subcategory"
              >
                {subcategories.map((subcat) => (
                  <MenuItem key={subcat.id} value={subcat.id}>
                    {subcat.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6}>
            <FormControl component="fieldset" margin="dense">
              <FormLabel component="legend">Stock Status</FormLabel>
              <RadioGroup
                row
                name="Available"
                value={product.Available ? 'in_stock' : 'out_of_stock'} // Set value based on boolean
                onChange={(e) => onChange('Available', e.target.value === 'in_stock')}
              >
                <FormControlLabel
                  value="in_stock"
                  control={<Radio />}
                  label="In Stock"
                />
                <FormControlLabel
                  value="out_of_stock"
                  control={<Radio />}
                  label="Out of Stock"
                />
              </RadioGroup>
            </FormControl>
          </Grid>

          {/* Price */}
          <Grid item xs={6}>
            <TextField
              margin="dense"
              label="Price"
              name="price"
              fullWidth
              variant="outlined"
              type="number"
              value={product.price || ''}
              onChange={handleInputChange}
              required
            />
          </Grid>
          {/* Offer Price */}
          <Grid item xs={6}>
            <TextField
              margin="dense"
              label="Offer Price"
              name="offer_price"
              fullWidth
              variant="outlined"
              type="number"
              value={product.offer_price || ''}
              onChange={handleInputChange}
            />
          </Grid>
          {/* Discount */}
          <Grid item xs={6}>
            <TextField
              margin="dense"
              label="Discount (%)"
              name="discount"
              fullWidth
              variant="outlined"
              type="number"
              value={product.discount || ''}
              onChange={handleInputChange}
            />
          </Grid>
          {/* Quantity */}

          {/* Weight Measurement */}
          <Grid item xs={6}>
            <TextField
              margin="dense"
              label="Weight Measurement"
              name="weight_measurement"
              fullWidth
              variant="outlined"
              value={product.weight_measurement || ''}
              onChange={handleInputChange}
              required
            />
          </Grid>
          {/* Is Popular Product */}
          <Grid item xs={3}>
            <FormControl component="fieldset" margin="dense">
              <FormLabel component="legend">Is Popular</FormLabel>
              <RadioGroup
                row
                name="is_popular_product"
                value={product.is_popular_product ? 'yes' : 'no'}
                onChange={handleInputChange}
              >
                <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                <FormControlLabel value="no" control={<Radio />} label="No" />
              </RadioGroup>
            </FormControl>
          </Grid>
          {/* Is Offer Product */}
          <Grid item xs={3}>
            <FormControl component="fieldset" margin="dense">
              <FormLabel component="legend">Is Offer Product</FormLabel>
              <RadioGroup
                row
                name="is_offer_product"
                value={product.is_offer_product ? 'yes' : 'no'}
                onChange={handleInputChange} >
                <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                <FormControlLabel value="no" control={<Radio />} label="No" />
              </RadioGroup>
            </FormControl>
          </Grid>
          {/* Product Description */}
          <Grid item xs={12}>
            <TextField
              margin="dense"
              label="Product Description"
              name="description"
              fullWidth
              variant="outlined"
              multiline
              rows={4}
              value={product.description || ''}
              onChange={handleInputChange} />
          </Grid>
          {/* Product Image Upload */}
          <Grid item xs={12}>
            <Button variant="contained" component="label" fullWidth>
              Upload Product Image
              <input type="file" hidden onChange={handleProductImageUpload} />
            </Button>
          </Grid>
          {/* Image Preview */}
          {imagePreview && (
            <Grid item xs={12}>
              <Box mt={2} textAlign="center">
                <img
                  src={imagePreview}
                  alt="Selected Product"
                  style={{ maxHeight: 200, objectFit: 'contain' }} />
              </Box>
            </Grid>
          )}
          {/* Add Weights and Prices */}
          <Grid item xs={12}>
  <Box mt={2}>
    <Typography variant="h6">Edit Weights and Prices:</Typography>
    <Grid container spacing={2}>
      <Grid item xs={4}>
        <TextField
          fullWidth
          label="Weight"
          variant="outlined"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
        />
      </Grid>
      <Grid item xs={4}>
        <TextField
          fullWidth
          label="Price"
          variant="outlined"
          type="number"
          value={weightPrice}
          onChange={(e) => setWeightPrice(e.target.value)}
        />
      </Grid>
      <Grid item xs={4}>
        <TextField
          fullWidth
          label="Quantity"
          variant="outlined"
          type="number"
          value={weightQuantity}
          onChange={(e) => setWeightQuantity(e.target.value)}
        />
      </Grid>
      <Grid item xs={12}>
        <FormControl component="fieldset">
          <FormLabel component="legend">In Stock</FormLabel>
          <RadioGroup
            row
            value={isWeightInStock}
            onChange={(e) => setIsWeightInStock(e.target.value)}
          >
            <FormControlLabel value="yes" control={<Radio />} label="Yes" />
            <FormControlLabel value="no" control={<Radio />} label="No" />
          </RadioGroup>
        </FormControl>
      </Grid>
      <Grid item xs={12}>
        <Button variant="contained" color="primary" onClick={handleAddWeight}>
          {isEditing ? "Update" : "Add"}
        </Button>
      </Grid>
    </Grid>
  </Box>
</Grid>

{/* Display Weights */}
<Grid item xs={12}>
  {weights.map((w, index) => (
    <Box
      key={index}
      mt={2}
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        border: '1px solid #ccc',
        p: 2,
        borderRadius: 1,
      }}
    >
      <Typography>
        Weight: {w.weight} - Price: {w.price} - Quantity: {w.quantity} - In Stock: {w.is_in_stock ? "Yes" : "No"}
      </Typography>
      <Box>
        <IconButton
          aria-label="edit"
          onClick={() => handleEditWeight(index)}
        >
          <EditIcon />
        </IconButton>
        <IconButton
          aria-label="delete"
          onClick={() => handleRemoveWeight(index)}
        >
          <DeleteIcon />
        </IconButton>
      </Box>
    </Box>
  ))}
</Grid>


        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary" variant="outlined">
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          color="primary"
          variant="contained"
          disabled={loading}>
          {loading ? <CircularProgress size={24} /> : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default EditProductModal;