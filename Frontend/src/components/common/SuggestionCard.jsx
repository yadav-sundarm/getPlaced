// Frontend/src/components/common/SuggestionCard.jsx
import React from 'react';
import { Box, Paper, Chip, Typography } from '@mui/material';

const SuggestionCard = ({ impact, impactColor, impactBg, sideColor, title, children }) => {
    return (
        <Paper
            elevation={1}
            sx={{
                display: 'flex',
                overflow: 'hidden',
                mb: 2,
                borderRadius: 2,
                border: '1px solid #eee'
            }}
        >
            {/* Colored Bar on the Left */}
            <Box sx={{ width: 6, bgcolor: sideColor }} />

            <Box sx={{ p: 2, width: '100%' }}>
                <Chip
                    label={impact}
                    size="small"
                    sx={{
                        bgcolor: impactBg,
                        color: impactColor,
                        fontWeight: 'bold',
                        fontSize: '0.7rem',
                        borderRadius: 1,
                        height: 24,
                        mb: 1
                    }}
                />
                <Typography variant="subtitle1" fontWeight="600" gutterBottom>
                    {title}
                </Typography>
                <Box mt={1}>
                    {children}
                </Box>
            </Box>
        </Paper>
    );
};

export default SuggestionCard;