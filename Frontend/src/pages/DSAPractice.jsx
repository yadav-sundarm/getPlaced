import React, { useState } from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

// MUI
import {
  Box,
  Typography,
  Grid,
  Card,
  CardActionArea,
  CircularProgress,
  Pagination,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const DSAPractice = () => {
  const [page, setPage] = useState(1);
  const topicsPerPage = 9;
  const navigate = useNavigate();

  // ✅ Correct fetch function
  const fetchTopics = async () => {
    const res = await axios.get("http://localhost:8000/dsa/get-dsa-topics");
    return res.data.data.allUniqueTopics;
  };

  // ✅ React Query
  const { data: dsaTopics = [], isLoading } = useQuery({
    queryKey: ["dsaTopics"],
    queryFn: fetchTopics,
    staleTime: 1000 * 60 * 10, // 10 mins cache
  });

  // Pagination
  const indexOfLast = page * topicsPerPage;
  const indexOfFirst = indexOfLast - topicsPerPage;
  const currentTopics = dsaTopics.slice(indexOfFirst, indexOfLast);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleClick = (topic) => {
    navigate(`/dsa-practise/${topic}`);
  };

  return (
    <Box sx={{ p: 5 }}>
      {/* Loader */}
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
          {/* Heading */}
          <Typography variant="h4" fontWeight="bold" mb={1}>
            DSA <span style={{ color: "#6366F1" }}>Playground</span>
          </Typography>
          <Typography variant="body1" color="text.secondary" mb={5}>
            Practice your Data Structures & Algorithms topics
          </Typography>

          {/* Grid */}
          <Grid container spacing={4}>
            {currentTopics.map((topic, index) => (
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                key={index}
                sx={{ display: "flex" }}
              >
                <Card
                  sx={{
                    flex: 1,
                    height: 50,
                    p: 2,
                    borderRadius: 1,
                    boxShadow: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    outline: "none", // ✅
                    "&:focus": { outline: "none" }, // ✅
                    "&:focus-visible": { outline: "none" }, // ✅
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "scale(1.03)",
                      boxShadow: 5,
                      backgroundColor: "#5a34f6",
                      color: "#fff",
                    },
                  }}
                >
                  <CardActionArea
                    disableRipple
                    disableTouchRipple
                    onClick={() => handleClick(topic)}
                    sx={{
                      height: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      outline: "none",
                      border: "none",
                      "&:focus": {
                        outline: "none",
                      },
                      "&:focus-visible": {
                        outline: "none",
                      },
                      "&.Mui-focusVisible": {
                        backgroundColor: "transparent",
                      },
                    }}
                  >
                    <Typography variant="h6" textAlign="center">
                      {topic}
                    </Typography>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Pagination */}
          <Box mt={6} display="flex" justifyContent="center">
            <Pagination
              count={Math.ceil(dsaTopics.length / topicsPerPage)}
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

export default DSAPractice;
