import React, { useContext, useState } from "react";
import { PRODUCTS } from "../../products";
import { ShopContext } from "../../context/shop-context";
import { CartItem } from "./cart-item";
import "./cart.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const Cart = () => {
    const { cartItems, getTotalCartAmount } = useContext(ShopContext);
    const totalAmount = getTotalCartAmount();
    const navigate = useNavigate();

    const [cartValues, setCartValues] = useState([]);

    const handleSubmit = () => {
        const newItems = PRODUCTS.filter(product => cartItems[product.id] > 0)
            .map(product => ({
                productId: product.id,
                productName: product.productName,
                productImage: product.ProductImage,
                productqty: cartItems[product.id] > 0 ? cartItems[product.id] : 0,
                price: product.price,
                category: product.category
            }));

        const updatedCart = [...cartValues, ...newItems];
        setCartValues(updatedCart);

        axios.post('http://localhost:8084/add-cart', { cartValues: updatedCart })
            .then(response => {
                console.log("Response from server:", response.data);
            })
            .catch(err => {
                console.error("Error adding to cart:", err);
            });
    };

    const handleCartUpdateSubmit = (e) => {
        e.preventDefault();
    
        const newItems = PRODUCTS.filter(product => cartItems[product.id] > 0)
            .map(product => ({
                productId: product.id,
                productName: product.productName,
                productImage: product.ProductImage,
                productqty: cartItems[product.id] > 0 ? cartItems[product.id] : 0,
                price: product.price,
                category: product.category
            }));
    
        const updatedCart = [...cartValues, ...newItems];
    
        axios.post('http://localhost:8084/update-cart', { cartUpdateValues: updatedCart })
            .then(res => {
                console.log("Response from server:", res.data);
                alert('Cart updated successfully'); // Notify user of successful update
                navigate('/checkout'); // Navigate to checkout page or another appropriate page
            })
            .catch(err => {
                console.error("Error updating cart:", err);
                alert('Error updating cart'); // Notify user of error
            });
    };
    

    return (
        <div className="cart">
            <div>
                <h2>Cart Items</h2>
            </div>
            <div className="cartItems">
                {PRODUCTS.map((product) => {
                    if (cartItems[product.id] >= 1) {
                        return <CartItem key={product.id} data={product} />;
                    }
                })}
            </div>
            {totalAmount > 0 ? (
                <div className="checkout">
                    <p> Subtotal: Ksh {totalAmount} </p>
                    <button onClick={() => navigate("/")}>Continue Shopping</button>
                    <button onClick={() => handleSubmit()}>Checkout</button>
                    <button onClick={handleCartUpdateSubmit}>Update Cart</button>
                </div>
            ) : (
                <h1>Your Cart Is Empty</h1>
            )}
        </div>
    );
};

export default Cart;































const express = require("express");
const mysql = require("mysql");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: "root",
    password: '',
    database: 'logins'
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to database: ' + err.stack);
        return;
    }
    console.log('Connected to database as id ' + db.threadId);
});

app.post('/signup', (req, res) => {
    const { name, email, password } = req.body;
    const sql = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";
    const values = [name, email, password];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error('Error inserting into database: ' + err.stack);
            return res.status(500).json({ error: 'Error registering user' });
        }
        console.log('Registered user successfully with ID: ' + result.insertId);
        return res.status(200).json({ message: 'Registered Successfully' });
    });
});

app.post('/login', (req, res) => {
    const { email, password } = req.body;
    const sql = "SELECT * FROM users WHERE email = ? AND password = ?";
    const values = [email, password];

    db.query(sql, values, (err, results) => {
        if (err) {
            console.error('Error querying database: ' + err.stack);
            return res.status(500).json({ error: 'Error logging in' });
        }
        if (results.length === 0) {
            console.log('User not found or invalid credentials');
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Login successful
        console.log('User logged in successfully');
        return res.status(200).json({ message: 'Logged in Successfully', name: results[0].name });
    });
});



app.post('/add-update-cart', (req, res) => {
    const { cartValues } = req.body;

    if (!cartValues || !Array.isArray(cartValues)) {
        return res.status(400).json({ error: 'Invalid cart data' });
    }

    // To keep track of successful operations
    let successfulOperations = [];

    // Function to send success response with alert message
    const sendSuccessResponse = () => {
        res.status(200).json({
            message: successfulOperations.length > 0 ? 'Items updated successfully' : 'Items added successfully'
        });
    };

    // Process each item in cartValues
    cartValues.forEach(item => {
        const {productId,productName,productImage,productqty,price,category } = item;

        // Check if item exists in the database
        db.query('SELECT * FROM cart_table WHERE product_id = ?', [productId], (err, result) => {
            if (err) {
                console.error('Error checking cart:', err);
                return res.status(500).json({ error: 'Error checking cart' });
            }

            if (result.length > 0) {
                
                db.query('UPDATE cart_table SET qty = ? WHERE product_id = ?', [productqty, productId], (err, updateResult) => {
                    if (err) {
                        console.error('Error updating cart:', err);
                        return res.status(500).json({ error: 'Error updating cart' });
                    }
                    successfulOperations.push(`Updated cart for product ID ${productId}`);
                });
            } else {
                
                db.query('INSERT INTO cart_table (product_id,product_name,image,qty,price,category) VALUES (?,?,?,?,?,?)', [productId,productName,productImage,productqty,price,category], (err, insertResult) => {
                    if (err) {
                        console.error('Error inserting into cart:', err);
                        return res.status(500).json({ error: 'Error inserting into cart' });
                    }
                    successfulOperations.push(`Inserted new item into cart for product ID ${productId}`);
                });
            }
        });
    });

    // After all operations are completed, send response with appropriate message
    db.on('end', () => {
        sendSuccessResponse();
    });
});




const PORT = process.env.PORT || 8084;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});







































app.post('/add-cart', (req, res) => {    
    const {cartValues} = req.body;

    console.log("resp",cartValues)
    const sql = "INSERT INTO cart_table (product_id, product_name, image,qty, price, category) VALUES ?";
   
    const values = cartValues?.map((item) => [item.productId, item.productName, item.productImage,item.productqty, item.price, item.category]);
   
    console.log("vals",values)
    db.query(sql, [values], (err, results) => {
        if (err) {
            console.error('Error querying database: ' + err.stack);
            return res.status(500).json({ error: 'Error adding items' });
        }
        if (results.length === 0) {
            console.log('User not found or invalid credentials');
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        console.log('Item added successfully ');
        return res.status(200).json({ message: 'Successfully'});
    });
});
