import React, { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Grid,
  Button,
  Avatar,
  Chip,
  CircularProgress,
  Alert,
} from "@mui/material";
import {
  HourglassEmpty,
  CheckCircle,
  Cancel,
  Business,
  UploadFile,
  List as ListIcon,
  Logout,
  AdminPanelSettings,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

const StatCard = ({ icon: Icon, label, value, color, bg }) => (
  <Paper
    elevation={0}
    sx={{
      p: 3,
      borderRadius: "16px",
      border: "1px solid #e5e7eb",
      display: "flex",
      alignItems: "center",
      gap: 2.5,
    }}
  >
    <Box
      sx={{
        width: 52,
        height: 52,
        borderRadius: "12px",
        bgcolor: bg,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      <Icon sx={{ color, fontSize: 28 }} />
    </Box>
    <Box>
      <Typography variant="h4" fontWeight={800} color="#111827">
        {value ?? "–"}
      </Typography>
      <Typography variant="body2" color="#6b7280" fontWeight={500}>
        {label}
      </Typography>
    </Box>
  </Paper>
);

const ActionCard = ({ children }) => (
  <Paper
    elevation={0}
    sx={{
      p: 4,
      borderRadius: "16px",
      border: "1px solid #e5e7eb",
      display: "flex",
      flexDirection: "column",
      gap: 2,
      // flex: "1 1 300px" lets each card grow equally and wrap below 300px each
      flex: "1 1 300px",
    }}
  >
    {children}
  </Paper>
);

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const adminUser = (() => {
    try {
      return JSON.parse(localStorage.getItem("adminUser") || "{}");
    } catch {
      return {};
    }
  })();
  const token = localStorage.getItem("adminToken");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await axios.get(`${API_BASE}/api/admin/stats`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStats(data.data);
      } catch {
        setError("Failed to load stats. Please refresh.");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
    navigate("/admin/login");
  };

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflowY: "auto",
        bgcolor: "#f9fafb",
        zIndex: 1300,
      }}
    >
      {/* Sticky top bar */}
      <Box
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 10,
          bgcolor: "#fff",
          borderBottom: "1px solid #e5e7eb",
          px: { xs: 2, md: 4 },
          py: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box
            sx={{
              width: 36,
              height: 36,
              bgcolor: "#4f46e5",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <AdminPanelSettings sx={{ color: "#fff", fontSize: 22 }} />
          </Box>
          <Typography fontWeight={800} fontSize="18px" color="#111827">
            GetPlaced Admin
          </Typography>
          <Chip
            label="VESIT"
            size="small"
            sx={{ ml: 1, bgcolor: "#eef2ff", color: "#4f46e5", fontWeight: 600 }}
          />
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Avatar sx={{ width: 34, height: 34, bgcolor: "#4f46e5", fontSize: 14, fontWeight: 700 }}>
            {adminUser.firstName?.[0] || "A"}
          </Avatar>
          <Typography
            fontSize="14px"
            fontWeight={600}
            color="#374151"
            sx={{ display: { xs: "none", sm: "block" } }}
          >
            {adminUser.firstName || "Admin"}
          </Typography>
          <Button
            size="small"
            startIcon={<Logout />}
            onClick={handleLogout}
            sx={{ textTransform: "none", color: "#6b7280" }}
          >
            Logout
          </Button>
        </Box>
      </Box>

      {/* Main content */}
      <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1100, mx: "auto" }}>
        <Typography variant="h5" fontWeight={800} color="#111827" mb={0.5}>
          Dashboard Overview
        </Typography>
        <Typography color="#6b7280" mb={4}>
          Manage student experience submissions and database content
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: "12px" }}>
            {error}
          </Alert>
        )}

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            {/* Stats — Grid is fine here since it's 4 equal cards, no overlap risk */}
            <Grid container spacing={2.5} mb={5}>
              <Grid item xs={12} sm={6} md={3}>
                <StatCard icon={HourglassEmpty} label="Pending Review" value={stats?.pending} color="#d97706" bg="#fef3c7" />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <StatCard icon={CheckCircle} label="Approved" value={stats?.approved} color="#059669" bg="#d1fae5" />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <StatCard icon={Cancel} label="Rejected" value={stats?.rejected} color="#dc2626" bg="#fee2e2" />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <StatCard icon={Business} label="Companies in DB" value={stats?.totalCompanies} color="#4f46e5" bg="#eef2ff" />
              </Grid>
            </Grid>

            {/*
              Action cards — plain flexbox, NO Grid.
              Gap handles spacing. flex:"1 1 300px" means each card grows equally
              and wraps onto its own row only when the container is narrower than ~630px.
              Zero chance of overlap.
            */}
            <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap", alignItems: "stretch" }}>
              <ActionCard>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                  <Box sx={{ bgcolor: "#eef2ff", p: 1, borderRadius: "10px" }}>
                    <ListIcon sx={{ color: "#4f46e5", fontSize: 26 }} />
                  </Box>
                  <Typography fontWeight={700} fontSize="16px">
                    Review Submissions
                  </Typography>
                </Box>
                <Typography color="#6b7280" fontSize="14px" sx={{ flexGrow: 1 }}>
                  View all pending submissions from students. Approve to push them into the Mock
                  Interview database, or reject with a note.
                </Typography>
                {stats?.pending > 0 && (
                  <Chip
                    label={`${stats.pending} awaiting review`}
                    sx={{ bgcolor: "#fef3c7", color: "#92400e", fontWeight: 600, alignSelf: "flex-start" }}
                  />
                )}
                <Button
                  variant="contained"
                  onClick={() => navigate("/admin/submissions")}
                  sx={{ borderRadius: "10px", textTransform: "none", fontWeight: 600, mt: "auto" }}
                >
                  View Submissions
                </Button>
              </ActionCard>

              <ActionCard>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                  <Box sx={{ bgcolor: "#ecfdf5", p: 1, borderRadius: "10px" }}>
                    <UploadFile sx={{ color: "#059669", fontSize: 26 }} />
                  </Box>
                  <Typography fontWeight={700} fontSize="16px">
                    Upload PDF Experience
                  </Typography>
                </Box>
                <Typography color="#6b7280" fontSize="14px" sx={{ flexGrow: 1 }}>
                  Have an interview experience document in PDF format? Upload it directly and Gemini
                  AI will parse and push it to the database instantly.
                </Typography>
                <Button
                  variant="outlined"
                  color="success"
                  onClick={() => navigate("/admin/upload-pdf")}
                  sx={{ borderRadius: "10px", textTransform: "none", fontWeight: 600, mt: "auto" }}
                >
                  Upload PDF
                </Button>
              </ActionCard>
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
};

export default AdminDashboard;
