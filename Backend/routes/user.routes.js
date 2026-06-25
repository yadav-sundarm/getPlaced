import express from "express";
import {
  createUser,
  loginUser,
  logoutUser,
} from "../controllers/user.controller.js";
import { getDashboardStats } from "../controllers/dashboardStats.controller.js"; // ADD
import { verifyJWT } from "../middlewares/verifyUser.middleware.js";

const router = express.Router();

router.post("/signup", createUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/dashboard-stats", verifyJWT, getDashboardStats); // ADD

export default router;
