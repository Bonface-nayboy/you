import React, { useState } from "react";
import axios from "axios";
import { Navigate } from "react-router-dom";
import "./login.css";

function Login() {
    const [loginValues, setLoginValues] = useState({
        email: "",
        password: ""
    });

    const [loginStatus, setLoginStatus] = useState('');
    const [redirect, setRedirect] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleLoginChange = (e) => {
        setLoginValues({ ...loginValues, [e.target.name]: e.target.value });
    };

    const handleLoginSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);

        axios.post('http://localhost:8084/login', loginValues)
            .then((response) => {
                if (response.data.message) {
                    setLoginStatus(response.data.message);
                    setIsLoading(false);
                    setRedirect(true);
                    localStorage.setItem('userId', response.data.userId); // Store user ID in localStorage
                    localStorage.setItem('userName', response.data.name); // Store user's name in localStorage
                } else {
                    setLoginStatus('Logged in as ' + response.data[0].message);
                    setIsLoading(false);
                    setRedirect(true);
                    localStorage.setItem('userId', response.data[0].userId); // Adjust according to your API response structure
                    localStorage.setItem('userName', response.data[0].name); // Adjust according to your API response structure
                }
            })
            .catch(err => {
                console.error(err);
                setLoginStatus('Error logging in. Please sign up if you do not have an account.');
                setIsLoading(false);
            });
    };

    if (redirect) {
        return <Navigate to="/" />;
    }

    return (
        <div className="login-container">
            <div className="login">
                <h1>Login</h1>
                <form onSubmit={handleLoginSubmit}>
                    <input type="email" id="email" name="email" placeholder="Email..." required onChange={handleLoginChange} />
                    <input type="password" id="password" name="password" placeholder="Password..." required onChange={handleLoginChange} />
                    <button type="submit" disabled={isLoading}>{isLoading ? 'Logging in...' : 'Login'}</button>
                </form>
                <p className="login-status">{loginStatus}</p>
            </div>
        </div>
    );
}

export default Login;
