import express from "express";
import {
  getAllQuestions,
  getComputerQuestions,
  getLogicalQuestions,
  getMathQuestions,
  submitTest,
} from "../controllers/tests.controller.js";

const router = express.Router();

router.get("/get-mock-questions", getAllQuestions);
router.get("/get-computer-questions", getComputerQuestions);
router.get("/get-logical-questions", getLogicalQuestions);
router.get("/get-math-questions", getMathQuestions);
router.post("/submit-test", submitTest);

export default router;