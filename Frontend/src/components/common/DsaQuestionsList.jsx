
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Typography, CircularProgress, Pagination, Chip } from "@mui/material";

const DsaQuestionsList = () => {
  const { topic } = useParams();
  const [page, setPage] = useState(1);
  const [solvedIds, setSolvedIds] = useState([]);
  const questionsPerPage = 5;
  const navigate = useNavigate();

  // fetch solved question IDs
  useEffect(() => {
    const fetchSolved = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        if (!user.id) return;
        const res = await axios.get(
          `http://localhost:8000/api/dsa/get-solved-questions?userId=${user.id}`
        );
        setSolvedIds(res.data.data.solvedIds || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchSolved();
  }, []);

  const fetchQuestions = async () => {
    const res = await axios.post(
      `http://localhost:8000/api/dsa/get-topic-wise-dsa-questions/?topic=${topic.toLowerCase()}`
    );
    return res.data.data.topicWiseQuestions;
  };

  const { data: questions = [], isLoading } = useQuery({
    queryKey: ["questions", topic],
    queryFn: fetchQuestions,
    staleTime: 1000 * 60 * 10,
  });

  const indexOfLast = page * questionsPerPage;
  const indexOfFirst = indexOfLast - questionsPerPage;
  const currentQuestions = questions.slice(indexOfFirst, indexOfLast);

  const handlePageChange = (e, value) => setPage(value);

  const getDifficultyColor = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case "easy": return "success";
      case "medium": return "warning";
      case "hard": return "error";
      default: return "default";
    }
  };

  const handleQuestionClick = (questionId) => {
    navigate(`/dsa-practise/${topic}/${questionId}`);
  };

  return (
    <Box sx={{ p: 2, minHeight: "100vh" }}>
      {isLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "80vh" }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Typography variant="h5" mb={4} fontWeight="bold">
            {topic.toUpperCase()} Questions
          </Typography>

          <Box display="flex" flexDirection="column" gap={2}>
            {currentQuestions.map((q, index) => {
              const isSolved = solvedIds.includes(q._id.toString()); // ✅
              return (
                <Box
                  onClick={() => handleQuestionClick(q._id)}
                  key={index}
                  sx={{
                    borderRadius: 1,
                    p: 2,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    boxShadow: 2,
                    transition: "all 0.3s ease",
                    "&:hover": { backgroundColor: "#eaeaea", cursor: "pointer" },
                  }}
                >
                  <Typography sx={{ flex: 1, textAlign: "left", marginLeft: 1 }}>
                    {q.title}
                  </Typography>

                  <Typography
                    sx={{
                      color: isSolved ? "#4caf50" : "#ff5252",
                      fontWeight: "bold",
                      marginRight: 1,
                    }}
                  >
                    {isSolved ? "Solved" : "Not Solved"}
                  </Typography>

                  <Chip
                    label={q.difficultyLevel}
                    color={getDifficultyColor(q.difficultyLevel)}
                    variant="outlined"
                    sx={{ marginRight: 1 }}
                  />
                </Box>
              );
            })}
          </Box>

          <Box mt={5} display="flex" justifyContent="center">
            <Pagination
              count={Math.ceil(questions.length / questionsPerPage)}
              page={page}
              onChange={handlePageChange}
              color="primary"
            />
          </Box>
        </>
      )}
    </Box>
  );
};

export default DsaQuestionsList;
