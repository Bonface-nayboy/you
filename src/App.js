import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Navbar } from "./components/navbar";
import Cart from "./pages/cart/cart";
import Logins from "./pages/logins"; 
import "./App.css";
import ShopContextProvider from "./context/shop-context"; 
import SideBar from "./components/sideBar";
import Login from "./pages/login";
import Home from "./components/home";
import Receipt from "./pages/cart/receipt";
import AddProducts from "./components/add_products";
import NewCart from "./pages/cart/newcart";
import Logout from "./pages/logout";
import Shop from "./pages/shop/shop";
import Stock from './pages/stocks/stock';
import Order from "./pages/stocks/order";

function App() {
    return (
        <div className="App">
            <ShopContextProvider> 
                <Router>
                    <Navbar />
                    <div className="main-content">
                        <div className="sidebar-container">
                            <SideBar />
                        </div>
                        <div className="products-container">
                            <Routes>
                                <Route path="/shop" element={<Shop />} />
                                <Route path="/cart" element={<Cart />} />
                                <Route path="/logins" element={<Logins />} />
                                <Route path="/login" element={<Login />} />
                                <Route path="/" element={<Home />} />
                                <Route path="/receipt" element={<Receipt />} />
                                <Route path="/home" element={<Home />} />
                                <Route path="/add_products" element={<AddProducts />} />
                                <Route path="/newcart" element={<NewCart />} />
                                <Route path="/logout" element={<Logout/>}/>
                                <Route path="/stock" element={<Stock/>}/>
                                <Route path="/order" element={<Order/>}/>
                            </Routes>
                        </div>
                    </div>
                </Router>
            </ShopContextProvider>
        </div>
    );
}

export default App;


