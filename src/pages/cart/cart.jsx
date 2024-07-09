import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../../context/shop-context';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button, Card, CardContent, TextField, Typography } from '@mui/material';

const Cart = () => {
  const { cartItems, removeFromCart, updateCartItemQuantity, getTotalCartAmount } = useContext(ShopContext);
  const totalAmount = getTotalCartAmount();
  const navigate = useNavigate();
  const userName = localStorage.getItem('userName');



  const [maxOrderId, setMaxOrderId] = useState('');

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







  const handleRemoveFromCart = (itemId) => {
    removeFromCart(itemId);
  };

  const handleQuantityChange = (itemId, newQuantity) => {
    updateCartItemQuantity(itemId, newQuantity);
  };

  const handleIncrement = (itemId) => {
    const item = cartItems.find((item) => item.id === itemId);
    if (item) {
      updateCartItemQuantity(itemId, item.quantity + 1);
    }
  };

  const handleDecrement = (itemId) => {
    const item = cartItems.find((item) => item.id === itemId);
    if (item && item.quantity > 1) {
      updateCartItemQuantity(itemId, item.quantity - 1);
    }
  };
  const handleCheckout = () => {
    const username = localStorage.getItem('userName');
    const orderId = localStorage.getItem('orderId');
  
    if (!username) {
      alert('User information not available. Please login or sign up.');
      return;
    }
    if (!orderId) {
      alert('User information not available. Please login or sign up.');
      return;
    }
    
  
    // Proceed with checkout logic
    const newItems = cartItems.map((item) => ({
      username: username,
      orderId: maxOrderId,
      productId: item.id,
      productName: item.productName,
      productImage: item.productImage,
      productQty: item.quantity,
      price: item.price,
      category: item.category,
    }));
  
    axios
      .post('http://localhost:8084/add-update-newcart', { cartValues: newItems })
      .then((response) => {
        const { data: { message } } = response;
        console.log('Response from server:', message);
        removeFromCart(); 
        navigate('/'); 
        alert('You have checked out successfully.');
      })
      .catch((err) => {
        console.error('Error during checkout:', err);
        alert('Error during checkout. Please try again later.');
      });
  };
  

  const handlePrintReceipt = () => {
    const receiptContent = `
      Receipt for ${userName}
      ---------------------------
      Total Amount: Ksh ${totalAmount}
      Items:
      ${cartItems.map((item) => `${item.productName} - Ksh ${item.price}`).join('\n')}
    `;
    alert(receiptContent);
    navigate('/receipt'); 
  };

  return (
    <div className="Cart">
      {cartItems.length === 0 ? (
        <Typography variant="body1">Your cart is empty.</Typography>
      ) : (
        <div>
          <Typography variant="h6">Welcome To Our Shopping Cart, <mark>{userName}</mark>  order No: <mark>{maxOrderId}</mark> </Typography>
          {cartItems.map((item) => (
            <Card
              key={item.id}
              sx={{ marginBottom: '10px', width: '50%', backgroundColor: 'white' }}
            >
              <CardContent>
                <Typography variant="h6">{item.productName}</Typography>
                <img
                  src={item.productImage}
                  alt={item.productName}
                  style={{
                    width: '37%',
                    height: '200px',
                    objectFit: 'cover',
                    marginBottom: '10px',
                  }}
                />
                <Typography variant="body1">Price: Ksh {item.price}</Typography>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    marginTop: '5px',
                  }}
                >
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => handleDecrement(item.id)}
                  >
                    -
                  </Button>
                  <TextField
                    type="number"
                    value={item.quantity}
                    onChange={(e) =>
                      handleQuantityChange(item.id, parseInt(e.target.value))
                    }
                    inputProps={{ min: 1 }}
                    style={{
                      width: '70px',
                      margin: '0 10px',
                      textAlign: 'center',
                    }}
                  />
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => handleIncrement(item.id)}
                  >
                    +
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => handleRemoveFromCart(item.id)}
                    style={{ marginLeft: '10px' }}
                  >
                    Remove
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          <div style={{ marginTop: '10px' }}>
            <Typography variant="h6">Subtotal: Ksh {totalAmount}</Typography>
            <Button variant="contained" onClick={() => navigate('/')}>
              Continue Shopping
            </Button>
            <Button variant="contained" onClick={() => handleCheckout()}>
              Checkout
            </Button>
            <Button variant="contained" onClick={() => handlePrintReceipt()}>
              Print Receipt
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;


