import {
  getTopicWiseDSAQuestions,
  getDSATopics,
  getSingleDSAQuestion,
  runCode,
  getSolvedQuestions,
} from "../controllers/dsa.controller.js";
import { Router } from "express";
import { generateDsaFeedback } from "../services/geminiDsaFeedback.js";
const router = Router();

router.get("/get-dsa-topics", getDSATopics);
router.post("/get-topic-wise-dsa-questions", getTopicWiseDSAQuestions);
router.get("/get-single-dsa-question", getSingleDSAQuestion);
router.post("/run-code", runCode);
router.post("/get-review", generateDsaFeedback);
router.get("/get-solved-questions", getSolvedQuestions);
export default router;
