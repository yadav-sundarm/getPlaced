import { GoogleGenAI } from "@google/genai";

export async function analyzeResumeWithGemini(resumeText) {
  try {
    // Instantiate inside function so env var is always read fresh
    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_RESUME_ANALYZER_API_KEY,
    });
    const prompt = `
You are an expert ATS (Applicant Tracking System) resume evaluator.

TASK:
Analyze the resume and return ALL relevant improvement suggestions.
Give only 2 to 4 suggestions that will have the HIGHEST impact on improving the ATS score.
Include every meaningful issue that could improve ATS score.

RULES:
- Return ONLY valid JSON (no markdown, no explanation).
- Suggestions must be categorized by impact: HIGH, MEDIUM, or LOW.
- HIGH impact = major ATS blockers.
- MEDIUM impact = improvements that increase match rate.
- LOW impact = polish and optional enhancements.
- Provide before/after examples ONLY when applicable.

OUTPUT FORMAT (STRICT):
{
  "atsScore": number,
  "verdict": "Excellent" | "Good" | "Average" | "Poor",
  "breakdown": {
    "format": number,
    "content": number,
    "keywords": number
  },
  "suggestions": [
    {
      "impact": "HIGH" | "MEDIUM" | "LOW",
      "title": string,
      "description": string,
      "before": string | null,
      "after": string | null
    }
  ]
}

SCORING GUIDELINES:
- Format: layout, section order, bullet usage, ATS readability
- Content: clarity, achievements, action verbs, impact
- Keywords: technical and role-specific terms

Resume text:
${resumeText.slice(0, 5000)}
`;

    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
    });

    const rawText = result.text;

    // Safety cleanup (Gemini sometimes adds stray formatting)
    const cleanedText = rawText
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    return JSON.parse(cleanedText);
  } catch (err) {
    console.error("====== GEMINI RESUME ERROR ======");

    // Basic error message
    console.error("Message:", err.message);

    // Stack trace (very important)
    console.error("Stack:", err.stack);

    // Gemini-specific response (if available)
    if (err.response) {
      console.error("Gemini Response:", JSON.stringify(err.response, null, 2));
    }

    // Sometimes error is nested differently
    if (err.cause) {
      console.error("Cause:", err.cause);
    }

    console.error("================================");

    throw new Error("Gemini resume analysis failed");
  }
}
