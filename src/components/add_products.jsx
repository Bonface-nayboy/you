import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import {
  Box,
  Button,
  Grid,
  TextField,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { Add, Delete, Edit } from '@mui/icons-material';
import { ShopContext } from '../context/shop-context';
import './add.css';

const AddProducts = () => {
  const [productName, setProductName] = useState('');
  const [productImage, setProductImage] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [items, setItems] = useState([]);
  const { addToCart } = useContext(ShopContext);
  const [imageLoading, setImageLoading] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await axios.get('http://localhost:8084/getItems');
      setItems(response.data);
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8084/newItems', {
        productName,
        productImage,
        price,
        category,
      });
      alert('Item added successfully!');
      setProductName('');
      setProductImage('');
      setPrice('');
      setCategory('');
      fetchItems();
    } catch (error) {
      console.error('Error adding item:', error);
      alert('Failed to add item.');
    }
  };

  const handleImageLoadStart = () => {
    setImageLoading(true);
    setImageError(false);
  };

  const handleImageLoad = () => {
    setImageLoading(false);
    setImageError(false);
  };

  const handleImageError = () => {
    setImageLoading(false);
    setImageError(true);
  };

  const handleEditModalOpen = (item) => {
    setSelectedItem(item);
    setOpenModal(true);
  };

  const handleModalClose = () => {
    setOpenModal(false);
    setSelectedItem(null);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8084/deleteItem/${id}`);
      fetchItems();
      alert('Item deleted successfully!');
    } catch (error) {
      console.error('Error deleting item:', error);
      alert('Failed to delete item.');
    }
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`http://localhost:8084/updateItem/${selectedItem.id}`, {
        productName: selectedItem.productName,
        productImage: selectedItem.productImage,
        price: selectedItem.price,
        category: selectedItem.category,
      });
      fetchItems();
      alert('Item updated successfully!');
      handleModalClose();
    } catch (error) {
      console.error('Error updating item:', error);
      alert('Failed to update item.');
    }
  };

  return (
    <Box className="addproducts" sx={{ margin: '20px 42px', alignItems: 'left', backgroundColor: 'whitesmoke', width: '96%' }}>
      <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: '600px' }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              label="Product Name"
              variant="outlined"
              fullWidth
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              label="Product Image URL"
              variant="outlined"
              fullWidth
              value={productImage}
              onChange={(e) => setProductImage(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              label="Price"
              type="number"
              variant="outlined"
              fullWidth
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              label="Category"
              variant="outlined"
              fullWidth
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <Button type="submit" variant="contained" startIcon={<Add />}>
              Add New Item
            </Button>
          </Grid>
        </Grid>
      </form>

      {items.length > 0 && (
        <Box sx={{ marginTop: '20px', marginLeft: '10%' }}>
          <Typography variant="h5" gutterBottom>
            Added Item:
          </Typography>
          <Card sx={{ maxWidth: '400px', marginBottom: '20px' }}>
            <CardContent>
              <Typography variant="h6" component="h2">
                {items[items.length - 1].productName} - Ksh {items[items.length - 1].price}
              </Typography>
              {imageLoading && (
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '350px',
                  }}
                >
                  <CircularProgress />
                </Box>
              )}
              {!imageLoading && !imageError && (
                <img
                  src={items[items.length - 1].productImage}
                  alt={items[items.length - 1].productName}
                  style={{
                    width: '100%',
                    height: '350px',
                    marginTop: '10px',
                    objectFit: 'cover',
                  }}
                  onLoad={handleImageLoad}
                  onError={handleImageError}
                />
              )}
              {imageError && (
                <Typography variant="body2" color="error">
                  Error loading image.
                </Typography>
              )}
              <Typography variant="body2" color="textSecondary">
                Category: {items[items.length - 1].category}
              </Typography>
              <Button
                className="addToCartButton"
                variant="contained"
                onClick={() => addToCart(items[items.length - 1])}
                style={{ marginTop: '10px', width: '40%' }}
              >
                Add to Cart
              </Button>
            </CardContent>
          </Card>
        </Box>
      )}

      <Box sx={{ marginTop: '20px' }}>
        <Typography variant="h5" gutterBottom>
          All Items:
        </Typography>
        <Grid container spacing={4}>
          {items.map((item) => (
            <Grid item key={item.id} xs={12} sm={6} md={4}>
              <Card sx={{ maxWidth: '300px', marginBottom: '20px' }}>
                <CardContent>
                  <Typography variant="h6" component="h2">
                    {item.productName} - Ksh {item.price}
                  </Typography>
                  <img
                    src={item.productImage}
                    alt={item.productName}
                    style={{ width: '240px', height: '290px', objectFit: 'cover' }}
                    onLoad={handleImageLoad}
                    onError={handleImageError}
                  />
                  <Typography variant="body2" color="textSecondary">
                    Category: {item.category}
                  </Typography>
                  <Button
                    className="addToCartButton"
                    variant="contained"
                    onClick={() => addToCart(item)}
                    style={{ marginTop: '10px', width: '50%' }}
                  >
                    Add to Cart
                  </Button>
                  <IconButton onClick={() => handleEditModalOpen(item)} aria-label="edit">
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(item.id)} aria-label="delete">
                    <Delete />
                  </IconButton>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Material-UI Dialog for Editing */}
      <Dialog open={openModal} onClose={handleModalClose}>
        <DialogTitle>Edit Item</DialogTitle>
        <DialogContent>
          <TextField
            required
            label="Product Name"
            variant="outlined"
            fullWidth
            value={selectedItem ? selectedItem.productName : ''}
            onChange={(e) => setSelectedItem({ ...selectedItem, productName: e.target.value })}
            style={{ marginBottom: '10px' }}
          />
          <TextField
            required
            label="Product Image URL"
            variant="outlined"
            fullWidth
            value={selectedItem ? selectedItem.productImage : ''}
            onChange={(e) => setSelectedItem({ ...selectedItem, productImage: e.target.value })}
            style={{ marginBottom: '10px' }}
          />
          <TextField
            required
            label="Price"
            type="number"
            variant="outlined"
            fullWidth
            value={selectedItem ? selectedItem.price : ''}
            onChange={(e) => setSelectedItem({ ...selectedItem, price: e.target.value })}
            style={{ marginBottom: '10px' }}
          />
          <TextField required label="Category" variant="outlined" fullWidth value={selectedItem ? selectedItem.category : ''} onChange={(e) => setSelectedItem({ ...selectedItem, category: e.target.value })} style={{ marginBottom: '10px' }}
          />
        </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={handleUpdate} style={{ marginRight: '10px' }}>
            Update
          </Button>
          <Button variant="contained" onClick={handleModalClose}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AddProducts;
