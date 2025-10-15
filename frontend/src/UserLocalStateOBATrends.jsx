// frontend/src/UserLocalOBATrends.jsx
import { useEffect, useState } from "react";
import { Box, Typography, CircularProgress } from "@mui/material";
import Grid from "@mui/material/Grid"; // ✅ Grid v2
import { useAuth } from "./AuthContext";
import FluBarChart from "./FluBarChart";
import FluLineChart from "./FluLineChart";
import FluPieChart from "./FluPieChart";
import axios from "axios";

function UserLocalStateOBATrends({userData}){

    const [OBAData, setOBAData] = useState(null);
    const [weeklyData, setWeeklyData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const {user}=useAuth()
    
    useEffect(()=>{
        async function fetchOBAData(){
            setLoading(true);
            setError(null);
            try{
                const response= await axios.get(`/api/reports/trending?locationType=state&locationValue=${userData.state}`)
                setOBAData(response.data.reports.aggregated)
                setWeeklyData(response.data.reports.weeklyData)
                console.log("fetched local OBA state data for local trends--->", response.data);
            }
            catch(err){
                console.error("error fetching OBA data", err);
                setError("Failed to load State Trend OBA data.");
            }
            finally{
                setLoading(false);
            }
        }
        fetchOBAData();
    },[]);

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

   if (!OBAData) {
    return <Typography>No OBA data available.</Typography>;
  }

  // --- Transform Data ---
  const symptomData = Object.entries(OBAData.symptomCounts).map(([symptom, count]) => ({
    label: symptom,
    count,
  }));

  const categoryData = Object.entries(OBAData.categoryCounts).map(([category, count]) => ({
    label: category,
    count,
  }));

  const severityData = Object.entries(OBAData.severityCounts).map(([severity, count]) => ({
    label: severity,
    count,
  }));

  const stateLocationData = Object.entries(OBAData.stateLocationCounts).map(([state, count]) => ({
    label: state,
    count,
  }));

  const zipLocationData=Object.entries(OBAData.zipLocationCounts).map(([zipcode, count]) =>({
    label: zipcode,
    count,
  }));

  const chartWeekData = weeklyData.map((week) => ({
  week: week.weekLabel,             // x-axis
  totalReports: week.totalReports,       // y-axis
  avgTemp: week.averageTemperature, // optional second line
  symptomCounts: week.symptomCounts,
  severityCounts  : week.severityCounts,
  categoryCounts : week.categoryCounts,
  stateLocationCounts : week.stateLocationCounts,
  ziplocationCounts : week.zipcodeLocationCounts,
    })).reverse();
  console.log("this is chart week data--->", chartWeekData);

  return (
    <Box sx={{ mt: 6 }}>
      <Typography variant="h4" gutterBottom textAlign="center" sx={{ mb: 3 }}>
        Bimonthly Home State ({userData.state}) User-Reported Illness Trends
      </Typography>

      <Grid container spacing={3}>

        <Grid size={{ xs: 12, md: 6 }}>
          <FluLineChart
            title="Reports per week"
            yKey="totalReports"
            xKey="week"
            data={chartWeekData}
            lineColor="#E63946"
            yLabel="Total Reports"
          />

        </Grid>


        <Grid size={{ xs: 12, md: 6 }}>
          <FluBarChart
            title="Reported Symptoms"
            fluData={symptomData}
            xKey="label"
            yKey="count"
            yLabel="Reports"
            barColor="#0056A4"
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

        <Grid size={{ xs: 12, md: 6 }}>
          <FluPieChart
            title="Severity Levels"
            data={severityData}
            nameKey="label"
            dataKey="count"
            colors={["#0056A4", "#FF9800", "#E63946"]} // mild, moderate, severe
          />
        </Grid>

         <Grid size={{ xs: 12, md: 6 }}>
          <FluBarChart
            title="Reports By Zipcode"
            fluData={zipLocationData}
            xKey="label"
            yKey="count"
            yLabel="Reports"
            barColor="#178A4E"
          />
        </Grid>


        <Grid size={{ xs: 12, md: 6 }}>
          <FluBarChart
            title="Total Reports"
            fluData={stateLocationData}
            xKey="label"
            yKey="count"
            yLabel="Reports"
            barColor="#FF9800"
          />
        </Grid>
      </Grid>
    </Box>
  );
}

export default UserLocalStateOBATrends;

