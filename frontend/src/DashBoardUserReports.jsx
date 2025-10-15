// frontend/src/DashboardUserReports.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import axios from "axios";
import {
  Box,
  Typography,
  CircularProgress,
  Button,
  Snackbar,
  Alert,
} from "@mui/material";
import Pagination from "@mui/material/Pagination";
import { DataGrid } from "@mui/x-data-grid";

function DashboardUserReports() {
  const [userReports, setUserReports] = useState([]);
  const [page, setPage]=useState(1)
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  // Snackbar state
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success", // "success" | "error" | "info" | "warning"
  });

  const handleSnackbarClose = () =>
    setSnackbar((prev) => ({ ...prev, open: false }));

  const handleEdit = (reportId) => {
    navigate(`/update-report/${reportId}`);
  };

  const handleDelete = async (reportId) => {
    if (!window.confirm("Are you sure you want to delete this report?")) return;

    try {
      await axios.delete(`/api/reports/${reportId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      // ✅ Remove deleted report from state
      setUserReports((prev) => prev.filter((r) => r.id !== reportId));

      // ✅ Show success snackbar
      setSnackbar({
        open: true,
        message: "Report deleted successfully.",
        severity: "success",
      });
    } catch (err) {
      console.error("Error deleting report", err);
      setSnackbar({
        open: true,
        message: "Failed to delete report.",
        severity: "error",
      });
    }
  };

  useEffect(() => {
    async function fetchUserReports() {
      if (!user) return;
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`/api/reports/user/${user.id}?page=${page}&limit=10`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setUserReports(response.data.reports);
        console.log("Fetched total user reports:", response.data.reports);
        setTotalPages(response.data.totalPages)
        console.log("fetched the total pages:", response.data.totalPages)
      } catch (err) {
        console.error("Error fetching user reports", err);
        setError("Failed to load user data.");
      } finally {
        setLoading(false);
      }
    }
    fetchUserReports();
  }, [user, page]);

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) return <Typography color="error">{error}</Typography>;
  // if (!userReports.length) return <Typography>No user reports available.</Typography>;

  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    {
      field: "created_at",
      headerName: "Created_at",
      width: 180,
      
    },
    { field: "primary_symptom", headerName: "Primary Symptom", width: 160 },
    { field: "severity", headerName: "Severity", width: 120 },
    { field: "temperature", headerName: "Temp (°F)", width: 120 },
    { field: "zipcode", headerName: "Zip", width: 100 },
    { field: "state", headerName: "State", width: 100 },
    { field: "notes", headerName: "Notes", width: 200 },
    {
      field: "actions",
      headerName: "Actions",
      width: 240,
      sortable: false,
      renderCell: (params) => (
        <Box display="flex" gap={1}>
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={() => handleEdit(params.row.id)}
          >
            Edit
          </Button>
          <Button
            variant="outlined"
            color="error"
            size="small"
            onClick={() => handleDelete(params.row.id)}
          >
            Delete
          </Button>
        </Box>
      ),
    },
  ];

  return (
   <Box sx={{ width: "100%", mt: 4 }}>
  <Typography variant="h5" gutterBottom>
    Your Reports
  </Typography>

  <DataGrid
    rows={userReports}
    columns={columns}
    disableRowSelectionOnClick
    hideFooter
    rowHeight={52}
    sx={{
      border: 'none',
    }}
  />

  <Box display="flex" justifyContent="center" mt={2}>
    <Pagination
      count={totalPages}
      page={page}
      onChange={handlePageChange}
      color="primary"
      shape="rounded"
    />
  </Box>

  <Snackbar
    open={snackbar.open}
    autoHideDuration={4000}
    onClose={handleSnackbarClose}
    anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
  >
    <Alert severity={snackbar.severity} onClose={handleSnackbarClose} sx={{ width: '100%' }}>
      {snackbar.message}
    </Alert>
  </Snackbar>
</Box>

  );
}

export default DashboardUserReports;

