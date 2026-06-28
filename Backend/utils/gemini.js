import { GoogleGenAI } from "@google/genai";

console.log("in gemini js",process.env.GEMINI_EVALUATION_API_KEY);
export const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_EVALUATION_API_KEY,
});