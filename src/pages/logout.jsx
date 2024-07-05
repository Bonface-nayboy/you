import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';

const Logout = () => {
    useEffect(() => {
        // Clear user data from localStorage upon logout
        localStorage.removeItem('userId');
        localStorage.removeItem('userName');
    }, []);

    // Redirect to the login page after logout
    return <Navigate to="/login" />;
};

export default Logout;
