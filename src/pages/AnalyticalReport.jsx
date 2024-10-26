import React, { useEffect, useState } from 'react';
import {
  Box,
  Grid,
  Typography,
  Paper,
  Card,
  CardContent,
} from '@mui/material';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { fetchStockRevenue } from '../services/allApi';

const StockRevenueReport = () => {
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchStockRevenue(); // Use the API function
        setReportData(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <Typography variant="h6">Loading...</Typography>;
  if (error) return <Typography variant="h6" color="red">{error}</Typography>;

  const { total_stock_quantity, total_amount_invested, total_amount_received, profit } = reportData;

  // Sample Chart Data
  const chartData = [
    { name: 'Invested', value: total_amount_invested },
    { name: 'Received', value: total_amount_received },
  ];

  const profitData = [
    { name: 'Profit', value: profit >= 0 ? profit : 0 },
    { name: 'Loss', value: profit < 0 ? -profit : 0 },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Stock Revenue Report
      </Typography>

      <Grid container spacing={3}>
        {/* Total Stock Quantity */}
        <Grid item xs={12} md={6} lg={3}>
          <Card>
            <CardContent>
              <Typography variant="h5" component="div">
                Total Stock 
              </Typography>
              <Typography variant="h6" color="text.secondary">
                {total_stock_quantity}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Total Amount Invested */}
        <Grid item xs={12} md={6} lg={3}>
          <Card>
            <CardContent>
              <Typography variant="h5" component="div">
              Invested Amt
              </Typography>
              <Typography variant="h6" color="text.secondary">
                RS.{total_amount_invested.toFixed(2)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Total Amount Received */}
        <Grid item xs={12} md={6} lg={3}>
          <Card>
            <CardContent>
              <Typography variant="h5" component="div">
                 Received Amt
              </Typography>
              <Typography variant="h6" color="text.secondary">
                RS.{total_amount_received.toFixed(2)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Profit */}
        <Grid item xs={12} md={6} lg={3}>
          <Card>
            <CardContent>
              <Typography variant="h5" component="div">
                Profit
              </Typography>
              <Typography variant="h6" color={profit >= 0 ? 'green' : 'red'}>
                RS.{profit.toFixed(2)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts Section */}
      <Grid container spacing={3} sx={{ mt: 3 }}>
        {/* Pie Chart for Amounts */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Investment vs Received
            </Typography>
            <PieChart width={400} height={400}>
              <Pie
                data={chartData}
                cx={200}
                cy={200}
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#0088FE' : '#00C49F'} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </Paper>
        </Grid>

        {/* Bar Chart for Profit/Loss */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Profit and Loss
            </Typography>
            <BarChart
              width={400}
              height={300}
              data={profitData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default StockRevenueReport;
