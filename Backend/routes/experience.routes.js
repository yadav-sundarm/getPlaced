import express from "express";
import { verifyJWT } from "../middlewares/verifyUser.middleware.js";
import {
  submitExperience,
  getMySubmissions,
} from "../controllers/experience.controller.js";

const router = express.Router();

// All experience routes require a logged-in student
router.use(verifyJWT);

router.post("/submit", submitExperience); // POST /api/experience/submit
router.get("/my-submissions", getMySubmissions); // GET  /api/experience/my-submissions

export default router;
