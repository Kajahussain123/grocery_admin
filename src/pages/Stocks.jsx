import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, CircularProgress, Radio, RadioGroup, FormControlLabel, FormLabel, TextField
} from '@mui/material';
import { fetchLowStockProducts, fetchStocks, searchProducts } from '../services/allApi';

function Stocks() {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [count, setCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all"); // State to toggle between "all" and "lowStock"
  const [expandedRows, setExpandedRows] = useState({}); // To track expanded rows

  const resultsPerPage = 10;

  const startProductIndex = (currentPage - 1) * resultsPerPage + 1;
  const endProductIndex = Math.min(startProductIndex + resultsPerPage - 1, count);

  useEffect(() => {
    const loadStocks = async () => {
      try {
        setLoading(true);
        let response;
        if (filterType === "all") {
          response = await fetchStocks(currentPage, resultsPerPage);
        } else if (filterType === "lowStock") {
          response = await fetchLowStockProducts(currentPage); // Pass page for low stock products
        }
        setStocks(response.results);
        setCount(response.count);
        setTotalPages(Math.ceil(response.count / resultsPerPage));
      } catch (error) {
        console.error('Failed to fetch stock data', error);
      } finally {
        setLoading(false);
      }
    };

    loadStocks();
  }, [currentPage, filterType]); // Re-fetch when filterType or page changes

  const handleSearch = async () => {
    if (searchQuery.trim() === "") {
      const response = await fetchStocks(currentPage, resultsPerPage);
      setStocks(response.results);
      setCount(response.count);
      setTotalPages(Math.ceil(response.count / resultsPerPage));
    } else {
      try {
        const response = await searchProducts(searchQuery);
        setStocks(response.results);
        setCount(response.count);
        setTotalPages(1);
        setCurrentPage(1);
      } catch (error) {
        console.error('Failed to search products', error);
      }
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  const toggleRowExpansion = (productId) => {
    setExpandedRows((prevExpandedRows) => ({
      ...prevExpandedRows,
      [productId]: !prevExpandedRows[productId]
    }));
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4" gutterBottom>
          View Stocks
        </Typography>

        {/* Radio Buttons for filtering */}
        <Box>
          <FormLabel component="legend">Filter Products</FormLabel>
          <RadioGroup
            row
            value={filterType}
            onChange={(e) => {
              setFilterType(e.target.value);
              setCurrentPage(1); // Reset to first page on filter change
            }}
          >
            <FormControlLabel value="all" control={<Radio />} label="All Products" />
            <FormControlLabel value="lowStock" control={<Radio />} label="Less than 10 Quantity" />
          </RadioGroup>
        </Box>
      </Box>

      {/* Search Field and Button */}
      <Box sx={{ display: 'flex', mb: 2 }}>
        <TextField
          variant="outlined"
          placeholder="Search Products"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              handleSearch();
            }
          }}
          sx={{ mr: 1, flex: 1 }}
        />
        <Button variant="contained" onClick={handleSearch}>
          Search
        </Button>
      </Box>

      {/* Stocks Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ backgroundColor: "lightblue" }}>
            <TableRow>
              <TableCell><b>SI No</b></TableCell>
              <TableCell><b>Product</b></TableCell>
              <TableCell><b>Category Name</b></TableCell>
              <TableCell><b>Sub Category</b></TableCell>
              <TableCell><b>Quantity</b></TableCell>
              <TableCell><b>Weight Measurement</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {stocks.map((stock, index) => (
              <TableRow key={stock.id}>
                <TableCell>{(currentPage - 1) * resultsPerPage + index + 1}</TableCell>
                <TableCell>{stock.product_name}</TableCell>
                <TableCell>{stock.category_name}</TableCell>
                <TableCell>{stock.sub_category_name}</TableCell>
                <TableCell style={{ whiteSpace: 'nowrap', textAlign: 'center' }}>
                  <ul>
                    {/* Show only one line initially, expand when button is clicked */}
                    {expandedRows[stock.id]
                      ? stock.stock_info.map((info, i) => (
                          <li key={i}>
                            Weight: {info.weight}, Quantity: {info.quantity}
                            {info.is_in_stock ? " (In Stock)" : " (Out of Stock)"}
                          </li>
                        ))
                      : (
                        <li>
                          Weight: {stock.stock_info[0]?.weight}, Quantity: {stock.stock_info[0]?.quantity}
                          {stock.stock_info[0]?.is_in_stock ? " (In Stock)" : " (Out of Stock)"}
                        </li>
                      )}
                  </ul>
                  {stock.stock_info.length > 1 && (
                    <Button 
                    
                      size="small"
                      onClick={() => toggleRowExpansion(stock.id)}
                    >
                      {expandedRows[stock.id] ? "View Less" : "View More"}
                    </Button>
                  )}
                </TableCell>
                <TableCell>{stock.weight_measurement}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination Controls */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 3 }}>
        <Button variant="contained" onClick={handlePrevPage} disabled={currentPage === 1}>
          Previous
        </Button>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography sx={{ mr: 2 }}>
            {`Products ${startProductIndex} to ${endProductIndex} of ${count}`}
          </Typography>
        </Box>
        <Button variant="contained" onClick={handleNextPage} disabled={currentPage === totalPages}>
          Next
        </Button>
      </Box>
    </Box>
  );
}

export default Stocks;
