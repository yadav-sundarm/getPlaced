import express from "express";
import "./config/dotenv.js";
import cors from "cors";
import { createServer } from "http";
import { connectToServer } from "./controllers/socketManager.js";
import resumeRoutes from "./routes/resume.routes.js";
import connectDB from "./db/db.js";
import TestRouter from "./routes/tests.routes.js";
import {
  seedAptitudeQuestionsInDatabase,
  seedDSAQuestionsInDatabase,
} from "./utils/seedQuestions.js";
import questionsModel from "./models/questions.model.js";
import DSAQuestion from "./models/dsaQuestion.model.js";
import dsaRouter from "./routes/dsa.routes.js";
import companiesRoutes from "./routes/mockInterview.routes.js";
import userRoutes from "./routes/user.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import experienceRoutes from "./routes/experience.routes.js";

const app = express();
const PORT = process.env.PORT || 8000;

/* ---------- middlewares ---------- */
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ---------- routes ---------- */
app.use("/api/resume", resumeRoutes);
app.use("/aptitude-questions", TestRouter);
app.use("/dsa", dsaRouter);
app.use("/api/companies", companiesRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/experience", experienceRoutes);

/* ---------- global error handler ---------- */
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
    errors: err.errors || [],
  });
});

/* ---------- server + socket ---------- */
const server = createServer(app);
connectToServer(server);

/* ---------- startup ---------- */
const startServer = async () => {
  try {
    await connectDB();
    console.log("Database connected");

    const AptiQuestionCount = await questionsModel.countDocuments();
    if (AptiQuestionCount === 0) {
      console.log("Extracting aptitude questions");
      await seedAptitudeQuestionsInDatabase();
      console.log("Aptitude Questions extracted and saved successfully");
    }

    const DsaQuestionCount = await DSAQuestion.countDocuments();
    if (DsaQuestionCount === 0) {
      console.log("Extracting DSA Questions");
      await seedDSAQuestionsInDatabase();
      console.log("DSA Questions extracted and saved successfully");
    }

    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error);
    process.exit(1);
  }
};

startServer();
