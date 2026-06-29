import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  TextField,
  Typography,
  Stack,
  Alert,
  MenuItem,
  Checkbox,
} from "@mui/material";

import SchoolIcon from "@mui/icons-material/School";
import CodeIcon from "@mui/icons-material/Code";
import PsychologyIcon from "@mui/icons-material/Psychology";
import RecordVoiceOverIcon from "@mui/icons-material/RecordVoiceOver";
import GroupsIcon from "@mui/icons-material/Groups";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { loginUser, signupUser } from "../api/auth.api";

const departments = ["CSE", "IT", "AIML", "DS", "EXTC", "MTECH", "MCA"];
const batchYears = [2024, 2025, 2026, 2027];

const features = [
  { title: "Aptitude", desc: "Practice & improve", icon: <SchoolIcon /> },
  { title: "DSA", desc: "Master problem solving", icon: <CodeIcon /> },
  {
    title: "Mock Interviews",
    desc: "Real-time experience",
    icon: <RecordVoiceOverIcon />,
  },
  { title: "Resume Analyzer", desc: "AI feedback", icon: <PsychologyIcon /> },
  {
    title: "Group Discussions",
    desc: "Communication skills",
    icon: <GroupsIcon />,
  },
];

export default function LoginSignup() {
  const [mode, setMode] = useState("login");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    batchYear: "",
    department: "",
  });

  const navigate = useNavigate();

  const handleChange = (key) => (e) =>
    setForm({ ...form, [key]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (mode === "login") {
        const res = await loginUser({
          email: form.email,
          password: form.password,
        });
        localStorage.setItem("token", res.data.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.data.user));
        navigate("/dashboard");
        return;
      }
      const res = await signupUser({
        ...form,
        batchYear: Number(form.batchYear),
      });
      localStorage.setItem("token", res.data.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.data.user));
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#f4f2ee",
        display: "flex",
        alignItems: "center",
      }}
    >
      <Container maxWidth="lg">
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={8}
          alignItems="center"
          justifyContent="center"
        >
          {/* LEFT */}
          <Box flex={1}>
            <Typography variant="h2" fontWeight={900}>
              <span style={{ color: "#111827" }}>Get</span>
              <span style={{ color: "#5b5ce2" }}>Placed</span>
            </Typography>

            <Typography mt={2} fontSize="1.3rem" color="#6b7280">
              All your placement prep,
              <span style={{ color: "#5b5ce2", fontWeight: 600 }}>
                {" "}
                in one place.
              </span>
            </Typography>

            <Typography mt={2} color="#6b7280" maxWidth={420}>
              Practice smarter, prepare better and get placed in your dream
              company.
            </Typography>

            <Stack direction="row" flexWrap="wrap" gap={2} mt={4}>
              {features.map((item) => (
                <Box
                  key={item.title}
                  sx={{
                    px: 3,
                    py: 2,
                    borderRadius: "20px",
                    bgcolor: "#ffffff",
                    minWidth: "200px",
                    boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
                    border: "1px solid #ececec",
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    color: "#6b7280",
                  }}
                >
                  <Box
                    sx={{
                      color: "#5b5ce2",
                      bgcolor: "#eef2ff",
                      p: 1,
                      borderRadius: "10px",
                    }}
                  >
                    {item.icon}
                  </Box>
                  <Box>
                    <Typography fontWeight={600}>{item.title}</Typography>
                    <Typography fontSize="0.8rem" color="#6b7280">
                      {item.desc}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Stack>
          </Box>

          {/* DIVIDER */}
          <Box
            sx={{
              display: { xs: "none", md: "block" },
              width: "2px",
              height: "380px",
              background:
                "linear-gradient(to bottom, transparent, #d1d5db, transparent)",
              opacity: 0.8,
            }}
          />

          {/* RIGHT */}
          <Box flex={1} maxWidth={420} width="100%">
            <Card
              sx={{
                borderRadius: "28px",
                bgcolor: "#f3f4f6",
                boxShadow: "0px 20px 40px rgba(0,0,0,0.08)",
                p: 2,
              }}
            >
              <CardContent sx={{ p: 3 }}>
                {/* TOGGLE */}
                {/* TOGGLE */}
                <Stack
                  direction="row"
                  sx={{
                    mb: 3,
                    bgcolor: "#d1d5db",
                    borderRadius: "14px",
                    p: "4px",
                    gap: "4px",
                  }}
                >
                  {["login", "signup"].map((tab) => (
                    <Box
                      key={tab}
                      onClick={() => setMode(tab)}
                      sx={{
                        flex: 1,
                        textAlign: "center",
                        py: 1,
                        borderRadius: "10px",
                        cursor: "pointer",
                        fontWeight: 700,
                        fontSize: "0.85rem",
                        letterSpacing: "0.05em",
                        transition: "all 0.2s ease",
                        bgcolor: mode === tab ? "#f3f4f6" : "transparent",
                        color: mode === tab ? "#5b5ce2" : "#9ca3af",
                        boxShadow:
                          mode === tab ? "0 1px 4px rgba(0,0,0,0.1)" : "none",
                      }}
                    >
                      {tab === "login" ? "LOGIN" : "SIGN UP"}
                    </Box>
                  ))}
                </Stack>

                {error && (
                  <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                  </Alert>
                )}

                <form onSubmit={handleSubmit}>
                  <Stack spacing={1.5}>
                    {mode === "signup" && (
                      <>
                        {/* ✅ Row 1: First + Last name side by side */}
                        <Stack direction="row" spacing={1.5}>
                          <TextField
                            label="First Name"
                            fullWidth
                            size="small"
                            onChange={handleChange("firstName")}
                          />
                          <TextField
                            label="Last Name"
                            fullWidth
                            size="small"
                            onChange={handleChange("lastName")}
                          />
                        </Stack>

                        {/* ✅ Row 2: Batch Year + Department side by side */}
                        <Stack direction="row" spacing={1.5}>
                          <TextField
                            select
                            label="Batch Year"
                            fullWidth
                            size="small"
                            onChange={handleChange("batchYear")}
                          >
                            {batchYears.map((y) => (
                              <MenuItem key={y} value={y}>
                                {y}
                              </MenuItem>
                            ))}
                          </TextField>
                          <TextField
                            select
                            label="Department"
                            fullWidth
                            size="small"
                            onChange={handleChange("department")}
                          >
                            {departments.map((d) => (
                              <MenuItem key={d} value={d}>
                                {d}
                              </MenuItem>
                            ))}
                          </TextField>
                        </Stack>
                      </>
                    )}

                    <TextField
                      label="Email"
                      fullWidth
                      size={mode === "signup" ? "small" : "medium"}
                      onChange={handleChange("email")}
                    />
                    <TextField
                      label="Password"
                      type={showPassword ? "text" : "password"}
                      onChange={handleChange("password")}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => setShowPassword(!showPassword)}
                              disableRipple
                              sx={{
                                p: 0,
                                border: "none",
                                boxShadow: "none",
                                "&:hover": {
                                  background: "transparent",
                                },
                                "&:focus": {
                                  outline: "none",
                                },
                              }}
                            >
                              {showPassword ? (
                                <Visibility />
                              ) : (
                                <VisibilityOff />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                    <Button
                      type="submit"
                      fullWidth
                      sx={{
                        mt: 1,
                        py: 1.4,
                        borderRadius: "20px",
                        fontWeight: 600,
                        fontSize: "1rem",
                        background: "linear-gradient(90deg, #6366F1, #5b5ce2)",
                        color: "white",
                        boxShadow: "0 6px 20px rgba(99,102,241,0.4)",
                      }}
                    >
                      {mode === "login" ? "Login →" : "Create Account"}
                    </Button>
                  </Stack>
                </form>
              </CardContent>
            </Card>

            <Box
              onClick={() => navigate("/admin/login")}
              sx={{
                mt: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 0.8,
                cursor: "pointer",
                opacity: 0.45,
                transition: "opacity 0.2s",
                "&:hover": { opacity: 1 },
              }}
            >
              <AdminPanelSettingsIcon sx={{ fontSize: 15, color: "#6b7280" }} />
              <Typography fontSize="0.78rem" color="#6b7280">
                Admin Portal
              </Typography>
            </Box>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
}
