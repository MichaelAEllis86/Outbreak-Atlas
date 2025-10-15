// frontend/src/UpdateReportForm.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useFormik } from "formik";
import { FormHelperText } from "@mui/material";
import * as Yup from "yup";
import axios from "axios";
import {
  Button,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Checkbox,
  ListItemText,
  OutlinedInput,
  Snackbar,
  Alert,
  Box,
  Typography,
} from "@mui/material";

// Symptom categories
const symptomOptions = [
  "cough",
  "congestion",
  "sneezing",
  "nausea",
  "vomiting",
  "diarrhea",
  "rash",
  "fever",
  "fatigue",
  "headache",
  "chills",
  "bodyache",
];

// Severity options
const severityOptions = ["mild", "moderate", "severe"];

// US States
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

// ✅ Validation schema (same as Create)
const validationSchema = Yup.object().shape({
  primary_symptom: Yup.string().oneOf(symptomOptions).required("Required"),
  symptoms: Yup.array()
    .of(Yup.string().oneOf(symptomOptions))
    .min(1, "Select at least one"),
  severity: Yup.string().oneOf(severityOptions).required("Required"),
  temperature: Yup.number()
    .nullable()
    .transform((value, originalValue) =>
      originalValue === "" ? null : value
    )
    .min(90, "Must be at least 90°F")
    .max(110, "Must be at most 110°F"),
  notes: Yup.string(),
  zipcode: Yup.string().matches(/^\d{5}$/, "Must be 5 digits").required("Required"),
  state: Yup.string().matches(/^[A-Z]{2}$/, "Invalid state code").required("Required"),
  latitude: Yup.number().nullable(),
  longitude: Yup.number().nullable(),
});

const UpdateReportForm = ({ previousReport }) => {
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      primary_symptom: previousReport.primary_symptom || "",
      symptoms: previousReport.symptoms || [],
      severity: previousReport.severity || "",
      temperature: Number(previousReport.temperature) || 98.6,
      notes: previousReport.notes || "",
      zipcode: previousReport.zipcode || "",
      state: previousReport.state || "",
      latitude: Number(previousReport.latitude) || null,
      longitude: Number(previousReport.longitude) || null,
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const payload = { ...values };
        if (payload.latitude === null) delete payload.latitude;
        if (payload.longitude === null) delete payload.longitude;

        await axios.patch(`/api/reports/${previousReport.id}`, payload, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        setSnackbar({ open: true, message: "Report updated successfully!", severity: "success" });
        navigate(`/`)
      } catch (err) {
        console.error(err.response?.data || err.message);
        setSnackbar({ open: true, message: "Failed to update report.", severity: "error" });
      } finally {
        setSubmitting(false);
      }
    },
  });

  const handleLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          formik.setFieldValue("latitude", Number(pos.coords.latitude.toFixed(6)));
          formik.setFieldValue("longitude", Number(pos.coords.longitude.toFixed(6)));
          setSnackbar({ open: true, message: "Location fetched successfully!", severity: "success" });
        },
        (err) => {
          setSnackbar({
            open: true,
            message: `Failed to fetch location: ${err.message}`,
            severity: "error",
          });
        }
      );
    } else {
      setSnackbar({
        open: true,
        message: "Geolocation is not supported by this browser.",
        severity: "error",
      });
    }
  };

  const handleCloseSnackbar = () => setSnackbar((prev) => ({ ...prev, open: false }));

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
          maxWidth: "600px",
        }}
      >
        <Typography variant="h4" fontWeight={700} color="primary" gutterBottom align="center">
          Update Illness Report
        </Typography>

        {/* Primary Symptom */}
        <FormControl fullWidth error={formik.touched.primary_symptom && Boolean(formik.errors.primary_symptom)}>
          <InputLabel>Primary Symptom</InputLabel>
          <Select
            name="primary_symptom"
            value={formik.values.primary_symptom}
            onChange={formik.handleChange}
          >
            {symptomOptions.map((s) => (
              <MenuItem key={s} value={s}>
                {s}
              </MenuItem>
            ))}
          </Select>
          {formik.touched.primary_symptom && formik.errors.primary_symptom && (
            <FormHelperText>{formik.errors.primary_symptom}</FormHelperText>
          )}
        </FormControl>

        {/* Symptoms Multi-select */}
        <FormControl fullWidth>
          <InputLabel>Symptoms</InputLabel>
          <Select
            multiple
            name="symptoms"
            value={formik.values.symptoms}
            onChange={formik.handleChange}
            input={<OutlinedInput />}
            renderValue={(selected) => selected.join(", ")}
          >
            {symptomOptions.map((s) => (
              <MenuItem key={s} value={s}>
                <Checkbox checked={formik.values.symptoms.includes(s)} />
                <ListItemText primary={s} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Severity */}
        <FormControl fullWidth error={formik.touched.severity && Boolean(formik.errors.severity)}>
          <InputLabel>Severity</InputLabel>
          <Select
            name="severity"
            value={formik.values.severity}
            onChange={formik.handleChange}
          >
            {severityOptions.map((sev) => (
              <MenuItem key={sev} value={sev}>
                {sev}
              </MenuItem>
            ))}
          </Select>
          {formik.touched.severity && formik.errors.severity && (
            <FormHelperText>{formik.errors.severity}</FormHelperText>
          )}
        </FormControl>

        {/* Temperature */}
        <TextField
          fullWidth
          name="temperature"
          label="Temperature (°F)"
          type="number"
          step="0.1"
          value={formik.values.temperature}
          onChange={formik.handleChange}
          error={formik.touched.temperature && Boolean(formik.errors.temperature)}
          helperText={formik.touched.temperature && formik.errors.temperature}
        />

        {/* Notes */}
        <TextField
          fullWidth
          name="notes"
          label="Notes"
          multiline
          rows={3}
          value={formik.values.notes}
          onChange={formik.handleChange}
        />

        {/* Zipcode */}
        <TextField
          fullWidth
          name="zipcode"
          label="Zipcode"
          value={formik.values.zipcode}
          onChange={formik.handleChange}
          error={formik.touched.zipcode && Boolean(formik.errors.zipcode)}
          helperText={formik.touched.zipcode && formik.errors.zipcode}
        />

        {/* State */}
        <FormControl fullWidth error={formik.touched.state && Boolean(formik.errors.state)}>
          <InputLabel>State</InputLabel>
          <Select name="state" value={formik.values.state} onChange={formik.handleChange}>
            {usStates.map((st) => (
              <MenuItem key={st.code} value={st.code}>
                {st.name} ({st.code})
              </MenuItem>
            ))}
          </Select>
          {formik.touched.state && formik.errors.state && (
            <FormHelperText>{formik.errors.state}</FormHelperText>
          )}
        </FormControl>

        {/* Location button */}
        <Button variant="outlined" onClick={handleLocation}>
          Use My Location
        </Button>

        {/* Submit */}
        <Button type="submit" variant="contained" disabled={formik.isSubmitting}>
          {formik.isSubmitting ? "Updating..." : "Update Report"}
        </Button>

        {/* Snackbar */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert severity={snackbar.severity} onClose={handleCloseSnackbar} sx={{ width: "100%" }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </Box>
  );
};

export default UpdateReportForm;
