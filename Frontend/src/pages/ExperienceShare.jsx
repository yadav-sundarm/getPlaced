import React, { useState } from "react";
import {
  Box,
  Container,
  Paper,
  Typography,
  Button,
  TextField,
  MenuItem,
  IconButton,
  Divider,
  Chip,
  Alert,
  CircularProgress,
  LinearProgress,
  Stepper,
  Step,
  StepLabel,
} from "@mui/material";
import {
  Add,
  Delete,
  CheckCircle,
  ArrowBack,
  ArrowForward,
  AddCircleOutline,
} from "@mui/icons-material";
import axios from "axios";

const baseURL = import.meta.env.VITE_BASE_URL || "http://localhost:8000"

const ROUND_TYPES = ["Technical", "HR", "Aptitude", "Coding", "GD", "Managerial"];
const DIFFICULTY_OPTIONS = ["Easy", "Medium", "Hard"];
const RESULT_OPTIONS = ["Selected", "Not Selected", "Waiting"];

const STEPS = ["Basic Details", "Round Questions", "Review & Submit"];

// ── Helper: create a blank round ──
const blankRound = (num) => ({
  roundNumber: num,
  roundType: "Technical",
  roundName: "",
  questions: [""],
});

const ExperienceShare = () => {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  // Step 0 state
  const [basic, setBasic] = useState({
    companyName: "",
    jobProfile: "",
    year: new Date().getFullYear(),
    totalRounds: 2,
    difficulty: "",
    result: "Waiting",
    tips: "",
  });

  // Step 1 state — array of round objects
  const [rounds, setRounds] = useState([blankRound(1), blankRound(2)]);

  // ── Basic field helpers ──
  const handleBasicChange = (field) => (e) => {
    const val = e.target.value;
    setBasic((prev) => ({ ...prev, [field]: val }));

    // Sync rounds array length when totalRounds changes
    if (field === "totalRounds") {
      const n = Math.min(Math.max(Number(val), 1), 8);
      setRounds((prev) => {
        if (n > prev.length) {
          const extras = Array.from({ length: n - prev.length }, (_, i) =>
            blankRound(prev.length + i + 1)
          );
          return [...prev, ...extras];
        }
        return prev.slice(0, n);
      });
    }
  };

  // ── Round helpers ──
  const updateRound = (ri, field, val) =>
    setRounds((prev) =>
      prev.map((r, i) => (i === ri ? { ...r, [field]: val } : r))
    );

  const addQuestion = (ri) =>
    setRounds((prev) =>
      prev.map((r, i) => (i === ri ? { ...r, questions: [...r.questions, ""] } : r))
    );

  const updateQuestion = (ri, qi, val) =>
    setRounds((prev) =>
      prev.map((r, i) =>
        i === ri
          ? { ...r, questions: r.questions.map((q, j) => (j === qi ? val : q)) }
          : r
      )
    );

  const removeQuestion = (ri, qi) =>
    setRounds((prev) =>
      prev.map((r, i) =>
        i === ri
          ? { ...r, questions: r.questions.filter((_, j) => j !== qi) }
          : r
      )
    );

  // ── Validation ──
  const validateStep0 = () => {
    if (!basic.companyName.trim()) return "Company name is required";
    if (!basic.jobProfile.trim()) return "Job profile is required";
    if (!basic.totalRounds || basic.totalRounds < 1) return "Total rounds must be at least 1";
    return "";
  };

  const validateStep1 = () => {
    for (const r of rounds) {
      const validQs = r.questions.filter((q) => q.trim().length > 0);
      if (validQs.length === 0)
        return `Round ${r.roundNumber} (${r.roundType}) must have at least one question`;
    }
    return "";
  };

  // ── Navigation ──
  const goNext = () => {
    if (step === 0) {
      const err = validateStep0();
      if (err) { setError(err); return; }
    }
    if (step === 1) {
      const err = validateStep1();
      if (err) { setError(err); return; }
    }
    setError("");
    setStep((s) => s + 1);
  };

  const goBack = () => {
    setError("");
    setStep((s) => s - 1);
  };

  // ── Submit ──
  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const payload = {
        companyName: basic.companyName.trim(),
        jobProfile: basic.jobProfile.trim(),
        year: Number(basic.year),
        totalRounds: Number(basic.totalRounds),
        difficulty: basic.difficulty || undefined,
        result: basic.result,
        tips: basic.tips.trim() || undefined,
        rounds: rounds.map((r) => ({
          roundNumber: r.roundNumber,
          roundType: r.roundType,
          roundName: r.roundName.trim() || undefined,
          questions: r.questions.filter((q) => q.trim().length > 0),
        })),
      };

      await axios.post(`${baseURL}/api/experience/submit`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSubmitted(true);
    } catch (err) {
      setError(err?.response?.data?.message || "Submission failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ── Success screen ──
  if (submitted) {
    return (
      <Container maxWidth="sm" sx={{ py: 8 }}>
        <Paper
          elevation={0}
          sx={{
            p: 5,
            textAlign: "center",
            borderRadius: "20px",
            border: "1px solid #bbf7d0",
            bgcolor: "#f0fdf4",
          }}
        >
          <CheckCircle sx={{ color: "#059669", fontSize: 64, mb: 2 }} />
          <Typography fontWeight={800} fontSize="22px" color="#065f46">
            Experience Submitted!
          </Typography>
          <Typography color="#6b7280" mt={1.5} mb={3}>
            Your interview experience has been sent for admin review. Once approved, it will
            help future VESIT students prepare better. Thank you! 🎉
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "center", gap: 2, flexWrap: "wrap" }}>
            <Button
              variant="outlined"
              color="success"
              sx={{ borderRadius: "10px", textTransform: "none", fontWeight: 600 }}
              onClick={() => {
                setSubmitted(false);
                setStep(0);
                setBasic({
                  companyName: "", jobProfile: "",
                  year: new Date().getFullYear(),
                  totalRounds: 2, difficulty: "", result: "Waiting", tips: "",
                });
                setRounds([blankRound(1), blankRound(2)]);
              }}
            >
              Share Another
            </Button>
          </Box>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: { xs: 3, md: 5 } }}>
      {/* Page header */}
      <Box mb={4}>
        <Typography fontSize={{ xs: "22px", md: "26px" }} fontWeight={800} color="#111827">
          Share{" "}
          <Box component="span" sx={{ color: "#4f46e5" }}>
            Interview Experience
          </Box>
        </Typography>
        <Typography color="#6b7280" mt={0.5}>
          Help VESIT juniors by sharing your real interview questions · Pending admin approval
        </Typography>
      </Box>

      {/* Stepper */}
      <Stepper activeStep={step} sx={{ mb: 4 }}>
        {STEPS.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: "12px" }}>
          {error}
        </Alert>
      )}

      {/* ── STEP 0: Basic Details ── */}
      {step === 0 && (
        <Paper
          elevation={0}
          sx={{ p: { xs: 3, md: 4 }, borderRadius: "16px", border: "1px solid #e5e7eb" }}
        >
          <Typography fontWeight={700} mb={3}>
            Company & Role Details
          </Typography>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
              <TextField
                label="Company Name *"
                value={basic.companyName}
                onChange={handleBasicChange("companyName")}
                placeholder="e.g. TCS, Infosys, Wipro"
                sx={{ flex: "1 1 200px" }}
              />
              <TextField
                label="Job Profile *"
                value={basic.jobProfile}
                onChange={handleBasicChange("jobProfile")}
                placeholder="e.g. Software Engineer"
                sx={{ flex: "1 1 200px" }}
              />
            </Box>

            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
              <TextField
                label="Year *"
                type="number"
                value={basic.year}
                onChange={handleBasicChange("year")}
                inputProps={{ min: 2015, max: new Date().getFullYear() + 1 }}
                sx={{ flex: "1 1 120px" }}
              />
              <TextField
                label="Number of Rounds *"
                type="number"
                value={basic.totalRounds}
                onChange={handleBasicChange("totalRounds")}
                inputProps={{ min: 1, max: 8 }}
                sx={{ flex: "1 1 120px" }}
              />
              <TextField
                select
                label="Difficulty"
                value={basic.difficulty}
                onChange={handleBasicChange("difficulty")}
                sx={{ flex: "1 1 150px" }}
              >
                <MenuItem value="">— Select —</MenuItem>
                {DIFFICULTY_OPTIONS.map((d) => (
                  <MenuItem key={d} value={d}>{d}</MenuItem>
                ))}
              </TextField>
              <TextField
                select
                label="Result"
                value={basic.result}
                onChange={handleBasicChange("result")}
                sx={{ flex: "1 1 150px" }}
              >
                {RESULT_OPTIONS.map((r) => (
                  <MenuItem key={r} value={r}>{r}</MenuItem>
                ))}
              </TextField>
            </Box>

            <TextField
              label="Tips for juniors (optional)"
              multiline
              rows={3}
              value={basic.tips}
              onChange={handleBasicChange("tips")}
              placeholder="Any preparation advice, important topics, what to focus on…"
            />
          </Box>
        </Paper>
      )}

      {/* ── STEP 1: Round Questions ── */}
      {step === 1 && (
        <Box>
          {rounds.map((round, ri) => (
            <Paper
              key={ri}
              elevation={0}
              sx={{
                p: { xs: 2.5, md: 3.5 },
                borderRadius: "16px",
                border: "1px solid #e5e7eb",
                mb: 2.5,
              }}
            >
              {/* Round header */}
              <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2.5, flexWrap: "wrap" }}>
                <Chip
                  label={`Round ${round.roundNumber}`}
                  sx={{
                    bgcolor: "#eef2ff",
                    color: "#4f46e5",
                    fontWeight: 700,
                    fontSize: "13px",
                  }}
                />
                <TextField
                  select
                  label="Round Type *"
                  value={round.roundType}
                  onChange={(e) => updateRound(ri, "roundType", e.target.value)}
                  size="small"
                  sx={{ minWidth: 160 }}
                >
                  {ROUND_TYPES.map((t) => (
                    <MenuItem key={t} value={t}>{t}</MenuItem>
                  ))}
                </TextField>
                <TextField
                  label="Round Name (optional)"
                  value={round.roundName}
                  onChange={(e) => updateRound(ri, "roundName", e.target.value)}
                  size="small"
                  placeholder="e.g. System Design"
                  sx={{ flex: 1, minWidth: 160 }}
                />
              </Box>

              <Divider sx={{ mb: 2 }} />

              {/* Questions */}
              <Typography fontSize="13px" fontWeight={600} color="#374151" mb={1.5}>
                Questions asked in this round
              </Typography>

              {round.questions.map((q, qi) => (
                <Box
                  key={qi}
                  sx={{ display: "flex", gap: 1, mb: 1.5, alignItems: "flex-start" }}
                >
                  <Typography
                    sx={{
                      width: 22,
                      height: 22,
                      bgcolor: "#f3f4f6",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "11px",
                      fontWeight: 700,
                      color: "#6b7280",
                      mt: 1,
                      flexShrink: 0,
                    }}
                  >
                    {qi + 1}
                  </Typography>
                  <TextField
                    fullWidth
                    size="small"
                    multiline
                    value={q}
                    onChange={(e) => updateQuestion(ri, qi, e.target.value)}
                    placeholder="Enter a question asked in this round"
                  />
                  {round.questions.length > 1 && (
                    <IconButton
                      size="small"
                      onClick={() => removeQuestion(ri, qi)}
                      sx={{ mt: 0.5, color: "#9ca3af", "&:hover": { color: "#ef4444" } }}
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                  )}
                </Box>
              ))}

              <Button
                startIcon={<AddCircleOutline />}
                size="small"
                onClick={() => addQuestion(ri)}
                sx={{
                  textTransform: "none",
                  color: "#4f46e5",
                  fontWeight: 600,
                  mt: 0.5,
                }}
              >
                Add Question
              </Button>
            </Paper>
          ))}
        </Box>
      )}

      {/* ── STEP 2: Review & Submit ── */}
      {step === 2 && (
        <Paper
          elevation={0}
          sx={{ p: { xs: 3, md: 4 }, borderRadius: "16px", border: "1px solid #e5e7eb" }}
        >
          <Typography fontWeight={700} fontSize="16px" mb={3}>
            Review Your Submission
          </Typography>

          {/* Basic summary */}
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5, mb: 3 }}>
            <Chip label={basic.companyName} sx={{ fontWeight: 700, bgcolor: "#eef2ff", color: "#4f46e5" }} />
            <Chip label={basic.jobProfile} variant="outlined" />
            <Chip label={`${basic.year}`} variant="outlined" />
            {basic.difficulty && <Chip label={basic.difficulty} variant="outlined" />}
            <Chip label={basic.result} variant="outlined" />
          </Box>

          {basic.tips && (
            <Box mb={3} p={2} bgcolor="#fafafa" borderRadius="10px" border="1px solid #e5e7eb">
              <Typography fontSize="13px" fontWeight={600} mb={0.5}>Tips:</Typography>
              <Typography fontSize="13px" color="#6b7280">{basic.tips}</Typography>
            </Box>
          )}

          <Divider sx={{ mb: 3 }} />

          {/* Rounds summary */}
          {rounds.map((round, ri) => {
            const validQs = round.questions.filter((q) => q.trim().length > 0);
            return (
              <Box key={ri} mb={ri < rounds.length - 1 ? 3 : 0}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}>
                  <Chip
                    label={`Round ${round.roundNumber}`}
                    size="small"
                    sx={{ bgcolor: "#eef2ff", color: "#4f46e5", fontWeight: 700 }}
                  />
                  <Typography fontWeight={700} fontSize="14px" color="#374151">
                    {round.roundType}
                    {round.roundName ? ` — ${round.roundName}` : ""}
                  </Typography>
                  <Chip
                    label={`${validQs.length} question${validQs.length !== 1 ? "s" : ""}`}
                    size="small"
                    sx={{ bgcolor: "#f3f4f6", color: "#6b7280" }}
                  />
                </Box>
                {validQs.map((q, qi) => (
                  <Typography key={qi} fontSize="13px" color="#4b5563" ml={2} mb={0.5}>
                    {qi + 1}. {q}
                  </Typography>
                ))}
              </Box>
            );
          })}

          <Divider sx={{ my: 3 }} />

          <Box sx={{ bgcolor: "#fef3c7", p: 2, borderRadius: "10px" }}>
            <Typography fontSize="13px" color="#92400e" fontWeight={600}>
              📋 Pending Review
            </Typography>
            <Typography fontSize="13px" color="#78350f" mt={0.5}>
              Your submission will be visible to other students only after an admin approves it.
              This usually takes 24–48 hours.
            </Typography>
          </Box>
        </Paper>
      )}

      {/* Navigation buttons */}
      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={goBack}
          disabled={step === 0}
          sx={{ textTransform: "none", fontWeight: 600 }}
        >
          Back
        </Button>

        {step < 2 ? (
          <Button
            variant="contained"
            endIcon={<ArrowForward />}
            onClick={goNext}
            sx={{
              borderRadius: "10px",
              textTransform: "none",
              fontWeight: 700,
              px: 3,
            }}
          >
            Next
          </Button>
        ) : (
          <Button
            variant="contained"
            color="success"
            onClick={handleSubmit}
            disabled={loading}
            sx={{ borderRadius: "10px", textTransform: "none", fontWeight: 700, px: 4 }}
          >
            {loading ? (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <CircularProgress size={16} sx={{ color: "#fff" }} />
                Submitting…
              </Box>
            ) : (
              "Submit Experience"
            )}
          </Button>
        )}
      </Box>
    </Container>
  );
};

export default ExperienceShare;
