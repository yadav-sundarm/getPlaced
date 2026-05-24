import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { createServer } from "http";
import { connectToServer } from "./controllers/socketManager.js";
import resumeRoutes from "./routes/resume.routes.js";
import connectDB from "./db/db.js";
import TestRouter from "./routes/tests.routes.js";
import seedQuestionsInDatabase from "./utils/seedQuestions.js";
import questionsModel from "./models/questions.model.js";
import companiesRoutes from "./routes/mockInterview.routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

/* ---------- middlewares ---------- */
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ---------- routes ---------- */
app.use("/api/resume", resumeRoutes);
app.use("/aptitude-questions", TestRouter);
app.use("/api/companies", companiesRoutes);

/* ---------- server + socket ---------- */
const server = createServer(app);
connectToServer(server);

/* ---------- startup ---------- */
const startServer = async () => {
  try {
    await connectDB();
    console.log("Database connected");

    const questionCount = await questionsModel.countDocuments();
    if (questionCount === 0) {
      console.log("Extracting questions");
      await seedQuestionsInDatabase();
      console.log("Questions extracted and saved successfully");
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
