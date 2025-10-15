// frontend/src/SideNavBar.jsx
import { useState } from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Box,
  IconButton,
  useMediaQuery,
} from "@mui/material";
import { useAuth } from "./AuthContext";
import MenuIcon from "@mui/icons-material/Menu";
import { Link } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import logo from "./assets/logo.png";

// ✅ MUI Icons
import HomeIcon from "@mui/icons-material/Home";
import DashboardIcon from "@mui/icons-material/Dashboard";
import InfoIcon from "@mui/icons-material/Info";
import AssignmentIcon from "@mui/icons-material/Assignment";
import TrendingUpIcon from "@mui/icons-material/TrendingUp"
import TravelExploreIcon from "@mui/icons-material/TravelExplore";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";


const drawerWidth = 240;

function SideNavBar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { user } = useAuth();

  // ✅ Define links with icons inline
  const navLinks = [
    { text: "Home & National Trends", path: "/", icon: <HomeIcon /> },
    
    ...(user ? [{ text: "Dashboard", path: `/dashboard/${user.id}`, icon: <DashboardIcon /> },
       { text: "Local Trends", path: "/local-trends", icon: <TrendingUpIcon /> },
       { text: "Report an illness", path: "/create-report", icon: <AssignmentIcon /> },
       { text: "Explore Trends", path: "/explore-trends", icon: <TravelExploreIcon/> },
    ] : []),
  ];

  const drawerContent = (
    <Box sx={{ width: drawerWidth }}>
      {/* Logo */}
      <Box
        component={Link}
        to="/"
        sx={{
          display: "flex",
          justifyContent: "center",
          p: 2,
          textDecoration: "none",
        }}
      >
        <Box
          component="img"
          src={logo}
          alt="Outbreak Atlas Logo"
          sx={{ height: 150 }}
        />
      </Box>

      <Divider />

      {/* Nav links with icons */}
      <List>
        {navLinks.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton component={Link} to={item.path}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  if (isMobile) {
    return (
      <>
        <IconButton
          color="inherit"
          edge="start"
          onClick={() => setMobileOpen(true)}
          sx={{ ml: 1 }}
        >
          <MenuIcon />
        </IconButton>
        <Drawer
          variant="temporary"
          anchor="left"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              zIndex: (theme) => theme.zIndex.drawer + 2,
            },
          }}
        >
          {drawerContent}
        </Drawer>
      </>
    );
  }

  return (
    <Drawer
      variant="permanent"
      anchor="left"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
          zIndex: (theme) => theme.zIndex.drawer + 2,
        },
      }}
    >
      {drawerContent}
    </Drawer>
  );
}

export default SideNavBar;




