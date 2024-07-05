import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Box, Typography, Button, Grid } from '@mui/material';
import { Laptop, ManOutlined, People, PlaylistAdd, Woman } from '@mui/icons-material';
import "./shop.css";
import { ShopContext } from '../../context/shop-context';
import Searchbar from '../../components/searchbar';

const Shop = () => {
  const [category, setCategory] = useState('');
  const [products, setProducts] = useState([]);
  const { addToCart } = useContext(ShopContext);
  const userName = localStorage.getItem('userName');

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
      <Button
        startIcon={<ManOutlined />}
        variant="contained"
        sx={{ margin: '10px 0px' }}
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
        startIcon={<Laptop/>}
        variant="contained"
        sx={{ margin: '0px 10px' }}
        onClick={() => setCategory('Laptop')}
      >
        Laptops
      </Button>
     
      <Typography sx={{ fontSize: '30px',marginLeft:'70px'}}>
      Classic Collection 
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
                    onClick={() => addToCart(product)}
                   
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

export default Shop;



