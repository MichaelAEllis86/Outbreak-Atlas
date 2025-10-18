// frontend/src/LocalTrendsPage.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Box,
  Typography,
  Button,
  CircularProgress
} from "@mui/material";
import Logo from "./assets/logo.png";
import { useAuth } from "./AuthContext";
import UserLocalFluTrends from "./UserLocalFluTrends";
import UserLocalStateOBATrends from "./UserLocalStateOBATrends";
import UserLocalZipcodeOBATrends from "./UserLocalZipcodeOBATrends";
import axios from "axios";

function UserLocalTrendsPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [userData, setUserData]=useState(null)
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const goToLogin = () => navigate("/login");
  const goToSignup = () => navigate("/signup");

  useEffect(()=>{
    async function fetchUserData(){
        if(!user) return;
        setLoading(true);
        setError(null);
        try{
            const response=await axios.get(`/api/users/${user.id}`,{
                headers:{
                    Authorization:`Bearer ${localStorage.getItem("token")}`
                },
            });
            setUserData(response.data.user)
             console.log("Fetched user data:", response.data.user);
        }
        catch(err){
            console.error("error fetching user data", err)
            setError("failed to fetch location for user");
        }
        finally{
            setLoading(false);
        }        
    } fetchUserData();
  }, [user]);

  if (loading) {
      return (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          <CircularProgress />
        </Box>
      );
    }

    if (error) return <Typography color="error">{error}</Typography>;
    if (!userData) return <Typography>No user location available for local trends.</Typography>;

  return (
    <Container maxWidth="lg" sx={{ mb: 6 }}>
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
          Local illness Trends for {user.username}. 
        </Typography>
      </Box>
      {/* User-specific charts */}
      <UserLocalFluTrends userData={userData} />
      <UserLocalStateOBATrends userData={userData}/>
      <UserLocalZipcodeOBATrends userData={userData}/>
    </Container>
  );
}

export default UserLocalTrendsPage;