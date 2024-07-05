
import React, { useEffect, useState } from "react";
import { Box, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import axios from "axios";
import { PlaylistAdd } from "@mui/icons-material";

const Order = () => {
  const [checkedOutItems, setCheckedOutItems] = useState([]);

  useEffect(() => {
    fetchCheckedOutItems();
  }, []);

  const fetchCheckedOutItems = () => {
    // Make a GET request to fetch checked out items from your server
    axios
      .get("http://localhost:8084/add-update-newcart")
      .then((response) => {
        setCheckedOutItems(response.data); // Assuming response.data is an array of checked out items
      })
      .catch((error) => {
        console.error("Error fetching checked out items:", error);
      });
  };

  const handleConfirmOrder = async () => {
    try {
      // Assuming you have a server endpoint to mark items as checked out and reduce stock
      const response = await axios.post(
        "http://localhost:8084/confirm-order",
        checkedOutItems
      );
      console.log("Order confirmed successfully:", response.data);
      alert("Order confirmed successfully");

      // Optionally clear checkedOutItems state or handle navigation
      // setCheckedOutItems([]);
      // history.push('/orders'); // Redirect to orders page after confirmation
    } catch (error) {
      console.error("Error confirming order:", error);
      alert("Error confirming order");
    }
  };

  return (
    <Box>
      <Typography sx={{ margin: "10px 100px" }}>
        Whinchester E-commerce shop Order Page
      </Typography>
      <TableContainer
        component={Box}
        sx={{
          marginTop: "20px",
          backgroundColor: "#f0f0f0",
          marginLeft: "50px",
          width: "80%",
          border: "2px solid #2196f3",
          borderRadius: "8px",
          overflow: "hidden",
        }}
      >
        <Table sx={{ minWidth: 650 }}>
          <TableHead sx={{ backgroundColor: "#2196f3", color: "#ffffff" }}>
            <TableRow>
              <TableCell sx={{ border: "1px solid #dddddd", fontWeight: "bold" }}>
                Product Name
              </TableCell>
              <TableCell sx={{ border: "1px solid #dddddd", fontWeight: "bold" }}>
                Category
              </TableCell>
              <TableCell sx={{ border: "1px solid #dddddd", fontWeight: "bold" }}>
                Price
              </TableCell>
              <TableCell sx={{ border: "1px solid #dddddd", fontWeight: "bold" }}>
                Quantity
              </TableCell>
              <TableCell sx={{ border: "1px solid #dddddd", fontWeight: "bold" }}>
                Total
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {checkedOutItems.map((item) => (
              <TableRow key={item.productId}>
                <TableCell sx={{ border: "1px solid #dddddd" }}>
                  {item.productName}
                </TableCell>
                <TableCell sx={{ border: "1px solid #dddddd" }}>
                  {item.category}
                </TableCell>
                <TableCell sx={{ border: "1px solid #dddddd" }}>
                  {item.price}
                </TableCell>
                <TableCell sx={{ border: "1px solid #dddddd" }}>
                  {item.productQty}
                </TableCell>
                <TableCell sx={{ border: "1px solid #dddddd" }}>
                  {item.price * item.productQty}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Button
        variant="contained"
        sx={{ margin: "20px 50px" }}
        onClick={handleConfirmOrder}
      >
        <PlaylistAdd /> Make Order
      </Button>
    </Box>
  );
};

export default Order;

