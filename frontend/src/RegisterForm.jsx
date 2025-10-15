// frontend/src/RegisterForm.jsx
import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import {
  Box,
  Button,
  TextField,
  Snackbar,
  Alert,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
} from "@mui/material";

// List of US states for the dropdown
const usStates = [
  { code: "AL", name: "Alabama" },
  { code: "AK", name: "Alaska" },
  { code: "AZ", name: "Arizona" },
  { code: "AR", name: "Arkansas" },
  { code: "CA", name: "California" },
  { code: "CO", name: "Colorado" },
  { code: "CT", name: "Connecticut" },
  { code: "DE", name: "Delaware" },
  { code: "FL", name: "Florida" },
  { code: "GA", name: "Georgia" },
  { code: "HI", name: "Hawaii" },
  { code: "ID", name: "Idaho" },
  { code: "IL", name: "Illinois" },
  { code: "IN", name: "Indiana" },
  { code: "IA", name: "Iowa" },
  { code: "KS", name: "Kansas" },
  { code: "KY", name: "Kentucky" },
  { code: "LA", name: "Louisiana" },
  { code: "ME", name: "Maine" },
  { code: "MD", name: "Maryland" },
  { code: "MA", name: "Massachusetts" },
  { code: "MI", name: "Michigan" },
  { code: "MN", name: "Minnesota" },
  { code: "MS", name: "Mississippi" },
  { code: "MO", name: "Missouri" },
  { code: "MT", name: "Montana" },
  { code: "NE", name: "Nebraska" },
  { code: "NV", name: "Nevada" },
  { code: "NH", name: "New Hampshire" },
  { code: "NJ", name: "New Jersey" },
  { code: "NM", name: "New Mexico" },
  { code: "NY", name: "New York" },
  { code: "NC", name: "North Carolina" },
  { code: "ND", name: "North Dakota" },
  { code: "OH", name: "Ohio" },
  { code: "OK", name: "Oklahoma" },
  { code: "OR", name: "Oregon" },
  { code: "PA", name: "Pennsylvania" },
  { code: "RI", name: "Rhode Island" },
  { code: "SC", name: "South Carolina" },
  { code: "SD", name: "South Dakota" },
  { code: "TN", name: "Tennessee" },
  { code: "TX", name: "Texas" },
  { code: "UT", name: "Utah" },
  { code: "VT", name: "Vermont" },
  { code: "VA", name: "Virginia" },
  { code: "WA", name: "Washington" },
  { code: "WV", name: "West Virginia" },
  { code: "WI", name: "Wisconsin" },
  { code: "WY", name: "Wyoming" },
];

// ✅ Yup schema aligned with your DB constraints
const validationSchema = Yup.object().shape({
  username: Yup.string()
    .required("Username is required")
    .min(4, "Username must be at least 4 characters")
    .max(15, "Username must be at most 15 characters"),
  password: Yup.string()
    .required("Password is required")
    .min(7, "Password must be at least 7 characters")
    .matches(/[A-Z]/, "Must contain at least one uppercase letter")
    .matches(/[a-z]/, "Must contain at least one lowercase letter")
    .matches(/\d/, "Must contain at least one number")
    .matches(/[@$!%*?&#]/, "Must contain at least one special character"),
  first_name: Yup.string()
    .required("First name is required")
    .max(20, "First name must be at most 20 characters")
    .min(2, "First name must be at least 2 characters"),
  last_name: Yup.string()
    .required("Last name is required")
    .max(20, "Last name must be at most 20 characters")
    .min(2, "Last name must be at least 2 characters"),
  age: Yup.number()
    .required("Age is required")
    .min(0, "Age must be at least 0")
    .max(120, "Age must be at most 120"),
  zipcode: Yup.string()
    .matches(/^\d{5}$/, "Zipcode must be exactly 5 digits")
    .required("Zipcode is required"),
  state: Yup.string()
    .matches(/^[A-Z]{2}$/, "State must be a valid 2-letter code")
    .required("State is required"),
});

const RegisterForm = () => {
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const navigate = useNavigate();

  const {user, login}=useAuth()

    useEffect(() => {
    if (user) {
      navigate("/"); // or /dashboard
    }
  }, [user, navigate]);

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
      first_name: "",
      last_name: "",
      age: "",
      zipcode: "",
      state: "",
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
        console.log("Login form submitted:", values);
      try {
        const response = await axios.post("/api/auth/register", values, {
          headers: { "Content-Type": "application/json" },
        });

        login(response.data.token)

        setSnackbar({
          open: true,
          message: "Registration successful!",
          severity: "success",
        });
        resetForm();
      } catch (err) {
        console.error(err.response?.data || err.message);
        setSnackbar({
          open: true,
          message: "Registration failed. Please try again.",
          severity: "error",
        });
      } finally {
        setSubmitting(false);
      }
    },
  });

  const handleCloseSnackbar = () =>
    setSnackbar((prev) => ({ ...prev, open: false }));

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        mt: 4,
      }}
    >
      <Box
        component="form"
        onSubmit={formik.handleSubmit}
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          width: "100%",
          maxWidth: "500px",
        }}
      >
        <Typography
          variant="h4"
          fontWeight={700}
          color="primary"
          gutterBottom
          align="center"
        >
          Create an Account
        </Typography>

        <TextField
          fullWidth
          name="username"
          label="Username"
          value={formik.values.username}
          onChange={formik.handleChange}
          error={formik.touched.username && Boolean(formik.errors.username)}
          helperText={formik.touched.username && formik.errors.username}
        />

        <TextField
          fullWidth
          name="password"
          label="Password"
          type="password"
          value={formik.values.password}
          onChange={formik.handleChange}
          error={formik.touched.password && Boolean(formik.errors.password)}
          helperText={formik.touched.password && formik.errors.password}
        />

        <TextField
          fullWidth
          name="first_name"
          label="First Name"
          value={formik.values.first_name}
          onChange={formik.handleChange}
          error={formik.touched.first_name && Boolean(formik.errors.first_name)}
          helperText={formik.touched.first_name && formik.errors.first_name}
        />

        <TextField
          fullWidth
          name="last_name"
          label="Last Name"
          value={formik.values.last_name}
          onChange={formik.handleChange}
          error={formik.touched.last_name && Boolean(formik.errors.last_name)}
          helperText={formik.touched.last_name && formik.errors.last_name}
        />

        <TextField
          fullWidth
          name="age"
          label="Age"
          type="number"
          value={formik.values.age}
          onChange={formik.handleChange}
          error={formik.touched.age && Boolean(formik.errors.age)}
          helperText={formik.touched.age && formik.errors.age}
        />

        <TextField
          fullWidth
          name="zipcode"
          label="Zipcode"
          value={formik.values.zipcode}
          onChange={formik.handleChange}
          error={formik.touched.zipcode && Boolean(formik.errors.zipcode)}
          helperText={formik.touched.zipcode && formik.errors.zipcode}
        />

        <TextField
          fullWidth
          name="state"
          label="State (2-letter code)"
          value={formik.values.state}
          onChange={formik.handleChange}
          error={formik.touched.state && Boolean(formik.errors.state)}
          helperText={formik.touched.state && formik.errors.state}
        />

        <Button type="submit" variant="contained" disabled={formik.isSubmitting}>
          {formik.isSubmitting ? "Registering..." : "Sign Up"}
        </Button>
        <Snackbar
            open={snackbar.open}
            autoHideDuration={4000}
            onClose={handleCloseSnackbar}
            anchorOrigin={{ vertical: "top", horizontal: "center" }} // 👈 positions at top-center
        >
            <Alert
                severity={snackbar.severity}
                onClose={handleCloseSnackbar}
                sx={{ width: "100%" }}
            >
            {snackbar.message}
            </Alert>
        </Snackbar>
      </Box>
    </Box>
  );
};

export default RegisterForm;
