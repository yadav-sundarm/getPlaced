
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from './pages/Dashboard.jsx';
import ResumeAnalyzer from './pages/ResumeAnalyzer.jsx';
import GroupDiscussion from "./pages/GroupDiscussion.jsx";
import VideoMeet from "./pages/VideoMeet.jsx";
import Layout from './components/layout/Layout.jsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/resume-analyzer" element={<ResumeAnalyzer />} />
          <Route path="/group-discussion" element={<GroupDiscussion />} />
          <Route path="/meet/:url" element={<VideoMeet />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;