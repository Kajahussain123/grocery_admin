import React, { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Box,
  Typography,
  Modal,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import { getOrders, getOrderDetails, deleteOrder, filterOrders } from '../services/allApi'; // Updated import
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import CloseIcon from '@mui/icons-material/Close';
import dayjs from 'dayjs'; // Date manipulation library

const ViewOrders = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [open, setOpen] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null); // State for the order to delete

  // State to manage date pickers
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  useEffect(() => {
    loadOrders(); // Load all orders on component mount
  }, []);

  const loadOrders = async (from = null, to = null) => {
    try {
      const data = await getOrders(from, to); // Fetch data with optional date filters
      setOrders(data);
    } catch (error) {
      console.error('Failed to fetch orders', error);
    }
  };

  const formatDate = (orderTime) => orderTime.split(' at ')[0];
  const formatTime = (orderTime) => orderTime.split(' at ')[1];

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text('Orders Report', 14, 16);

    const columns = ['Order ID', 'Customer', 'Date', 'Time', 'Payment Method', 'Status'];
    const rows = orders.map(order => [
      order.order_ids,
      order.user_name,
      formatDate(order.order_time),
      formatTime(order.order_time),
      order.payment_method,
      order.status
    ]);

    doc.autoTable({
      head: [columns],
      body: rows,
    });

    doc.save('orders_report.pdf');
  };

  const handleViewClick = async (userId, orderId) => {
    try {
      const data = await getOrderDetails(userId, orderId);
      setSelectedOrder(data);
      setOpen(true);
    } catch (error) {
      console.error('Failed to fetch order details', error);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedOrder(null);
  };

  // const handleFilterOrders = () => {
  //   const formattedFromDate = fromDate ? dayjs(fromDate).format('YYYY-MM-DD') : null;
  //   const formattedToDate = toDate ? dayjs(toDate).format('YYYY-MM-DD') : null;

  //   loadOrders(formattedFromDate, formattedToDate); // Filter orders with selected dates
  // };

  const handleDelete = async () => {
    try {
      await deleteOrder(orderToDelete); // Call the delete API
      setOrders(orders.filter(order => order.id !== orderToDelete)); 
      setConfirmDialogOpen(false); // Close the dialog
    } catch (error) {
      console.error('Failed to delete order', error);
    }
  };

  const openConfirmDialog = (Id) => {
    setOrderToDelete(Id); // Set the order to delete
    setConfirmDialogOpen(true); // Open the dialog
  };

  const handleFilterOrders = async () => {
    try {
      // Ensure dates are formatted before passing to the API
      const formattedFromDate = fromDate ? dayjs(fromDate).format('YYYY-MM-DD') : null;
      const formattedToDate = toDate ? dayjs(toDate).format('YYYY-MM-DD') : null;
  
      // Debug: Log the formatted dates
      console.log("Filtering orders from", formattedFromDate, "to", formattedToDate);
  
      // Fetch filtered orders with the formatted dates
      const data = await filterOrders(formattedFromDate, formattedToDate);
      setOrders(data);  // Update the state with the filtered orders
    } catch (error) {
      console.error('Failed to filter orders', error);
    }
  };
  

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" gutterBottom>
          View Orders
        </Typography>
        <Button variant="contained" color="primary" onClick={downloadPDF}>
          Export as PDF <PictureAsPdfIcon sx={{ ml: 1 }} />
        </Button>
      </Box>

      {/* Date filters */}
      <Box sx={{ display: 'flex', mb: 2, gap: 2 }}>
      <Typography gutterBottom>
         From
        </Typography>
        <input
          type="date"
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
          style={{ padding: '10px', fontSize: '16px' }}
        />
        <Typography gutterBottom>
        To
        </Typography>
        <input
          type="date"
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
          style={{ padding: '10px', fontSize: '16px' }}
        />
        <Button variant="contained" color="secondary" onClick={handleFilterOrders}>
          Filter Orders
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ backgroundColor: 'lightblue' }}>
            <TableRow>
              <TableCell style={{ whiteSpace: 'nowrap', textAlign: 'center' }}><b>Order ID</b></TableCell>
              <TableCell style={{ whiteSpace: 'nowrap', textAlign: 'center' }}><b>Customer</b></TableCell>
              <TableCell style={{ whiteSpace: 'nowrap', textAlign: 'center' }}><b>Date</b></TableCell>
              <TableCell style={{ whiteSpace: 'nowrap', textAlign: 'center' }}><b>Time</b></TableCell>
              <TableCell style={{ whiteSpace: 'nowrap', textAlign: 'center' }}><b>Payment Method</b></TableCell>
              <TableCell style={{ whiteSpace: 'nowrap', textAlign: 'center' }}><b>Status</b></TableCell>
              <TableCell style={{ whiteSpace: 'nowrap', textAlign: 'center' }}><b>Actions</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell style={{ whiteSpace: 'nowrap', textAlign: 'center' }}>{order.order_ids}</TableCell>
                <TableCell style={{ whiteSpace: 'nowrap', textAlign: 'center' }}>{order.user_name}</TableCell>
                <TableCell style={{ whiteSpace: 'nowrap', textAlign: 'center' }}>{formatDate(order.order_time)}</TableCell>
                <TableCell style={{ whiteSpace: 'nowrap', textAlign: 'center' }}>{formatTime(order.order_time)}</TableCell>
                <TableCell style={{ whiteSpace: 'nowrap', textAlign: 'center' }}>{order.payment_method}</TableCell>
                <TableCell style={{ whiteSpace: 'nowrap', textAlign: 'center' }}>{order.status}</TableCell>
                <TableCell style={{ whiteSpace: 'nowrap', textAlign: 'center' }}>
                  <Button variant="contained" color="primary" size="small" onClick={() => handleViewClick(order.user, order.order_ids)}>
                    View
                  </Button>
                  <Button variant="contained" color="secondary" size="small" style={{ marginLeft: '10px' }} onClick={() => openConfirmDialog(order.id)}>
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Modal to display order details */}
      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 600,
            bgcolor: 'background.paper',
            p: 4,
            boxShadow: 24,
            position: 'relative',
            maxHeight: '80vh', // Limit height of modal
            overflowY: 'auto',  // Enable vertical scrolling
          }}
        >
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: 'grey.500',
            }}
          >
            <CloseIcon />
          </IconButton>

          {selectedOrder && (
            <>
              <Typography variant="h6" gutterBottom>
                Order Details
              </Typography>
              <Typography>
                <b>Order ID:</b> {selectedOrder.order_ids}
              </Typography>
              <Typography>
                <b>Customer:</b> {selectedOrder.user_name}
              </Typography>
              <Typography>
                <b>Status:</b> {selectedOrder.status}
              </Typography>
              <Typography>
                <b>Payment Method:</b> {selectedOrder.payment_method}
              </Typography>
              <Typography>
                <b>Total Price:</b> RS.{selectedOrder.total_price}
              </Typography>
              <Typography>
                <b>Order Time:</b> {selectedOrder.order_time}
              </Typography>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                Products:
              </Typography>

              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell><b>Product Name</b></TableCell>
                    <TableCell><b>Quantity</b></TableCell>
                    <TableCell><b>Weight</b></TableCell>
                    <TableCell><b>Price</b></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {selectedOrder.cart_products.map((product, index) => (
                    <TableRow key={index}>
                      <TableCell>{product.name}</TableCell>
                      <TableCell>{product.quantity}</TableCell>
                      <TableCell>{product.selected_weight}</TableCell>
                      <TableCell>RS.{product.price}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </>
          )}
        </Box>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={confirmDialogOpen}
        onClose={() => setConfirmDialogOpen(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this order?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDelete} color="secondary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ViewOrders;
