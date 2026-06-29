import "../ResumeAnalyzer.css";
import React, { useState } from "react";

import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Button,
  Chip,
  LinearProgress,
  Alert,
} from "@mui/material";

import { CloudUploadOutlined } from "@mui/icons-material";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: { main: "#6366F1" },
    secondary: { main: "#10B981" },
  },
  typography: { fontFamily: "Inter, sans-serif" },
});

const ResumeAnalyzer = () => {
  const [analyzed, setAnalyzed] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [atsScore, setAtsScore] = useState(0);
  const [verdict, setVerdict] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setError("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("http://localhost:8000/api/resume/analyze", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Resume analysis failed. Please try again.");
        return;
      }

      setAtsScore(data.atsScore);
      setVerdict(data.verdict);
      setSuggestions(data.suggestions);
      setAnalyzed(true);
    } catch (err) {
      setError("Gemini is currently overloaded. Please try again in a moment.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box className="resume-root" py={{ xs: 3, md: 5 }}>
        <Container maxWidth="md">
          {/* Header */}
          <Box mb={4}>
            <Typography variant="h4" fontWeight={700} sx={{ color: "#111827" }}>
              Resume <span style={{ color: "#6366F1" }}>Analyzer</span>{" "}
            </Typography>

            <Typography sx={{ color: "#6B7280" }}>
              Get your ATS score and improvement suggestions.
            </Typography>
          </Box>
          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: "12px" }}>
              {error}
            </Alert>
          )}
          {/* Upload Box */}
          {!analyzed && (
            <Paper className="upload-box" elevation={0}>
              <CloudUploadOutlined sx={{ fontSize: 56, color: "#6366F1" }} />

              <Typography fontWeight={600}>
                {uploading ? "Analyzing..." : "Drag & drop your resume"}
              </Typography>

              <Typography color="#6B7280">
                or click to browse (PDF, DOC, DOCX)
              </Typography>

              {uploading ? (
                <LinearProgress
                  sx={{ width: "60%", height: 8, borderRadius: 4 }}
                />
              ) : (
                <Button variant="contained" component="label">
                  Choose File
                  <input hidden type="file" onChange={handleUpload} />
                </Button>
              )}
            </Paper>
          )}

          {/* Results */}
          {analyzed && (
            <Box className="fade-in">
              {/* ATS SCORE CARD */}
              <Paper
                className="ats-card"
                sx={{
                  width: "100%",
                  mb: 4,
                }}
              >
                <Typography sx={{ opacity: 0.9 }}>
                  ATS Compatibility Score
                </Typography>

                <Typography variant="h2" fontWeight={800}>
                  <span style={{ color: "#6366F1" }}>{atsScore}</span>
                  <span style={{ fontSize: "1.4rem" }}>/100</span>
                </Typography>

                <Typography sx={{ opacity: 0.9, mb: 2 }}>{verdict}</Typography>
              </Paper>

              {/* SUGGESTIONS */}
              <Box mt={4}>
                <Typography
                  variant="h6"
                  fontWeight={700}
                  mb={2}
                  sx={{ textAlign: "left", color: "#111827" }}
                >
                  Top Suggestions :
                </Typography>

                {suggestions.map((item, idx) => (
                  <Paper
                    key={idx}
                    className="suggestion-card"
                    sx={{
                      width: "100%",
                      borderLeft: `6px solid ${
                        item.impact === "HIGH"
                          ? "#EF4444"
                          : item.impact === "MEDIUM"
                            ? "#F59E0B"
                            : "#10B981"
                      }`,
                    }}
                  >
                    <Chip
                      label={`${item.impact} IMPACT`}
                      size="small"
                      className={`impact-chip ${item.impact.toLowerCase()}`}
                    />

                    <Typography fontWeight={700} mb={0.5}>
                      {item.title}
                    </Typography>

                    <Typography color="text.secondary" mb={1}>
                      {item.description}
                    </Typography>

                    {item.before && (
                      <Typography className="before-text">
                        Before: "{item.before}"
                      </Typography>
                    )}

                    {item.after && (
                      <Typography className="after-text">
                        After: "{item.after}"
                      </Typography>
                    )}
                  </Paper>
                ))}
              </Box>

              <Box textAlign="center" mt={4}>
                <Button onClick={() => setAnalyzed(false)}>
                  Analyze another resume
                </Button>
              </Box>
            </Box>
          )}
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default ResumeAnalyzer;
