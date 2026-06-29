import { Container, Typography } from "@mui/material";
import PracticeCards from "../components/common/PractiseCards";
import MockTestBanner from "../components/common/MockTestBanner";

export default function AptitudePractice() {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" fontWeight={600}>
        Practice <span style={{ color: "#6366F1" }}>Aptitude</span>
      </Typography>

      <Typography color="text.secondary" mb={4}>
        Improve your quantitative and logical reasoning skills
      </Typography>

      <PracticeCards />
      <MockTestBanner />
    </Container>
  );
}
