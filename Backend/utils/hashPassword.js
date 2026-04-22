import bcrypt from "bcrypt";
import CustomApiError from "./customApiError.js";

/* =========================
   HASH PASSWORD
========================= */
export const hashPassword = async (userPassword) => {
  if (!userPassword) {
    throw new CustomApiError("Password is required", 400);
  }

  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(userPassword, salt);
};

/* =========================
   COMPARE PASSWORD
========================= */
export const comparePassword = async (plainPassword, hashedPassword) => {
  if (!plainPassword || !hashedPassword) {
    throw new CustomApiError("Password comparison failed", 400);
  }

  return await bcrypt.compare(plainPassword, hashedPassword);
};
