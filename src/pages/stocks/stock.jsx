import React, { useEffect, useState } from "react";
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography
} from "@mui/material";
import axios from "axios";
import { Add, Edit, PlaylistAdd } from "@mui/icons-material";

const Stock = () => {
    const [productName, setProductName] = useState('');
    const [productImage, setProductImage] = useState('');
    const [price, setPrice] = useState('');
    const [category, setCategory] = useState('');
    const [qty, setQty] = useState('');
    const [items, setItems] = useState([]);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [openSellModal, setOpenSellModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null); // State to hold the selected item for editing
    const [sellQuantity, setSellQuantity] = useState(1); // State to hold the quantity to sell
    const [openDeleteModal, setOpenDeleteModal] = useState(false);

    useEffect(() => {
        fetchItems();
    }, []);

    const fetchItems = async () => {
        try {
            const response = await axios.get('http://localhost:8084/stock');
            setItems(response.data);
        } catch (error) {
            console.log('Error fetching items', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8084/stock', {
                productName,
                productImage,
                price,
                category,
                qty
            });
            alert('Item added to stock');
            setProductName('');
            setProductImage('');
            setPrice('');
            setCategory('');
            setQty('');
            fetchItems();
        } catch (error) {
            console.log('Error adding new stock', error);
        }
    };

    const handleEdit = (item) => {
        setSelectedItem(item);
        setOpenEditModal(true);
    };

    const handleUpdate = async () => {
        try {
            const response = await axios.put(`http://localhost:8084/stock/${selectedItem.id}`, {
                productName: selectedItem.productName,
                productImage: selectedItem.productImage,
                price: selectedItem.price,
                category: selectedItem.category,
                qty: selectedItem.qty
            });
            alert('Item updated successfully');
            setOpenEditModal(false);
            fetchItems();
        } catch (error) {
            console.log('Error updating stock', error);
        }
    };

    const handleEditModalOpen = () => {
        setOpenEditModal(true);
    };

    const handleEditModalClose = () => {
        setOpenEditModal(false);
        setSelectedItem(null); // Clear selected item after closing modal
    };

    const handleDelete = async (id) => {
        try {
            const response = await axios.delete(`http://localhost:8084/stock/${id}`);
            alert('Item deleted successfully');
            fetchItems();
            handleDeleteModalClose(); // Close the delete modal after successful deletion
        } catch (error) {
            console.log('Error deleting stock item', error);
        }
    };

    const handleDeleteModalOpen = (item) => {
        setSelectedItem(item);
        setOpenDeleteModal(true);
    };

    const handleDeleteModalClose = () => {
        setOpenDeleteModal(false);
        setSelectedItem(null); // Clear selected item after closing modal
    };

    const handleSale = (item) => {
        setSelectedItem(item);
        setOpenSellModal(true);
    };

    const confirmSale = async () => {
        try {
            if (sellQuantity > 0 && sellQuantity <= selectedItem.qty) {
                const updatedQty = selectedItem.qty - sellQuantity;
                const response = await axios.put(`http://localhost:8084/stock/${selectedItem.id}`, {
                    ...selectedItem,
                    qty: updatedQty
                });
                alert('Item sold successfully');
                fetchItems();
                setOpenSellModal(false);

                // Check if stock is below 10 and show alert
                if (updatedQty < 10) {
                    alert(`Stock for ${selectedItem.productName} is below 10 !!!`);
                }
            } else {
                alert('Invalid quantity to sell');
            }
        } catch (error) {
            console.log('Error selling item', error);
        }
    };

    const handleSellModalOpen = () => {
        setOpenSellModal(true);
    };

    const handleSellModalClose = () => {
        setOpenSellModal(false);
        setSelectedItem(null); // Clear selected item after closing modal
    };

    const handleAddItem = async (id) => {
        try {
            const response = await axios.put(`http://localhost:8084/stock/add/${id}`);
            fetchItems();
        } catch (error) {
            console.log('Error adding item to stock', error);
        }
    };

    return (
        <Box className='orders' sx={{ margin: '10px 100px', display: 'block' }}>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                    <TextField variant="outlined" label='Product Name' value={productName} onChange={(e) => setProductName(e.target.value)} fullWidth />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField variant="outlined" label='Product Image' value={productImage} onChange={(e) => setProductImage(e.target.value)} fullWidth />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField variant="outlined" label='Price' value={price} onChange={(e) => setPrice(e.target.value)} fullWidth />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField variant="outlined" label='Category' value={category} onChange={(e) => setCategory(e.target.value)} fullWidth />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField variant="outlined" label='Quantity' value={qty} onChange={(e) => setQty(e.target.value)} fullWidth />
                </Grid>
            </Grid>

            <Button variant='contained' onClick={handleSubmit} sx={{ marginTop: '10px' }}><PlaylistAdd /> Add Stock</Button>
            <Typography variant="h5" sx={{ marginBottom: '10px', marginLeft: '35%' }}>Stock List</Typography>
            <TableContainer component={Box} sx={{ marginTop: '20px', backgroundColor: '#f0f0f0', borderRadius: '8px', overflow: 'hidden' }}>
                <Table sx={{ minWidth: 650 }}>
                    <TableHead sx={{ backgroundColor: 'powderblue', color: '#ffffff' }}>
                        <TableRow>
                            <TableCell sx={{ border: '1px solid #dddddd', fontWeight: 'bold' }}>Product Name</TableCell>
                            <TableCell sx={{ border: '1px solid #dddddd', fontWeight: 'bold' }}>Category</TableCell>
                            <TableCell sx={{ border: '1px solid #dddddd', fontWeight: 'bold' }}>Price</TableCell>
                            <TableCell sx={{ border: '1px solid #dddddd', fontWeight: 'bold' }}>Quantity</TableCell>
                            <TableCell sx={{ border: '1px solid #dddddd', fontWeight: 'bold' }}>Total</TableCell>
                            <TableCell sx={{ border: '1px solid #dddddd', fontWeight: 'bold' }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {items.map(item => (
                            <TableRow key={item.id}>
                                <TableCell sx={{ border: '1px solid #dddddd' }}>{item.productName}</TableCell>
                                <TableCell sx={{ border: '1px solid #dddddd' }}>{item.category}</TableCell>
                                <TableCell sx={{ border: '1px solid #dddddd' }}>{item.price}</TableCell>
                                <TableCell sx={{ border: '1px solid #dddddd' }}>{item.qty}</TableCell>
                                <TableCell sx={{ border: '1px solid #dddddd' }}>{item.price * item.qty}</TableCell>
                                <TableCell sx={{ border: '1px solid #dddddd' }}>
                                    <Button variant="contained" color="primary" onClick={() => handleAddItem(item.id)}>Add</Button>
                                    <Button variant="contained" color="primary" onClick={() => handleEdit(item)}>Edit</Button>
                                    <Button variant="contained" color="error" onClick={() => handleDeleteModalOpen(item)}>Delete</Button>
                                    <Button variant="contained" color="primary" onClick={() => handleSale(item)}>Sell</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Dialog for Editing */}
            <Dialog open={openEditModal} onClose={handleEditModalClose}>
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
                    <TextField
                        required
                        label="Category"
                        variant="outlined"
                        fullWidth
                        value={selectedItem ? selectedItem.category : ''}
                        onChange={(e) => setSelectedItem({ ...selectedItem, category: e.target.value })}
                        style={{ marginBottom: '10px' }}
                    />
                      <TextField
                        required
                        label="Quantity"
                        variant="outlined"
                        fullWidth
                        value={selectedItem ? selectedItem.qty : ''}
                        onChange={(e) => setSelectedItem({ ...selectedItem, qty: e.target.value })}
                        style={{ marginBottom: '10px' }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" onClick={handleUpdate} style={{ marginRight: '10px' }}>
                        Update
                    </Button>
                    <Button variant="contained" onClick={handleEditModalClose}>
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Dialog for Selling */}
            <Dialog open={openSellModal} onClose={handleSellModalClose}>
                <DialogTitle>Sell Item: {selectedItem && selectedItem.productName}</DialogTitle>
                <DialogContent>
                    <TextField
                        required
                        label="Quantity to Sell"
                        type="number"
                        variant="outlined"
                        fullWidth
                        value={sellQuantity}
                        onChange={(e) => setSellQuantity(Number(e.target.value))}
                        style={{ marginBottom: '10px' }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" onClick={confirmSale} style={{ marginRight: '10px' }}>
                        Sell
                    </Button>
                    <Button variant="contained" onClick={handleSellModalClose}>
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Dialog for Deleting */}
            <Dialog open={openDeleteModal} onClose={handleDeleteModalClose}>
                <DialogTitle>Delete Item: {selectedItem && selectedItem.productName}</DialogTitle>
                <DialogContent>
                    <Typography sx={{color:'red'}}>
                        Are you sure you want to delete this item?
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button variant="outlined" onClick={() => handleDelete(selectedItem.id)} style={{ marginRight: '10px' }}>
                        Yes
                    </Button>
                    <Button variant="outlined" onClick={handleDeleteModalClose}>
                        No
                    </Button>
                </DialogActions>
            </Dialog>
            
        </Box>
    );
};

export default Stock;

