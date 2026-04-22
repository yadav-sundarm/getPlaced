import express from "express";
import {
  createUser,
  loginUser,
  logoutUser,
} from "../controllers/user.controller.js";

const router = express.Router();

/* =========================
   AUTH ROUTES
========================= */
router.post("/signup", createUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);

export default router;
