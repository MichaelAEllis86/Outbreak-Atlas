import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import AccountDetails from "./AccountDetails";
import EditAccountForm from "./EditAccountForm";
import {
  Container,
  Box,
  Typography,
  Button,
} from "@mui/material";
import Logo from "./assets/logo.png";
import { useAuth } from "./AuthContext";
import axios from "axios";

function AccountPage(){
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const [userData, setUserData]=useState(null)
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const goToLogin = () => navigate("/login");
    const goToSignup = () => navigate("/register")

    async function deleteUser(){
         if (!window.confirm("Are you sure you want to delete this user? This action cannot be undone!!")) return;
        try{
            if(!user) return;
            setLoading(true);
            setError(null);
            const response=await axios.delete(`/api/users/${user.id}`,{
                headers:{
                    Authorization:`Bearer ${localStorage.getItem("token")}`
                },
            })
            logout();
        }
        catch(err){
            console.error("error deleting user", err)
            setError("failed to delete user");

        }
        finally{
            setLoading(false)
        }}

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
                setError("failed to fetch user data");
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
      if (!userData) return <Typography>No user data available.</Typography>;

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
              Account Actions and info for {user.username}
            </Typography>
          </Box>
    
          {/* Auth Buttons */}
          <Box display="flex" justifyContent="center" gap={3} sx={{ mb: 6 }}>
  {user ? (
    <>
      <Button variant="contained" color="primary" onClick={logout}>
        Logout
      </Button>
      <Button
        variant="contained"
        color="error"
        onClick={() => deleteUser(user.id)}
      >
        Delete My Account
      </Button>
    </>
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
</Box>
    <AccountDetails user={userData}></AccountDetails>
    <EditAccountForm userData={userData}></EditAccountForm>
          </Container>
          );
}

export default AccountPage;
