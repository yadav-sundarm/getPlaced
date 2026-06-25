import express from "express";

import {
  getAllMockInterviewCompanies,
  startMockInterview,
  evaluateMockInterviewController,
} from "../controllers/mockInterview.controller.js";

import upload from "../middlewares/audioUpload.middleware.js";

const router = express.Router();

router.get("/", getAllMockInterviewCompanies);

router.post("/start", startMockInterview);

router.post("/evaluate", upload.any(), evaluateMockInterviewController);
export default router;
