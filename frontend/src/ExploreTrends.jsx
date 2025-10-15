import { useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import {
  Box,
  Button,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  Snackbar,
  Alert,
  CircularProgress,
  Grid,
  Paper,
} from "@mui/material";
import FluBarChart from "./FluBarChart";
import FluLineChart from "./FluLineChart";
import FluPieChart from "./FluPieChart";

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

const validationSchema = Yup.object({
  locationType: Yup.string().oneOf(["state", "zipcode"]).required("Location type is required"),
  locationValue: Yup.string().when("locationType", {
    is: (val) => val === "state",
    then: (schema) =>
      schema.matches(/^[A-Z]{2}$/, "Use state code (e.g. SC)").required("State code is required"),
    otherwise: (schema) =>
      schema.matches(/^\d{5}$/, "Must be 5-digit zipcode").required("Zipcode is required"),
  }),
});

function ExploreTrendsPage() {
  const [OBAData, setOBAData] = useState(null);
  const [weeklyData, setWeeklyData] = useState(null);
  const [fluData, setFluData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [wILIBaseline, setWILIBaseline]=useState(null)
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [hasSearched, setHasSearched] = useState(false);

  const { user } = useAuth();

  const formik = useFormik({
    initialValues: { locationType: "", locationValue: "" },
    validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      setSnackbar({ open: false, message: "", severity: "success" });
      setHasSearched(true);

      try {
        const obaResponse = await axios.get(
          `/api/reports/trending?locationType=${values.locationType}&locationValue=${values.locationValue}`
        );
        setOBAData(obaResponse.data.reports.aggregated);
        setWeeklyData(obaResponse.data.reports.weeklyData);

        if (values.locationType === "state") {
          const fluResponse = await axios.get(`/api/flu/trends/${values.locationValue}`);
          setFluData(fluResponse.data);
          console.log("here is fluResponse in explore trends---->", fluResponse.data)
          setWILIBaseline(fluResponse.data[0].baseline)
          console.log("here is wILIBaseLine from fluReponse in explore trends---->", fluResponse.data[0].baseline)
        } else {
          setFluData(null);
          setWILIBaseline(null);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setSnackbar({ open: true, message: "❌ Failed to load data.", severity: "error" });
      } finally {
        setLoading(false);
      }
    },
  });

  //This useEffect is just used to properly log the wILIbaseline. if we don't need this log it can be deleted safely.
    useEffect(() => {
    if (wILIBaseline !== null) {
      console.log("Baseline updated:", wILIBaseline);
    }
  }, [wILIBaseline]);

  const handleCloseSnackbar = () => setSnackbar((prev) => ({ ...prev, open: false }));

  useEffect(() => {
  if (!hasSearched) return;

  if (OBAData) {
    const hasSymptoms =
      OBAData.symptomCounts && Object.values(OBAData.symptomCounts).some(c => c > 0);
    const hasSeverity =
      OBAData.severityCounts && Object.values(OBAData.severityCounts).some(c => c > 0);

    if (!hasSymptoms && !hasSeverity) {
      setSnackbar({
        open: true,
        message: "ℹ️ No self-reported OBA data found for this location.",
        severity: "info",
      });
    }
  } else if (OBAData === null && !loading) {
    setSnackbar({
      open: true,
      message: "ℹ️ No OBA data available for this location.",
      severity: "info",
    });
  }
}, [OBAData, loading, hasSearched]);

   // --- Map Pie Chart Data ---
  let categoryData = [];
  let severityData = [];
  if (OBAData) {
    categoryData = Object.entries(OBAData.categoryCounts || {}).map(([label, count]) => ({
      label,
      count,
    }));

    severityData = Object.entries(OBAData.severityCounts || {}).map(([label, count]) => ({
      label,
      count,
    }));
  }

  let fluPatientsByWeek = [];
  let weightedILIData = [];
  let totalILIData = [];

  if(fluData){
      // --- Transform Data ---

   fluPatientsByWeek = fluData
    .filter(entry => entry.total_patients && entry.epiweek !== "bimonthly (8-week aggregate)")
    .map(entry => ({
      week: entry.epiweek_label || entry.epiweek,
      totalPatients: Number(entry.total_patients),
    }))
    .reverse();

   weightedILIData = fluData
    .filter(entry => entry.weighted_ILI_percent && entry.epiweek !== "bimonthly (8-week aggregate)")
    .map(entry => ({
      week: entry.epiweek_label || entry.epiweek,
      weightedILI: Number(entry.weighted_ILI_percent),
    }))
    .reverse();

   totalILIData = fluData
    .filter(entry => entry.total_ILI_cases && entry.epiweek !== "bimonthly (8-week aggregate)")
    .map(entry => ({
      week: entry.epiweek_label || entry.epiweek,
      totalILI: Number(entry.total_ILI_cases),
    }))
    .reverse();
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 6, mb: 6 }}>
      <Typography variant="h4" fontWeight={700} color="primary" gutterBottom textAlign="center">
        Explore Illness Trends
      </Typography>
      <Typography variant="subtitle1"  gutterBottom textAlign="center"  sx={{ fontWeight: 'bold', mb:5 }} >
        Explore Regional Trends by interacting with the form below!! CDC Fluview Illnet data is available
            for state level queries only!! Outbreak Atlas data is available at both the state and zipcode levels. Data is available
            to the latest 8 week period. Please note that CDC Fluview Illnet outpatient data normally lags by 1-3 weeks.
      </Typography>
      <Typography color="error" variant="subtitle1"  gutterBottom textAlign="center"  sx={{ fontWeight: 'bold', mb:5 }} >
        Please Note that CDC fluview data collection is currently delayed due to the USA governmental shutdown. Until the activities resume 
        please allow for further delays in CDC data.
      </Typography>

      {/* Form */}
      <Box component="form" onSubmit={formik.handleSubmit} sx={{ display: "flex", gap: 2, mb: 4 }}>
        <FormControl fullWidth>
          <InputLabel>Location Type</InputLabel>
          <Select
            name="locationType"
            value={formik.values.locationType}
            onChange={(e) => {
              formik.handleChange(e);
              formik.setFieldValue("locationValue", "");
            }}
            error={formik.touched.locationType && Boolean(formik.errors.locationType)}
          >
            <MenuItem value="state">State</MenuItem>
            <MenuItem value="zipcode">Zipcode</MenuItem>
          </Select>
        </FormControl>

        {formik.values.locationType === "state" ? (
          <FormControl fullWidth>
            <InputLabel>State</InputLabel>
            <Select
              name="locationValue"
              value={formik.values.locationValue}
              onChange={formik.handleChange}
              error={formik.touched.locationValue && Boolean(formik.errors.locationValue)}
            >
              {usStates.map((st) => (
                <MenuItem key={st.code} value={st.code}>
                  {st.name} ({st.code})
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        ) : (
          <TextField
            fullWidth
            name="locationValue"
            label="5 Digit Zipcode"
            value={formik.values.locationValue}
            onChange={formik.handleChange}
            error={formik.touched.locationValue && Boolean(formik.errors.locationValue)}
            helperText={formik.touched.locationValue && formik.errors.locationValue}
          />
        )}

        <Button type="submit" variant="contained" disabled={loading}>
          {loading ? "Loading..." : "Fetch Trends"}
        </Button>
      </Box>

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

      {/* Loading */}
      {loading && (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          <CircularProgress />
        </Box>
      )}

      {/* Flu Data */}
      {!loading && fluData && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h4" textAlign="center" gutterBottom>
            CDC FluView Data (Delphi API) for latest 8 week period – {formik.values.locationValue}
          </Typography>

          <Grid container spacing={3} sx={{mt:2}}>
            <Grid size={{ xs: 12, md: 6 }}>
          <FluLineChart
            title="Total Patients Visiting Healthcare Providers by Week"
            data={fluPatientsByWeek}
            xKey="week"
            yKey="totalPatients"
            yLabel="Total Patients"
            lineColor="#0056A4"
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <FluLineChart
            title="% Patients Ill with Flu-like Symptoms (Weighted ILI)"
            data={weightedILIData}
            xKey="week"
            yKey="weightedILI"
            yLabel="% Patients Ill"
            lineColor="#E63946"
            baseline={wILIBaseline}
          />
        </Grid>
      </Grid>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <FluBarChart
            title="Total Cases of Flu-like Illness per Week"
            fluData={totalILIData}
            xKey="week"
            yKey="totalILI"
            yLabel="Total ILI Cases"
            barColor="#E63946"
          />
        </Grid>
            
          </Grid>
        </Box>
      )}

      {/* OBA Charts */}
      {!loading && OBAData && (categoryData.length > 0 || severityData.length > 0) && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h4" color="primary" textAlign="center" gutterBottom>
            OBA Self-Reported Data for latest 8 week period ({formik.values.locationType}: {formik.values.locationValue})
          </Typography>

          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              
                <FluBarChart
                  title="Reported Symptoms"
                  fluData={Object.entries(OBAData.symptomCounts).map(([label, count]) => ({
                    label,
                    count,
                  }))}
                  xKey="label"
                  yKey="count"
                  yLabel="Reports"
                  barColor="#0056A4"
                />
             
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              
                {weeklyData && (
                  <FluLineChart
                    title="Reports Per Week"
                    data={weeklyData
                      .map((week) => ({
                        week: week.weekLabel,
                        totalReports: week.totalReports,
                      }))
                      .reverse()}
                    xKey="week"
                    yKey="totalReports"
                    yLabel="Total Reports"
                    lineColor="#E63946"
                  />
                )}
              
            </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
              
                <FluPieChart
                  title="Severity Levels"
                  data={severityData}
                  nameKey="label"
                  dataKey="count"
                  yLabel="Reports"
                  barColor="#0056A4"
                  colors={["#0056A4", "#FF9800", "#E63946"]} // mild, moderate, severe
                />
              
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
          <FluPieChart
            title="Symptom Categories"
            data={categoryData}
            nameKey="label"
            dataKey="count"
          />
        </Grid> 
          </Grid>
        </Box>
      )}
    </Container>
  );
}

export default ExploreTrendsPage;

