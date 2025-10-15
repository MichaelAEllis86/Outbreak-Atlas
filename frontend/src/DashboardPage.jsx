// frontend/src/Dashboard.jsx
import { useNavigate } from "react-router-dom";
import {
  Container,
  Box,
  Typography,
  Button,
} from "@mui/material";
import Logo from "./assets/logo.png";
import { useAuth } from "./AuthContext";
import DashboardUserTrends from "./DashboardUserTrends";
import DashboardUserReports from "./DashBoardUserReports";

function Dashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const goToLogin = () => navigate("/login");
  const goToSignup = () => navigate("/signup");

  return (
    <Container maxWidth="lg" sx={{ mt: 6, mb: 6 }}>
      {/* Logo Section */}
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        flexDirection="column"
        sx={{ mb: 6 }}
      >
        <Box
          component="img"
          src={Logo}
          alt="Outbreak Atlas Logo"
          sx={{ width: { xs: 180, md: 400 }, height: "auto", mb: 2 }}
        />
        <Typography variant="h3" fontWeight={700} color="primary">
          Outbreak Atlas
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Your personal health reporting dashboard
        </Typography>
      </Box>

      {/* Auth Buttons
      <Box display="flex" justifyContent="center" gap={3} sx={{ mb: 6 }}>
        {user ? (
          <Button variant="contained" color="primary" onClick={logout}>
            Logout
          </Button>
        ) : (
          <>
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={goToLogin}
            >
              Login
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              size="large"
              onClick={goToSignup}
            >
              Sign Up
            </Button>
          </>
        )}
      </Box> */}

      {/* User-specific charts */}
      <DashboardUserTrends />

      {/* User-specific reports table */}
      <DashboardUserReports />
    </Container>
  );
}

export default Dashboard;


