import { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Typography,
  TextField,
  Card,
  CardContent,
  Box,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from "react-router-dom";

const CARD_WIDTH = 260;
const CARD_HEIGHT = 220;

const Company = () => {
  const [companies, setCompanies] = useState([]);
  const [search, setSearch] = useState("");

  const navigate = useNavigate();

  const baseURL = import.meta.env.VITE_BASE_URL || "http://localhost:8000"

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await axios.get(`${baseURL}/api/companies`);
        setCompanies(res.data);
      } catch (error) {
        console.error("Failed to fetch companies", error);
      }
    };

    fetchCompanies();
  }, []);

  const filteredCompanies = companies.filter((company) =>
    company.companyName.toLowerCase().includes(search.toLowerCase()),
  );

  const handleCompanyClick = (company) => {
    navigate(`/mock-interview/${company.companyName}`);
  };
  return (
    <Container maxWidth="xl" sx={{ mt: 6, pb: 6 }}>
      {/* Heading */}
      <Typography variant="h4" fontWeight={700} mb={1}>
        Select Company for{" "}
        <span style={{ color: "#4f46e5" }}>Mock Interview</span>
      </Typography>

      <Typography color="text.secondary" mb={4}>
        Choose from companies recruiting at VESIT
      </Typography>

      {/* Search */}
      <TextField
        fullWidth
        placeholder="Search companies..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        InputProps={{
          startAdornment: <SearchIcon sx={{ mr: 1, color: "#9ca3af" }} />,
        }}
        sx={{
          mb: 6,
          "& .MuiOutlinedInput-root": {
            height: 56,
            borderRadius: "14px",
          },
        }}
      />

      {/* Cards Grid */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: "32px",
          justifyItems: "center",
        }}
      >
        {filteredCompanies.map((company) => {
          const initials = company.companyName
            .split(" ")
            .map((word) => word[0])
            .join("")
            .slice(0, 2)
            .toUpperCase();

          return (
            <Card
              key={company._id}
              onClick={() => handleCompanyClick(company)}
              sx={{
                width: CARD_WIDTH,
                height: CARD_HEIGHT,
                borderRadius: "20px",
                cursor: "pointer",
                border: "1px solid #e5e7eb", // ✅ grey border
                transition: "all 0.25s ease",
                backgroundColor: "#fff",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: "0 6px 12px rgba(0,0,0,0.06)",
                  borderColor: "#e0e7ff",
                },
              }}
            >
              <CardContent
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 2,
                }}
              >
                {/* Icon */}
                <Box
                  sx={{
                    width: 72,
                    height: 72,
                    borderRadius: "18px",
                    background: "linear-gradient(135deg, #e0e7ff, #eef2ff)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 700,
                    fontSize: 22,
                    color: "#4f46e5",
                    boxShadow: "0 6px 14px rgba(79,70,229,0.25)",
                  }}
                >
                  {initials}
                </Box>

                {/* Company name */}
                <Typography fontWeight={600} fontSize="1.05rem" align="center">
                  {company.companyName}
                </Typography>
              </CardContent>
            </Card>
          );
        })}
      </Box>
    </Container>
  );
};

export default Company;
