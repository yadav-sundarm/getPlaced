import { useLocation, useNavigate } from "react-router-dom";

import { useState, useEffect, useRef } from "react";
import MicRoundedIcon from "@mui/icons-material/MicRounded";
import GraphicEqRoundedIcon from "@mui/icons-material/GraphicEqRounded";
import DescriptionRoundedIcon from "@mui/icons-material/DescriptionRounded";
import SpeedRoundedIcon from "@mui/icons-material/SpeedRounded";
import PauseCircleRoundedIcon from "@mui/icons-material/PauseCircleRounded";
import TimerRoundedIcon from "@mui/icons-material/TimerRounded";
import SentimentSatisfiedAltRoundedIcon from "@mui/icons-material/SentimentSatisfiedAltRounded";
import SentimentDissatisfiedRoundedIcon from "@mui/icons-material/SentimentDissatisfiedRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import {
  Container,
  Typography,
  Box,
  Button,
  TextField,
  LinearProgress,
  Grid,
  Chip,
} from "@mui/material";

import axios from "axios";

const MockInterview = () => {
  const location = useLocation();

  const state = location.state || {};

  const { companyName = "", interviewType = "", questions = [] } = state;
  const navigate = useNavigate();

  const [currentIndex, setCurrentIndex] = useState(0);

  const [answer, setAnswer] = useState("");

  const [responses, setResponses] = useState([]);

  const [isRecording, setIsRecording] = useState(false);

  const [hasVoiceAnswer, setHasVoiceAnswer] = useState(false);

  const [evaluation, setEvaluation] = useState(null);

  const [isEvaluating, setIsEvaluating] = useState(false);

  const [timeLeft, setTimeLeft] = useState(0);

  const [hasSubmitted, setHasSubmitted] = useState(false);

  const [evalError, setEvalError] = useState("");

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const currentQuestion = questions[currentIndex];

  const baseURL = import.meta.env.VITE_BASE_URL || "http://localhost:8000"

  useEffect(() => {
    if (!questions.length) {
      navigate("/mock-interviews");
    }
  }, [questions, navigate]);
  const safeValue = (value, fallback) => {
    return value !== undefined && value !== null && value !== ""
      ? value
      : fallback;
  };

  // ---------- TIMER SETUP ----------
  useEffect(() => {
    let totalSeconds = 30 * 60;

    if (interviewType?.toLowerCase() === "mixed") {
      totalSeconds = 45 * 60;
    }

    setTimeLeft(totalSeconds);
  }, [interviewType]);

  // ---------- TIMER ----------
  useEffect(() => {
    if (!timeLeft || hasSubmitted) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);

          autoSubmitInterview();

          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, hasSubmitted]);

  // ---------- REFS ----------
  const recognitionRef = useRef(null);

  const mediaRecorderRef = useRef(null);

  const audioChunksRef = useRef([]);

  // ---------- SPEAK QUESTION ----------
  const speakText = (text) => {
    if (!window.speechSynthesis) return;

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);

    utterance.lang = "en-US";

    utterance.rate = 1;

    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    if (currentQuestion) {
      speakText(currentQuestion);
    }
  }, [currentQuestion]);

  // ---------- SPEECH RECOGNITION ----------
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();

    recognition.continuous = true;

    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event) => {
      let transcript = "";

      for (let i = 0; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript + " ";
      }

      setAnswer(transcript);
    };
    recognition.onend = () => {
      if (
        isRecording &&
        mediaRecorderRef.current &&
        mediaRecorderRef.current.state === "recording"
      ) {
        recognition.start();
      }
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.stop();
    };
  }, []);

  // ---------- TAB SWITCH AUTO SUBMIT ----------
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && !hasSubmitted) {
        alert("Tab switching detected. Interview auto-submitted.");

        autoSubmitInterview();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [hasSubmitted, responses, answer, currentQuestion]);

  // ---------- START RECORDING ----------
  const startRecording = async () => {
    try {
      setHasVoiceAnswer(true);

      setAnswer("");

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      const mediaRecorder = new MediaRecorder(stream);

      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.start(100);
      mediaRecorderRef.current = mediaRecorder;

      recognitionRef.current?.start();

      setIsRecording(true);
    } catch (error) {
      console.error(error);
    }
  };

  // ---------- STOP RECORDING ----------
  const stopRecording = () => {
    setIsRecording(false);

    recognitionRef.current?.stop();

    mediaRecorderRef.current?.stop();

    mediaRecorderRef.current?.stream
      ?.getTracks()
      ?.forEach((track) => track.stop());
  };
  // ---------- AUTO SUBMIT ----------
  const autoSubmitInterview = async () => {
    if (hasSubmitted) return;

    setHasSubmitted(true);

    if (isRecording) {
      stopRecording();

      await new Promise((resolve) => setTimeout(resolve, 1500));
    }

    let audioBlob = null;

    if (audioChunksRef.current.length > 0) {
      audioBlob = new Blob(audioChunksRef.current, {
        type: "audio/webm",
      });
    }

    const updatedResponses = [
      ...responses,

      {
        question: currentQuestion,

        answer: answer.trim(),

        audio: audioBlob,
      },
    ];

    submitForEvaluation(updatedResponses);
  };
  // ---------- NEXT ----------
  // ---------- NEXT ----------
  const handleNext = async () => {
    if (hasSubmitted) return;

    // stop recording first
    if (isRecording) {
      stopRecording();

      // wait for final audio chunk
      await new Promise((resolve) => setTimeout(resolve, 1800));
    }

    let audioBlob = null;

    if (audioChunksRef.current.length > 0) {
      audioBlob = new Blob(audioChunksRef.current, {
        type: "audio/webm",
      });
    }

    const updatedResponses = [
      ...responses,

      {
        question: currentQuestion,

        answer: answer.trim(),

        audio: audioBlob,
      },
    ];

    setResponses(updatedResponses);

    setAnswer("");

    setHasVoiceAnswer(false);

    audioChunksRef.current = [];

    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setHasSubmitted(true);

      submitForEvaluation(updatedResponses);
    }
  };

  const submitForEvaluation = async (finalResponses) => {
    try {
      setIsEvaluating(true);

      const user = JSON.parse(localStorage.getItem("user") || "{}");

      const formData = new FormData();
      console.log(JSON.parse(localStorage.getItem("user")));
      formData.append("userId", user.id);

      formData.append("companyName", companyName);
      formData.append("interviewType", interviewType);

      finalResponses.forEach((response, index) => {
        formData.append(`responses[${index}][question]`, response.question);
        formData.append(`responses[${index}][answer]`, response.answer);

        if (response.audio) {
          formData.append(
            `responses[${index}][audio]`,
            response.audio,
            `audio-${index}.webm`,
          );
        }
      });

      const totalInterviewTime =
        interviewType?.toLowerCase() === "mixed"
          ? 45 * 60 - timeLeft
          : 30 * 60 - timeLeft;

      formData.append("interviewDuration", totalInterviewTime);

      const res = await axios.post(
        `${baseURL}/api/companies/evaluate`,
        formData,
      );

      setEvaluation(res.data);
    } catch (error) {
      console.error(error);
      setEvalError(
        "Evaluation failed. Gemini may be overloaded. Please try again.",
      );
    } finally {
      setIsEvaluating(false);
    }
  };
  // ---------- LOADING ----------
  if (isEvaluating) {
    return (
      <Container
        maxWidth="sm"
        sx={{
          mt: {
            xs: 10,
            md: 14,
          },
          textAlign: "center",
        }}
      >
        <Typography variant="h4" fontWeight={700} mb={2}>
          AI is analyzing your interview
        </Typography>

        <Typography
          sx={{
            color: "#6b7280",
            mb: 4,
          }}
        >
          Evaluating communication, fluency, confidence, fillers, speaking pace,
          and answer quality.
        </Typography>

        <LinearProgress
          sx={{
            height: 10,
            borderRadius: 10,
          }}
        />
      </Container>
    );
  }

  if (evalError) {
    return (
      <Container maxWidth="sm" sx={{ mt: 14, textAlign: "center" }}>
        <Typography variant="h5" fontWeight={700} mb={2} color="#ef4444">
          Evaluation Failed
        </Typography>
        <Typography color="#6b7280" mb={4}>
          {evalError}
        </Typography>
        <Button
          variant="contained"
          onClick={() => navigate("/mock-interviews")}
          sx={{
            borderRadius: "12px",
            textTransform: "none",
            fontWeight: 700,
            background: "#4f46e5",
          }}
        >
          Back to Interviews
        </Button>
      </Container>
    );
  }
  //result diplay
  if (evaluation) {
    const scoreCards = [
      {
        title: "Communication",
        value: evaluation.communicationScore || 0,
      },

      {
        title: "Technical",
        value: evaluation.technicalScore || 0,
      },

      {
        title: "Confidence",
        value: evaluation.confidenceScore || 0,
      },

      {
        title: "Fluency",
        value: evaluation.fluencyScore || 0,
      },
    ];

    return (
      <Container
        maxWidth="xl"
        sx={{
          py: 5,

          px: {
            xs: 2,
            md: 4,
          },

          minHeight: "100vh",
        }}
      >
        {/* HERO */}
        <Box
          sx={{
            background: "linear-gradient(135deg,#4f46e5 0%, #6366f1 100%)",

            borderRadius: "24px",

            p: {
              xs: 3,
              md: 5,
            },

            color: "#fff",

            mb: 4,
          }}
        >
          <Grid container spacing={4} alignItems="center">
            {/* SCORE */}
            <Grid item xs={12} md={4}>
              <Box
                sx={{
                  width: {
                    xs: 160,
                    md: 200,
                  },

                  height: {
                    xs: 160,
                    md: 200,
                  },

                  borderRadius: "50%",

                  background: `conic-gradient(
                  #a5b4fc 0% ${
                    (safeValue(evaluation.overallScore, 0) / 10) * 100
                  }%,
                  rgba(255,255,255,0.12) ${
                    (safeValue(evaluation.overallScore, 0) / 10) * 100
                  }% 100%
                )`,

                  display: "flex",

                  alignItems: "center",

                  justifyContent: "center",

                  mx: {
                    xs: "auto",
                    md: 0,
                  },
                }}
              >
                <Box
                  sx={{
                    width: "78%",

                    height: "78%",

                    borderRadius: "50%",

                    background: "linear-gradient(135deg,#4f46e5,#6366f1)",

                    display: "flex",

                    flexDirection: "column",

                    alignItems: "center",

                    justifyContent: "center",
                  }}
                >
                  <Typography
                    variant="h2"
                    fontWeight={800}
                    color="#fff"
                    sx={{
                      display: "flex",
                      alignItems: "flex-end",
                      gap: 0.5,
                    }}
                  >
                    {safeValue(evaluation.overallScore, 0)}

                    <Typography
                      component="span"
                      sx={{
                        fontSize: "1.2rem",

                        fontWeight: 700,

                        mb: 1,
                      }}
                    >
                      /10
                    </Typography>
                  </Typography>

                  <Typography
                    sx={{
                      opacity: 0.9,
                    }}
                  >
                    Overall Score
                  </Typography>
                </Box>
              </Box>
            </Grid>

            {/* TEXT */}
            <Grid item xs={12} md={8}>
              <Typography
                variant="h3"
                fontWeight={800}
                sx={{
                  mb: 1,
                }}
              >
                Interview Analysis
              </Typography>

              <Typography
                sx={{
                  opacity: 0.9,

                  lineHeight: 1.8,

                  mb: 3,

                  maxWidth: 700,
                }}
              >
                AI-powered communication and interview evaluation with detailed
                analysis of confidence, fluency, speaking pace, and technical
                performance.
              </Typography>

              <Typography
                variant="h5"
                fontWeight={700}
                sx={{
                  mb: 2,
                }}
              >
                {evaluation.verdict || "Interview Evaluated"}
              </Typography>

              <Chip
                label={`${interviewType} Interview`}
                sx={{
                  background: "rgba(255,255,255,0.15)",

                  color: "#fff",

                  fontWeight: 700,
                }}
              />
            </Grid>
          </Grid>
        </Box>

        {/* MAIN SCORES */}
        <Box
          sx={{
            display: "grid",

            gridTemplateColumns: {
              xs: "1fr",
              sm: "1fr 1fr",
              md: "repeat(4, 1fr)",
            },

            gap: 3,

            mb: 5,

            width: "100%",
          }}
        >
          {scoreCards.map((item, index) => (
            <Box
              key={index}
              sx={{
                background: "#fff",

                borderRadius: "20px",

                p: 4,

                height: "230px",

                width: "100%",

                border: "1px solid #e2e8f0",

                transition: "0.2s",

                display: "flex",

                flexDirection: "column",

                justifyContent: "space-between",

                "&:hover": {
                  borderColor: "#4f46e5",

                  transform: "translateY(-3px)",
                },
              }}
            >
              <Typography
                sx={{
                  color: "#64748b",

                  mb: 2,

                  fontWeight: 600,

                  fontSize: "1.1rem",
                }}
              >
                {item.title}
              </Typography>

              <Typography
                variant="h2"
                fontWeight={800}
                sx={{
                  mb: 2,

                  color: "#4f46e5",

                  display: "flex",

                  alignItems: "flex-end",

                  gap: 0.5,
                }}
              >
                {safeValue(item.value, 0)}

                <Typography
                  component="span"
                  sx={{
                    fontSize: "1.1rem",

                    color: "#64748b",

                    fontWeight: 700,

                    mb: 1,
                  }}
                >
                  /10
                </Typography>
              </Typography>

              <LinearProgress
                variant="determinate"
                value={(safeValue(item.value, 0) / 10) * 100}
                sx={{
                  height: 10,

                  borderRadius: 10,

                  backgroundColor: "#e2e8f0",

                  "& .MuiLinearProgress-bar": {
                    borderRadius: 10,

                    background: "linear-gradient(90deg,#4f46e5,#6366f1)",
                  },
                }}
              />
            </Box>
          ))}
        </Box>

        {/* ANALYTICS */}
        {evaluation.fluencyScore > 0 && (
          <Box
            sx={{
              background: "#fff",

              borderRadius: "20px",

              p: 4,

              mb: 4,

              border: "1px solid #e2e8f0",
            }}
          >
            <Typography variant="h5" fontWeight={800} mb={4} color="#111827">
              Communication Analytics
            </Typography>

            <Box
              sx={{
                display: "grid",

                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "1fr 1fr",
                  lg: "repeat(4, 1fr)",
                },

                gap: 3,
              }}
            >
              {[
                {
                  label: "Fluency Score",
                  value: `${safeValue(evaluation.fluencyScore, 0)}/10`,
                  icon: <GraphicEqRoundedIcon />,
                },

                {
                  label: "Filler Words",
                  value: safeValue(evaluation.fillerWords, 0),
                  icon: <DescriptionRoundedIcon />,
                },

                {
                  label: "Speaking Pace",
                  value: safeValue(evaluation.speakingPace, "Balanced"),
                  icon: <SpeedRoundedIcon />,
                },

                {
                  label: "Long Pauses",
                  value: safeValue(evaluation.longPauseCount, 0),
                  icon: <PauseCircleRoundedIcon />,
                },

                {
                  label: "Words Per Minute",
                  value: safeValue(evaluation.wordsPerMinute, 0),
                  icon: <TimerRoundedIcon />,
                },

                {
                  label: "Positive Tone",
                  value: safeValue(evaluation.positiveSentiment, "Neutral"),
                  icon: <SentimentSatisfiedAltRoundedIcon />,
                },

                {
                  label: "Negative Tone",
                  value: safeValue(evaluation.negativeSentiment, "Low"),
                  icon: <SentimentDissatisfiedRoundedIcon />,
                },

                {
                  label: "Interview Duration",
                  value: `${(
                    safeValue(evaluation.interviewDuration, 0) / 60
                  ).toFixed(1)} min`,
                  icon: <AccessTimeRoundedIcon />,
                },
              ].map((item, index) => (
                <Box
                  key={index}
                  sx={{
                    background: "#fff",

                    borderRadius: "16px",

                    p: 3,

                    minHeight: "170px",

                    border: "1px solid #e2e8f0",

                    display: "flex",

                    flexDirection: "column",

                    justifyContent: "center",

                    transition: "0.2s",

                    "&:hover": {
                      borderColor: "#4f46e5",

                      transform: "translateY(-2px)",
                    },
                  }}
                >
                  <Box
                    sx={{
                      width: 52,

                      height: 52,

                      borderRadius: "14px",

                      background: "#eef2ff",

                      display: "flex",

                      alignItems: "center",

                      justifyContent: "center",

                      mb: 2,

                      "& svg": {
                        color: "#4f46e5",

                        fontSize: 28,
                      },
                    }}
                  >
                    {item.icon}
                  </Box>

                  <Typography
                    sx={{
                      color: "#64748b",

                      fontSize: "1rem",

                      mb: 1,
                    }}
                  >
                    {item.label}
                  </Typography>

                  <Typography fontWeight={800} fontSize="2rem" color="#111827">
                    {item.value}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        )}
        {/* FEEDBACK */}
        {[
          {
            title: "Strengths",
            data: evaluation.strengths || [],
          },

          {
            title: "Weaknesses",
            data: evaluation.weaknesses || [],
          },

          {
            title: "Suggestions",
            data: evaluation.suggestions || [],
          },
        ].map((section, index) => (
          <Box
            key={index}
            sx={{
              background: "#fff",

              borderRadius: "20px",

              p: 4,

              border: "1px solid #e2e8f0",

              mb: 3,
            }}
          >
            <Typography
              fontWeight={800}
              fontSize="1.3rem"
              color="#4f46e5"
              mb={3}
            >
              {section.title}
            </Typography>

            <Box
              component="ul"
              sx={{
                pl: 2,
                m: 0,
              }}
            >
              {section.data.map((item, i) => (
                <Typography
                  component="li"
                  key={i}
                  sx={{
                    mb: 2,

                    lineHeight: 1.8,

                    color: "#334155",
                  }}
                >
                  {item}
                </Typography>
              ))}
            </Box>
          </Box>
        ))}

        {/* BUTTON */}
        <Box
          sx={{
            display: "flex",

            justifyContent: "center",

            mt: 5,
          }}
        >
          <Button
            variant="contained"
            onClick={() => navigate("/mock-interviews")}
            sx={{
              height: 54,

              px: 5,

              borderRadius: "14px",

              textTransform: "none",

              fontWeight: 700,

              fontSize: "1rem",

              background: "#4f46e5",

              boxShadow: "none",

              "&:hover": {
                background: "#4338ca",
              },
            }}
          >
            Back to Interviews
          </Button>
        </Box>
      </Container>
    );
  }
  // ---------- INTERVIEW VIEW ----------
  const progress =
    questions.length > 0 ? ((currentIndex + 1) / questions.length) * 100 : 0;
  return (
    <Container
      maxWidth="md"
      sx={{
        mt: 3,
        mb: 5,
      }}
    >
      {/* HEADER */}
      {/* HEADER */}
      <Box
        mb={3}
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: 2,
          flexWrap: "wrap",
        }}
      >
        <Box>
          <Typography
            sx={{
              fontSize: {
                xs: "2.2rem",
                md: "2.8rem",
              },

              fontWeight: 800,

              lineHeight: 1.1,

              color: "#111827",
            }}
          >
            <span
              style={{
                color: "#4f46e5",
              }}
            >
              {companyName}
            </span>{" "}
            Interview
          </Typography>

          <Typography
            sx={{
              color: "#6b7280",

              mt: 1,

              fontSize: "0.98rem",

              fontWeight: 500,
            }}
          >
            AI-powered mock interview with communication and technical
            evaluation.
          </Typography>
        </Box>

        {/* TIMER */}
        <Box
          sx={{
            minWidth: "100px",

            height: "44px",

            borderRadius: "12px",

            background:
              timeLeft <= 300
                ? "linear-gradient(135deg,#ef4444,#dc2626)"
                : "linear-gradient(135deg,#4f46e5,#4338ca)",

            display: "flex",

            alignItems: "center",

            justifyContent: "center",

            px: 2,

            boxShadow:
              timeLeft <= 300
                ? "0 4px 10px rgba(239,68,68,0.12)"
                : "0 4px 10px rgba(79,70,229,0.12)",
          }}
        >
          <Typography
            sx={{
              color: "#fff",

              fontWeight: 800,

              fontSize: "1rem",

              letterSpacing: 1,
            }}
          >
            {String(Math.floor(timeLeft / 60)).padStart(2, "0")}:
            {String(timeLeft % 60).padStart(2, "0")}
          </Typography>
        </Box>
      </Box>

      {/* PROGRESS */}
      <LinearProgress
        variant="determinate"
        value={progress}
        sx={{
          height: 8,

          borderRadius: 999,

          mb: 3.5,

          backgroundColor: "#e5e7eb",

          "& .MuiLinearProgress-bar": {
            borderRadius: 999,

            background: "#4f46e5",
          },
        }}
      />

      {/* QUESTION CARD */}
      <Box
        sx={{
          backgroundColor: "#fff",

          borderRadius: "20px",

          p: 3.5,

          border: "1px solid #e5e7eb",

          mb: 2.5,
        }}
      >
        <Typography
          sx={{
            fontWeight: 700,

            mb: 2,

            color: "#4f46e5",

            fontSize: "1rem",
          }}
        >
          Question {currentIndex + 1} of {questions.length}
        </Typography>

        <Typography
          sx={{
            fontSize: "1.15rem",

            lineHeight: 1.9,

            color: "#111827",

            fontWeight: 500,
          }}
        >
          {currentQuestion}
        </Typography>
      </Box>

      {/* ANSWER BOX */}
      <TextField
        fullWidth
        multiline
        rows={3}
        value={answer}
        disabled={hasVoiceAnswer}
        placeholder={
          hasVoiceAnswer
            ? "AI is transcribing your voice response..."
            : "Type answer or record for communication analysis..."
        }
        onChange={(e) => setAnswer(e.target.value)}
        sx={{
          mb: 2.5,

          "& .MuiOutlinedInput-root": {
            borderRadius: "16px",

            backgroundColor: "#fff",

            fontSize: "1rem",

            lineHeight: 1.7,

            "& fieldset": {
              borderColor: "#dbe2ea",
            },

            "&:hover fieldset": {
              borderColor: "#4f46e5",
            },

            "&.Mui-focused fieldset": {
              borderColor: "#4f46e5",

              borderWidth: "2px",
            },
          },
        }}
      />

      {/* RECORDING STATUS */}
      {isRecording && (
        <Box
          sx={{
            display: "inline-flex",

            alignItems: "center",

            gap: 1,

            mb: 2.5,

            background: "#fef2f2",

            border: "1px solid #fecaca",

            borderRadius: "999px",

            px: 2,

            py: 0.8,
          }}
        >
          <Box
            sx={{
              width: 9,
              height: 9,

              borderRadius: "50%",

              backgroundColor: "#ef4444",
            }}
          />

          <Typography
            sx={{
              color: "#dc2626",

              fontWeight: 700,

              fontSize: "0.9rem",

              whiteSpace: "nowrap",
            }}
          >
            Recording in progress...
          </Typography>
        </Box>
      )}

      {/* BUTTONS */}
      <Box
        sx={{
          display: "flex",

          justifyContent: "center",

          gap: 2,

          mt: 1,

          flexWrap: "wrap",
        }}
      >
        <Button
          onClick={isRecording ? stopRecording : startRecording}
          sx={{
            flex: 1,

            maxWidth: 240,

            height: 52,

            borderRadius: "14px",

            textTransform: "none",

            fontWeight: 700,

            fontSize: "0.95rem",

            backgroundColor: isRecording ? "#fee2e2" : "#eef2ff",

            color: isRecording ? "#dc2626" : "#4f46e5",

            border: "1px solid #dbeafe",

            "&:hover": {
              backgroundColor: isRecording ? "#fecaca" : "#e0e7ff",
            },
          }}
        >
          {isRecording ? "⏹ Stop Recording" : "🎤 Record Answer"}
        </Button>

        <Button
          onClick={handleNext}
          disabled={!answer.trim()}
          sx={{
            flex: 1,

            maxWidth: 240,

            height: 52,

            borderRadius: "14px",

            background: "#4f46e5",

            color: "#fff",

            fontWeight: 700,

            textTransform: "none",

            "&:hover": {
              background: "#4338ca",
            },

            "&.Mui-disabled": {
              background: "#cbd5e1",

              color: "#64748b",
            },
          }}
        >
          {currentIndex === questions.length - 1
            ? "Finish Interview"
            : "Next Question"}
        </Button>
      </Box>
    </Container>
  );
};

export default MockInterview;
