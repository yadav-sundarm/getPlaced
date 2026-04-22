import { useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Card,
  Stack,
  Avatar,
  Grid,
  Button,
} from "@mui/material";

const SettingsPage = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f8fafc", py: 5 }}>
      <Container maxWidth="lg">
        {/* HEADER */}
        <Typography variant="h4" fontWeight={700}>
          Account Settings
        </Typography>
        <Typography color="text.secondary" mb={4}>
          Manage your profile and academic information
        </Typography>

        <Card
          sx={{
            p: 4,
            borderRadius: "24px",
            boxShadow: "0 20px 40px rgba(0,0,0,0.06)",
          }}
        >
          <Stack spacing={4}>

            {/* PROFILE */}
            <Stack direction="row" spacing={3} alignItems="center">
              <Avatar
                sx={{
                  width: 80,
                  height: 80,
                  fontSize: "2rem",
                  fontWeight: 700,
                  background:
                    "linear-gradient(135deg, #6366F1, #8B5CF6)",
                }}
              >
                {user?.firstName?.[0] || "U"}
              </Avatar>

              <Box>
                <Typography fontWeight={700} fontSize="1.3rem">
                  {user?.firstName}
                </Typography>
                <Typography color="text.secondary">
                  {user?.email}
                </Typography>
              </Box>
            </Stack>

            {/* PERSONAL INFO */}
            <Box>
              <Typography fontWeight={600} mb={2}>
                Academic Information
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <InfoBox label="Full Name" value={user?.firstName} />
                </Grid>

                <Grid item xs={12} md={6}>
                  <InfoBox label="Email" value={user?.email} />
                </Grid>

                <Grid item xs={12} md={6}>
                  <InfoBox label="Course" value={user?.course || "N/A"} />
                </Grid>

                <Grid item xs={12} md={6}>
                  <InfoBox label="Department" value={user?.department || "N/A"} />
                </Grid>

                <Grid item xs={12} md={6}>
                  <InfoBox label="Batch Year" value={user?.batchYear || "N/A"} />
                </Grid>

                <Grid item xs={12} md={6}>
                  <InfoBox label="Role" value={user?.role || "student"} />
                </Grid>
              </Grid>
            </Box>

            {/* ACTION */}
            <Box textAlign="right">
              <Button
                onClick={handleLogout}
                sx={{
                  background: "#ef4444",
                  color: "white",
                  px: 4,
                  py: 1,
                  borderRadius: "20px",
                  fontWeight: 600,
                  "&:hover": {
                    background: "#dc2626",
                  },
                }}
              >
                Logout
              </Button>
            </Box>

          </Stack>
        </Card>
      </Container>
    </Box>
  );
};

/* 🔹 Info Box Component */
const InfoBox = ({ label, value }) => (
  <Box
    sx={{
      p: 2.5,
      borderRadius: "14px",
      border: "1px solid #e5e7eb",
      background: "#ffffff",
    }}
  >
    <Typography fontSize="0.85rem" color="#6b7280" mb={0.5}>
      {label}
    </Typography>
    <Typography fontWeight={600}>{value || "-"}</Typography>
  </Box>
);

export default SettingsPage;