import React, { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Alert,
  InputAdornment,
  IconButton,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  AdminPanelSettings,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

const AdminLogin = () => {
  // Force body/html to be scrollable — overrides any leftover styles from student Layout
  React.useEffect(() => {
    document.documentElement.style.overflow = "auto";
    document.documentElement.style.height = "auto";
    document.body.style.overflow = "auto";
    document.body.style.height = "auto";
    return () => {
      document.documentElement.style.overflow = "";
      document.documentElement.style.height = "";
      document.body.style.overflow = "";
      document.body.style.height = "";
    };
  }, []);

  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      setError("Both fields are required");
      return;
    }

    setLoading(true);
    try {
      const { data } = await axios.post(`${API_BASE}/api/users/login`, form);
      const { token, user } = data.data;

      if (user.role !== "admin") {
        setError("Access denied. This portal is for admins only.");
        return;
      }

      localStorage.setItem("adminToken", token);
      localStorage.setItem("adminUser", JSON.stringify(user));
      navigate("/admin/dashboard");
    } catch (err) {
      setError(
        err?.response?.data?.message || "Login failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4338ca 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          width: "100%",
          maxWidth: 420,
          p: { xs: 3, md: 5 },
          borderRadius: "20px",
          border: "1px solid rgba(255,255,255,0.1)",
          backgroundColor: "rgba(255,255,255,0.97)",
        }}
      >
        {/* Icon + Title */}
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Box
            sx={{
              width: 64,
              height: 64,
              bgcolor: "#4f46e5",
              borderRadius: "16px",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              mb: 2,
            }}
          >
            <AdminPanelSettings sx={{ color: "#fff", fontSize: 36 }} />
          </Box>
          <Typography variant="h5" fontWeight={800} color="#111827">
            Admin Portal
          </Typography>
          <Typography variant="body2" color="#6b7280" mt={0.5}>
            GetPlaced · VESIT
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2, borderRadius: "10px" }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField
            fullWidth
            label="Admin Email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            sx={{ mb: 2.5 }}
          />

          <TextField
            fullWidth
            label="Password"
            name="password"
            type={showPass ? "text" : "password"}
            value={form.password}
            onChange={handleChange}
            sx={{ mb: 3 }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    edge="end"
                    disableRipple
                    disableFocusRipple
                    onClick={() => setShowPass(!showPass)}
                    sx={{
                      p: 0,
                      m: 0,
                      border: "none",
                      borderRadius: 0,
                      backgroundColor: "transparent",
                      boxShadow: "none",
                      "&:hover": {
                        backgroundColor: "transparent",
                      },
                      "&:focus": {
                        outline: "none",
                      },
                    }}
                  >
                    {showPass ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={loading}
            sx={{
              borderRadius: "12px",
              py: 1.5,
              fontWeight: 700,
              fontSize: "15px",
              textTransform: "none",
              background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
              "&:hover": {
                background: "linear-gradient(135deg, #4338ca, #6d28d9)",
              },
            }}
          >
            {loading ? (
              <CircularProgress size={22} sx={{ color: "#fff" }} />
            ) : (
              "Sign In"
            )}
          </Button>
        </Box>

        <Typography
          variant="caption"
          color="#9ca3af"
          textAlign="center"
          display="block"
          mt={3}
        >
          Student? Go to the{" "}
          <Box
            component="span"
            sx={{ color: "#4f46e5", cursor: "pointer", fontWeight: 600 }}
            onClick={() => navigate("/")}
          >
            student portal
          </Box>
        </Typography>
      </Paper>
    </Box>
  );
};

export default AdminLogin;
