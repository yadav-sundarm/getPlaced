import React, { useState } from "react";
import {
    Box,
    Container,
    Grid,
    Paper,
    Typography,
    Button,
    List,
    ListItem,
    ListItemText,
    ListItemAvatar,
    Avatar,
    Chip,
    Divider,
    LinearProgress
} from "@mui/material";

import {
    CloudUploadOutlined,
    CheckCircleOutline,
    HighlightOff,
    LightbulbOutlined,
    InsertDriveFileOutlined,
    AutoAwesome
} from "@mui/icons-material";

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

    const handleUpload = () => {
        setUploading(true);
        // Simulate processing delay
        setTimeout(() => {
            setUploading(false);
            setAnalyzed(true);
        }, 1500);
    };

    // Data for the suggestions list (matches Upcoming Sessions style)
    const suggestions = [
        {
            title: "Quantify your achievements",
            desc: "Use numbers (e.g., 'Increased sales by 20%') instead of generic statements.",
            type: "critical",
            icon: <HighlightOff />,
            color: "#EF4444",
            bg: "#FEF2F2",
        },
        {
            title: "Add technical keywords",
            desc: "Missing: Docker, Kubernetes, CI/CD. These are popular in your target role.",
            type: "warning",
            icon: <LightbulbOutlined />,
            color: "#F59E0B",
            bg: "#FFFBEB",
        },
        {
            title: "Formatting is excellent",
            desc: "Your font size and margins are ATS-friendly.",
            type: "good",
            icon: <CheckCircleOutline />,
            color: "#10B981",
            bg: "#ECFDF5",
        },
    ];

    return (
        <ThemeProvider theme={theme}>
            <Box
                sx={{
                    width: "100%",
                    minHeight: "100vh",
                    bgcolor: "#F9FAFB",
                    display: "flex",
                    justifyContent: "center",
                    py: { xs: 3, md: 5 },
                }}
            >
                <Container maxWidth="md" sx={{ mx: "auto" }}>

                    {/* Header Section */}
                    <Box sx={{ mb: 5 }}>
                        <Typography
                            variant="h5"
                            sx={{
                                fontWeight: 700,
                                mb: 1,
                                fontSize: { xs: "1.75rem", md: "2.25rem" },
                                color: "#111827",
                            }}
                        >
                            Resume Analyzer 📄
                        </Typography>
                        <Typography
                            sx={{
                                color: "#6B7280",
                                fontSize: { xs: "0.95rem", md: "1.05rem" },
                            }}
                        >
                            Check your ATS score and get instant feedback.
                        </Typography>
                    </Box>

                    {/* Main Content Area */}
                    {!analyzed ? (
                        // --- Upload State ---
                        <Paper
                            elevation={0}
                            sx={{
                                p: 6,
                                border: "2px dashed #E5E7EB",
                                borderRadius: 2,
                                bgcolor: "white",
                                textAlign: "center",
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                gap: 2
                            }}
                        >
                            <Box
                                sx={{
                                    width: 80,
                                    height: 80,
                                    bgcolor: "#EEF2FF",
                                    borderRadius: "50%",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    mb: 1
                                }}
                            >
                                <CloudUploadOutlined sx={{ fontSize: 40, color: "#6366F1" }} />
                            </Box>

                            <Typography variant="h6" fontWeight={600} color="#111827">
                                {uploading ? "Analyzing..." : "Upload your Resume"}
                            </Typography>

                            <Typography variant="body2" color="#6B7280" sx={{ maxWidth: 300, mb: 2 }}>
                                Drag and drop your file here, or click the button below. Supported: PDF, DOCX.
                            </Typography>

                            {uploading ? (
                                <Box sx={{ width: '60%', mt: 2 }}>
                                    <LinearProgress sx={{ height: 8, borderRadius: 4 }} />
                                </Box>
                            ) : (
                                <Button
                                    onClick={handleUpload}
                                    variant="contained"
                                    size="large"
                                    sx={{
                                        textTransform: "none",
                                        px: 5,
                                        py: 1.5,
                                        fontWeight: 600,
                                        boxShadow: "none",
                                        "&:hover": { boxShadow: "none" },
                                    }}
                                >
                                    Select File
                                </Button>
                            )}
                        </Paper>
                    ) : (
                        // --- Results State ---
                        <Box sx={{ animation: "fadeIn 0.5s" }}>

                            {/* Score Overview Cards (KPI Style) */}
                            <Grid container spacing={3} sx={{ mb: 5 }}>
                                {/* Main Score */}
                                <Grid item xs={12} md={6}>
                                    <Paper
                                        elevation={0}
                                        sx={{
                                            p: 3,
                                            border: "1px solid #E5E7EB",
                                            borderRadius: 2,
                                            bgcolor: "white",
                                            height: "100%",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "space-between"
                                        }}
                                    >
                                        <Box>
                                            <Typography color="#6B7280" gutterBottom>ATS Score</Typography>
                                            <Typography variant="h3" fontWeight={700} color="#10B981">
                                                78<span style={{ fontSize: '1.5rem', color: '#9CA3AF' }}>/100</span>
                                            </Typography>
                                            <Chip
                                                label="Good Job!"
                                                size="small"
                                                sx={{ mt: 1, bgcolor: "#ECFDF5", color: "#059669", fontWeight: 600 }}
                                            />
                                        </Box>
                                        <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                                            <AutoAwesome sx={{ fontSize: 80, color: "#10B981", opacity: 0.2 }} />
                                        </Box>
                                    </Paper>
                                </Grid>

                                {/* Breakdown Stats */}
                                <Grid item xs={12} md={6}>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12}>
                                            <Paper elevation={0} sx={{ p: 2, border: "1px solid #E5E7EB", borderRadius: 2 }}>
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                                    <Typography variant="body2" fontWeight={600}>Keywords Match</Typography>
                                                    <Typography variant="body2" color="#6366F1">76%</Typography>
                                                </Box>
                                                <LinearProgress variant="determinate" value={76} sx={{ height: 8, borderRadius: 4 }} />
                                            </Paper>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Paper elevation={0} sx={{ p: 2, border: "1px solid #E5E7EB", borderRadius: 2 }}>
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                                    <Typography variant="body2" fontWeight={600}>Formatting</Typography>
                                                    <Typography variant="body2" color="#10B981">85%</Typography>
                                                </Box>
                                                <LinearProgress variant="determinate" value={85} color="secondary" sx={{ height: 8, borderRadius: 4 }} />
                                            </Paper>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>

                            {/* Detailed Suggestions List */}
                            <Box>
                                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                                    <Typography variant="h6" sx={{ fontWeight: 700, color: "#111827" }}>
                                        Detailed Analysis
                                    </Typography>
                                    <Button
                                        variant="outlined"
                                        startIcon={<InsertDriveFileOutlined />}
                                        sx={{ textTransform: 'none' }}
                                    >
                                        View Parsed Data
                                    </Button>
                                </Box>

                                <Paper
                                    elevation={0}
                                    sx={{
                                        border: "1px solid #E5E7EB",
                                        borderRadius: 2,
                                        bgcolor: "white",
                                        overflow: "hidden",
                                    }}
                                >
                                    <List disablePadding>
                                        {suggestions.map((item, index) => (
                                            <React.Fragment key={index}>
                                                <ListItem sx={{ px: 3, py: 3, alignItems: "flex-start" }}>
                                                    <ListItemAvatar>
                                                        <Avatar
                                                            sx={{ bgcolor: item.bg, color: item.color, width: 48, height: 48 }}
                                                        >
                                                            {item.icon}
                                                        </Avatar>
                                                    </ListItemAvatar>

                                                    <ListItemText
                                                        primary={
                                                            <Typography fontWeight={600} color="#111827" sx={{ mb: 0.5 }}>
                                                                {item.title}
                                                            </Typography>
                                                        }
                                                        secondary={
                                                            <Typography variant="body2" color="#6B7280">
                                                                {item.desc}
                                                            </Typography>
                                                        }
                                                    />

                                                    <Chip
                                                        label={item.type === 'critical' ? 'High Impact' : item.type === 'warning' ? 'Medium' : 'Good'}
                                                        size="small"
                                                        sx={{
                                                            fontWeight: 600,
                                                            bgcolor: item.bg,
                                                            color: item.color,
                                                            display: { xs: 'none', sm: 'flex' }
                                                        }}
                                                    />
                                                </ListItem>
                                                {index < suggestions.length - 1 && <Divider />}
                                            </React.Fragment>
                                        ))}
                                    </List>
                                </Paper>
                            </Box>

                            {/* Retry Button */}
                            <Box sx={{ mt: 4, textAlign: 'center' }}>
                                <Button onClick={() => setAnalyzed(false)} sx={{ color: '#6B7280', textTransform: 'none' }}>
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