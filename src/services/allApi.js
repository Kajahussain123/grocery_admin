import axios from "axios";
import { commonApi } from "./commonApi";
import { BASE_URL } from "./baseUrl";

//add category
export const addCategory = async (formData) => {
    try {
        const response = await commonApi('POST', `${BASE_URL}/api/categories/`, formData, {
            'Content-Type': 'multipart/form-data'
        });
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error('Network Error');
    }
};

// get categories
export const fetchCategories = async()=>{
    try{
        const response=await commonApi('GET',`${BASE_URL}/api/categories/`);
        return response.data;
    } catch(error){
        throw error.response?error.response.data:new Error('Network Error');
    }
};

// get all categories 
export const getCategories = async()=>{
  try{
      const response=await commonApi('GET',`${BASE_URL}/api/categories/`);
      return response.data;
  } catch(error){
      throw error.response?error.response.data:new Error('Network Error');
  }
};

// delete category
export const deleteCategory=async(id)=>{
    try{
        const response=await commonApi('DELETE',`${BASE_URL}/api/categories/${id}/`);
        return response.data;
    } catch (error){
        throw error.response?error.response.data:new Error('Network error')
    }
};

// edit category
export const editCategory = async (id, formData) => {
    try {
      const response = await commonApi('PUT', `${BASE_URL}/api/categories/${id}/`, formData, { 'Content-Type': 'multipart/form-data' });
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : new Error('Network Error');
    }
  };

// add product
export const addProduct = async (formData) => {
    const response = await commonApi('POST', `${BASE_URL}/api/products/`, formData, { 'Content-Type': 'multipart/form-data' });
    return response.data;
  };

// get products
export const fetchProducts = async (page = 1) => {
  try {
    const response = await axios.get(`${BASE_URL}/api/products/?page=${page}`);
    return response.data; // Ensure this returns an object with `results` and `next`
  } catch (error) {
    console.error('Failed to fetch products:', error);
    throw error;
  }
};

// edit product
export const editProduct = async (id, updatedProduct) => {
  try {
      const response = await axios.patch(`${BASE_URL}/api/products/${id}/`, updatedProduct, {
          headers: {
               'Content-Type': 'multipart/form-data' // is set automatically when using FormData
          },
      });
      return response.data;
  } catch (error) {
      console.error(`Error updating product with id ${id}:`, error);
      throw error;
  }
};

  // delete product
export const deleteProduct=async(id)=>{
    try{
        const response=await commonApi('DELETE',`${BASE_URL}/api/products/${id}/`);
        return response.data;
    } catch (error){
        throw error.response?error.response.data:new Error('Network error')
    }
};

// get all users
export const fetchCustomers = async (page = 1) => {
  try {
    const response = await axios.get(`${BASE_URL}/api/allusers/?page=${page}`);
    return response.data; // Returns data containing count, next, previous, and results
  } catch (error) {
    console.error('Failed to fetch customers', error);
    throw error;
  }
};

// Function to delete a customer
export const deleteCustomer = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/api/user/${id}/`);
    } catch (error) {
      throw new Error('Failed to delete customer: ' + error.message);
    }
  };
  
  // Function to update customer details
  export const updateCustomer = async (id, updatedData) => {
    try {
      const response = await axios.put(`${BASE_URL}/api/user/${id}/`, updatedData);
      return response.data;
    } catch (error) {
      throw new Error('Failed to update customer: ' + error.message);
    }
  };

  // add carousel image 
  export const uploadImage = async (formData) => {
    try {
      const response = await axios.post(`${BASE_URL}/api/carousel/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data; // Return the actual data from the response
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error; // Throw the error so it can be caught in the component
    }
  };

// get carosal image
  export const fetchImages = async (formData) => {
    try {
      const response = await axios.get(`${BASE_URL}/api/carousel/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data; // Return the actual data from the response
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error; // Throw the error so it can be caught in the component
    }
  };

 // delete image
 export const deleteImage = async (id) => {
  try {
    const response = await axios.delete(`${BASE_URL}/api/carousel/${id}/`);
    return response.data;
  } catch (error) {
    console.error('Error deleting image:', error);
    throw error;
  }
}; 

// update image
export const updateImage = async (id, formData) => {
  try {
    const response = await axios.patch(`${BASE_URL}/api/carousel/${id}/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error updating image:', error);
    throw error;
  }
};

// admin login
export const login = async (email, password) => {
  try {
    const response = await axios.post(`${BASE_URL}/api/adminlogin/`, {
      email,
      password
    });
    console.log('API Response:', response.data);
    return response.data; // Assuming the API returns a JSON object with success, email, password, etc.
  } catch (error) {
    console.error('API login error:', error.response ? error.response.data : error.message);
    throw error;
  }
};

// notifications
export const fetchNotifications = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/api/notifications`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch notifications:', error);
    throw error;
  }
};

// mark as read
export const markAsRead = async (id) => {
  try {
    await axios.patch(`${BASE_URL}/api/notifications/${id}/`, { is_read: true });
  } catch (error) {
    console.error('Failed to mark notification as read:', error);
    throw error;
  }
};

// delete notification
export const deleteNotification = async (id) => {
  try {
    await axios.delete(`${BASE_URL}/api/notifications/${id}/`);
  } catch (error) {
    console.error('Failed to delete notification:', error);
    throw error;
  }
};

// add sub category
export const addSubcategory = async (formData) => {
  try {
    const response = await axios.post(`${BASE_URL}/api/Subcategories/`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  } catch (error) {
    console.error('Error adding subcategory:', error);
    throw error;
  }
};

// fetch sub category  by id
export const fetchSubCategories = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}/api/subcategories/${id}/`);
    return response.data;  // Ensure the data is returned
  } catch (error) {
    console.error('Failed to fetch subcategories:', error);
    throw error;
  }
};

// fetch all sub category 
export const fetchSubCategory = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/api/Subcategories/`);
    return response.data;  // Ensure the data is returned
  } catch (error) {
    console.error('Failed to fetch subcategories:', error);
    throw error;
  }
};

// delete  sub category
export const deleteSubcategory=async(id)=>{
  try{
      const response=await commonApi('DELETE',`${BASE_URL}/api/Subcategories/${id}/`);
      return response.data;
  } catch (error){
      throw error.response?error.response.data:new Error('Network error')
  }
};

// edit sub category
export const editSubcategory = async (id, formData) => {
  try {
    const response = await commonApi('PUT', `${BASE_URL}/api/Subcategories/${id}/`, formData, { 'Content-Type': 'multipart/form-data' });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Network Error');
  }
};

// fetch products by id 
export const fetchProductById = async (productId) => {
  const response = await axios.get(`${BASE_URL}/api/products/${productId}`);
  return response.data;
};

// send notifications
export const sendNotification = async (formData) => {
  try {
    const response = await axios.post(`${BASE_URL}/api/send-notification/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data', // Important for file upload
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error sending notification:', error);
    throw error;
  }
};

// send notifications by user 
export const sendNotificationUser = async (customerId, message) => {
  try {
    const response = await axios.post(`${BASE_URL}/api/send-notification/${customerId}/`, {
      message
    });
    return response.data;
  } catch (error) {
    console.error('Failed to send notification', error);
    throw error;
  }
};

// add sub admin
export const addSubAdmin = async (subAdminData) => {
  try {
    const response = await axios.post(`${BASE_URL}/api/coadmins-reg/`, {
      ...subAdminData,
      is_verified: true,
      is_active: true,
      is_staff: true,
      is_superuser: false,
    });
    return response.data;
  } catch (error) {
    console.error('Error adding sub-admin:', error);
    throw error;
  }
};

// add main admin 
export const addMainAdmin = async (mainAdminData) => {
  try {
    const response = await axios.post(`${BASE_URL}/api/super-admins/`, mainAdminData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// get all subadmins
export const getSubAdmins = async (page = 1, rowsPerPage = 5) => {
  const response = await axios.get(`${BASE_URL}/api/coadmins/`, {
    params: {
      page: page,
      page_size: rowsPerPage,
    },
  });
  return response.data;
};

export const deleteSubAdmin = async (page = 1, rowsPerPage = 5) => {
  const response = await axios.get(`${BASE_URL}/api/coadmins/`, {
    params: {
      page: page,
      page_size: rowsPerPage,
    },
  });
  return response.data;
};

// search products
export const searchProducts = async (searchQuery) => {
  try {
    const response = await axios.get(`${BASE_URL}/api/products/search/`, {
      params: {
        search_query: searchQuery,  // Updated to match the expected parameter name
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error searching products:', error);
    throw error;
  }
};

export const uploadProductImages = async (productId, formData) => {
  try {
    const response = await axios.post(`${BASE_URL}/api/products/${productId}/images/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Failed to upload images', error);
    throw error;
  }
};

// fetch stocks
export const fetchStocks = async (page) => {
  try {
    const response = await axios.get(`${BASE_URL}/api/products/stock/?page=${page}`);
    return response.data; // Returns the data containing count, next, previous, and results
  } catch (error) {
    console.error('Error fetching stocks data:', error);
    throw error;
  }
};

// get all orders
export const getOrders = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/api/orders/`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch customers', error);
    throw error;
  }
};

// fetch customer orders by id 
export const fetchOrdersByCustomerId = async (customerId) => {
  const response = await fetch(`${BASE_URL}/api/orders/${customerId}/`);
  if (!response.ok) {
    throw new Error('Failed to fetch orders');
  }
  return await response.json();
};

// stock revenue
export const fetchStockRevenue = async () => {
  try {
    const response = await fetch(`${BASE_URL}/api/stock-revenue/`);
    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }
    return await response.json();
  } catch (error) {
    throw new Error(error.message);
  }
};

// get order details
export const getOrderDetails = async (userId, orderId) => {
  try {
    const response = await axios.get(`${BASE_URL}/api/orders/${userId}/${orderId}/`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch order details:', error);
    throw error;
  }
};

// get orders in a user
export const fetchUserOrders = async (userId) => {
  try {
    const response = await axios.get(`${BASE_URL}/api/user/${userId}/orders/`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch order details:', error);
    throw error;
  }
};

// delete order 
export const deleteOrder=async(id)=>{
  try{
      const response=await commonApi('DELETE',`${BASE_URL}/api/order/${id}/`);
      return response.data;
  } catch (error){
      throw error.response?error.response.data:new Error('Network error')
  }
};

// filter order by date 
export const filterOrders = async (fromDate = null, toDate = null) => {
  try {
    const params = {};   
    if (fromDate) {
      params.start_date = fromDate;
    }  
    if (toDate) {
      params.end_date = toDate;
    }
    const response = await axios.get(`${BASE_URL}/api/orders/filter-by-date/`, { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }
};

// upload poster
export const uploadPoster = async (formData) => {
  const response = await axios.post(`${BASE_URL}/api/poster-image/`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

// get posters
export const fetchPosters = async () => {
  const response = await axios.get(`${BASE_URL}/api/poster-image/`);
  return response.data; // Adjust based on your API's response structure
};

// delete poster 
export const deletePoster = async (id) => {
  await axios.delete(`${BASE_URL}/api/poster/${id}/`);
};

// update poster 
export const updatePoster = async (id, formData) => {
  const response = await axios.patch(`${BASE_URL}/api/poster/${id}/`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

// upload home image 
export const uploadHomeImage = async (formData)=>{
  const response = await axios.post(`${BASE_URL}/api/Home-image/`, formData,{
    headers:{
      'Content-Type':'multipart/form-data',
    },
  });
  return response.data;
}

// get home page 
export const getHomeImage = async ()=>{
  const response = await axios.get(`${BASE_URL}/api/Home-image/`);
  return response.data;
}

// delete home image
export const deleteHomeImage = async (id)=>{
  await axios.delete(`${BASE_URL}/api/Home-image/${id}/`)
}

// update home image 
export const updateHomeImage=async (id,formData)=>{
  const response=await axios.patch(`${BASE_URL}/api/Home-image/${id}/`,formData,{
    headers:{
      'Content-Type':'multipart/form-data',
    },
  });
  return response.data;
}

// get all payments 
export const fetchPayments = async()=>{
  try{
      const response=await commonApi('GET',`${BASE_URL}/api/total-price/all-users/`);
      return response.data;
  } catch(error){
      throw error.response?error.response.data:new Error('Network Error');
  }
};

// fetch low quantity products
export const fetchLowStockProducts = async(page)=>{
  try{
      const response=await commonApi('GET',`${BASE_URL}/api/products/low-stock/?page=${page}`);
      return response.data;
  } catch(error){
      throw error.response?error.response.data:new Error('Network Error');
  }
};


// Fetch all delivery boys
export const getDeliveryBoys = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/api/delivery-boys/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching delivery boys:", error);
    throw error;
  }
};

// Add a new delivery boy
export const addDeliveryBoy = async (formData) => {
  try {
    const response = await axios.post(`${BASE_URL}/api/create-delivery-boy/`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  } catch (error) {
    console.error("Error adding delivery boy:", error.response?.data || error);
    throw error;
  }
};

// API to update an existing delivery boy's details
export const updateDeliveryBoy = async (id, formData) => {
  try {
    const response = await axios.put(`${BASE_URL}/api/delivery-boys/${id}/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating delivery boy:", error);
    throw error;
  }
};