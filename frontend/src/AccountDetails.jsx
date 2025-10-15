import { Box, Typography, Paper, Grid } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

function AccountDetails({ user }) {
  if (!user) {
    return <Typography>No account details available.</Typography>;
  }

  return (
    <Paper sx={{ p: 3, mt: 4 }}>
      <Box display="flex" alignItems="center" gap={2} sx={{ mb: 3 }}>
        <AccountCircleIcon fontSize="large" color="primary" />
        <Typography variant="h5" fontWeight={600}>
          Account Information
        </Typography>
      </Box>

      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Typography variant="subtitle2" color="text.secondary">
            Username
          </Typography>
          <Typography variant="body1">{user.username}</Typography>
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography variant="subtitle2" color="text.secondary">
            First Name
          </Typography>
          <Typography variant="body1">{user.first_name}</Typography>
        </Grid>

         <Grid item xs={12} md={6}>
          <Typography variant="subtitle2" color="text.secondary">
            Last Name
            </Typography>
          <Typography variant="body1">{user.last_name}</Typography>
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography variant="subtitle2" color="text.secondary">
            Age
          </Typography>
          <Typography variant="body1">{user.age}</Typography>
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography variant="subtitle2" color="text.secondary">
            Zipcode
          </Typography>
          <Typography variant="body1">{user.zipcode}</Typography>
        </Grid>

         <Grid item xs={12} md={6}>
          <Typography variant="subtitle2" color="text.secondary">
            US State
          </Typography>
          <Typography variant="body1">{user.state}</Typography>
        </Grid>

        <Grid item xs={12} md={6}>
          <Typography variant="subtitle2" color="text.secondary">
            Created at
          </Typography>
          <Typography variant="body1">{user.created_at}</Typography>
        </Grid>        
      </Grid>
    </Paper>
  );
}

export default AccountDetails;
