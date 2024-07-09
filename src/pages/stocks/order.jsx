import React, { useState, useEffect } from 'react';
import {
  Button,
  Typography,
  Box
} from '@mui/material';
import axios from 'axios';

const OrderPage = () => {
  const [maxOrderId, setMaxOrderId] = useState('');
  const userName = localStorage.getItem('userName'); // Assuming 'userName' is set correctly in localStorage
  const [formError, setFormError] = useState('');
  const [orderId, setOrderId] = useState('');

  useEffect(() => {
    fetchMaxOrderId();
  }, []);

  const fetchMaxOrderId = () => {
    axios.get('http://localhost:8084/orders')
      .then(response => {
        const maxId = response.data[0]['maxOrderId'];
        setMaxOrderId(maxId);
      })
      .catch(error => console.error('Error fetching maximum Order ID:', error));
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();

    axios.post('http://localhost:8084/orders', {})
      .then(response => {
        console.log('Order added successfully:', response.data);
        setFormError('');
        setOrderId(response.data.orderId); // Set orderId state after successful order addition
        fetchMaxOrderId(); // Refresh maximum orderId after successful order addition
        // Optionally, clear form fields or perform any other actions upon successful submission
        alert('Order made successfully!');
      })
      .catch(error => {
        console.error('Error adding order:', error);
        setFormError('Failed to add order. Please try again later.'); // Display a meaningful error message
      });
  };

  return (
    <Box sx={{ margin: '10px 50px' }}>
      <h1>Make An Order With Us</h1>
      <Typography>We Offer Free Delivery</Typography>
      <Box>
        <Box sx={{ margin: '0px 300px' }}>Maximum Order ID: {maxOrderId}</Box>

        <form onSubmit={handleFormSubmit}>
          {formError && <div style={{ color: 'red' }}>{formError}</div>}

          <Button type="submit" variant="contained" color="primary">
            Place Order
          </Button>
        </form>
      </Box>
    </Box>
  );
};

export default OrderPage;
