import { useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Container, Typography, Box, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const OptionButton = ({ selected, onClick, children }) => (
  <Button
    onClick={onClick}
    disableRipple
    disableFocusRipple
    sx={{
      flex: 1,
      height: 56,
      borderRadius: "14px",
      border: selected ? "2px solid #4f46e5" : "1px solid #e5e7eb",
      backgroundColor: selected ? "#eef2ff" : "#fff",
      color: selected ? "#4f46e5" : "#111827",
      fontWeight: 600,
      textTransform: "none",
      outline: "none",
      "&:focus": {
        outline: "none",
        boxShadow: "none",
      },
      "&:active": {
        outline: "none",
        boxShadow: "none",
      },
      "&:hover": {
        backgroundColor: "#eef2ff",
      },
    }}
  >
    {children}
  </Button>
);

const MockInterviewSetup = () => {
  const { companyName } = useParams();
  const navigate = useNavigate();

  const [interviewType, setInterviewType] = useState("Mixed");
  const [loading, setLoading] = useState(false);

  const baseURL = import.meta.env.VITE_BASE_URL || "http://localhost:8000"


  const handleStartInterview = async () => {
    try {
      setLoading(true);

      const res = await axios.post(
        `${baseURL}/api/companies/start`,
        {
          companyName,
          interviewType,
        },
      );

      console.log("mock questions", res.data);

      navigate("/interview", {
        state: {
          companyName,
          interviewType,
          questions: res.data.questions,
        },
      });
    } catch (error) {
      console.error("Failed to start mock interview", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      {/* Heading */}
      <Typography variant="h4" fontWeight={700} mb={1}>
        <span style={{ color: "#4f46e5" }}>{companyName}</span> Mock Interview
      </Typography>

      <Typography color="text.secondary" mb={4}>
        Choose interview type to begin
      </Typography>

      {/* Card */}
      <Box
        sx={{
          backgroundColor: "#fff",
          borderRadius: "20px",
          padding: 4,
          border: "1px solid #e5e7eb",
        }}
      >
        {/* Interview Type */}
        <Typography fontWeight={600} mb={2}>
          Interview Type
        </Typography>

        <Box display="flex" gap={2} mb={4}>
          <OptionButton
            selected={interviewType === "Technical"}
            onClick={() => setInterviewType("Technical")}
          >
            Technical
          </OptionButton>

          <OptionButton
            selected={interviewType === "HR"}
            onClick={() => setInterviewType("HR")}
          >
            HR
          </OptionButton>

          <OptionButton
            selected={interviewType === "Mixed"}
            onClick={() => setInterviewType("Mixed")}
          >
            Mixed
          </OptionButton>
        </Box>

        {/* Start Button */}
        <Button
          fullWidth
          disabled={loading}
          onClick={handleStartInterview}
          disableRipple
          disableFocusRipple
          sx={{
            height: 60,
            borderRadius: "16px",
            backgroundColor: "#4f46e5",
            color: "#fff",
            fontSize: "1rem",
            fontWeight: 600,
            textTransform: "none",
            outline: "none",
            "&:focus": {
              outline: "none",
              boxShadow: "none",
            },
            "&:active": {
              outline: "none",
              boxShadow: "none",
            },
            "&:hover": {
              backgroundColor: "#4338ca",
            },
          }}
        >
          ▶ Start Mock Interview
        </Button>
      </Box>
    </Container>
  );
};

export default MockInterviewSetup;
