import React, { useState } from "react";
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate from react-router-dom
import "./login.css";

function Signup() {
    const navigate = useNavigate(); // Initialize navigate function from useNavigate

    const [signupValues, setSignupValues] = useState({
        name: '',
        email: '',
        password: '',
    });

    const handleSignupChange = (e) => {
        setSignupValues({ ...signupValues, [e.target.name]: e.target.value });
    };

    const handleSignupSubmit = (e) => {
        e.preventDefault();
        axios.post('http://localhost:8084/signup', signupValues)
            .then(res => {
                console.log("Registered Successfully");
                alert('Registered Successfully'); // Display success message as an alert
                navigate('/login'); // Redirect to login page upon successful signup
            })
            .catch(err => {
                console.error(err);
                alert('Error registering user'); // Display error message as an alert
            });
    };

    return (
        <div className="login-container">
            <div className="login">
                <div>
                    <h2>Signup</h2>
                    <form onSubmit={handleSignupSubmit}>
                        <div>
                            <label htmlFor="name"><strong>Name</strong></label>
                            <input type="text" placeholder="Enter Name" name="name" required onChange={handleSignupChange} />
                        </div>
                        <div>
                            <label htmlFor="email"><strong>Email</strong></label>
                            <input type="email" placeholder="Enter email" name="email" required  onChange={handleSignupChange} />
                        </div>
                        <div >
                            <label htmlFor="password"><strong>Password</strong></label>
                            <input type="password" placeholder="Enter Password" name="password" required onChange={handleSignupChange} />
                        </div>
                        <button type="submit" className="btn btn-success w-100 rounded-0">Signup</button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Signup;



