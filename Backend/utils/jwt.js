import jwt from "jsonwebtoken";

const generateToken = (payload) => {
  console.log("JWT in jwt.js:", process.env.JWT_SECRET);
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in .env");
  }

  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

export default generateToken;
