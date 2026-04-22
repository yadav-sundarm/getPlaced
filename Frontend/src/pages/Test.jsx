// import { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import axios from "axios";
// import {
//   Typography,
//   Card,
//   CardContent,
//   Box,
//   Button,
//   RadioGroup,
//   FormControlLabel,
//   Radio,
//   Divider,
//   CircularProgress,
// } from "@mui/material";

// export default function Test() {
//   const { category, testName } = useParams();
//   const navigate = useNavigate();

//   const [questions, setQuestions] = useState([]);
//   const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
//   const [answers, setAnswers] = useState({});
//   const [loading, setLoading] = useState(false);
//   const [submitting, setSubmitting] = useState(false); // 🔥 NEW
//   const [submitted, setSubmitted] = useState(false);
//   const [score, setScore] = useState(0);

//   useEffect(() => {
//     if (!category || !testName) return;

//     const fetchQuestions = async () => {
//       try {
//         setLoading(true);

//         const res = await axios.get(
//           `http://localhost:8000/aptitude-questions/get-${category}-questions`
//         );

//         const allQuestions = Object.values(
//           res.data.data.allQuestions
//         ).map((q) => ({
//           ...q,
//           options: q.options
//             ? Object.entries(q.options).map(([key, value]) => ({
//                 key,
//                 value,
//               }))
//             : [],
//         }));

//         const QUESTIONS_PER_TEST = 20;
//         const testNumber = parseInt(testName.replace("Test", ""));
//         const startIndex = (testNumber - 1) * QUESTIONS_PER_TEST;
//         const endIndex = startIndex + QUESTIONS_PER_TEST;

//         setQuestions(allQuestions.slice(startIndex, endIndex));
//         setLoading(false);
//       } catch (err) {
//         console.error(err);
//         setLoading(false);
//       }
//     };

//     fetchQuestions();
//   }, [category, testName]);

//   if (loading) return <Typography>Loading questions...</Typography>;
//   if (!questions.length)
//     return <Typography>No questions available.</Typography>;

//   const currentQuestion = questions[currentQuestionIndex];

//   const handleAnswerSelect = (questionId, optionKey) => {
//     if (submitted) return;
//     setAnswers((prev) => ({ ...prev, [questionId]: optionKey }));
//   };

//   // 🔥 BACKEND-DRIVEN SUBMIT WITH LOADER
//   const handleSubmit = async () => {
//     try {
//       setSubmitting(true);

//       const res = await axios.post(
//         "http://localhost:8000/aptitude-questions/submit-test",
//         { answers }
//       );

//       setScore(res?.data?.data?.score);
//       setSubmitted(true);
//     } catch (err) {
//       console.error("Submit failed:", err);
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const handleExit = () => {
//     navigate(`/aptitude-questions/${category}`);
//   };

//   return (
//     <Box sx={{ p: 3 }}>
//       <Typography variant="h5" fontWeight={600} gutterBottom>
//         {category.toUpperCase()} {testName} – Question{" "}
//         {currentQuestionIndex + 1} of {questions.length}
//       </Typography>

//       {/* 🔥 SUBMITTING LOADER */}
//       {submitting && (
//         <Card sx={{ mb: 3 }}>
//           <CardContent sx={{ display: "flex", alignItems: "center", gap: 2 }}>
//             <CircularProgress size={26} />
//             <Typography fontWeight={500}>
//               Evaluating your answers…
//             </Typography>
//           </CardContent>
//         </Card>
//       )}

//       {/* ✅ SCORE CARD */}
//       {submitted && !submitting && (
//         <Card sx={{ mb: 3, bgcolor: "#f0fdf4" }}>
//           <CardContent>
//             <Typography variant="h6" fontWeight={600}>
//               Test Submitted ✅
//             </Typography>
//             <Typography>
//               Score: <b>{score}</b>
//             </Typography>
//           </CardContent>
//         </Card>
//       )}

//       <Card variant="outlined">
//         <CardContent>
//           <Typography sx={{ mb: 2 }}>
//             {currentQuestion.question}
//           </Typography>

//           <RadioGroup
//             value={answers[currentQuestion._id] || ""}
//             onChange={(e) =>
//               handleAnswerSelect(
//                 currentQuestion._id,
//                 e.target.value
//               )
//             }
//           >
//             {currentQuestion.options.map((opt) => (
//               <FormControlLabel
//                 key={opt.key}
//                 value={opt.key}
//                 control={<Radio />}
//                 label={`${opt.key}: ${opt.value}`}
//                 disabled={submitted}
//               />
//             ))}
//           </RadioGroup>
//         </CardContent>
//       </Card>

//       <Divider sx={{ my: 3 }} />

//       <Box sx={{ display: "flex", gap: 2 }}>
//         <Button
//           variant="contained"
//           disabled={currentQuestionIndex === 0 || submitted}
//           onClick={() => setCurrentQuestionIndex((i) => i - 1)}
//         >
//           Previous
//         </Button>

//         <Button
//           variant="contained"
//           disabled={
//             currentQuestionIndex === questions.length - 1 ||
//             submitted
//           }
//           onClick={() => setCurrentQuestionIndex((i) => i + 1)}
//         >
//           Next
//         </Button>

//         {!submitted && (
//           <Button
//             variant="contained"
//             color="success"
//             onClick={handleSubmit}
//             disabled={submitting}
//           >
//             Submit Test
//           </Button>
//         )}

//         <Button
//           variant="outlined"
//           color="error"
//           onClick={handleExit}
//         >
//           Exit
//         </Button>
//       </Box>
//     </Box>
//   );
// }


import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
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

const TEST_DURATION = 20 * 60; // seconds

export default function Test() {
  const { category, testName } = useParams();
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

  const [showResult, setShowResult] = useState(false);

  // 🔥 SESSION INIT
  useEffect(() => {
    const testKey = `${category}-${testName}`;
    const stored = localStorage.getItem("testSession");

    if (!stored) {
      localStorage.setItem(
        "testSession",
        JSON.stringify({ testKey, startTime: Date.now() })
      );
    } else {
      const parsed = JSON.parse(stored);
      if (parsed.testKey !== testKey) {
        localStorage.setItem(
          "testSession",
          JSON.stringify({ testKey, startTime: Date.now() })
        );
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

    // reload safety
    const elapsedNow = Math.floor((Date.now() - start) / 1000);
    if (elapsedNow >= TEST_DURATION) {
      triggerSubmit();
    }

    return () => clearInterval(interval);
  }, [submitted]);

  // 🔥 TAB SWITCH
  useEffect(() => {
    if (submitted) return;

    const handleVisibility = () => {
      if (document.hidden) {
        setWarnings((prev) => prev + 1);
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibility);
  }, [submitted]);

  // 🔥 WARNINGS
  useEffect(() => {
    if (submitted) return;

    if (warnings > 0) {
      alert(`Tab switch detected! Warning ${warnings}/3`);
    }

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
          `http://localhost:8000/aptitude-questions/get-${category}-questions`
        );

        const allQuestions = Object.values(
          res.data.data.allQuestions
        ).map((q) => ({
          ...q,
          options: q.options
            ? Object.entries(q.options).map(([key, value]) => ({
                key,
                value,
              }))
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

  // 🔥 SAFE TRIGGER
  const triggerSubmit = () => {
    if (isSubmittingTriggered || submitted) return;
    setIsSubmittingTriggered(true);
    handleSubmit();
  };

  // 🔥 SUBMIT
  const handleSubmit = async () => {
    try {
      setSubmitting(true);

      const session = JSON.parse(localStorage.getItem("testSession"));

      const res = await axios.post(
        "http://localhost:8000/aptitude-questions/submit-test",
        {
          answers,
          startTime: session?.startTime,
        }
      );

      localStorage.removeItem("testSession");

      setScore(res?.data?.data?.score);
      setSubmitted(true);
      setShowResult(true); // ✅ show result first
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  // 🔥 RESULT → LOADER → REDIRECT FLOW
  useEffect(() => {
    if (submitted) {
      const resultTimer = setTimeout(() => {
        setShowResult(false);
        setShowLoader(true);
      }, 7000); // show score 7 sec

      const redirectTimer = setTimeout(() => {
        navigate("/aptitude-questions");
      }, 9000); // 7s + 2s loader

      return () => {
        clearTimeout(resultTimer);
        clearTimeout(redirectTimer);
      };
    }
  }, [submitted]);

  // 🔥 LOADER SCREEN


  if (loading) return <Typography>Loading...</Typography>;
  if (!questions.length) return <Typography>No questions</Typography>;

  const q = questions[currentQuestionIndex];

  return (
    <Box sx={{ p: 3 }}>
      {!submitted && (
        <Typography color="error">
          Time Left: {Math.floor(timeLeft / 60)}:
          {String(timeLeft % 60).padStart(2, "0")}
        </Typography>
      )}

      <Typography variant="h5">
        {category.toUpperCase()} {testName} – Question{" "}
        {currentQuestionIndex + 1}/{questions.length}
      </Typography>

      {submitting && <CircularProgress />}

      {/* ✅ RESULT */}
      {showResult && (
        <Card sx={{ my: 2, bgcolor: "#f0fdf4" }}>
          <CardContent>
            <Typography variant="h6">Test Submitted ✅</Typography>
            <Typography>
              Score: <b>{score}</b>
            </Typography>
            <Typography variant="body2">
              Redirecting shortly...
            </Typography>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent>
          <Typography>{q.question}</Typography>

          <RadioGroup
            value={answers[q._id] || ""}
            onChange={(e) =>
              handleAnswerSelect(q._id, e.target.value)
            }
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
        <Button
          disabled={submitted || currentQuestionIndex === 0}
          onClick={() => setCurrentQuestionIndex((i) => i - 1)}
        >
          Prev
        </Button>

        <Button
          disabled={
            submitted ||
            currentQuestionIndex === questions.length - 1
          }
          onClick={() => setCurrentQuestionIndex((i) => i + 1)}
        >
          Next
        </Button>

        {!submitted && (
          <Button color="success" onClick={triggerSubmit}>
            Submit
          </Button>
        )}

        <Button
          color="error"
          disabled={submitted}
          onClick={() => navigate("/aptitude-questions")}
        >
          Exit
        </Button>
      </Box>
    </Box>
  );
}