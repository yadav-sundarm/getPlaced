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
          `http://localhost:8000/aptitude-questions/get-${category}-questions`,
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
    <>
      <Typography variant="h5" fontWeight={600} mb={3}>
        {category.toUpperCase()} Tests
      </Typography>

      <Box display="flex" flexDirection="column" gap={2}>
        {Object.keys(tests).map((testName) => (
          <Card
            key={testName}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              p: 2.5,
              borderRadius: 3,
            }}
          >
            <Box display="flex" alignItems="center" gap={1}>
              <NoteAltIcon color="primary" />
              <Typography fontWeight={600}>{testName}</Typography>
            </Box>

            <Button
              variant="contained"
              onClick={() =>
                navigate(`/aptitude-questions/${category}/test/${testName}`, {
                  state:{
                    category,
                    testName,
                  }
                })
              }
            >
              Start Mock Test
            </Button>
          </Card>
        ))}
      </Box>
    </>
  );
}
