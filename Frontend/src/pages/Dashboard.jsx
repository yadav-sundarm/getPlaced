import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Card,
  CardActionArea,
} from "@mui/material";
import {
  TrendingUp,
  AssignmentOutlined,
  CodeOutlined,
  DescriptionOutlined,
  GroupOutlined,
  Calculate,
  AccessTimeOutlined,
} from "@mui/icons-material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const theme = createTheme({
  palette: { primary: { main: "#6366F1" }, secondary: { main: "#10B981" } },
  typography: { fontFamily: "Inter, sans-serif" },
});

const Dashboard = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const firstName = user?.firstName || "User";
  const baseURL = import.meta.env.VITE_BASE_URL || "http://localhost:8000"

  const [scores, setScores] = useState({
    aptitudeScore: null,
    dsaScore: null,
    communicationScore: null,
    recentActivity: [],
  });
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `${baseURL}/api/users/dashboard-stats`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        setScores(res.data);
      } catch (err) {
        console.error("Failed to fetch dashboard stats", err);
      }
    };
    fetchStats();
  }, []);

  const kpiData = [
    { label: "Aptitude Score", value: scores.aptitudeScore, color: "#6366F1" },
    { label: "DSA Solved", value: scores.dsaScore, color: "#10B981" },
    {
      label: "Communication",
      value: scores.communicationScore,
      color: "#F59E0B",
    },
  ];

  const quickActions = [
    {
      icon: <AssignmentOutlined sx={{ fontSize: 40, color: "white" }} />,
      label: "Start Mock",
      color: "#6366F1",
      path: "/mock-interviews",
    },
    {
      icon: <DescriptionOutlined sx={{ fontSize: 40, color: "white" }} />,
      label: "Analyze Resume",
      color: "#10B981",
      path: "/resume-analyzer",
    },
    {
      icon: <CodeOutlined sx={{ fontSize: 40, color: "white" }} />,
      label: "Practice DSA",
      color: "#F59E0B",
      path: "/dsa-practice",
    },
    {
      icon: <GroupOutlined sx={{ fontSize: 40, color: "white" }} />,
      label: "Book GD",
      color: "#EF4444",
      path: "/group-discussion",
    },
    {
      icon: <Calculate sx={{ fontSize: 40, color: "white" }} />,
      label: "Practice Aptitude",
      color: "#A855F7",
      path: "/aptitude-questions",
    },
  ];

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          width: "100%",
          bgcolor: "#F9FAFB",
          display: "flex",
          justifyContent: "center",
          py: { xs: 3, md: 5 },
        }}
      >
        <Container maxWidth="md">
          {/* Welcome */}
          <Box sx={{ mb: 5 }}>
            <Typography
              sx={{
                fontWeight: 700,
                fontSize: { xs: "1.75rem", md: "2.25rem" },
                color: "#111827",
                mb: 0.5,
              }}
            >
              Welcome back,{" "}
              <span style={{ color: "#6366F1" }}>{firstName}</span>! 👋
            </Typography>
            <Typography sx={{ color: "#6B7280", fontSize: "1rem" }}>
              Let's continue your placement prep
            </Typography>
          </Box>
          {/* KPI Cards — equal width using CSS grid */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 3,
              mb: 5,
            }}
          >
            {kpiData.map((kpi, i) => (
              <Paper
                key={i}
                elevation={0}
                sx={{
                  p: 3,
                  border: "1px solid #E5E7EB",
                  borderRadius: 3,
                  textAlign: "center",
                  bgcolor: "white",
                }}
              >
                <Typography
                  sx={{ color: "#6B7280", fontSize: "0.9rem", mb: 1 }}
                >
                  {kpi.label}
                </Typography>
                <Typography
                  sx={{
                    fontWeight: 700,
                    color: kpi.color,
                    fontSize: "2.5rem",
                    mb: 1,
                  }}
                >
                  {kpi.value === null
                    ? "—"
                    : kpi.label === "DSA Solved"
                      ? `${kpi.value}`
                      : `${kpi.value}%`}{" "}
                </Typography>
                {kpi.value !== null && kpi.value > 0 && (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      gap: 0.5,
                    }}
                  >
                    <TrendingUp sx={{ fontSize: 16, color: "#10B981" }} />
                    <Typography sx={{ color: "#10B981", fontSize: "0.85rem" }}>
                      Keep it up!
                    </Typography>
                  </Box>
                )}
                {kpi.value === 0 && (
                  <Typography sx={{ color: "#9CA3AF", fontSize: "0.82rem" }}>
                    No activity yet
                  </Typography>
                )}
              </Paper>
            ))}
          </Box>
          {/* Quick Actions — CSS grid, all equal */}
          <Typography
            sx={{
              fontWeight: 700,
              fontSize: "1.3rem",
              color: "#111827",
              mb: 2.5,
            }}
          >
            Quick Actions
          </Typography>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(5, 1fr)",
              gap: 2,
              mb: 5,
            }}
          >
            {quickActions.map((action, i) => (
              <Card
                key={i}
                elevation={0}
                sx={{
                  bgcolor: action.color,
                  borderRadius: 2.5,
                  transition: "transform 0.2s, box-shadow 0.2s",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
                  },
                }}
              >
                <CardActionArea
                  onClick={() => navigate(action.path)}
                  sx={{
                    height: "130px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: 1.2,
                    p: 1.5,
                  }}
                >
                  {action.icon}
                  <Typography
                    sx={{
                      fontWeight: 600,
                      fontSize: "0.82rem",
                      color: "white",
                      textAlign: "center",
                      lineHeight: 1.2,
                    }}
                  >
                    {action.label}
                  </Typography>
                </CardActionArea>
              </Card>
            ))}
          </Box>

          <Typography
            sx={{
              fontWeight: 700,
              fontSize: "1.3rem",
              color: "#111827",
              mb: 2.5,
            }}
          >
            Recent Activity
          </Typography>
          {scores.recentActivity.length === 0 ? (
            <Paper
              elevation={0}
              sx={{
                p: 3,
                border: "1px solid #E5E7EB",
                borderRadius: 3,
                bgcolor: "white",
                textAlign: "center",
              }}
            >
              <Typography sx={{ color: "#9CA3AF" }}>
                No activity yet — start practicing!
              </Typography>
            </Paper>
          ) : (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {scores.recentActivity.map((item, i) => (
                <Paper
                  key={i}
                  elevation={0}
                  sx={{
                    p: 2.5,
                    border: "1px solid #E5E7EB",
                    borderRadius: 3,
                    bgcolor: "white",
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                  }}
                >
                  {/* Icon */}
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: 2,
                      bgcolor: item.type === "dsa" ? "#FEF3C7" : "#EEF2FF",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    {item.type === "dsa" ? (
                      <CodeOutlined sx={{ color: "#F59E0B" }} />
                    ) : (
                      <AssignmentOutlined sx={{ color: "#6366F1" }} />
                    )}
                  </Box>

                  {/* Text */}
                  <Box sx={{ flex: 1 }}>
                    <Typography
                      sx={{
                        fontWeight: 600,
                        color: "#111827",
                        fontSize: "0.95rem",
                      }}
                    >
                      {item.label}
                    </Typography>
                    <Typography sx={{ color: "#6B7280", fontSize: "0.82rem" }}>
                      {item.type === "dsa"
                        ? `Difficulty: ${item.difficulty}`
                        : `Score: ${item.score}`}
                    </Typography>
                  </Box>

                  {/* Time */}
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <AccessTimeOutlined
                      sx={{ fontSize: 14, color: "#9CA3AF" }}
                    />
                    <Typography sx={{ color: "#9CA3AF", fontSize: "0.8rem" }}>
                      {new Date(item.time).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                      })}
                    </Typography>
                  </Box>
                </Paper>
              ))}
            </Box>
          )}
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default Dashboard;
