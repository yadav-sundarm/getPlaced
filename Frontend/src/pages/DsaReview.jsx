import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  Box,
  CircularProgress,
  Divider,
  Paper,
  Stack,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import Tooltip from "@mui/material/Tooltip";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

const DsaReview = () => {
  const location = useLocation();

  const [reviewParams, setReviewParams] = useState({
    questionTitle: "",
    questionDescription: "",
    code: "",
    language: "",
    timeComplexity: "",
    spaceComplexity: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);
  const [reviewText, setReviewText] = useState({});
  const [error, setError] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogTitle, setDialogTitle] = useState("");
  const [dialogContentText, setDialogContentText] = useState("");

  const loadingMessages = [
    "Preparing your AI review",
    "Please wait",
    "Just a moment",
  ];

  const getAIReview = async (data) => {
    try {
      setIsLoading(true);
      setError("");

      const response = await fetch("http://localhost:8000/dsa/get-review", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const text = await response.text();

      if (!response.ok) {
        throw new Error(text || "Failed to fetch AI review");
      }

      const aiReviewResponseObject = JSON.parse(text);
      const review = aiReviewResponseObject?.message?.data;

      setReviewText(review || {});
    } catch (err) {
      console.error("Fetch Error:", err);
      setError(
        "We could not generate the AI review right now. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isLoading) return;

    const interval = setInterval(() => {
      setLoadingMessageIndex((prev) => (prev + 1) % loadingMessages.length);
    }, 1400);

    return () => clearInterval(interval);
  }, [isLoading, loadingMessages.length]);

  useEffect(() => {
    const run = async () => {
      const data = {
        questionTitle: location?.state?.questionTitle,
        questionDescription: location?.state?.questionDescription,
        code: location?.state?.code,
        language: location?.state?.language,
        timeComplexity: location?.state?.timeComplexity,
        spaceComplexity: location?.state?.spaceComplexity,
      };

      setReviewParams(data);
      await getAIReview(data);
    };

    run();
  }, []);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#f8f9fa",
        p: { xs: 2, md: 4 },
      }}
    >
      <Paper
        elevation={2}
        sx={{
          maxWidth: 1100,
          mx: "auto",
          p: { xs: 3, md: 4 },
          borderRadius: 2,
        }}
      >
        <Typography variant="h4" fontWeight={700} gutterBottom>
          AI <span style={{ color: "#4f46e5" }}>Review</span>
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 3 }}>
          {reviewParams.questionTitle ||
            "Your solution review is being prepared"}
        </Typography>

        <Divider sx={{ mb: 3 }} />

        {isLoading ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              py: 6,
              textAlign: "center",
            }}
          >
            <CircularProgress size={48} thickness={4} sx={{ mb: 2 }} />
            <Typography variant="h6" fontWeight={600}>
              {loadingMessages[loadingMessageIndex]}
            </Typography>
            <Typography color="text.secondary" sx={{ mt: 1 }}>
              This usually takes a few seconds. Please keep this page open.
            </Typography>
          </Box>
        ) : (
          <Stack spacing={2}>
            {error ? (
              <Paper
                elevation={0}
                sx={{ p: 3, borderRadius: 2, backgroundColor: "#fff4f4" }}
              >
                <Typography color="error">{error}</Typography>
              </Paper>
            ) : (
              <Paper
                elevation={0}
                sx={{ p: 3, borderRadius: 2, backgroundColor: "#f7f9fc" }}
              >
                <Box sx={{ p: 1 }}>
                  {reviewText?.summary && (
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="h6" fontWeight={700} gutterBottom>
                        Summary
                      </Typography>
                      <Typography
                        color="text.secondary"
                        sx={{ whiteSpace: "pre-wrap" }}
                      >
                        {reviewText.summary}
                      </Typography>
                    </Box>
                  )}

                  <Box
                    sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 2 }}
                  >
                    <Tooltip
                      title={reviewText?.timeComplexity || "Not available"}
                      arrow
                    >
                      <Chip
                        label={`Time: ${reviewText?.timeComplexity || "N/A"}`}
                        color="primary"
                        variant="outlined"
                        onClick={() => {
                          setDialogTitle("Time Complexity");
                          setDialogContentText(
                            reviewText?.timeComplexity || "N/A",
                          );
                          setDialogOpen(true);
                        }}
                        sx={{ cursor: "pointer" }}
                      />
                    </Tooltip>

                    <Tooltip
                      title={reviewText?.spaceComplexity || "Not available"}
                      arrow
                    >
                      <Chip
                        label={`Space: ${reviewText?.spaceComplexity || "N/A"}`}
                        color="primary"
                        variant="outlined"
                        onClick={() => {
                          setDialogTitle("Space Complexity");
                          setDialogContentText(
                            reviewText?.spaceComplexity || "N/A",
                          );
                          setDialogOpen(true);
                        }}
                        sx={{ cursor: "pointer" }}
                      />
                    </Tooltip>
                  </Box>

                  {Array.isArray(reviewText?.strengths) &&
                    reviewText.strengths.length > 0 && (
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="h6" fontWeight={700} gutterBottom>
                          Strengths
                        </Typography>
                        <List dense>
                          {reviewText.strengths.map((s, i) => (
                            <ListItem key={`strength-${i}`}>
                              <ListItemIcon sx={{ minWidth: 36 }}>
                                <CheckCircleIcon color="success" />
                              </ListItemIcon>
                              <ListItemText
                                primary={s}
                                primaryTypographyProps={{
                                  style: { whiteSpace: "pre-wrap" },
                                }}
                              />
                            </ListItem>
                          ))}
                        </List>
                      </Box>
                    )}

                  {Array.isArray(reviewText?.improvements) &&
                    reviewText.improvements.length > 0 && (
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="h6" fontWeight={700} gutterBottom>
                          Improvements
                        </Typography>
                        <List dense>
                          {reviewText.improvements.map((imp, i) => (
                            <ListItem key={`imp-${i}`}>
                              <ListItemIcon sx={{ minWidth: 36 }}>
                                <ArrowForwardIosIcon
                                  fontSize="small"
                                  color="action"
                                />
                              </ListItemIcon>
                              <ListItemText
                                primary={imp}
                                primaryTypographyProps={{
                                  style: { whiteSpace: "pre-wrap" },
                                }}
                              />
                            </ListItem>
                          ))}
                        </List>
                      </Box>
                    )}

                  {Array.isArray(reviewText?.nextSteps) &&
                    reviewText.nextSteps.length > 0 && (
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="h6" fontWeight={700} gutterBottom>
                          Next Steps
                        </Typography>
                        <List dense>
                          {reviewText.nextSteps.map((n, i) => (
                            <ListItem key={`next-${i}`}>
                              <ListItemIcon sx={{ minWidth: 36 }}>
                                <ArrowForwardIosIcon
                                  fontSize="small"
                                  color="action"
                                />
                              </ListItemIcon>
                              <ListItemText
                                primary={n}
                                primaryTypographyProps={{
                                  style: { whiteSpace: "pre-wrap" },
                                }}
                              />
                            </ListItem>
                          ))}
                        </List>
                      </Box>
                    )}

                  {reviewText?.codingStyle && (
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="h6" fontWeight={700} gutterBottom>
                        Coding Style
                      </Typography>
                      <Typography
                        component="pre"
                        sx={{ whiteSpace: "pre-wrap", m: 0 }}
                      >
                        {reviewText.codingStyle}
                      </Typography>
                    </Box>
                  )}

                  {reviewText?.motivation && (
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="h6" fontWeight={700} gutterBottom>
                        Motivation
                      </Typography>
                      <Typography
                        color="text.secondary"
                        sx={{ whiteSpace: "pre-wrap" }}
                      >
                        {reviewText.motivation}
                      </Typography>
                    </Box>
                  )}
                </Box>
                <Dialog
                  open={dialogOpen}
                  onClose={() => setDialogOpen(false)}
                  fullWidth
                  maxWidth="sm"
                >
                  <DialogTitle
                    sx={{
                      m: 0,
                      p: 2,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    {dialogTitle}
                    <Box>
                      <IconButton
                        aria-label="copy"
                        size="small"
                        onClick={() => {
                          navigator.clipboard?.writeText(
                            dialogContentText || "",
                          );
                        }}
                      >
                        <ContentCopyIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        aria-label="close"
                        size="small"
                        onClick={() => setDialogOpen(false)}
                      >
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </DialogTitle>
                  <DialogContent dividers>
                    <Typography sx={{ whiteSpace: "pre-wrap" }}>
                      {dialogContentText}
                    </Typography>
                  </DialogContent>
                </Dialog>
              </Paper>
            )}
          </Stack>
        )}
      </Paper>
    </Box>
  );
};

export default DsaReview;
