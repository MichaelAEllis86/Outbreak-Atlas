// frontend/src/UpdateReportPage.jsx
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { CircularProgress, Alert, Container, Typography, Box } from "@mui/material"
import axios from "axios";
import UpdateReportForm from "./UpdateReportForm";

function UpdateReportPage() {                      
  const { reportId } = useParams();
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchReport() {
        setLoading(true);
        setError(null);
      try {
            const response = await axios.get(`/api/reports/${reportId}`, 
                {headers: {  Authorization: `Bearer ${localStorage.getItem("token")}`}//include token in request 
                });
            setReportData(response.data.report);
            console.log("fetched report data to edit/update--->", response.data.report)
        }
        catch (err) {
            console.error("error fetching report to edit/update", err);
            setError("Failed to load report data.");
        }
        finally {
            setLoading(false);
        }
    }
    fetchReport();}, [reportId]);

    if (loading) {
  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
      <CircularProgress />
    </Box>
  );
}

if (error) {
  return (
    <Container maxWidth="sm">
      <Alert severity="error">{error}</Alert>
    </Container>
  );
}

return (
  <Container maxWidth="sm">
    {reportData && <UpdateReportForm previousReport={reportData} />}
  </Container>
);

}

export default UpdateReportPage;