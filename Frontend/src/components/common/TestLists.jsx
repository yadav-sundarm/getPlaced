import { useEffect, useState } from "react";
import axios from "axios";
import { Typography, Card, Button, Box } from "@mui/material";
import NoteAltIcon from "@mui/icons-material/NoteAlt";
import { useNavigate, useParams } from "react-router-dom";

export default function TestLists() {
  const { category } = useParams();
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [tests, setTests] = useState({});

  // Split questions into tests
  const splitInTests = () => {
    const QUESTIONS_PER_TEST = 20;
    let testObj = {};
    let temp = [];
    let testCount = 1;

    questions.forEach((q) => {
      temp.push(q);

      if (temp.length === QUESTIONS_PER_TEST) {
        testObj[`Test${testCount}`] = temp;
        temp = [];
        testCount++;
      }
    });

    // Add remaining questions if at least 10
    if (temp.length >= 10) {
      testObj[`Test${testCount}`] = temp;
    }

    setTests(testObj);
  };

  // Fetch questions from backend
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const fetchQuestions = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8000/api/aptitude-questions/get-${category}-questions`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        console.log(res);

        const questionsArray = Object.values(res.data.data.allQuestions);
        setQuestions(questionsArray);
      } catch (err) {
        console.error("Error fetching questions:", err);
      }
    };

    fetchQuestions();
  }, [category]);

  console.log(tests)

  useEffect(() => {
    if (questions.length > 0) splitInTests();
  }, [questions]);

  return (
    <Box sx={{ px: { xs: 2, md: 4 }, py: { xs: 3, md: 4 }, minHeight: "80vh" }}>
      <Box
        sx={{
          maxWidth: 980,
          mx: "auto",
          p: { xs: 3, md: 4 },
          borderRadius: 3,
          background: "linear-gradient(180deg, rgba(99, 102, 241, 0.08) 0%, rgba(99, 102, 241, 0.02) 100%)",
          boxShadow: "0 28px 80px rgba(99, 102, 241, 0.08)",
        }}
      >
        <Typography variant="h4" fontWeight={700} gutterBottom>
          {category.toUpperCase()} Tests
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 640 }}>
          Choose a mock test below to practise your aptitude skills. Every test is grouped neatly so you can start from the right level.
        </Typography>

        <Box display="grid" gap={3}>
          {Object.keys(tests).map((testName) => (
            <Card
              key={testName}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                p: 3,
                borderRadius: 3,
                border: "1px solid rgba(99, 102, 241, 0.14)",
                backgroundColor: "rgba(255,255,255,0.95)",
                transition: "transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease",
                '&:hover': {
                  transform: "translateY(-4px)",
                  boxShadow: "0 22px 45px rgba(99, 102, 241, 0.12)",
                  borderColor: "rgba(99, 102, 241, 0.24)",
                },
              }}
            >
              <Box display="flex" alignItems="center" gap={2}>
                <Box
                  sx={{
                    width: 44,
                    height: 44,
                    borderRadius: 2,
                    backgroundColor: "rgba(99, 102, 241, 0.12)",
                    display: "grid",
                    placeItems: "center",
                  }}
                >
                  <NoteAltIcon color="primary" />
                </Box>
                <Box>
                  <Typography fontWeight={700} sx={{ letterSpacing: "0.01em" }}>
                    {testName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Ready to start your aptitude mock test.
                  </Typography>
                </Box>
              </Box>

              <Button
                variant="contained"
                sx={{
                  textTransform: "none",
                  borderRadius: 2,
                  px: 3,
                  py: 1.25,
                  boxShadow: "none",
                }}
                onClick={() =>
                  navigate(`/aptitude-questions/${category}/test/${testName}`, {
                    state: {
                      category,
                      testName,
                    },
                  })
                }
              >
                Start Mock Test
              </Button>
            </Card>
          ))}
        </Box>
      </Box>
    </Box>
  );
}
