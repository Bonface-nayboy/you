import React from "react";
import { Box, Button, Link, List, ListItem, Typography } from "@mui/material";
import { AdminPanelSettings, Home, Login, LogoutOutlined, SignLanguageOutlined,} from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";


const SideBar = () => {
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
            link: "/logins",  // Updated link to "/logins"
            icon: <SignLanguageOutlined/>,
        },
        {
            id:"3",
            name:"Login",
            link:"/login",
            icon:<Login/>,

        },
        {
            id: "4",
            name: "Admin",
            link: "/admin",
            icon: <AdminPanelSettings />,
        },
    ];

    const handleLogout = () => {
        // Perform logout actions here, such as clearing localStorage/sessionStorage
        localStorage.removeItem("userId");
        localStorage.removeItem("userName");
        // Redirect user to login page or perform any other necessary actions
        alert("Logged out successfully!"); // Example alert
    };
    


    

    return (
        <Box>
            <Box
                sx={{
                    width: "252px",
                    backgroundColor: "#fff",
                    height: "100vh",
                    padding:"20px"
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
>
Logout
</Button>
            </Box>
        </Box>
    );
};

export default SideBar;

