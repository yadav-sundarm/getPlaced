import React, { useState, useRef } from "react";
import {
  Box,
  Paper,
  Typography,
  Button,
  Alert,
  CircularProgress,
  Divider,
  Chip,
  IconButton,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import {
  UploadFile,
  CheckCircle,
  Close,
  PictureAsPdf,
  ArrowBack,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

const AdminPdfUpload = () => {
  // Force body/html to be scrollable — overrides any leftover styles from student Layout
  React.useEffect(() => {
    document.documentElement.style.overflow = 'auto';
    document.documentElement.style.height = 'auto';
    document.body.style.overflow = 'auto';
    document.body.style.height = 'auto';
    return () => {
      document.documentElement.style.overflow = '';
      document.documentElement.style.height = '';
      document.body.style.overflow = '';
      document.body.style.height = '';
    };
  }, []);

  const navigate = useNavigate();
  const token = localStorage.getItem("adminToken");
  const fileInputRef = useRef();

  const [file, setFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null); // parsed result after upload

  const pickFile = (f) => {
    if (!f) return;
    if (f.type !== "application/pdf") {
      setError("Only PDF files are accepted.");
      return;
    }
    if (f.size > 5 * 1024 * 1024) {
      setError("File size must be under 5 MB.");
      return;
    }
    setFile(f);
    setError("");
    setResult(null);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    pickFile(e.dataTransfer.files?.[0]);
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setError("");
    setResult(null);

    const formData = new FormData();
    formData.append("pdf", file);

    try {
      const { data } = await axios.post(`${API_BASE}/api/admin/upload-pdf`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      setResult(data.data);
      setFile(null);
    } catch (err) {
      setError(err?.response?.data?.message || "Upload failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f9fafb", p: { xs: 2, md: 4 } }}>
      <Box sx={{ maxWidth: 700, mx: "auto" }}>
        {/* Header */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
          <IconButton onClick={() => navigate("/admin/dashboard")} size="small">
            <ArrowBack />
          </IconButton>
          <Box>
            <Typography variant="h5" fontWeight={800} color="#111827">
              Upload PDF Experience
            </Typography>
            <Typography variant="body2" color="#6b7280">
              Gemini AI will parse the PDF and add it directly to the Mock Interview database
            </Typography>
          </Box>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2.5, borderRadius: "12px" }}>
            {error}
          </Alert>
        )}

        {/* Success result */}
        {result && (
          <Paper
            elevation={0}
            sx={{
              p: 3.5,
              mb: 3,
              borderRadius: "16px",
              border: "1px solid #bbf7d0",
              bgcolor: "#f0fdf4",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
              <CheckCircle sx={{ color: "#059669", fontSize: 28 }} />
              <Typography fontWeight={800} fontSize="17px" color="#065f46">
                Successfully added to database!
              </Typography>
            </Box>

            <Typography fontSize="14px" fontWeight={700} color="#374151" mb={0.5}>
              {result.parsed.companyName} — {result.parsed.jobProfile}
            </Typography>
            <Typography fontSize="13px" color="#6b7280" mb={2}>
              {result.parsed.totalRounds} round{result.parsed.totalRounds !== 1 ? "s" : ""} parsed
              {result.parsed.difficulty ? ` · ${result.parsed.difficulty}` : ""}
              {result.parsed.result ? ` · ${result.parsed.result}` : ""}
            </Typography>

            <Divider sx={{ my: 2 }} />

            {result.parsed.rounds?.map((round, i) => (
              <Box key={i} mb={2}>
                <Typography fontSize="13px" fontWeight={700} color="#374151" mb={0.5}>
                  Round {round.roundNumber} — {round.roundType}
                  {round.roundName ? ` (${round.roundName})` : ""}
                </Typography>
                <List dense disablePadding>
                  {round.questions.map((q, qi) => (
                    <ListItem key={qi} disableGutters sx={{ py: 0.25 }}>
                      <ListItemText
                        primary={`${qi + 1}. ${q}`}
                        primaryTypographyProps={{ fontSize: "13px", color: "#4b5563" }}
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>
            ))}

            {result.parsed.tips && (
              <Box mt={1} p={1.5} bgcolor="#fff" borderRadius="8px" border="1px solid #e5e7eb">
                <Typography fontSize="13px" fontWeight={600}>Tips:</Typography>
                <Typography fontSize="13px" color="#6b7280">{result.parsed.tips}</Typography>
              </Box>
            )}

            <Box sx={{ display: "flex", gap: 1, mt: 2.5 }}>
              <Chip label={`Submission ID: ${result.submissionId}`} size="small" variant="outlined" />
              <Chip label={`MockInterview ID: ${result.mockInterviewId}`} size="small" variant="outlined" />
            </Box>

            <Button
              sx={{ mt: 2.5, textTransform: "none", fontWeight: 600 }}
              onClick={() => setResult(null)}
            >
              Upload Another PDF
            </Button>
          </Paper>
        )}

        {/* Upload area */}
        {!result && (
          <Paper
            elevation={0}
            sx={{ borderRadius: "16px", border: "1px solid #e5e7eb", overflow: "hidden" }}
          >
            <Box sx={{ p: 3.5 }}>
              <Typography fontWeight={700} color="#111827" mb={0.5}>
                Interview Experience PDF
              </Typography>
              <Typography fontSize="13px" color="#6b7280" mb={2.5}>
                The PDF should contain the company name, rounds, and questions. Gemini will do the rest.
              </Typography>

              {/* Drop zone */}
              <Box
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => !file && fileInputRef.current?.click()}
                sx={{
                  border: `2px dashed ${dragOver ? "#4f46e5" : file ? "#059669" : "#d1d5db"}`,
                  borderRadius: "14px",
                  p: 5,
                  textAlign: "center",
                  cursor: file ? "default" : "pointer",
                  bgcolor: dragOver ? "#eef2ff" : file ? "#f0fdf4" : "#fafafa",
                  transition: "all 0.2s",
                }}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="application/pdf"
                  hidden
                  onChange={(e) => pickFile(e.target.files?.[0])}
                />

                {file ? (
                  <Box>
                    <PictureAsPdf sx={{ color: "#dc2626", fontSize: 44, mb: 1 }} />
                    <Typography fontWeight={700} color="#065f46">
                      {file.name}
                    </Typography>
                    <Typography fontSize="13px" color="#6b7280" mt={0.5}>
                      {(file.size / 1024).toFixed(1)} KB
                    </Typography>
                    <Button
                      size="small"
                      startIcon={<Close />}
                      onClick={(e) => { e.stopPropagation(); setFile(null); }}
                      sx={{ mt: 1.5, textTransform: "none", color: "#6b7280" }}
                    >
                      Remove
                    </Button>
                  </Box>
                ) : (
                  <Box>
                    <UploadFile sx={{ color: "#9ca3af", fontSize: 48, mb: 1.5 }} />
                    <Typography fontWeight={600} color="#374151">
                      Drag & drop a PDF here
                    </Typography>
                    <Typography fontSize="13px" color="#9ca3af" mt={0.5}>
                      or click to browse · Max 5 MB
                    </Typography>
                  </Box>
                )}
              </Box>

              {/* Upload button */}
              <Button
                fullWidth
                variant="contained"
                size="large"
                disabled={!file || loading}
                onClick={handleUpload}
                sx={{
                  mt: 3,
                  borderRadius: "12px",
                  textTransform: "none",
                  fontWeight: 700,
                  py: 1.5,
                  background: file ? "linear-gradient(135deg, #4f46e5, #7c3aed)" : undefined,
                }}
              >
                {loading ? (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <CircularProgress size={18} sx={{ color: "#fff" }} />
                    Parsing with Gemini AI...
                  </Box>
                ) : (
                  "Parse & Add to Database"
                )}
              </Button>
            </Box>

            <Divider />
            <Box sx={{ p: 2.5, bgcolor: "#fafafa" }}>
              <Typography fontSize="12px" color="#9ca3af" fontWeight={600} mb={1}>
                WHAT HAPPENS WHEN YOU UPLOAD
              </Typography>
              <Typography fontSize="12px" color="#6b7280" lineHeight={1.7}>
                1. PDF text is extracted using pdf-parse.<br />
                2. Gemini AI structures it into company, rounds, and questions.<br />
                3. Data is inserted directly into the MockInterview collection.<br />
                4. An approved audit record is created in ExperienceSubmission.
              </Typography>
            </Box>
          </Paper>
        )}
      </Box>
    </Box>
  );
};

export default AdminPdfUpload;
