// frontend/src/Home.jsx
import { useNavigate } from "react-router-dom";
import {
  Container,
  Box,
  Typography,
  Button,
  Divider
} from "@mui/material";
import Logo from "./assets/logo.png";
import { useAuth } from "./AuthContext";
import FluTrends from "./FluTrends";
import OBATrends from "./OBATrends";

function Home() {
  const navigate = useNavigate();
  const {user, logout}=useAuth();

  const goToLogin = () => navigate("/login");
  const goToSignup = () => navigate("/register");
  // implement dashboard nav once we make this component
  const goToDashboard = () => navigate(`/dashboard/:${user.id}`)

  return (
    <Container maxWidth="lg" sx={{ mb: 6 }}>
      {/* Logo Section */}
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        flexDirection="column"
        sx={{ mb: 3 }}
      >
        <Box
          component="img"
          src={Logo}
          alt="Outbreak Atlas Logo"
          sx={{ width: { xs: 180, md: 400 }, height: "auto", mb: 2, backgroundColor: "#f8fafc", p: 2, borderRadius: 3  }}
        />
        <Typography variant="h3" fontWeight={700} color="primary">
          Outbreak Atlas
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Tracking health trends across the U.S.
        </Typography>
        <Typography color="error" variant="subtitle1"  gutterBottom textAlign="center"  sx={{ fontWeight: 'bold', mb:5 }} >
                Note!!!  CDC fluview data collection is currently delayed due to the USA governmental shutdown. Until the activities resume 
                please allow for further delays in CDC data.
              </Typography>
      </Box>

      {/* Auth Buttons */}
      <Box display="flex" justifyContent="center" gap={3} sx={{ mb: 6 }}>
        {user ? 
        <>
        </>
        :
        <><Button variant="contained" color="primary" size="large" onClick={goToLogin}>
          Login
        </Button>
        <Button variant="outlined" color="secondary" size="large" onClick={goToSignup}>
          Sign Up
        </Button>
        </>}
      </Box>

      {/* CDC Section (Flu) */}
      <FluTrends />
<Divider sx={{ my: 4 }} />
      {/* OBA Section */}
      <OBATrends />
    </Container>
  );
}

export default Home;








