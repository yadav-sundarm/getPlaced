import React, { useState } from "react";
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Button,
  LinearProgress,
  TextField,
  Divider,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: { main: "#6366F1" },
  },
  typography: {
    fontFamily: "Inter, sans-serif",
  },
});

const ExperienceShare = () => {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    companyName: "",
    jobProfile: "",
    totalRounds: "",
    techQuestions: "",
    hrQuestions: "",
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    setLoading(true);

    const payload = {
      companyName: formData.companyName,
      rounds: [
        {
          roundNumber: 1,
          roundType: "Technical",
          questions: formData.techQuestions.split("\n").filter(Boolean),
        },
        {
          roundNumber: 2,
          roundType: "HR",
          questions: formData.hrQuestions.split("\n").filter(Boolean),
        },
      ],
    };

    try {
      await fetch("http://localhost:8000/api/experience/share", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      setSubmitted(true);
    } catch {
      alert("Failed to share experience");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          minHeight: "100vh",
          backgroundColor: "#F9FAFB",
          py: { xs: 3, md: 6 },
        }}
      >
        <Container maxWidth="md">
          {/* Header */}
          <Box mb={4}>
            <Typography
              fontSize={{ xs: "22px", md: "26px" }}
              fontWeight={800}
              color="#111827"
            >
              Share{" "}
              <span style={{ color: "#4f46e5" }}>Interview Experience</span>
            </Typography>
            <Typography color="#6B7280" mt={0.5}>
              Help juniors by sharing real interview questions
            </Typography>
          </Box>

          {!submitted ? (
            <Paper
              elevation={0}
              sx={{
                p: { xs: 3, md: 5 },
                borderRadius: "16px",
                border: "1px solid #E5E7EB",
                backgroundColor: "#FFFFFF",
              }}
            >
              {/* Basic Info */}
              <Grid container spacing={3} mb={3}>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Company Name"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    placeholder="Company"
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Job Profile"
                    name="jobProfile"
                    value={formData.jobProfile}
                    onChange={handleChange}
                    placeholder="Role"
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Interview Rounds"
                    name="totalRounds"
                    value={formData.totalRounds}
                    onChange={handleChange}
                    placeholder="Count"
                  />
                </Grid>
              </Grid>

              <Divider sx={{ my: 4 }} />

              {/* Technical Questions */}
              <Box mb={4}>
                <Typography fontWeight={700} mb={0.5}>
                  Technical Questions
                </Typography>
                <Typography fontSize="13px" color="#6B7280" mb={1.5}>
                  One question per line
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  name="techQuestions"
                  value={formData.techQuestions}
                  onChange={handleChange}
                  placeholder="Enter technical questions"
                />
              </Box>

              {/* HR Questions */}
              <Box mb={4}>
                <Typography fontWeight={700} mb={0.5}>
                  HR Questions
                </Typography>
                <Typography fontSize="13px" color="#6B7280" mb={1.5}>
                  One question per line
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  name="hrQuestions"
                  value={formData.hrQuestions}
                  onChange={handleChange}
                  placeholder="Enter HR questions"
                />
              </Box>

              {/* Submit */}
              {loading ? (
                <LinearProgress />
              ) : (
                <Button
                  variant="contained"
                  size="large"
                  sx={{
                    mt: 2,
                    px: 4,
                    borderRadius: "10px",
                    textTransform: "none",
                    fontWeight: 600,
                  }}
                  onClick={handleSubmit}
                >
                  Share Experience
                </Button>
              )}
            </Paper>
          ) : (
            <Paper
              elevation={0}
              sx={{
                p: 5,
                textAlign: "center",
                borderRadius: "16px",
                border: "1px solid #E5E7EB",
              }}
            >
              <Typography fontWeight={800} fontSize="20px">
                Experience Shared 🎉
              </Typography>
              <Typography color="#6B7280" mt={1}>
                Thank you for helping future candidates.
              </Typography>

              <Button
                sx={{ mt: 3, textTransform: "none" }}
                onClick={() => setSubmitted(false)}
              >
                Share Another
              </Button>
            </Paper>
          )}
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default ExperienceShare;
