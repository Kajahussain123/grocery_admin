import React, { useEffect, useState, useMemo } from 'react';
import {
  Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton,
  Dialog, DialogActions, DialogContent, DialogTitle, Button, Select, CircularProgress,
  DialogContentText, FormControl, InputLabel, MenuItem,
  TextField
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { fetchProducts, fetchCategories, deleteProduct, editProduct, searchProducts } from '../services/allApi';
import EditProductModal from './EditProductModal';

function ViewProduct() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [nextPageUrl, setNextPageUrl] = useState(null);
  const [prevPageUrl, setPrevPageUrl] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [editProductData, setEditProductData] = useState({});
  const [error, setError] = useState(null); // For error handling
  const [count, setCount] = useState(0); // Add this state to store total count
  const [isInStock, setIsInStock] = useState(true);
  const [stockFilter, setStockFilter] = useState('all'); // New stock filter state
  const [searchQuery, setSearchQuery] = useState(''); // New search query state


  const resultsPerPage = 10;

  const totalPages = Math.ceil(count / resultsPerPage);


  useEffect(() => {
    const loadProductsAndCategories = async () => {
      try {
        setLoading(true);
        const data = await fetchProducts(currentPage);
        setProducts(data.results);
        setFilteredProducts(data.results);
        setCount(data.count);  // Set the total count of products
        setNextPageUrl(data.next);
        setPrevPageUrl(data.previous);
        const categoriesData = await fetchCategories();
        setCategories(categoriesData);
      } catch (error) {
        console.error('Failed to fetch data', error);
        setError('Failed to load products. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    loadProductsAndCategories();
  }, [currentPage]);

  useEffect(() => {
    const filterProducts = () => {
      let filtered = products;

      // Apply offer or popular filter
      if (filter === 'offer') {
        filtered = products.filter(product => product.is_offer_product);
      } else if (filter === 'popular') {
        filtered = products.filter(product => product.is_popular_product);
      }

      // Apply category filter
      if (selectedCategory !== 'all') {
        filtered = filtered.filter(product => product.category === selectedCategory);
      }

      // Apply stock filter
      if (stockFilter !== 'all') {
        filtered = filtered.filter(product =>
          stockFilter === 'inStock' ? product.Available : !product.Available
        );
      }

      setFilteredProducts(filtered);
    };

    filterProducts();
  }, [filter, selectedCategory, stockFilter, products]);


  const handleDelete = async () => {
    try {
      await deleteProduct(selectedProduct.id);
      setProducts(products.filter((product) => product.id !== selectedProduct.id));
      setFilteredProducts(filteredProducts.filter((product) => product.id !== selectedProduct.id));
      setError(null); // Clear any previous errors
    } catch (error) {
      console.error('Failed to delete product', error);
      setError('Failed to delete product. Please try again.');
    } finally {
      setOpenDeleteDialog(false);
      setSelectedProduct(null);
    }
  };

  const startProductIndex = (currentPage - 1) * resultsPerPage + 1;
  const endProductIndex = Math.min(startProductIndex + resultsPerPage - 1, count);


  const handleOpenDeleteDialog = (product) => {
    setSelectedProduct(product);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setSelectedProduct(null);
  };

  const handleOpenEditDialog = (product) => {
    setEditProductData({
      ...product,
      category: product.category, // Ensure this matches the category ID
      sub_category: product.sub_category, // Ensure this matches the subcategory ID
      weights: product.weights || [], // Initialize weights
      is_popular_product: product.is_popular_product ? 'yes' : 'no',
      is_offer_product: product.is_offer_product ? 'yes' : 'no',
    });
    setOpenEditDialog(true);
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
    setEditProductData({});
  };

  const handleEditChange = (name, value) => {
    setEditProductData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleEditSubmit = async () => {
    try {
      // Create a new FormData instance
      const formData = new FormData();
  
      // Add the updated product fields to FormData
      formData.append('name', editProductData.name);
      formData.append('category', editProductData.category);
      formData.append('sub_category', editProductData.sub_category);
      formData.append('price', editProductData.price);
      formData.append('offer_price', editProductData.offer_price);
      formData.append('discount', editProductData.discount);
  
      // Ensure boolean for 'Available' field
      formData.append('Available', editProductData.Available === true || editProductData.Available === 'true'); // Ensure it's a boolean
  
      formData.append('quantity', editProductData.quantity);
      formData.append('weight_measurement', editProductData.weight_measurement);
      
      // Convert 'yes'/'no' fields to boolean
      formData.append('is_popular_product', editProductData.is_popular_product === 'yes');
      formData.append('is_offer_product', editProductData.is_offer_product === 'yes');
      
      formData.append('description', editProductData.description);
  
      // Check if the image is a file and append it to FormData
      if (editProductData.image instanceof File) {
        formData.append('image', editProductData.image); // Append file if it's a file object
      }
  
      // Append weights array to formData as a JSON string
      formData.append('weights', JSON.stringify(editProductData.weights));
  
      // Call the API to update the product using FormData
      await editProduct(editProductData.id, formData);  // editProduct should handle the FormData properly
  
      // Update the product list with the edited product
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product.id === editProductData.id ? { ...product, ...editProductData } : product
        )
      );
  
      // Also update the filtered list (if applicable)
      setFilteredProducts((prevFilteredProducts) =>
        prevFilteredProducts.map((product) =>
          product.id === editProductData.id ? { ...product, ...editProductData } : product
        )
      );
  
      // Clear any previous errors and close the dialog
      setError(null);
      handleCloseEditDialog();
    } catch (error) {
      console.error('Failed to update product', error);
      setError('Failed to update product. Please try again.');
    }
  };
  


  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const handleNextPage = async () => {
    if (nextPageUrl) {
      setLoading(true);
      try {
        const response = await fetch(nextPageUrl);
        const data = await response.json();
        setProducts([...products, ...data.results]);
        setFilteredProducts([...filteredProducts, ...data.results]);
        setNextPageUrl(data.next);
        setPrevPageUrl(data.previous);
        setCurrentPage((prevPage) => prevPage + 1);
      } catch (error) {
        console.error('Failed to fetch more products', error);
        setError('Failed to load more products. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handlePrevPage = async () => {
    if (prevPageUrl) {
      setLoading(true);
      try {
        const response = await fetch(prevPageUrl);
        const data = await response.json();
        setProducts(data.results);
        setFilteredProducts(data.results);
        setNextPageUrl(data.next);
        setPrevPageUrl(data.previous);
        setCurrentPage((prevPage) => prevPage - 1);
      } catch (error) {
        console.error('Failed to fetch previous products', error);
        setError('Failed to load previous products. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSearch = async () => {
    if (searchQuery.trim()) {
      try {
        setLoading(true);
        const data = await searchProducts(searchQuery);
        setFilteredProducts(data.results);
      } catch (error) {
        console.error('Failed to search products', error);
        setError('Failed to search products. Please try again.');
      } finally {
        setLoading(false);
      }
    } else {
      // If the search query is cleared, reset to the original product list
      setFilteredProducts(products);
    }
  };

  const handleStockFilterChange = (e) => {
    setStockFilter(e.target.value);
  };

  if (loading && currentPage === 1) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: '100%', margin: 'auto' }}>

      {/* Error Alert */}
      {error && (
        <Box mb={2}>
          <Typography variant="body1" color="error">
            {error}
          </Typography>
        </Box>
      )}

      {/* Header and Filters */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4" gutterBottom>
          <b>View Products</b>
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <FormControl variant="outlined" sx={{ minWidth: 200 }}>
            <InputLabel>Filter Products</InputLabel>
            <Select value={filter} onChange={handleFilterChange} label="Filter Products">
              <MenuItem value="all">All Products</MenuItem>
              <MenuItem value="offer">Offer Products</MenuItem>
              <MenuItem value="popular">Popular Products</MenuItem>
            </Select>
          </FormControl>
          <FormControl variant="outlined" sx={{ minWidth: 200 }}>
            <InputLabel>Category</InputLabel>
            <Select value={selectedCategory} onChange={handleCategoryChange} label="Category">
              <MenuItem value="all">All Categories</MenuItem>
              {categories.map((category) => (
                <MenuItem key={category.id} value={category.id}>
                  {category.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl variant="outlined" sx={{ minWidth: 200 }}>
            <InputLabel>Stock Status</InputLabel>
            <Select value={stockFilter} onChange={handleStockFilterChange} label="Stock Status">
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="inStock">In Stock</MenuItem>
              <MenuItem value="outOfStock">Out of Stock</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>

      <Box sx={{ mb: 2, display: 'flex', gap: 2 }}>
        <TextField
          label="Search Products"
          variant="outlined"
          sx={{ flexGrow: 1, maxWidth: '300px' }}  // Limit width of search field
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by product name..."
        />
        <Button
          variant="contained"
          color="primary"
          sx={{ minWidth: '100px' }}  // Set a minimum width for the button
          onClick={handleSearch}
        >
          Search
        </Button>
      </Box>


      {/* Products Table */}
      <TableContainer component={Paper} sx={{ overflowX: 'auto' }}>
        <Table>

          <TableHead sx={{ backgroundColor: "lightblue" }}>
            <TableRow>
              <TableCell style={{ whiteSpace: 'nowrap', textAlign: 'center' }}><b>SI NO</b></TableCell>
              <TableCell><b>Image</b></TableCell>
              <TableCell style={{ whiteSpace: 'nowrap', textAlign: 'center' }}><b>Product Name</b></TableCell>
              <TableCell><b>Category</b></TableCell>
              <TableCell style={{ whiteSpace: 'nowrap', textAlign: 'center' }}><b>Sub Category</b></TableCell>
              <TableCell style={{ whiteSpace: 'nowrap', textAlign: 'center' }}><b>Price (Weight)</b></TableCell>
              <TableCell style={{ whiteSpace: 'nowrap', textAlign: 'center' }}><b>Offer Price</b></TableCell>
              <TableCell><b>Discount</b></TableCell>
              {/* <TableCell style={{ whiteSpace: 'nowrap', textAlign: 'center' }}><b>Stock</b></TableCell> */}
              <TableCell style={{ whiteSpace: 'nowrap', textAlign: 'center' }}><b>Stock Status</b></TableCell>
              <TableCell><b>Description</b></TableCell>
              <TableCell><b>Actions</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredProducts?.map((product, index) => (

              <TableRow key={product.id}>
                <TableCell>{startProductIndex + index}</TableCell>
                <TableCell>
                  <img
                    src={product.image}
                    alt={product.name}
                    style={{ width: 50, height: 50, objectFit: 'cover' }}
                    loading="lazy"
                  />
                </TableCell>
                <TableCell>{product.name}</TableCell>
                <TableCell style={{ whiteSpace: 'nowrap', textAlign: 'center' }}>{product.category_name}</TableCell>
                <TableCell style={{ whiteSpace: 'nowrap', textAlign: 'center' }}>{product.sub_category_name}</TableCell>
                <TableCell style={{ textAlign: 'center' }}>
                  {product.price} ({product.weight} {product.weight_measurement})
                </TableCell>
                <TableCell style={{ textAlign: 'center' }}>{product.offer_price}</TableCell>
                <TableCell>{product.discount}%</TableCell>
                {/* <TableCell>{product.quantity}</TableCell> */}
                <TableCell style={{ textAlign: 'center' }}>
                  {product.Available ? "In Stock" : "Out of Stock"} {/* Display Stock Status */}
                </TableCell>
                <TableCell style={{
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  maxWidth: '150px' // You can adjust the width according to your design
                }}>
                  {product.description}
                </TableCell>

                <TableCell style={{ whiteSpace: 'nowrap', textAlign: 'center' }}>
                  <IconButton
                    onClick={() => handleOpenEditDialog(product)}
                    aria-label={`Edit ${product.name}`}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => handleOpenDeleteDialog(product)}
                    aria-label={`Delete ${product.name}`}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination Controls */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 3 }}>
        <Button
          variant="contained"
          onClick={handlePrevPage}
          disabled={prevPageUrl === null}
        >
          Previous
        </Button>

        <Box sx={{ display: 'flex', alignItems: 'center', ml: 'auto' }}>
          <Typography sx={{ mr: 2 }}>
            {`Products ${startProductIndex} to ${endProductIndex} of ${count}`}
          </Typography>
          <Button
            variant="contained"
            onClick={handleNextPage}
            disabled={nextPageUrl === null}
          >
            Next
          </Button>
        </Box>
      </Box>


      {/* Edit Product Modal */}
      {openEditDialog && (
        <EditProductModal
          open={openEditDialog}
          onClose={handleCloseEditDialog}
          product={editProductData}
          categories={categories}
          onChange={handleEditChange}
          onSubmit={handleEditSubmit}
        />
      )}

      {/* Delete Product Confirmation Modal */}
      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the product "{selectedProduct?.name}"?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="primary" variant="outlined">
            Cancel
          </Button>
          <Button onClick={handleDelete} color="secondary" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default ViewProduct;
