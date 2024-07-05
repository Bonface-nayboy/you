// newcart-items.jsx
import React from "react";
import { Box, Typography, Button, TextField, Input } from "@mui/material";

const NewCartItems = ({ productId, NewCartItems,addToCart, removeFromCart, updateCartItemQuantity }) => {
  const handleQuantityChange = (event) => {
    const newQuantity = parseInt(event.target.value, 10);
    updateCartItemQuantity(productId, newQuantity);
  };

  return (
    <Box key={productId} sx={{ border: "1px solid #ccc", padding: 2, marginBottom: 2 }}>
      <Typography variant="h6">Product ID: {productId}</Typography>
      <Box sx={{ display: "flex", alignItems: "center", marginTop: 1 }}>
        <TextField
          type="number"
          label="Quantity"
          defaultValue={1} // You can set default quantity here
          InputProps={{ inputProps: { min: 1 } }}
          onChange={handleQuantityChange}
          sx={{ marginRight: 2, width: 100 }}
        />
        <Button variant="outlined" color="secondary" onClick={() => addToCart(productId)}>
          +
        </Button>
        <Input value={NewCartItems[productId]} onChange={(e)=>updateCartItemQuantity(Number(e.target.value) ,productId)}/>
        <Button variant="outlined" color="secondary" onClick={() => removeFromCart(productId)}>
          -
        </Button>
      </Box>
    </Box>
  );
};

export default NewCartItems;
