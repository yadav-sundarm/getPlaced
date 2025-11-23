import React from 'react';
import { CssBaseline, ThemeProvider, createTheme, Box } from '@mui/material';
import ResumeAnalyzer from './pages/ResumeAnalyzer';

const theme = createTheme({
  palette: {
    mode: 'light',
    background: {
      default: '#f4f6f8', // Slightly grey background to make the white cards pop
    }
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      {/* This Box forces the content to be full width and centered */}
      <Box
        sx={{
          width: '100%',
          minHeight: '100vh',
          display: 'flex',
          justifyContent: 'center', // Centers horizontally
          alignItems: 'flex-start', // Starts from top (change to 'center' if you want vertical centering)
          bgcolor: 'background.default'
        }}
      >
        <ResumeAnalyzer />
      </Box>

    </ThemeProvider>
  );
}

export default App;