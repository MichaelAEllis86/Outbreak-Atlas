// frontend/src/TopNavBar.jsx
import {
  AppBar,
  Toolbar,
  Button,
  Box,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Divider,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import HomeIcon from "@mui/icons-material/Home";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import DashboardIcon from "@mui/icons-material/Dashboard";
import InfoIcon from "@mui/icons-material/Info";
import AssignmentIcon from "@mui/icons-material/Assignment";
import LogoutIcon from "@mui/icons-material/Logout"
import LoginIcon from "@mui/icons-material/Login"
import TravelExploreIcon from "@mui/icons-material/TravelExplore";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import { Link, useNavigate } from "react-router-dom";
import logo from "./assets/logo.png";
import { useAuth } from "./AuthContext";
import { useState } from "react";

function TopNavBar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [drawerOpen, setDrawerOpen] = useState(false);
  

  const goToLogin = () => navigate("/login");
  const goToRegister = () => navigate("/register");

  const toggleDrawer = (open) => (event) => {
    if (event.type === "keydown" && (event.key === "Tab" || event.key === "Shift")) return;
    setDrawerOpen(open);
  };

  return (
    <>
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          {/* Logo */}
          <Box component={Link} to="/" sx={{ display: "flex", alignItems: "center", textDecoration: "none" }}>
            <Box component="img" src={logo} alt="Outbreak Atlas Logo" sx={{ height: 60, mr: 2 }} />
          </Box>

          {/* Right side */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            {user && (
              <Typography variant="subtitle1" color="inherit">
                Welcome, <strong>{user.username}</strong> 👋
              </Typography>
            )}

            {/* Hamburger menu */}
            <IconButton color="inherit" onClick={toggleDrawer(true)}>
              <MenuIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Drawer menu */}
      <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer(false)}>
        <Box
          sx={{ width: 260, p: 2 }}
          role="presentation"
          onClick={toggleDrawer(false)}
          onKeyDown={toggleDrawer(false)}
        >
          <Typography variant="h6" sx={{ mb: 2 }}>
            Menu
          </Typography>
          <Divider sx={{ mb: 2 }} />

          <List>
             <ListItem disablePadding>
                  <ListItemButton component={Link} to="/">
                  <ListItemIcon>
                    <HomeIcon color="primary" />
                  </ListItemIcon>
                    <ListItemText primary="Home" />
                  </ListItemButton>
                </ListItem>
            {user ? (
              <>
                <ListItem disablePadding>
                  <ListItemButton component={Link} to={`/dashboard/${user.id}`}>
                    <ListItemIcon>
                      <DashboardIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText primary="Dashboard" />
                  </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                  <ListItemButton component={Link} to="/account">
                  <ListItemIcon>
                      <ManageAccountsIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText primary="My Account" />
                  </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                  <ListItemButton onClick={logout}>
                    <ListItemIcon>
                      <LogoutIcon color="error" />
                    </ListItemIcon>
                    <ListItemText primary="Logout" />
                  </ListItemButton>
                </ListItem>
              </>
            ) : (
              <>
                <ListItem disablePadding>
                  <ListItemButton onClick={goToLogin}>
                    <ListItemIcon>
                      <LoginIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText primary="Login" />
                  </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                  <ListItemButton onClick={goToRegister}>
                     <ListItemIcon>
                      <PersonAddIcon color="secondary" />
                    </ListItemIcon>
                    <ListItemText primary="Sign Up" />
                  </ListItemButton>
                </ListItem>
                
              </>
            )}
           
            <ListItem disablePadding>
                  <ListItemButton component={Link} to="/about">
                  <ListItemIcon>
                    <InfoIcon color="primary" />
                  </ListItemIcon>
                    <ListItemText primary="About" />
                  </ListItemButton>
                </ListItem>
          </List>
        </Box>
      </Drawer>
    </>
  );
}

export default TopNavBar;




