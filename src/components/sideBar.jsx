import React, { useState } from "react";
import { Box, Button, Link, List, ListItem, Typography, CircularProgress } from "@mui/material";
import { AdminPanelSettings, Home, Login, LogoutOutlined, SignLanguageOutlined } from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SideBar = () => {
    const [isLoading, setLoading] = useState(false);

    const sidebarlinks = [
        {
            id: "1",
            name: "Home",
            link: "/",
            icon: <Home />,
        },
        {
            id: "2",
            name: "Signup",
            link: "/logins",
            icon: <SignLanguageOutlined />,
        },
        {
            id: "3",
            name: "Login",
            link: "/login",
            icon: <Login />,
        },
        {
            id: "4",
            name: "Admin",
            link: "/admin",
            icon: <AdminPanelSettings />,
        },
    ];

    const handleLogout = () => {
        setLoading(true); // Show loading indicator
        // Perform logout actions here, such as clearing localStorage/sessionStorage
        localStorage.removeItem("userId");
        localStorage.removeItem("userName");

        // Simulate logout delay with setTimeout
        setTimeout(() => {
            setLoading(false); // Hide loading indicator after 2 seconds
            toast.success("Logged out successfully!"); // Show toast notification
            // Redirect user to login page or perform any other necessary actions
        }, 2000);
    };

    return (
        <Box>
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
            <Box
                sx={{
                    width: "252px",
                    backgroundColor: "#fff",
                    height: "100vh",
                    padding: "20px",
                }}
            >
                <Typography color="black" fontWeight="bold" fontSize="150%" marginLeft={1}>
                    Home
                </Typography>
                <Box width="100%">
                    {sidebarlinks.map((link) => (
                        <Box key={link.id} sx={{ margin: "2px 0px" }}>
                            <List>
                                <Link
                                    component={RouterLink}
                                    to={link.link}
                                    underline="hover"
                                    color="inherit"
                                >
                                    <ListItem>
                                        <Typography color="green" mr={2}>
                                            {link.icon}
                                        </Typography>
                                        <Typography color="#000">{link.name}</Typography>
                                    </ListItem>
                                </Link>
                            </List>
                        </Box>
                    ))}
                </Box>
            </Box>
            <Box mt="-90px" marginLeft={2} width={400}>
                <Button
                    variant="outlined"
                    startIcon={<LogoutOutlined />}
                    onClick={handleLogout}
                    disabled={isLoading} // Disable button when loading
                >
                    Logout
                </Button>
            </Box>
            {isLoading && (
                <Box
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                    }}
                >
                    <CircularProgress color="primary" size={40} />
                </Box>
            )}
        </Box>
    );
};

export default SideBar;
