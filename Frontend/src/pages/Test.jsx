import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import {
  Typography,
  Card,
  CardContent,
  Box,
  Button,
  RadioGroup,
  FormControlLabel,
  Radio,
  Divider,
  CircularProgress,
} from "@mui/material";

const TEST_DURATION = 20 * 60;

export default function Test() {
  const location = useLocation();
  const { category, testName, test } = location.state || {};
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TEST_DURATION);
  const [warnings, setWarnings] = useState(0);
  const [isSubmittingTriggered, setIsSubmittingTriggered] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const baseURL = import.meta.env.VITE_BASE_URL || "http://localhost:8000"

  // 🔥 SESSION INIT
  useEffect(() => {
    const testKey = `${category}-${testName}`;
    const stored = localStorage.getItem("testSession");
    if (!stored) {
      localStorage.setItem("testSession", JSON.stringify({ testKey, startTime: Date.now() }));
    } else {
      const parsed = JSON.parse(stored);
      if (parsed.testKey !== testKey) {
        localStorage.setItem("testSession", JSON.stringify({ testKey, startTime: Date.now() }));
      }
    }
  }, [category, testName]);

  // 🔥 TIMER
  useEffect(() => {
    if (submitted) return;
    const session = JSON.parse(localStorage.getItem("testSession"));
    if (!session) return;
    const start = session.startTime;

    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - start) / 1000);
      const remaining = TEST_DURATION - elapsed;
      if (remaining <= 0) {
        clearInterval(interval);
        triggerSubmit();
      } else {
        setTimeLeft(remaining);
      }
    }, 1000);

    const elapsedNow = Math.floor((Date.now() - start) / 1000);
    if (elapsedNow >= TEST_DURATION) triggerSubmit();

    return () => clearInterval(interval);
  }, [submitted]);

  // 🔥 TAB SWITCH
  useEffect(() => {
    if (submitted) return;
    const handleVisibility = () => {
      if (document.hidden) setWarnings((prev) => prev + 1);
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, [submitted]);

  // 🔥 WARNINGS
  useEffect(() => {
    if (submitted) return;
    if (warnings > 0) alert(`Tab switch detected! Warning ${warnings}/3`);
    if (warnings >= 3) {
      alert("Too many violations. Submitting...");
      triggerSubmit();
    }
  }, [warnings]);

  // 🔥 MULTI TAB
  useEffect(() => {
    if (submitted) return;
    const handleStorage = () => {
      alert("Test opened in another tab. Submitting...");
      triggerSubmit();
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [submitted]);

  // 🔥 FETCH QUESTIONS
  useEffect(() => {
    if (!category || !testName) return;
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `${baseURL}/api/aptitude-questions/get-${category}-questions`,
        );

        const allQuestions = Object.values(res.data.data.allQuestions).map((q) => ({
          ...q,
          options: q.options
            ? Object.entries(q.options).map(([key, value]) => ({ key, value }))
            : [],
        }));

        const QUESTIONS_PER_TEST = 20;
        const testNumber = parseInt(testName.replace("Test", ""));
        const startIndex = (testNumber - 1) * QUESTIONS_PER_TEST;
        const endIndex = startIndex + QUESTIONS_PER_TEST;

        setQuestions(allQuestions.slice(startIndex, endIndex));
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };
    fetchQuestions();
  }, [category, testName]);

  const handleAnswerSelect = (id, key) => {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [id]: key }));
  };

  const triggerSubmit = () => {
    if (isSubmittingTriggered || submitted) return;
    setIsSubmittingTriggered(true);
    handleSubmit();
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      const session = JSON.parse(localStorage.getItem("testSession"));
      const user = JSON.parse(localStorage.getItem("user") || "{}");

      const res = await axios.post(
        `${baseURL}/api/aptitude-questions/submit-test`,
        {
          userId: user.id,
          answers,
          startTime: session?.startTime,
          category,
        },
      );

      localStorage.removeItem("testSession");
      setScore(res?.data?.data?.score);
      setSubmitted(true);
      setShowResult(true);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  // 🔥 RESULT → REDIRECT FLOW
  useEffect(() => {
    if (submitted) {
      const resultTimer = setTimeout(() => {
        setShowResult(false);
        setShowLoader(true);
      }, 7000);
      const redirectTimer = setTimeout(() => {
        navigate("/aptitude-questions");
      }, 9000);
      return () => {
        clearTimeout(resultTimer);
        clearTimeout(redirectTimer);
      };
    }
  }, [submitted]);

  if (loading) return <Typography>Loading...</Typography>;
  if (!questions.length) return <Typography>No questions</Typography>;

  const q = questions[currentQuestionIndex];

  return (
    <Box sx={{ p: 3 }}>
      {!submitted && (
        <Typography color="error">
          Time Left: {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, "0")}
        </Typography>
      )}

      <Typography variant="h5">
        {category.toUpperCase()} {testName} – Question {currentQuestionIndex + 1}/{questions.length}
      </Typography>

      {submitting && <CircularProgress />}

      {showResult && (
        <Card sx={{ my: 2, bgcolor: "#f0fdf4" }}>
          <CardContent>
            <Typography variant="h6">Test Submitted ✅</Typography>
            <Typography>Score: <b>{score}</b></Typography>
            <Typography variant="body2">Redirecting shortly...</Typography>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent>
          <Typography>{q.question}</Typography>
          <RadioGroup
            value={answers[q._id] || ""}
            onChange={(e) => handleAnswerSelect(q._id, e.target.value)}
          >
            {q.options.map((opt) => (
              <FormControlLabel
                key={opt.key}
                value={opt.key}
                control={<Radio />}
                label={`${opt.key}: ${opt.value}`}
                disabled={submitted}
              />
            ))}
          </RadioGroup>
        </CardContent>
      </Card>

      <Divider sx={{ my: 2 }} />

      <Box sx={{ display: "flex", gap: 2 }}>
        <Button disabled={submitted || currentQuestionIndex === 0} onClick={() => setCurrentQuestionIndex((i) => i - 1)}>Prev</Button>
        <Button disabled={submitted || currentQuestionIndex === questions.length - 1} onClick={() => setCurrentQuestionIndex((i) => i + 1)}>Next</Button>
        {!submitted && <Button color="success" onClick={triggerSubmit}>Submit</Button>}
        <Button color="error" disabled={submitted} onClick={() => navigate("/aptitude-questions")}>Exit</Button>
      </Box>
    </Box>
  );
}