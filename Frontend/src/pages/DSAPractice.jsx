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

  const baseURL = import.meta.env.VITE_BASE_URL || "http://localhost:8000"

  // ✅ Correct fetch function
  const fetchTopics = async () => {
    const res = await axios.get(`${baseURL}/api/dsa/get-dsa-topics`);
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
          <Grid container spacing={3}>
            {currentTopics.map((topic, index) => (
              <Grid item xs={12} sm={4} md={4} key={index}>
                <Card
                  elevation={0}
                  sx={{
                    minHeight: 120,
                    borderRadius: 3,
                    overflow: "hidden",
                    background: "linear-gradient(180deg, #ffffff 0%, #f7f7ff 100%)",
                    border: "1px solid rgba(99, 102, 241, 0.16)",
                    boxShadow: "0 20px 45px rgba(99, 102, 241, 0.08)",
                    transition: "transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    "&:hover": {
                      transform: "translateY(-6px)",
                      boxShadow: "0 26px 55px rgba(99, 102, 241, 0.18)",
                      borderColor: "rgba(99, 102, 241, 0.32)",
                      background: "linear-gradient(180deg, #f4f5ff 0%, #e9ecff 100%)",
                    },
                  }}
                >
                  <CardActionArea
                    disableRipple
                    disableTouchRipple
                    onClick={() => handleClick(topic)}
                    sx={{
                      width: "100%",
                      height: "100%",
                      px: 3,
                      py: 2.5,
                      display: "grid",
                      gridTemplateRows: "auto 1fr",
                      gap: 1,
                      textAlign: "center",
                    }}
                  >
                    <Box
                      sx={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: 34,
                        height: 34,
                        borderRadius: "50%",
                        bgcolor: "rgba(99, 102, 241, 0.12)",
                        color: "#4f46e5",
                        mx: "auto",
                        fontWeight: 700,
                      }}
                    >
                      {String(index + 1)}
                    </Box>

                    <Typography
                      variant="h6"
                      fontWeight={800}
                      sx={{
                        letterSpacing: "0.02em",
                        color: "#111827",
                        textTransform: "capitalize",
                        lineHeight: 1.2,
                      }}
                    >
                      {topic}
                    </Typography>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        mt: 0.5,
                        px: 1,
                      }}
                    >
                      Practice problems and examples for this topic.
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
