import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Typography, MenuItem, Grid, CircularProgress, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, IconButton, Switch, Autocomplete } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { fetchCategories, addProduct, fetchSubCategories, uploadProductImages, fetchProducts, } from '../services/allApi'; // Import fetchSubCategories
import { toast, ToastContainer } from 'react-toastify';

function AddProduct() {
  const [productName, setProductName] = useState('');
  const [category, setCategory] = useState('');
  const [subcategory, setSubcategory] = useState(''); // State for subcategory
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]); // State for subcategories
  const [actualPrice, setActualPrice] = useState('');
  const [offerPrice, setOfferPrice] = useState('');
  const [weightMeasurement, setWeightMeasurement] = useState('');
  const [discountPercentage, setDiscountPercentage] = useState('');
  const [description, setDescription] = useState('');
  const [quantity, setQuantity] = useState('');
  const [productImage, setProductImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isPopularProduct, setIsPopularProduct] = useState('no');  // default to "no"
  const [isOfferProduct, setIsOfferProduct] = useState('no');      // default to "no"
  const [isInStock, setIsInStock] = useState(true);
  const [productImages, setProductImages] = useState([]); // For multiple images
  const [multipleImagesPreview, setMultipleImagesPreview] = useState([]); // Preview for multiple images
  const [allProducts, setAllProducts] = useState([]);  // Store all products
  const [productSuggestions, setProductSuggestions] = useState([]);  // Store filtered suggestions
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [weightQuantity, setWeightQuantity] = useState('');
  const [isWeightInStock, setIsWeightInStock] = useState(true); // Default to in stock

  useEffect(() => {
    const loadAllProducts = async () => {
      setLoadingProducts(true);
      let allFetchedProducts = [];
      let currentPage = 1;
      let hasNextPage = true;

      try {
        // Keep fetching products until no next page is available
        while (hasNextPage) {
          const data = await fetchProducts(currentPage);
          allFetchedProducts = [...allFetchedProducts, ...data.results];  // Concatenate results
          hasNextPage = !!data.next;  // Check if there is a next page
          currentPage += 1;  // Increment page for next fetch
        }

        setAllProducts(allFetchedProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoadingProducts(false);
      }
    };

    loadAllProducts();
  }, []);

  // Filter products based on user input
  const handleProductNameChange = (event, value) => {
    setProductName(value);

    if (value.length > 0) {
      const filteredSuggestions = allProducts.filter((product) =>
        product.name.toLowerCase().includes(value.toLowerCase())
      );
      setProductSuggestions(filteredSuggestions);
    } else {
      setProductSuggestions([]);
    }
  };



  // New state for weights
  const [weight, setWeight] = useState('');
  const [weightPrice, setWeightPrice] = useState('');
  const [weights, setWeights] = useState([]);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await fetchCategories();
        setCategories(data);
      } catch (error) {
        console.log('Failed to fetch categories', error);
      }
    };
    loadCategories();
  }, []);

  // Fetch subcategories when a category is selected
  useEffect(() => {
    const loadSubcategories = async () => {
      if (category) {
        try {
          const data = await fetchSubCategories(category); // Fetch subcategories for selected category
          setSubcategories(data);
        } catch (error) {
          console.log('Failed to fetch subcategories', error);
        }
      } else {
        setSubcategories([]); // Reset subcategories if no category is selected
      }
    };
    loadSubcategories();
  }, [category]);

  const handleProductImageUpload = (event) => {
    const file = event.target.files[0];
    setProductImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleMultipleImageUpload = (event) => {
    const files = event.target.files;
    const selectedImages = Array.from(files);
    setProductImages(selectedImages);

    const previews = selectedImages.map((file) => URL.createObjectURL(file));
    setMultipleImagesPreview(previews);
  };

  const handleDiscountPercentageChange = (e) => {
    const discount = e.target.value;
    setDiscountPercentage(discount);
    if (actualPrice && discount) {
      const offerPrice = actualPrice - (actualPrice * discount) / 100;
      setOfferPrice(offerPrice.toFixed(2));
    }
  };

  const handleOfferPriceChange = (e) => {
    const offer = e.target.value;
    setOfferPrice(offer);
    if (actualPrice && offer) {
      const discount = ((actualPrice - offer) / actualPrice) * 100;
      setDiscountPercentage(discount.toFixed(2));
    }
  };

  const handleAddWeight = () => {
    if (weight && weightPrice && weightQuantity) {
      const newWeight = {
        weight, // Added weight key
        price: parseFloat(weightPrice),
        quantity: parseInt(weightQuantity),
        is_in_stock: isWeightInStock === 'yes',
      };
      setWeights((prevWeights) => [...prevWeights, newWeight]);
      // Clear input fields
      setWeight('');
      setWeightPrice('');
      setWeightQuantity('');
      setIsWeightInStock('yes'); // Reset to default
    }
  };

  const handleRemoveWeight = (index) => {
    setWeights((prevWeights) => prevWeights.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    setLoading(true);

    // Step 1: Create formData for the main product details
    const formData = new FormData();
    formData.append('name', productName);
    formData.append('category', category);
    formData.append('sub_category', subcategory);
    formData.append('price', actualPrice);
    formData.append('offer_price', offerPrice);
    formData.append('discount', discountPercentage);
    formData.append('quantity', quantity);
    formData.append('description', description);
    formData.append('image', productImage); // For single image upload
    formData.append('Available', isInStock);
    formData.append('is_popular_product', isPopularProduct === 'yes');
    formData.append('is_offer_product', isOfferProduct === 'yes');
    formData.append('weights', JSON.stringify(weights));
    formData.append('weight_measurement', weightMeasurement);

    try {
      // Step 2: Add product first
      const response = await addProduct(formData);
      const productId = response.id; // Get the product ID after adding

      toast.success('Product added successfully!');

      // Step 3: Handle multiple image uploads (only if productImages array has files)
      if (productImages.length > 0) {
        const multipleImageFormData = new FormData();

        // Use productImages and append each image with the same 'image' key
        productImages.forEach((image) => {
          multipleImageFormData.append('image', image); // Ensure 'image' is the correct key
        });

        // Send multiple image files to the backend (ensure this endpoint supports multiple images)
        await uploadProductImages(productId, multipleImageFormData);
        toast.success('Multiple images uploaded successfully!');
      }

      // Reset form after submission
      setProductName('');
      setCategory('');
      setSubcategory('');
      setActualPrice('');
      setOfferPrice('');
      setWeightMeasurement('');
      setDiscountPercentage('');
      setDescription('');
      setProductImage(null);
      setImagePreview(null);
      setQuantity('');
      setIsPopularProduct('no');
      setIsOfferProduct('no');
      setWeights([]);
      setProductImages([]);
      setMultipleImagesPreview([]);

    } catch (error) {
      console.error('Error while adding product:', error);
      toast.error('Failed to add product or images');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMainImage = () => {
    setImagePreview(null); // Clears the main product image preview
  };

  const handleDeleteMultipleImage = (index) => {
    setMultipleImagesPreview((prev) => prev.filter((_, i) => i !== index)); // Removes the selected image by index
  };



  return (
    <Box
      sx={{
        maxWidth: 1600,
        margin: 'auto',
        p: 3,
        border: '1px solid #ccc',
        borderRadius: 2,
        boxShadow: 3,
      }}
    >
      <Typography variant="h4" gutterBottom>
        <b>Add Product</b>
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={4}>
          <Autocomplete
            freeSolo
            options={productSuggestions.map((product) => product.name)}  // Show filtered product names
            loading={loadingProducts}
            value={productName}
            onInputChange={handleProductNameChange}
            renderInput={(params) => (
              <TextField
                {...params}
                fullWidth
                label="Product Name"
                variant="outlined"
              />
            )}
          />
        </Grid>
        <Grid item xs={4}>
          <TextField
            select
            fullWidth
            label="Category"
            variant="outlined"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {categories.map((cat) => (
              <MenuItem key={cat.id} value={cat.id}>
                {cat.name}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={4}>
          <TextField
            select
            fullWidth
            label="Subcategory"
            variant="outlined"
            value={subcategory}
            onChange={(e) => setSubcategory(e.target.value)}
            disabled={!category || subcategories.length === 0}  // Disable if no category selected or no subcategories
          >
            {subcategories && subcategories.length > 0 ? (
              subcategories.map((subcat) => (
                <MenuItem key={subcat.id} value={subcat.id}>
                  {subcat.name}
                </MenuItem>
              ))
            ) : (
              <MenuItem value="" disabled>
                No subcategories available
              </MenuItem>
            )}
          </TextField>
        </Grid>


        <Grid item xs={6}>
          <Button variant="contained" component="label">
            Upload Main Product Image
            <input type="file" hidden onChange={handleProductImageUpload} />
          </Button>
        </Grid>
        <Grid item xs={6}>
          <Button variant="contained" component="label">
            Upload Multiple Images
            <input type="file" hidden multiple onChange={handleMultipleImageUpload} />
          </Button>
        </Grid>
        {imagePreview && (
          <Grid item xs={12}>
            <Box mt={2} textAlign="center" position="relative" display="inline-block">
              <img
                src={imagePreview}
                alt="Selected Product"
                style={{ maxHeight: 200, objectFit: 'contain' }}
              />
              <IconButton
                onClick={handleDeleteMainImage}
                size="small"
                sx={{ position: 'absolute', top: 0, right: 0, backgroundColor: 'rgba(255, 255, 255, 0.8)' }}
              >
                <DeleteIcon />
              </IconButton>
            </Box>
          </Grid>
        )}

        {multipleImagesPreview.length > 0 && (
          <Grid item xs={12}>
            <Box mt={2} textAlign="center">
              {multipleImagesPreview.map((imageSrc, index) => (
                <Box key={index} position="relative" display="inline-block" mx={1}>
                  <img
                    src={imageSrc}
                    alt={`Selected Product ${index}`}
                    style={{ maxHeight: 100, margin: 5, objectFit: 'contain' }}
                  />
                  <IconButton
                    onClick={() => handleDeleteMultipleImage(index)}
                    size="small"
                    sx={{ position: 'absolute', top: 0, right: 0, backgroundColor: 'rgba(255, 255, 255, 0.8)' }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              ))}
            </Box>
          </Grid>
        )}

        <Grid item xs={6}>
          <TextField
            fullWidth
            label="Actual Price"
            variant="outlined"
            type="number"
            value={actualPrice}
            onChange={(e) => setActualPrice(e.target.value)}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            fullWidth
            label="Weight Measurement"
            variant="outlined"
            value={weightMeasurement}
            onChange={(e) => setWeightMeasurement(e.target.value)}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            fullWidth
            label="Discount Percentage"
            variant="outlined"
            type="number"
            value={discountPercentage}
            onChange={handleDiscountPercentageChange}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            fullWidth
            label="Offer Price"
            variant="outlined"
            type="number"
            value={offerPrice}
            onChange={handleOfferPriceChange}
          />
        </Grid>
        
        <Grid item xs={4}>
          <FormControl component="fieldset">
            <FormLabel component="legend">Is Popular</FormLabel>
            <RadioGroup
              row
              value={isPopularProduct}
              onChange={(e) => setIsPopularProduct(e.target.value)}
            >
              <FormControlLabel value="yes" control={<Radio />} label="Yes" />
              <FormControlLabel value="no" control={<Radio />} label="No" />
            </RadioGroup>
          </FormControl>
        </Grid>
        <Grid item xs={4}>
          <FormControl component="fieldset">
            <FormLabel component="legend">Is Offer Product</FormLabel>
            <RadioGroup
              row
              value={isOfferProduct}
              onChange={(e) => setIsOfferProduct(e.target.value)}
            >
              <FormControlLabel value="yes" control={<Radio />} label="Yes" />
              <FormControlLabel value="no" control={<Radio />} label="No" />
            </RadioGroup>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Product Description"
            multiline
            rows={4}
            variant="outlined"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Grid>
        <Grid item xs={12}>
          <Typography variant="body1">In Stock</Typography>
          <Switch
            checked={isInStock}
            onChange={(e) => setIsInStock(e.target.checked)}
            color="primary"
          />
        </Grid>

        <Grid item xs={12}>
  <Box mt={2}>
    <Typography variant="h6">Add Weights and Prices:</Typography>
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
        <Button
          variant="contained"
          color="primary"
          onClick={handleAddWeight}
        >
          Add
        </Button>
      </Grid>
    </Grid>
  </Box>
</Grid>

{/* Display Weights */}
<Grid item xs={12}>
  {weights.map((w, index) => ( // Use weights directly
    <Box
      key={index} // Use index as the key (if weights don't have a unique ID)
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
      <IconButton
        aria-label="delete"
        onClick={() => handleRemoveWeight(index)} // Pass the index directly
      >
        <DeleteIcon />
      </IconButton>
    </Box>
  ))}
</Grid>

        <Grid item xs={12} mt={2}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Submit Product'}
          </Button>
        </Grid>
      </Grid>
      <ToastContainer />
    </Box>
  );
}

export default AddProduct;
