import React, { createContext, useState } from 'react';

export const ShopContext = createContext();

const ShopContextProvider = (props) => {
  const [cartItems, setCartItems] = useState([]);


  const addToCart = (item) => {
    const existingItem = cartItems.find(cartItem => cartItem.id === item.id);

    if (existingItem) {
      
      const updatedCartItems = cartItems.map(cartItem =>
        cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem
      );
      setCartItems(updatedCartItems);
    } else {

      setCartItems([...cartItems, { ...item, quantity: 1 }]);
    }
  };

  
  const removeFromCart = (itemId) => {
    const updatedCartItems = cartItems.filter(item => item.id !== itemId);
    setCartItems(updatedCartItems);
  };

  
  const updateCartItemQuantity = (itemId, newQuantity) => {
    const updatedCartItems = cartItems.map(item =>
      item.id === itemId ? { ...item, quantity: newQuantity } : item
    );
    setCartItems(updatedCartItems);
  };

  
  const getTotalCartAmount = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  
  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <ShopContext.Provider value={{ cartItems, addToCart, removeFromCart, updateCartItemQuantity, getTotalCartAmount, clearCart }}>
      {props.children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;


