import Router from "express";
import {
  getTopicWiseDSAQuestions,
  getDSATopics,
  getSingleDSAQuestion,
  runCode,
} from "../controllers/dsa.controller.js";

const router = Router();

router.get("/get-dsa-topics", getDSATopics);
router.post("/get-topic-wise-dsa-questions", getTopicWiseDSAQuestions);
router.get("/get-single-dsa-question", getSingleDSAQuestion);
router.post("/run-code", runCode);

export default router;
