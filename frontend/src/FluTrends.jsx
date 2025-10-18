// frontend/src/Home.jsx
// frontend/src/FluTrends.jsx
import { useEffect, useState } from "react";
import { Box, Typography, CircularProgress } from "@mui/material";
import Grid from "@mui/material/Grid"; // ✅ Grid v2
import FluBarChart from "./FluBarChart";
import FluLineChart from "./FluLineChart";
import axios from "axios";
import { ReferenceLine } from "recharts";
import CoronavirusIcon from "@mui/icons-material/Coronavirus";

function FluTrends() {
  const [fluData, setFluData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [wILIBaseline, setWILIBaseline]=useState(null)

  useEffect(() => {
    async function fetchFluData() {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`/api/flu/trends/nat`);
        setFluData(response.data);
        console.log("fetched flu data--->", response.data);
        setWILIBaseline(response.data[0].baseline)
      } catch (err) {
        console.error("error fetching flu data", err);
        setError("Failed to load flu data.");
      } finally {
        setLoading(false);
      }
    }
    fetchFluData();
  }, []);
  
  //This useEffect is just used to properly log the wILIbaseline. if we don't need this log it can be deleted safely.
  useEffect(() => {
  if (wILIBaseline !== null) {
    console.log("Baseline updated:", wILIBaseline);
  }
}, [wILIBaseline]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  if (!fluData) {
    return <Typography>No flu data available.</Typography>;
  }

  // --- Transform Data ---
  const ageData = Object.entries(fluData[0].age_breakdown).map(([ageGroup, cases]) => ({
    ageGroup,
    cases: cases === "No data" ? 0 : Number(cases),
  }));

  const patientsByWeek = fluData
    .filter(entry => entry.total_patients && entry.epiweek !== "bimonthly (8-week aggregate)")
    .map(entry => ({
      week: entry.epiweek_label || entry.epiweek,
      totalPatients: Number(entry.total_patients),
    }))
    .reverse();

  const weightedILIData = fluData
    .filter(entry => entry.weighted_ILI_percent && entry.epiweek !== "bimonthly (8-week aggregate)")
    .map(entry => ({
      week: entry.epiweek_label || entry.epiweek,
      weightedILI: Number(entry.weighted_ILI_percent),
    }))
    .reverse();

  const totalILIData = fluData
    .filter(entry => entry.total_ILI_cases && entry.epiweek !== "bimonthly (8-week aggregate)")
    .map(entry => ({
      week: entry.epiweek_label || entry.epiweek,
      totalILI: Number(entry.total_ILI_cases),
    }))
    .reverse();

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom textAlign="center" sx={{ mb: 3 }}>
        <CoronavirusIcon color="secondary" />
        National Bimonthly CDC Influenza-like Illness Surveillance (ILINet)
        <CoronavirusIcon color="secondary" />
      </Typography>

      {/* Bar Charts Row */}
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <FluBarChart
            title="8 Week Total Flu Illness by Age Group"
            fluData={ageData}
            xKey="ageGroup"
            yKey="cases"
            yLabel="Cases"
            barColor="#178A4E"
          />
        </Grid>
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

      {/* Line Charts Row */}
      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid size={{ xs: 12, md: 6 }}>
          <FluLineChart
            title="Total Patients Visiting Healthcare Providers by Week"
            data={patientsByWeek}
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
    </Box>
  );
}

export default FluTrends;
