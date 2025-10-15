import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useAuth } from "./AuthContext";
import { useLocation } from "react-router-dom";
import {
  Box,
  TextField,
  Button,
  Snackbar,
  Alert,
  Typography,
} from "@mui/material";

// ✅ Validation schema
const validationSchema = Yup.object().shape({
  username: Yup.string().required("Username is required"),
  password: Yup.string()
    .required("Password is required")
});

function LoginForm() {
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const {login}=useAuth();

  const location=useLocation(); //read navigation state, if route is protected we pass a message to login via snackbar using state through the location object

    // ✅ If redirected with a message, show it
  useEffect(() => {
    if (location.state?.message) {
      setSnackbar({
        open: true,
        message: location.state.message,
        severity: "warning",
      });
    }
  }, [location.state]);

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validationSchema,
    validateOnChange: true,
    validateOnBlur: true,

    validate: async (values) => {
      try {
        await validationSchema.validate(values, { abortEarly: false });
      } catch (err) {
        return err.inner.reduce((errors, currentError) => {
          errors[currentError.path] = currentError.message;
          return errors;
        }, {});
      }
    },

    onSubmit: async (values, { setSubmitting, resetForm, setErrors }) => {
      console.log("Login form submitted:", values);
      try {
        const response = await axios.post("/api/auth/login", values, {
          headers: { "Content-Type": "application/json" },
        });

        login(response.data.token)
        setSnackbar({
          open: true,
          message: "Login successful redirecting to homepage!",
          severity: "success",
        });
        resetForm();

      } catch (err) {
        console.error("Login error:", err.response?.data || err.message);
        setSnackbar({
          open: true,
          message: "Invalid username or password",
          severity: "error",
        });
        if (err.response?.data?.errors) {
          setErrors(err.response.data.errors);
        }
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
        mt: 6,
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
          maxWidth: "500px", // ✅ shrink width similar to CreateReportForm
        }}
      >
        <Typography
          variant="h4"
          fontWeight={700}
          color="primary"
          gutterBottom
          align="center"
        >
          Login to Outbreak Atlas
        </Typography>

        {/* Username */}
        <TextField
          fullWidth
          name="username"
          label="Username"
          value={formik.values.username}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.username && Boolean(formik.errors.username)}
          helperText={formik.touched.username && formik.errors.username}
        />

        {/* Password */}
        <TextField
          fullWidth
          name="password"
          label="Password"
          type="password"
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.password && Boolean(formik.errors.password)}
          helperText={formik.touched.password && formik.errors.password}
        />

        {/* Submit */}
        <Button type="submit" variant="contained" disabled={formik.isSubmitting}>
          {formik.isSubmitting ? "Logging in..." : "Login"}
        </Button>

        {/* Snackbar */}
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
}

export default LoginForm;
