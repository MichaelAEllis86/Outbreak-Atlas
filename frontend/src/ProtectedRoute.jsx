// frontend/src/ProtectedRoute.jsx

import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { CircularProgress, Box } from "@mui/material";

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ message: "You must be logged in to access that page." }}
      />
    );
  }

  return children;
}

export default ProtectedRoute;
