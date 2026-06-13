import React, { useState } from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

// MUI
import {
  Box,
  Typography,
  CircularProgress,
  Pagination,
  Chip,
} from "@mui/material";

const DsaQuestionsList = () => {
  const { topic } = useParams();
  const [page, setPage] = useState(1);
  const questionsPerPage = 5;
  const navigate = useNavigate();


  const fetchQuestions = async () => {
    const res = await axios.post(
      `http://localhost:8000/dsa/get-topic-wise-dsa-questions/?topic=${topic.toLowerCase()}`
    );
    console.log(res.data.data.topicWiseQuestions)
    return res.data.data.topicWiseQuestions;
  };


  const { data: questions = [], isLoading } = useQuery({
    queryKey: ["questions", topic],
    queryFn: fetchQuestions,
    staleTime: 1000 * 60 * 10,
  });

  // Pagination
  const indexOfLast = page * questionsPerPage;
  const indexOfFirst = indexOfLast - questionsPerPage;
  const currentQuestions = questions.slice(indexOfFirst, indexOfLast);



  const handlePageChange = (e, value) => {
    setPage(value);
  };

  
  const getDifficultyColor = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case "easy":
        return "success";
      case "medium":
        return "warning";
      case "hard":
        return "error";
      default:
        return "default";
    }
  };


  const handleQuestionClick = (questionId) =>{
    navigate(`/dsa-practise/${topic}/${questionId}`)
  }

  return (
    <Box
      sx={{
        p: 2,
        backgroundColor: "#ffff",
        minHeight: "100vh",
      }}
    >
      {isLoading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "80vh",
          }}
        >
          <CircularProgress />
        </Box>
      ) : (
        <>
          {/* Topic Title */}
          <Typography variant="h5" mb={4} fontWeight="bold">
            {topic.toUpperCase()} Questions
          </Typography>

          {/* Questions List */}
          <Box display="flex" flexDirection="column" gap={2}>
            {currentQuestions.map((q, index) => (
              <Box
                onClick = {()=>handleQuestionClick(q._id)}
                key={index}
                sx={{
                  borderRadius: 1,
                  p: 2,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  boxShadow:2,
                  transition: "all 0.3s ease",
                  "&:hover": {
                    backgroundColor: "#eaeaea",
                    cursor: "pointer"
                  },
                }}
              >

                <Typography sx={{ flex: 1, textAlign: "left", marginLeft: 1, }}>
                  {q.title}
                </Typography>



                <Typography
                  sx={{
                    color: q.solved ? "#4caf50" : "#ff5252",
                    fontWeight: "bold",
                    marginRight: 1,
                  }}
                >
                  {q.solved ? "Solved" : "Not Solved"}
                </Typography>



                <Chip
                  label={q.difficultyLevel}
                  color={getDifficultyColor(q.difficultyLevel)}
                  variant="outlined"
                  sx={{marginRight: 1}}
                />


                
              </Box>
            ))}
          </Box>

          {/* Pagination */}
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