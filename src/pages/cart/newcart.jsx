import React, { useContext, useState } from "react";
import { PRODUCTS } from "../../products";
import { CartItem } from "./cart-item";
import "./cart.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ShopContext } from "../../context/shop-context";


const Cart = () => {
  const { cartItems, getTotalCartAmount } = useContext(ShopContext);
  const totalAmount = getTotalCartAmount();
  const navigate = useNavigate();

  const [cartValues, setCartValues] = useState([]);

  const handleCheckout = () => {
    const newItems = PRODUCTS.filter(product => cartItems[product.id] > 0)
      .map(product => ({
        productId: product.id,
        productName: product.productName,
        ProductImage: product.ProductImage,
        productqty: cartItems[product.id] > 0 ? cartItems[product.id] : 0,
        price: product.price,
        category: product.category
      }));

    const updatedCart = [...cartValues, ...newItems];
    setCartValues(updatedCart);

    axios
      .post("http://localhost:8084/add-update-cart", { cartValues: updatedCart })
      .then(response => {
        console.log("Response from server:", response.data);
        navigate("/");
        alert("You have checked out successfully.");
      })
      .catch(err => {
        console.error("Error adding/updating cart:", err);
        alert("Error adding/updating cart");
      });
  };

  return (
    <div className="cart">
      <div>
        <h2>Cart Items</h2>
      </div>
      <div className="cartItems">
        {PRODUCTS.map(product => {
          if (cartItems[product.id] >= 1) {
            return <CartItem key={product.id} data={product} />;
          }
          return null;
        })}
      </div>
      {totalAmount > 0 ? (
        <div className="checkout">
          <p>Subtotal: Ksh {totalAmount}</p>
          <button onClick={() => navigate("/")}>Continue Shopping</button>
          <button onClick={() => handleCheckout()}>Checkout</button>
          <button onClick={() => navigate("/receipt")}>Print Receipt</button>
       
        </div>
      ) : (
        <h1>Your Cart Is Empty</h1>
      )}
    </div>
  );
};

export default Cart;

