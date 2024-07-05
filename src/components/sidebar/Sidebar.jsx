// src/components/sidebar/Sidebar.tsx
import React from "react";
import { Link } from "react-router-dom";
import './sidebar.css';

const Sidebar = () => {
    return (
        <div className="sidebar">
            <h2>Sidebar</h2>
            <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/cart">Cart</Link></li>
                {/* Add additional links as needed */}
            </ul>
        </div>
    );
};

export default Sidebar;
