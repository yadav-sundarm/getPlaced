import React, { useEffect, useState, useCallback } from "react";
import {
  Box,
  Paper,
  Typography,
  Button,
  Chip,
  CircularProgress,
  Alert,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  ToggleButton,
  ToggleButtonGroup,
  IconButton,
  Collapse,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import {
  CheckCircle,
  Cancel,
  ExpandMore,
  ExpandLess,
  ArrowBack,
  HourglassEmpty,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const baseURL = import.meta.env.VITE_BASE_URL || "http://localhost:8000"

const statusConfig = {
  pending: { label: "Pending", color: "#d97706", bg: "#fef3c7", icon: HourglassEmpty },
  approved: { label: "Approved", color: "#059669", bg: "#d1fae5", icon: CheckCircle },
  rejected: { label: "Rejected", color: "#dc2626", bg: "#fee2e2", icon: Cancel },
};

const SubmissionCard = ({ sub, onAction }) => {
  const [expanded, setExpanded] = useState(false);
  const cfg = statusConfig[sub.status];

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: "14px",
        border: "1px solid #e5e7eb",
        overflow: "hidden",
        mb: 2,
      }}
    >
      {/* Card header */}
      <Box
        sx={{
          p: 2.5,
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 2,
          flexWrap: "wrap",
        }}
      >
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5, flexWrap: "wrap" }}>
            <Typography fontWeight={700} fontSize="16px" color="#111827">
              {sub.companyName}
            </Typography>
            <Chip
              label={cfg.label}
              size="small"
              sx={{ bgcolor: cfg.bg, color: cfg.color, fontWeight: 700, fontSize: "11px" }}
            />
            {sub.source === "admin_pdf" && (
              <Chip label="PDF Upload" size="small" variant="outlined" sx={{ fontSize: "11px" }} />
            )}
          </Box>
          <Typography fontSize="13px" color="#6b7280">
            {sub.jobProfile} · {sub.year} · {sub.totalRounds} round{sub.totalRounds !== 1 ? "s" : ""}
          </Typography>
          {sub.submittedBy && (
            <Typography fontSize="12px" color="#9ca3af" mt={0.5}>
              Submitted by {sub.submittedBy.firstName} {sub.submittedBy.lastName} (
              {sub.submittedBy.department}, {sub.submittedBy.batchYear})
            </Typography>
          )}
          {sub.reviewNote && (
            <Typography fontSize="12px" color="#6b7280" mt={0.5} fontStyle="italic">
              Note: {sub.reviewNote}
            </Typography>
          )}
        </Box>

        <Box sx={{ display: "flex", gap: 1, alignItems: "center", flexShrink: 0 }}>
          <IconButton size="small" onClick={() => setExpanded(!expanded)}>
            {expanded ? <ExpandLess /> : <ExpandMore />}
          </IconButton>
          {sub.status === "pending" && (
            <>
              <Button
                size="small"
                variant="contained"
                color="success"
                startIcon={<CheckCircle />}
                onClick={() => onAction(sub, "approve")}
                sx={{ borderRadius: "8px", textTransform: "none", fontWeight: 600 }}
              >
                Approve
              </Button>
              <Button
                size="small"
                variant="outlined"
                color="error"
                startIcon={<Cancel />}
                onClick={() => onAction(sub, "reject")}
                sx={{ borderRadius: "8px", textTransform: "none", fontWeight: 600 }}
              >
                Reject
              </Button>
            </>
          )}
        </Box>
      </Box>

      {/* Expandable rounds */}
      <Collapse in={expanded}>
        <Divider />
        <Box sx={{ p: 2.5 }}>
          {sub.rounds?.map((round, i) => (
            <Box key={i} mb={i < sub.rounds.length - 1 ? 2.5 : 0}>
              <Typography fontWeight={700} fontSize="13px" color="#374151" mb={1}>
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
          {sub.tips && (
            <Box mt={2} p={1.5} bgcolor="#f9fafb" borderRadius="8px">
              <Typography fontSize="13px" fontWeight={600} color="#374151">
                Tips from candidate:
              </Typography>
              <Typography fontSize="13px" color="#6b7280" mt={0.5}>
                {sub.tips}
              </Typography>
            </Box>
          )}
        </Box>
      </Collapse>
    </Paper>
  );
};

const AdminSubmissions = () => {
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

  const [statusFilter, setStatusFilter] = useState("pending");
  const [submissions, setSubmissions] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Action dialog state
  const [dialog, setDialog] = useState({ open: false, sub: null, action: "" });
  const [reviewNote, setReviewNote] = useState("");
  const [acting, setActing] = useState(false);
  const [actionSuccess, setActionSuccess] = useState("");

  const fetchSubmissions = useCallback(
    async (page = 1) => {
      setLoading(true);
      setError("");
      try {
        const { data } = await axios.get(
          `${baseURL}/api/admin/submissions?status=${statusFilter}&page=${page}&limit=10`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setSubmissions(data.data.submissions);
        setPagination(data.data.pagination);
      } catch {
        setError("Failed to load submissions.");
      } finally {
        setLoading(false);
      }
    },
    [statusFilter, token]
  );

  useEffect(() => {
    fetchSubmissions(1);
  }, [fetchSubmissions]);

  const openDialog = (sub, action) => {
    setDialog({ open: true, sub, action });
    setReviewNote("");
    setActionSuccess("");
  };

  const closeDialog = () => setDialog({ open: false, sub: null, action: "" });

  const handleAction = async () => {
    if (!dialog.sub) return;
    setActing(true);
    try {
      await axios.patch(
        `${baseURL}/api/admin/submissions/${dialog.sub._id}/${dialog.action}`,
        { reviewNote },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setActionSuccess(
        dialog.action === "approve"
          ? "Approved! Experience pushed to Mock Interview database."
          : "Submission rejected."
      );
      // Remove from current list
      setSubmissions((prev) => prev.filter((s) => s._id !== dialog.sub._id));
      setTimeout(() => {
        closeDialog();
        setActionSuccess("");
      }, 1800);
    } catch (err) {
      setError(err?.response?.data?.message || "Action failed.");
      closeDialog();
    } finally {
      setActing(false);
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f9fafb", p: { xs: 2, md: 4 } }}>
      <Box sx={{ maxWidth: 860, mx: "auto" }}>
        {/* Header */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
          <IconButton onClick={() => navigate("/admin/dashboard")} size="small">
            <ArrowBack />
          </IconButton>
          <Box>
            <Typography variant="h5" fontWeight={800} color="#111827">
              Experience Submissions
            </Typography>
            <Typography variant="body2" color="#6b7280">
              Review, approve, or reject student-submitted interview experiences
            </Typography>
          </Box>
        </Box>

        {/* Filter tabs */}
        <ToggleButtonGroup
          value={statusFilter}
          exclusive
          onChange={(_, v) => v && setStatusFilter(v)}
          size="small"
          sx={{ mb: 3 }}
        >
          {["pending", "approved", "rejected", "all"].map((s) => (
            <ToggleButton
              key={s}
              value={s}
              sx={{
                textTransform: "capitalize",
                fontWeight: 600,
                px: 2.5,
                borderRadius: "8px !important",
                border: "1px solid #e5e7eb !important",
                mr: 0.5,
                "&.Mui-selected": {
                  bgcolor: "#4f46e5",
                  color: "#fff",
                  "&:hover": { bgcolor: "#4338ca" },
                },
              }}
            >
              {s}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>

        {error && (
          <Alert severity="error" sx={{ mb: 2, borderRadius: "10px" }}>
            {error}
          </Alert>
        )}

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
            <CircularProgress />
          </Box>
        ) : submissions.length === 0 ? (
          <Paper
            elevation={0}
            sx={{
              p: 5,
              textAlign: "center",
              borderRadius: "16px",
              border: "1px solid #e5e7eb",
            }}
          >
            <Typography fontWeight={600} color="#9ca3af">
              No {statusFilter === "all" ? "" : statusFilter} submissions found.
            </Typography>
          </Paper>
        ) : (
          <>
            <Typography fontSize="13px" color="#9ca3af" mb={2}>
              Showing {submissions.length} of {pagination.total} submission
              {pagination.total !== 1 ? "s" : ""}
            </Typography>
            {submissions.map((sub) => (
              <SubmissionCard key={sub._id} sub={sub} onAction={openDialog} />
            ))}

            {/* Pagination */}
            {pagination.pages > 1 && (
              <Box sx={{ display: "flex", justifyContent: "center", gap: 1, mt: 3 }}>
                {Array.from({ length: pagination.pages }, (_, i) => (
                  <Button
                    key={i}
                    size="small"
                    variant={pagination.page === i + 1 ? "contained" : "outlined"}
                    onClick={() => fetchSubmissions(i + 1)}
                    sx={{ minWidth: 36, borderRadius: "8px" }}
                  >
                    {i + 1}
                  </Button>
                ))}
              </Box>
            )}
          </>
        )}
      </Box>

      {/* Approve / Reject Dialog */}
      <Dialog open={dialog.open} onClose={closeDialog} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: "16px" } }}>
        <DialogTitle sx={{ fontWeight: 700, pb: 1 }}>
          {dialog.action === "approve" ? "Approve Submission" : "Reject Submission"}
        </DialogTitle>
        <DialogContent>
          {actionSuccess ? (
            <Alert severity={dialog.action === "approve" ? "success" : "info"} sx={{ borderRadius: "10px" }}>
              {actionSuccess}
            </Alert>
          ) : (
            <>
              <Typography fontSize="14px" color="#6b7280" mb={2}>
                {dialog.action === "approve"
                  ? `This will push "${dialog.sub?.companyName}" interview experience into the Mock Interview database.`
                  : `The student will see a rejection note if provided.`}
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Review note (optional)"
                value={reviewNote}
                onChange={(e) => setReviewNote(e.target.value)}
                placeholder={
                  dialog.action === "approve"
                    ? "e.g. Good quality questions, verified with alumni"
                    : "e.g. Incomplete — missing Technical round questions"
                }
              />
            </>
          )}
        </DialogContent>
        {!actionSuccess && (
          <DialogActions sx={{ px: 3, pb: 3 }}>
            <Button onClick={closeDialog} sx={{ textTransform: "none" }}>
              Cancel
            </Button>
            <Button
              variant="contained"
              color={dialog.action === "approve" ? "success" : "error"}
              onClick={handleAction}
              disabled={acting}
              sx={{ borderRadius: "10px", textTransform: "none", fontWeight: 700 }}
            >
              {acting ? <CircularProgress size={18} sx={{ color: "#fff" }} /> : dialog.action === "approve" ? "Approve" : "Reject"}
            </Button>
          </DialogActions>
        )}
      </Dialog>
    </Box>
  );
};

export default AdminSubmissions;
