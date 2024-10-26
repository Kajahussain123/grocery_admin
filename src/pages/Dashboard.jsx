import React, { useEffect, useState } from 'react';
import { Box, Container, Grid, Typography, Paper, CircularProgress } from '@mui/material';
import { Line, Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement
} from 'chart.js';
import axios from 'axios';
import { fetchCustomers, fetchPayments, fetchProducts } from '../services/allApi';

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement
);


function Dashboard() {
  const [customerCount, setCustomerCount] = useState(null);
  const [productsCount, setProductsCount] = useState(null);
  const [paymentsCount, setPaymentsCount] = useState(null)
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch total customers count on component mount
  useEffect(() => {
    const getCustomerCount = async () => {
      try {
        const data = await fetchCustomers();
        setCustomerCount(data.count);
      } catch (err) {
        setError('Failed to fetch customer count. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    getCustomerCount();
  }, []);

  // fetch payments count
  useEffect(()=>{
    const getPaymentsCount = async()=>{
      try{
        const data = await fetchPayments();
        setPaymentsCount(data.total_price_all_users);
      } catch (err) {
        setError("Failed to fetch count");
      } finally {
        setLoading(false)
      }
    };
    getPaymentsCount()
  })



  useEffect(() => {
    const getProductsCount = async () => {
      try {
        const data = await fetchProducts();
        setProductsCount(data.count);
      } catch (err) {
        setError('Failed to fetch customer count. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    getProductsCount();
  }, []);

  // Example data for the charts
  const lineData = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
      {
        label: 'Sales',
        data: [33, 53, 85, 41, 44, 65, 59],
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: true,
      },
    ],
  };

  const barData = {
    labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
    datasets: [
      {
        label: '# of Votes',
        data: [12, 19, 3, 5, 2, 3],
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
    ],
  };

  const pieData = {
    labels: ['Red', 'Blue', 'Yellow', 'Green'],
    datasets: [
      {
        label: '# of Votes',
        data: [12, 19, 3, 5],
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)'
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)'
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <Container>
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Dashboard
        </Typography>

        {/* Summary Boxes */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} md={4}>
            <Paper elevation={3} sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Total Products
              </Typography>
              {loading ? (
                <CircularProgress />
              ) : error ? (
                <Typography color="error">{error}</Typography>
              ) : (
                <Typography variant="h4">{productsCount}</Typography>
              )}
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper elevation={3} sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Total Customers
              </Typography>
              {loading ? (
                <CircularProgress />
              ) : error ? (
                <Typography color="error">{error}</Typography>
              ) : (
                <Typography variant="h4">{customerCount}</Typography>
              )}
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper elevation={3} sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Total Payments
              </Typography>
              {loading ? (
                <CircularProgress />
              ) : error ? (
                <Typography color="error">{error}</Typography>
              ) : (
                <Typography variant="h4">RS:{paymentsCount}</Typography>
              )}
            </Paper>
          </Grid>
        </Grid>

        {/* Charts */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Paper elevation={3} sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Sales Overview
              </Typography>
              <Line data={lineData} />
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper elevation={3} sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Vote Distribution
              </Typography>
              <Bar data={barData} />
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper elevation={3} sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Category Breakdown
              </Typography>
              <Pie data={pieData} />
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}

export default Dashboard;
