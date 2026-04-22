import User from "../models/user.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import CustomApiError from "../utils/customApiError.js";
import CustomApiResponse from "../utils/customApiResponse.js";
import { hashPassword, comparePassword } from "../utils/hashPassword.js";
import generateToken from "../utils/jwt.js";

/* =========================
   SIGNUP
========================= */
const createUser = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, password, batchYear, department } =
    req.body;

  if (
    !firstName ||
    !lastName ||
    !email ||
    !password ||
    !batchYear ||
    !department
  ) {
    throw new CustomApiError("All fields are required", 400);
  }

  // ✅ Email validation
  const emailRegex = /^[a-zA-Z0-9._]+@ves\.ac\.in$/;
  if (!emailRegex.test(email)) {
    throw new CustomApiError("Invalid institute email", 400);
  }

  // ✅ Check existing user
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new CustomApiError("User already exists, please login", 409);
  }

  // ✅ Generate username from email
  const parts = email.split(".");
  const username = `${parts[1]}.${parts[2].split("@")[0]}`;

  // ✅ Hash password
  const hashedPassword = await hashPassword(password);

  const newUser = await User.create({
    username,
    firstName,
    lastName,
    email,
    password: hashedPassword,
    batchYear,
    department,
  });

  // ✅ Generate JWT
  const token = generateToken({
    userId: newUser._id,
    role: newUser.role,
  });

  return res.status(201).json(
    new CustomApiResponse("User registered successfully", 201, {
      token,
      user: {
        id: newUser._id,
        firstName: newUser.firstName,
        email: newUser.email,
        role: newUser.role,
        course: newUser.department,
      },
    }),
  );
});

/* =========================
   LOGIN
========================= */
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new CustomApiError("Email and password are required", 400);
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    throw new CustomApiError("User not found, please register", 404);
  }

  const isPasswordCorrect = await comparePassword(password, user.password);

  if (!isPasswordCorrect) {
    throw new CustomApiError("Invalid credentials", 401);
  }

  const token = generateToken({
    userId: user._id,
    role: user.role,
  });

  return res.status(200).json(
    new CustomApiResponse("User logged in successfully", 200, {
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        email: user.email,
        role: user.role,
        course: user.department,
      },
    }),
  );
});

/* =========================
   LOGOUT
========================= */
const logoutUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new CustomApiResponse("User logged out successfully", 200));
});

export { createUser, loginUser, logoutUser };
