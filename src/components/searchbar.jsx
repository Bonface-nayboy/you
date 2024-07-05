import React, { useState, useContext, useEffect } from "react";
import { TextField, InputAdornment, Box, Grid, Typography, Button } from "@mui/material";
import { ShopContext } from "../context/shop-context";
import axios from 'axios';
import "./searchbar.css";

function Searchbar() {
    const { addToCart, cartItems } = useContext(ShopContext);
    const [searchTerm, setSearchTerm] = useState('');
    const [items, setItems] = useState([]);
    const [filteredItems, setFilteredItems] = useState([]);

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

    const handleSearch = (event) => {
        const searchTerm = event.target.value.toLowerCase();
        setSearchTerm(searchTerm);

        const filteredItems = items.filter(item =>
            item.productName.toLowerCase().includes(searchTerm) ||
            item.category.toLowerCase().includes(searchTerm)
        );
        setFilteredItems(filteredItems);
    };

    const renderItems = () => {
        if (searchTerm === '') {
            return null; // Render nothing if no search term
        }

        return (
            <Grid container spacing={3}>
                {filteredItems.map((item) => (
                    <Grid item xs={12} sm={6} md={4} key={item.id}>
                        <Box sx={{ border: '1px solid #ccc', padding: '10px' }}>
                            <Typography variant="subtitle1" gutterBottom>
                                <b>{item.category}</b>
                            </Typography>
                            <img src={item.productImage} alt={item.productName} width={250} height={300} />
                            <div className="descript">
                                <Typography variant="body1">
                                    <b>{item.productName}</b>
                                </Typography>
                                <Typography variant="body1">
                                    Ksh {item.price}
                                </Typography>
                            </div>
                            <Button className="addToCartButton" variant="contained" onClick={() => addToCart(item)}>
                                Add to Cart
                            </Button>
                        </Box>
                    </Grid>
                ))}
            </Grid>
        );
    };

    return (
        <Box className="Searchbar" sx={{ padding: '20px' }}>
            <TextField
                variant="standard"
                size="small"
                placeholder="Search..."
                value={searchTerm}
                onChange={handleSearch}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <span role="img" aria-label="search">
                                🔍
                            </span>
                        </InputAdornment>
                    ),
                }}
            />
            {renderItems()}
        </Box>
    );
}

export default Searchbar;










