// Sidebar.tsx
import React from "react";
import { Link } from "react-router-dom";

const Sidebar = () => {
    return (
        <div className="sidebar">
            <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/cart">Cart</Link></li>
                {/* Add more links as needed */}
            </ul>
        </div>
    );
};

export default Sidebar;
