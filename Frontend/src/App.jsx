import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

// ── Layouts & Auth ──
import Layout from "./components/layout/Layout.jsx";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import AdminRoute from "./components/auth/AdminRoute.jsx";   // NEW

// ── Student pages ──
import LoginSignup from "./pages/LoginSignup";
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
import ExperienceShare from "./pages/ExperienceShare.jsx";    // UPDATED
import DsaQuestionsList from "./components/common/DsaQuestionsList.jsx";
import DsaPlayGround from "./components/common/DsaPlayGround.jsx";
import DsaReview from "./pages/DsaReview.jsx";
import TestReview from "./pages/TestReview.jsx";

// ── Admin pages (NEW) ──
import AdminLogin from "./pages/admin/AdminLogin.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import AdminSubmissions from "./pages/admin/AdminSubmissions.jsx";
import AdminPdfUpload from "./pages/admin/AdminPdfUpload.jsx";


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
      <BrowserRouter>
        <Routes>
          {/* ═══════════════════════════════
              🔓 Public – Student Login
          ═══════════════════════════════ */}
          <Route path="/" element={<LoginSignup />} />

          {/* ═══════════════════════════════
              🔐 Admin – no CssBaseline so
              html/body stay scrollable
          ═══════════════════════════════ */}
          <Route path="/admin/login" element={<AdminLogin />} />

          <Route
            path="/admin/dashboard"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/submissions"
            element={
              <AdminRoute>
                <AdminSubmissions />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/upload-pdf"
            element={
              <AdminRoute>
                <AdminPdfUpload />
              </AdminRoute>
            }
          />

          {/* ═══════════════════════════════
              🔒 Student App Routes
              CssBaseline only here — scoped
              to student layout
          ═══════════════════════════════ */}
          <Route
            element={
              <ProtectedRoute>
                <CssBaseline />
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<Dashboard />} />

            {/* Mock Interviews */}
            <Route path="/mock-interviews" element={<Company />} />
            <Route path="/mock-interview/:companyName" element={<MockInterviewSetup />} />
            <Route path="/interview" element={<MockInterview />} />

            {/* Experience Share */}
            <Route path="/share-experience" element={<ExperienceShare />} />

            {/* Aptitude */}
            <Route path="aptitude-questions" element={<AptitudePractice />} />
            <Route path="/aptitude-questions/:category" element={<TestLists />} />
            <Route path="/aptitude-questions/:category/test/:testName" element={<Test />} />

            {/* DSA */}
            <Route path="dsa-practice" element={<DSAPractice />} />
            <Route path="dsa-review" element={<DsaReview />} />
            <Route path="dsa-practise/:topic" element={<DsaQuestionsList />} />
            <Route path="dsa-practise/:topic/:questionId" element={<DsaPlayGround />} />

            {/* Other */}
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
