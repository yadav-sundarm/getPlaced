import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

import Layout from "./components/layout/Layout.jsx";

import Dashboard from "./pages/Dashboard";
import DSAPractice from "./pages/DSAPractice";
import ResumeAnalyzer from "./pages/ResumeAnalyzer";
import GroupDiscussion from "./pages/GroupDiscussion";
import SettingsPage from "./pages/SettingsPage";
import AptitudePractice from "./pages/AptitudePractice";
import VideoMeet from "./pages/VideoMeet.jsx";
import Company from "./pages/Company.jsx";
import TestLists from "./components/common/TestLists.jsx";
import Test from "./pages/Test.jsx";
import MockInterviewSetup from "./pages/MockInterviewSetup.jsx";
import MockInterview from "./pages/MockInterview";
import ExperienceShare from "./pages/ExperienceShare.jsx";

const theme = createTheme({
  palette: {
    primary: {
      main: "#4f46e5",
    },
    secondary: {
      main: "#10b981",
    },
    background: {
      default: "#f9fafb",
      paper: "#ffffff",
    },
  },
  typography: {
    fontFamily: [
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
    ].join(","),
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 600,
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="/mock-interviews" element={<Company />} />
            <Route
              path="/mock-interview/:companyName"
              element={<MockInterviewSetup />}
            />
            <Route path="/interview" element={<MockInterview />} />
        <Route path="/share-experience" element={<ExperienceShare />} />

            <Route path="aptitude-questions" element={<AptitudePractice />} />
            <Route
              path="/aptitude-questions/:category"
              element={<TestLists />}
            />
            <Route
              path="/aptitude-questions/:category/test/:testName"
              element={<Test />}
            />

            <Route path="dsa-practice" element={<DSAPractice />} />
            <Route path="resume-analyzer" element={<ResumeAnalyzer />} />
            <Route path="group-discussion" element={<GroupDiscussion />} />

            <Route path="meet/:url" element={<VideoMeet />} />

            <Route path="settings" element={<SettingsPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
