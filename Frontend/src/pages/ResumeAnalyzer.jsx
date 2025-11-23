// Frontend/src/pages/ResumeAnalyzer.jsx
import React, { useState } from 'react';
import { Box, Container, Typography, Button, Paper, Stack } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
// Import the reusable component from your common folder
import SuggestionCard from '../components/common/SuggestionCard';

const ResumeAnalyzer = () => {
    const [fileUploaded, setFileUploaded] = useState(false);

    const handleUpload = () => {
        setFileUploaded(true);
    };

    return (
        <Container maxWidth="md" sx={{ py: 5 }}>
            {/* Header Section */}
            <Box mb={4}>
                <Typography variant="h4" fontWeight="700" gutterBottom color="text.primary">
                    Resume Analyzer
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Get your ATS score and improvement suggestions
                </Typography>
            </Box>

            {/* Upload Section */}
            <Paper
                variant="outlined"
                sx={{
                    borderStyle: 'dashed',
                    borderWidth: 2,
                    borderColor: 'divider',
                    borderRadius: 2,
                    p: 6,
                    textAlign: 'center',
                    bgcolor: '#fff',
                    mb: 4
                }}
            >
                <CloudUploadIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" gutterBottom>Drag & drop your resume</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    or click to browse (PDF, DOC, DOCX)
                </Typography>
                <Button
                    variant="contained"
                    size="large"
                    onClick={handleUpload}
                    sx={{
                        bgcolor: '#5b4ef6',
                        textTransform: 'none',
                        fontWeight: 'bold',
                        px: 4,
                        '&:hover': { bgcolor: '#4a3ecb' }
                    }}
                >
                    Choose File
                </Button>
            </Paper>

            {/* Results Section */}
            {fileUploaded && (
                <Box sx={{ animation: 'fadeIn 0.5s' }}>
                    <Paper
                        elevation={0}
                        sx={{
                            bgcolor: '#12b981',
                            color: 'white',
                            borderRadius: 3,
                            p: 4,
                            textAlign: 'center',
                            mb: 5
                        }}
                    >
                        <Typography variant="subtitle1" sx={{ opacity: 0.9, mb: 1 }}>ATS Compatibility Score</Typography>
                        <Typography variant="h2" fontWeight="800" sx={{ lineHeight: 1 }}>
                            78<Typography component="span" variant="h4" sx={{ opacity: 0.8 }}>/100</Typography>
                        </Typography>
                        <Typography variant="h6" fontWeight="500" sx={{ mb: 3 }}>Good</Typography>

                        <Stack direction="row" spacing={4} justifyContent="center" sx={{ opacity: 0.9 }}>
                            <Typography variant="body2">Format: 85%</Typography>
                            <Typography variant="body2">Content: 72%</Typography>
                            <Typography variant="body2">Keywords: 76%</Typography>
                        </Stack>
                    </Paper>

                    <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ mb: 2 }}>
                        Top Suggestions
                    </Typography>

                    <SuggestionCard
                        impact="HIGH IMPACT"
                        impactColor="#ef4444"
                        impactBg="#fee2e2"
                        sideColor="#ef4444"
                        title="Add quantifiable achievements"
                    >
                        <Typography variant="body2" color="text.secondary" sx={{ textDecoration: 'line-through', mb: 0.5 }}>
                            Before: "Worked on improving website performance"
                        </Typography>
                        <Typography variant="body2" color="text.primary">
                            After: "Improved website load time by 40% using lazy loading and CDN caching"
                        </Typography>
                    </SuggestionCard>

                    <SuggestionCard
                        impact="MEDIUM IMPACT"
                        impactColor="#d97706"
                        impactBg="#fef3c7"
                        sideColor="#f59e0b"
                        title="Add missing technical keywords"
                    >
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                            Suggested: React.js, Node.js, MongoDB, REST API
                        </Typography>
                    </SuggestionCard>
                </Box>
            )}
        </Container>
    );
};

export default ResumeAnalyzer;