import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, IconButton, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle,
  DialogContentText
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SendIcon from '@mui/icons-material/Send';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EmojiPicker from 'emoji-picker-react';
import { deleteCustomer, fetchCustomers, sendNotificationUser, updateCustomer, fetchUserOrders } from '../services/allApi';

const defaultAvatar = 'https://i.postimg.cc/mZ3Yr8JV/user-avatar-male-5.png';

function ViewCustomers() {
  const [customers, setCustomers] = useState([]);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openNotificationDialog, setOpenNotificationDialog] = useState(false);
  const [openOrdersDialog, setOpenOrdersDialog] = useState(false); // Orders dialog state
  const [currentCustomer, setCurrentCustomer] = useState(null);
  const [editForm, setEditForm] = useState({
    name: '', email: '', mobile_number: '', address_line1: '', address_line2: '', pincode: ''
  });
  const [message, setMessage] = useState('');
  const [orders, setOrders] = useState([]); // State to hold fetched orders
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [currentPage, setCurrentPage] = useState(1); // Page number state
  const [totalPages, setTotalPages] = useState(1);   // Total pages from API
  const [count, setCount] = useState(0);             // Total number of customers
  const [startCustomerIndex, setStartCustomerIndex] = useState(1);
  const [endCustomerIndex, setEndCustomerIndex] = useState(10);

  useEffect(() => {
    const loadCustomers = async () => {
      try {
        const data = await fetchCustomers(currentPage);
        setCustomers(data.results);
        setCount(data.count); // Total number of customers
        setTotalPages(Math.ceil(data.count / 10)); // Assuming 10 customers per page
        setStartCustomerIndex((currentPage - 1) * 10 + 1);
        setEndCustomerIndex(currentPage * 10 > data.count ? data.count : currentPage * 10);
      } catch (error) {
        console.error('Failed to fetch customers', error);
      }
    };
    loadCustomers();
  }, [currentPage]); // Fetch data when page changes

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };


  const handleEdit = (customerId) => {
    const customerToEdit = customers.find(customer => customer.id === customerId);
    if (customerToEdit) {
      const addressParts = customerToEdit.address.split('\n');
      setCurrentCustomer(customerToEdit); // Set current customer state
      setEditForm({
        name: customerToEdit.name,
        email: customerToEdit.email,
        mobile_number: customerToEdit.mobile_number,
        address: addressParts[0] || '', // Address line 1
        city: customerToEdit.city || '',
        state: customerToEdit.state || '',
        pincode: customerToEdit.pincode,
      });
      setOpenEditDialog(true);
    }
  };


  const handleEditChange = (event) => {
    const { name, value } = event.target;
    setEditForm(prevForm => ({
      ...prevForm,
      [name]: value
    }));
  };

  const handleEditSubmit = async () => {
    try {
      await updateCustomer(currentCustomer.id, editForm);

      // Update the local customers state
      setCustomers(customers.map(customer =>
        customer.id === currentCustomer.id ? { ...customer, ...editForm } : customer
      ));

      setOpenEditDialog(false); // Close the dialog after submission
    } catch (error) {
      console.error('Failed to update customer', error);
      // Optionally, show a message to the user
    }
  };


  const handleDelete = (id) => {
    setCurrentCustomer(customers.find(customer => customer.id === id));
    setOpenDeleteDialog(true);
  };

  const confirmDelete = async () => {
    try {
      if (currentCustomer) {
        await deleteCustomer(currentCustomer.id);
        setCustomers(customers.filter(customer => customer.id !== currentCustomer.id));
      }
    } catch (error) {
      console.error('Failed to delete customer', error);
    } finally {
      setOpenDeleteDialog(false);
      setCurrentCustomer(null);
    }
  };

  const cancelDelete = () => {
    setOpenDeleteDialog(false);
    setCurrentCustomer(null);
  };

  const handleSendNotification = (customer) => {
    setCurrentCustomer(customer);
    setMessage('');
    setOpenNotificationDialog(true);
  };

  const handleMessageChange = (event) => {
    setMessage(event.target.value);
  };

  const handleEmojiClick = (emojiObject) => {
    setMessage((prevMessage) => prevMessage + emojiObject.emoji);
  };

  const sendCustomerNotification = async () => {
    try {
      await sendNotificationUser(currentCustomer.id, message);
    } catch (error) {
      console.error('Failed to send notification', error);
    } finally {
      setOpenNotificationDialog(false);
    }
  };
  const handleViewOrders = async (customer) => {
    try {
      setCurrentCustomer(customer); // Store the current customer for the dialog
      const ordersData = await fetchUserOrders(customer.id); // Fetch user orders from API

      if (ordersData && Array.isArray(ordersData.orders)) {
        setOrders(ordersData.orders); // Store fetched orders
      } else {
        setOrders([]); // If no valid orders, set it to an empty array
      }
      setOpenOrdersDialog(true); // Open the dialog to display orders
    } catch (error) {
      console.error('Failed to fetch orders', error);
      setOrders([]); // On error, set orders to an empty array
    }
  };

  const handleViewOnMap = (roadName) => {
    const coordinates = roadName.match(/(\d+\.\d+),\s*(\d+\.\d+)/); // Extract coordinates if available
    const query = coordinates
      ? `${coordinates[1]},${coordinates[2]}`
      : encodeURIComponent(roadName); // URL encode the road name if no coordinates

    // Open Google Maps with the address or coordinates
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
  };



  // Helper function to format address
  const formatAddress = (addressLine1, addressLine2, pincode) => {
    return `${addressLine1 || ''} ${addressLine2 || ''} ${pincode || ''}`.trim();
  };

  return (
    <Box sx={{ maxWidth: '100%', margin: 'auto', p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4" gutterBottom>View Customers</Typography>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ backgroundColor: "lightblue" }}>
            <TableRow>
              <TableCell><b>Photo</b></TableCell>
              <TableCell><b>Name</b></TableCell>
              <TableCell style={{ whiteSpace: 'nowrap', textAlign: 'center' }}><b>Mobile Number</b></TableCell>
              <TableCell style={{ whiteSpace: 'nowrap', textAlign: 'center' }}><b>Road Name</b></TableCell>
              <TableCell><b>Address</b></TableCell>
              <TableCell><b>City</b></TableCell>
              <TableCell><b>State</b></TableCell>
              <TableCell><b>Pincode</b></TableCell>
              <TableCell style={{ whiteSpace: 'nowrap', textAlign: 'center' }}><b>View Orders</b></TableCell>
              <TableCell style={{ whiteSpace: 'nowrap', textAlign: 'center' }}><b>Actions</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {customers?.map((customer) => (
              <TableRow key={customer.id}>
                <TableCell>
                  <img
                    src={customer.photo || defaultAvatar}
                    alt={customer.name}
                    style={{ width: 50, height: 50, borderRadius: '50%', objectFit: 'cover' }}
                  />
                </TableCell>
                <TableCell>{customer.name}</TableCell>
                <TableCell>{customer.mobile_number}</TableCell>
                <TableCell style={{ whiteSpace: 'nowrap', textAlign: 'center' }} >
                  <Button
                    onClick={() => handleViewOnMap(customer.road_name)}
                    color="primary"
                  >
                    View Location
                  </Button>
                </TableCell>

                <TableCell>
                  {customer.address} {/* Adjusted to use the complete address from the response */}
                </TableCell>
                <TableCell>{customer.city}</TableCell> {/* Added City */}
                <TableCell>{customer.state}</TableCell> {/* Added State */}
                <TableCell>{customer.pincode}</TableCell> {/* Added Pincode */}
                <TableCell style={{ whiteSpace: 'nowrap', textAlign: 'center' }}>
                  <IconButton color="info" onClick={() => handleViewOrders(customer)}>
                    <VisibilityIcon /> {/* View Orders button */}
                  </IconButton>
                </TableCell>
                <TableCell style={{ whiteSpace: 'nowrap', textAlign: 'center' }}>
                  <IconButton color="primary" onClick={() => handleEdit(customer.id)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton color="secondary" onClick={() => handleDelete(customer.id)}>
                    <DeleteIcon />
                  </IconButton>
                  <IconButton color="default" onClick={() => handleSendNotification(customer)}>
                    <SendIcon />
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
          disabled={currentPage === 1}
        >
          Previous
        </Button>

        <Box sx={{ display: 'flex', alignItems: 'center', ml: 'auto' }}>
          <Typography sx={{ mr: 2 }}>
            {`Showing ${startCustomerIndex} to ${endCustomerIndex} of ${count}`}
          </Typography>
          <Button
            variant="contained"
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </Box>
      </Box>

      {/* Orders Dialog */}
      <Dialog
        open={openOrdersDialog}
        onClose={() => setOpenOrdersDialog(false)}
        fullWidth // Ensures the dialog takes up the full available width
        maxWidth="lg" // You can use 'sm', 'md', 'lg', 'xl' based on your need
      >
        <DialogTitle>
          {currentCustomer
            ? `Orders for ${currentCustomer.name} (${orders.length} Total Orders)`
            : `Orders (${orders.length} Total Orders)`
          }



        </DialogTitle>

        <DialogContent>
          {Array.isArray(orders) && orders.length > 0 ? (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><b>Order ID</b></TableCell>
                  <TableCell><b>Status</b></TableCell>
                  <TableCell><b>Payment Method</b></TableCell>
                  <TableCell><b>Total Price</b></TableCell>
                  <TableCell><b>Order Time</b></TableCell>
                  <TableCell><b>Products</b></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>{order.order_ids}</TableCell>
                    <TableCell>{order.status}</TableCell>
                    <TableCell>{order.payment_method}</TableCell>
                    <TableCell>${order.total_price.toFixed(2)}</TableCell>
                    <TableCell>{order.order_time}</TableCell>
                    <TableCell>
                      <ul>
                        {order.cart_products.map((product, index) => (
                          <li key={index}>
                            {product.name} - {product.quantity} x {product.selected_weight} at ${product.price}
                          </li>
                        ))}
                      </ul>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <Typography>No orders found for this customer.</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenOrdersDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>




      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteDialog} onClose={cancelDelete}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this customer? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelDelete} color="primary">
            Cancel
          </Button>
          <Button onClick={confirmDelete} color="secondary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Customer Dialog */}
      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
        <DialogTitle>Edit Customer</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            name="name"
            label="Name"
            fullWidth
            variant="standard"
            value={editForm.name}
            onChange={handleEditChange}
          />
          <TextField
            margin="dense"
            name="email"
            label="Email"
            fullWidth
            variant="standard"
            value={editForm.email}
            onChange={handleEditChange}
          />
          <TextField
            margin="dense"
            name="mobile_number"
            label="Mobile Number"
            fullWidth
            variant="standard"
            value={editForm.mobile_number}
            onChange={handleEditChange}
          />
          <TextField
            margin="dense"
            name="address"
            label="Address"
            fullWidth
            variant="standard"
            value={editForm.address}
            onChange={handleEditChange}
          />
          <TextField
            margin="dense"
            name="city"
            label="City"
            fullWidth
            variant="standard"
            value={editForm.city}
            onChange={handleEditChange}
          />
          <TextField
            margin="dense"
            name="state"
            label="State"
            fullWidth
            variant="standard"
            value={editForm.state}
            onChange={handleEditChange}
          />
          <TextField
            margin="dense"
            name="pincode"
            label="Pincode"
            fullWidth
            variant="standard"
            value={editForm.pincode}
            onChange={handleEditChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)}>Cancel</Button>
          <Button onClick={handleEditSubmit}>Save</Button>
        </DialogActions>
      </Dialog>

      {/* Send Notification Dialog */}
      <Dialog open={openNotificationDialog} onClose={() => setOpenNotificationDialog(false)}>
        <DialogTitle>Send Notification</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Message"
            fullWidth
            variant="standard"
            value={message}
            onChange={handleMessageChange}
          />
          <Button onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
            {showEmojiPicker ? 'Hide Emoji Picker' : 'Show Emoji Picker'}
          </Button>
          {showEmojiPicker && <EmojiPicker onEmojiClick={handleEmojiClick} />}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenNotificationDialog(false)}>Cancel</Button>
          <Button onClick={sendCustomerNotification}>Send</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default ViewCustomers;
