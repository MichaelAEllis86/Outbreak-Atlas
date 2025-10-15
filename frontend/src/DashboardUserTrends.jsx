//frontend/src/DashBoardUserTrends.jsx
import { useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import FluPieChart from "./FluPieChart"; 
import {
  Box,
  Typography,
  CircularProgress,
  Grid,  // ✅ import Grid directly from @mui/material
} from "@mui/material";
import axios from "axios";

function DashboardUserTrends(){
  const [userTrendData, setUserTrendData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    async function fetchUserTrends() {
      if (!user) return;
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`/api/reports/user/${user.id}/aggregated`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setUserTrendData(response.data.reports.aggregated);
        console.log("Fetched user reports:", response.data);
      } catch (err) {
        console.error("error fetching user trends", err);
        setError("Failed to load user data.");
      } finally {
        setLoading(false);
      }
    }
    fetchUserTrends();
  }, [user]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) return <Typography color="error">{error}</Typography>;
  if (!userTrendData) return <Typography>No user data available.</Typography>;

  // --- Transform Data ---
  const categoryData = Object.entries(userTrendData.categoryCounts).map(([label, count]) => ({ label, count }));
  const symptomData = Object.entries(userTrendData.symptomCounts).map(([label, count]) => ({ label, count }));
  const severityData = Object.entries(userTrendData.severityCounts).map(([label, count]) => ({ label, count }));
  const stateData = Object.entries(userTrendData.stateLocationCounts).map(([label, count]) => ({ label, count }));
  const zipData = Object.entries(userTrendData.zipLocationCounts).map(([label, count]) => ({ label, count }));

  return (
    <Box sx={{ mt: 6 }}>
      <Typography variant="h4" gutterBottom textAlign="center" sx={{ mb: 3 }}>
         Health Reports Dashboard for {user.username}
      </Typography>

     <Grid container spacing={3}>
  <Grid size={{ xs: 12, md: 6 }}>
    <FluPieChart title={`${user.username}'s symptoms by Category`} data={categoryData} nameKey="label" dataKey="count" />
  </Grid>
  <Grid size={{ xs: 12, md: 6 }}>
    <FluPieChart title={` ${user.username}'s Total Symptom Reports`} data={symptomData} nameKey="label" dataKey="count" />
  </Grid>
  <Grid size={{ xs: 12, md: 6 }}>
    <FluPieChart
      title={`Report Severity Levels for ${user.username}`}
      data={severityData}
      nameKey="label"
      dataKey="count"
      colors={["#0056A4", "#FF9800", "#E63946"]}
    />
  </Grid>
  <Grid size={{ xs: 12, md: 6 }}>
    <FluPieChart title={`${user.username}'s Reports by State`} $ data={stateData} nameKey="label" dataKey="count" />
  </Grid>
  <Grid size={{ xs: 12, md: 6 }}>
    <FluPieChart title={`${user.username}'s Reports by Zip`} data={zipData} nameKey="label" dataKey="count" />
  </Grid>
</Grid>

    </Box>
  );
}

export default DashboardUserTrends;

