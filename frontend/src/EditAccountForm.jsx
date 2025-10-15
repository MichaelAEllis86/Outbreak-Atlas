// frontend/src/EditAccountForm.jsx
import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import {
  Box,
  Button,
  TextField,
  Snackbar,
  Alert,
  Typography,
} from "@mui/material";
import { useAuth } from "./AuthContext";

// ✅ Reuse validation schema
const validationSchema = Yup.object().shape({
  username: Yup.string().required("Username is required").min(4).max(15),
  first_name: Yup.string().required("First name is required").min(2).max(20),
  last_name: Yup.string().required("Last name is required").min(2).max(20),
  age: Yup.number().required("Age is required").min(0).max(120),
  zipcode: Yup.string()
    .matches(/^\d{5}$/, "Zipcode must be exactly 5 digits")
    .required("Zipcode is required"),
  state: Yup.string()
    .matches(/^[A-Z]{2}$/, "Must be a 2-letter state code")
    .required("State is required"),
});

function EditAccountForm({ userData }) {
  const { token } = useAuth();
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const formik = useFormik({
    enableReinitialize: true, // 👈 allows prefill from props
    initialValues: {
      username: userData?.username || "",
      first_name: userData?.first_name || "",
      last_name: userData?.last_name || "",
      age: userData?.age || "",
      zipcode: userData?.zipcode || "",
      state: userData?.state || "",
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        await axios.patch(`/api/users/${userData.id}`, values, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSnackbar({ open: true, message: "✅ Account updated!", severity: "success" });
      } catch (err) {
        console.error(err);
        setSnackbar({ open: true, message: "❌ Failed to update account", severity: "error" });
      } finally {
        setSubmitting(false);
      }
    },
  });

  const handleCloseSnackbar = () => setSnackbar((prev) => ({ ...prev, open: false }));

  return (
    <Box
      component="form"
      onSubmit={formik.handleSubmit}
      sx={{ display: "flex", flexDirection: "column", gap: 2, maxWidth: 500, mx: "auto", mt: 4 }}
    >
      <Typography variant="h5" color="primary" align="center">
        Edit Account
      </Typography>

      <TextField {...formik.getFieldProps("username")} label="Username" fullWidth />
      <TextField {...formik.getFieldProps("first_name")} label="First Name" fullWidth />
      <TextField {...formik.getFieldProps("last_name")} label="Last Name" fullWidth />
      <TextField {...formik.getFieldProps("age")} label="Age" type="number" fullWidth />
      <TextField {...formik.getFieldProps("zipcode")} label="Zipcode" fullWidth />
      <TextField {...formik.getFieldProps("state")} label="State (2-letter)" fullWidth />

      <Button type="submit" variant="contained" disabled={formik.isSubmitting}>
        {formik.isSubmitting ? "Saving..." : "Save Changes"}
      </Button>

      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={handleCloseSnackbar}>
        <Alert severity={snackbar.severity} onClose={handleCloseSnackbar}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default EditAccountForm;
