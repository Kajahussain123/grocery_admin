import React from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const payments = [
  { id: 'P001', customerName: 'John Doe', amount: 100, date: '2024-08-01', status: 'Completed' },
  { id: 'P002', customerName: 'Jane Smith', amount: 200, date: '2024-08-03', status: 'Pending' },
  // Add more payment data as needed
];

function ViewPayments() {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        View Payments
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{backgroundColor:"lightblue"}}>
            <TableRow>
              <TableCell>Payment ID</TableCell>
              <TableCell>Customer Name</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {payments.map((payment) => (
              <TableRow key={payment.id}>
                <TableCell>{payment.id}</TableCell>
                <TableCell>{payment.customerName}</TableCell>
                <TableCell>${payment.amount}</TableCell>
                <TableCell>{payment.date}</TableCell>
                <TableCell>{payment.status}</TableCell>
                <TableCell>
                  <IconButton color="primary" aria-label="edit">
                    <EditIcon />
                  </IconButton>
                  <IconButton color="secondary" aria-label="delete">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default ViewPayments;
