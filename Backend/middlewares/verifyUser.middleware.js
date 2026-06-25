import jwt, { decode } from "jsonwebtoken";
import CustomApiError from "../utils/customApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import User from "../models/user.model.js";

/* ─────────────────────────────────────────
   verifyJWT  — attaches req.user on success
───────────────────────────────────────── */
export const verifyJWT = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new CustomApiError("Unauthorised – no token provided", 401);
  }

  const token = authHeader.split(" ")[1];

  let decoded;
  let user;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("from jwt verify", decoded);

    user = await User.findById(decoded.userId).select("-password");
    console.log("from jwt user", user);

    if (!user) {
      throw new CustomApiError("Unauthorised – user not found", 401);
    }


  } catch (err) {
    throw new CustomApiError("Unauthorised – invalid or expired token", 401);
  }


  req.user = user;
  next();
});

/* ─────────────────────────────────────────
   requireAdmin  — call AFTER verifyJWT
   Usage:  router.use(verifyJWT, requireAdmin)
───────────────────────────────────────── */
export const requireAdmin = asyncHandler(async (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    throw new CustomApiError("Forbidden – admin access only", 403);
  }
  next();
});
