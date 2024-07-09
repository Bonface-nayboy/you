import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Box, Typography, Button, Grid, Snackbar, Alert, TextField } from '@mui/material';
import Searchbar from './searchbar';
import { Category, ChildCareRounded, Laptop, ManOutlined, People, PlaylistAdd, Woman } from '@mui/icons-material';
import { ShopContext } from '../context/shop-context';
import "./add.css";

const Home = () => {
  const [category, setCategory] = useState('');
  const [products, setProducts] = useState([]);
  const { addToCart } = useContext(ShopContext);
  const userName = localStorage.getItem('userName');
  const [formError, setFormError] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false); 

  const handleFormSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:8084/orders', {})
      .then(response => {
        console.log('Order added successfully:', response.data);
        setFormError('');
        setOpenSnackbar(true); 
        fetchMaxOrderId(); 
      })
      .catch((err) => {
        console.error('Error adding order:', err);
        setFormError('Failed to add order. Please try again later.');
      });
  };

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
      .catch((error) => {
        console.error('Error getting the max order ID:', error);
      });
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:8084/getItems');
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  return (
    <Box className="home">
      <form onSubmit={handleFormSubmit}>
        {formError && <div style={{ color: 'red' }}>{formError}</div>}

        <Button
          startIcon={<ManOutlined />}
          variant="contained"
          sx={{ margin: '1px 0px' }}
          onClick={() => setCategory('Men')}
        >
          Men Collection
        </Button>
        <Button
          startIcon={<Woman />}
          variant="contained"
          sx={{ margin: '0px 0px' }}
          onClick={() => setCategory('Women')}
        >
          Women Collection
        </Button>
        <Button
          startIcon={<People />}
          variant="contained"
          sx={{ margin: '0px 0px' }}
          onClick={() => setCategory('Unisex')}
        >
          Unisex
        </Button>
        <Button
          startIcon={<Laptop />}
          variant="contained"
          sx={{ margin: '0px 0px' }}
          onClick={() => setCategory('Laptop')}
        >
          Laptops
        </Button>
        <Button
        startIcon={<ChildCareRounded/>}
        variant="contained"
        sx={{ margin: '0px 10px' }}
        onClick={() => setCategory('Children')}
      >
        Children
      </Button>
        <Button variant="outlined" sx={{ margin: '10px 50px', width: '100px' }} href="./add_products">
          <PlaylistAdd /> Add
        </Button>
        <Button variant='outlined' href='./stock' ><Category /> Stock</Button>
        <Button variant='outlined' href='./order' ><Category /> Orders</Button>

        <Button type="submit" variant='contained' color='secondary'>Create order</Button>
        <TextField
            variant='standard'
            value={maxOrderId}
          />
      </form>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000} 
        onClose={() => setOpenSnackbar(false)} 
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }} 
      >
        <Alert onClose={() => setOpenSnackbar(false)} severity="success">
          Order successfully created. Order ID: {maxOrderId}
        </Alert>
      </Snackbar>

      <Typography sx={{ fontSize: '30px', marginLeft: '70px' }}>
        Welcome <mark>{userName}</mark>, To Winchester E-Commerce Shop
      </Typography>

      <Box className="shop">
        <Box className="searchBar">
          <Searchbar />
        </Box>

        <Box className="products">
          <Grid container spacing={2}>
            {products
              .filter(product => {
                if (category === '') {
                  return true;
                } else {
                  return product.category === category;
                }
              })
              .map(product => (
                <Grid item md={4} xs={12} key={product.id}>
                  <Box sx={{ border: '1px solid #ccc', padding: '10px' }}>
                    <img
                      src={product.productImage}
                      alt={product.productName}
                      style={{ width: '240px', height: '290px', objectFit: 'cover' }}
                    />
                    <Typography variant="h6">{product.productName}</Typography>
                    <Typography variant="body1">Ksh {product.price}</Typography>
                    <Button
                      className="addCartBttn"
                      variant="contained"
                      onClick={() =>{
                        if (!maxOrderId){
                          alert('failed create an order')
                        } else{ 
                        addToCart(product)}
                      }}
                    >
                      Add to Cart
                    </Button>
                  </Box>
                </Grid>
              ))}
          </Grid>
        </Box>
      </Box>
    </Box>
  );
};

export default Home;
