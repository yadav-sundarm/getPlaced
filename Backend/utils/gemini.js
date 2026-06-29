import { GoogleGenAI } from "@google/genai";
export const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_EVALUATION_API_KEY,
});
