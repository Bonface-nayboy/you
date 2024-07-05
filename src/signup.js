import React, { useState } from "react";
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './signup.css'; // Assuming you create a Signup.css file for custom styling

function Signup() {
    const [signupValues, setSignupValues] = useState({
        name: '',
        email: '',
        password: '',
    });

    const [loginValues, setLoginValues] = useState({
        email: '',
        password: '',
    });

    const [signupStatus, setSignupStatus] = useState('');
    const [loginStatus, setLoginStatus] = useState('');

    const handleSignupChange = (e) => {
        setSignupValues({ ...signupValues, [e.target.name]: e.target.value });
    };

    const handleLoginChange = (e) => {
        setLoginValues({ ...loginValues, [e.target.name]: e.target.value });
    };

    const handleSignupSubmit = (e) => {
        e.preventDefault();
        axios.post('http://localhost:8084/signup', signupValues)
            .then(res => {
                console.log("Registered Successfully");
                setSignupStatus('Registered Successfully');
                // Optionally, you can redirect or perform other actions upon successful registration
            })
            .catch(err => {
                console.error(err);
                setSignupStatus('Error registering user');
                // Handle error state or display error message to user
            });
    };

    const handleLoginSubmit = (e) => {
        e.preventDefault();
        axios.post('http://localhost:8084/login', loginValues)
            .then((response) => {
                if (response.data.message) {
                    setLoginStatus(response.data.message);
                } else {
                    setLoginStatus('Logged in as ' + response.data[0].name);
                }
            })
            .catch(err => {
                console.error(err);
                setLoginStatus('Error logging in please signup if you do not have an account');
                // Handle error state or display error message to user
            });
    };

    return (
        <div className="d-flex justify-content-center align-items-center vh-100" >
            <div className="bg-white p-3 rounded w-25 ml ">
                <h2>Signup</h2>
                <form onSubmit={handleSignupSubmit}>
                    <div className="mb-3">
                        <label htmlFor="name"><strong>Name</strong></label>
                        <input type="text" placeholder="Enter Name" name="name" className="form-control rounded-0" onChange={handleSignupChange}/>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="email"><strong>Email</strong></label>
                        <input type="email" placeholder="Enter email" name="email" className="form-control rounded-0" onChange={handleSignupChange}/>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password"><strong>Password</strong></label>
                        <input type="password" placeholder="Enter Password" name="password" className="form-control rounded-0" onChange={handleSignupChange}/>
                    </div>
                    <button type="submit" className="btn btn-success w-100 rounded-0">Signup</button>
                    <p>{signupStatus}</p>
                    <a href="/" className="btn btn-default border w-100 bg-light rounded-0 text-decoration-none">now login</a>
                </form>
            </div>

            <div className="login bg-white p-3 rounded w-25 ml-30">
                <h2>Login</h2>
                <form onSubmit={handleLoginSubmit}>
                    <div className="mb-3">
                        <label htmlFor="email"><strong>Email</strong></label>
                        <input type="email" placeholder="Enter email" name="email" className="form-control rounded-0" onChange={handleLoginChange}/>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password"><strong>Password</strong></label>
                        <input type="password" placeholder="Enter password" name="password" className="form-control rounded-0" onChange={handleLoginChange}/>
                    </div>
                    <button type="submit" className="btn btn-primary w-100 rounded-0">Login</button>
                    <p>{loginStatus}</p>
                </form>
            </div>
        </div>
    );
}

export default Signup;

