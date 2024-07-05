import React from "react";
import { Link } from "react-router-dom";


import "./navbar.css";
import "./searchbar.css";
import { ShoppingCart } from "phosphor-react";

export const Navbar = () => {
    return (
        <div className="navbar">
            <div className="links">
                <Link to="/shop">Shop</Link>
                <Link to="/cart">
                    <ShoppingCart size={32} />
                </Link>
            </div>
          
        </div>
    );
};

