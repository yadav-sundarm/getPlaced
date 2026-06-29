import dotenv from "dotenv";

dotenv.config();

import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_MOCK_INTERVIEW_API_KEY,
});

// SAFE VALUE
const safeValue = (value, fallback = 0) => {
  return value !== undefined && value !== null && value !== ""
    ? value
    : fallback;
};

// NORMALIZE SCORE
const normalizeScore = (score) => {
  let num = Number(score);

  if (isNaN(num)) return 1;

  if (num > 10) {
    num = num / 10;
  }

  return Math.max(1, Math.min(10, Number(num.toFixed(1))));
};

export async function evaluateMockInterview({
  companyName,
  interviewType,
  responses,
}) {
  try {
    // VALID RESPONSES
    const validResponses = responses.filter(
      (item) => item.answer && item.answer.trim().length > 0,
    );

    // NO ANSWERS
    if (validResponses.length === 0) {
      return {
        overallScore: 1,

        communicationScore: 1,

        technicalScore: 1,

        confidenceScore: 1,

        fluencyScore: 1,

        verdict: "Poor",

        strengths: [],

        weaknesses: ["No meaningful interview responses were provided."],

        suggestions: ["Provide detailed answers during the interview."],
      };
    }

    // FORMAT QA
    const formattedQA = validResponses
      .map((item, index) => {
        const hasVoiceData = item.wordsPerMinute > 0 || item.fluencyScore > 0;

        return `
${index + 1}. Question:
${safeValue(item.question)}

Answer:
${safeValue(item.answer)}

${
  hasVoiceData
    ? `
COMMUNICATION ANALYSIS:

Fluency Score:
${safeValue(item.fluencyScore)}/10

Filler Words Used:
${safeValue(item.fillerCount)}

Long Pauses:
${safeValue(item.longPauseCount)}

Speaking Pace:
${safeValue(item.speakingPace, "Balanced")}

Words Per Minute:
${safeValue(item.wordsPerMinute)}

Positive Tone Indicators:
${safeValue(item.positiveSentiment)}

Negative Tone Indicators:
${safeValue(item.negativeSentiment)}
`
    : `
NO VOICE ANALYSIS AVAILABLE
`
}
`;
      })
      .join("\n\n");

    console.log("===== FORMATTED QA =====");

    console.log(formattedQA);

    // PROMPT
    const prompt = `
You are a STRICT AI mock interview evaluator.

You MUST ONLY evaluate using ACTUAL interview data provided.

=====================================
SCORING RULES
=====================================

1. TECHNICAL SCORE:
- Evaluate ONLY from answer quality.
- Ignore speaking style while evaluating technical depth.
- Weak technical answers should reduce ONLY technical score.

2. COMMUNICATION SCORE:
- Evaluate ONLY from:
  - speaking pace
  - fillers
  - pauses
  - speaking smoothness
  - clarity

3. CONFIDENCE:
- Confidence observations should ONLY depend on:
  - hesitation
  - pauses
  - fillers
  - speaking smoothness

- DO NOT infer low confidence from weak technical answers.

4. FLUENCY:
- Evaluate ONLY from:
  - fillers
  - pauses
  - speaking flow

=====================================
IMPORTANT RULES
=====================================

- NEVER hallucinate.
- NEVER invent personality traits.
- NEVER invent eye contact.
- NEVER invent body language.
- NEVER invent professionalism.
- NEVER invent fake technical topics.
- NEVER exaggerate weaknesses.
- NEVER contradict analytics.

Examples:
- High fluency → mention smooth communication.
- High communication → mention clarity.
- Low technical → mention weak technical depth.
- Balanced pace → DO NOT call speech rushed.

=====================================
PERSONALIZED FEEDBACK RULE
=====================================

Feedback MUST feel personalized.

DO NOT give generic HR advice.

Mention:
- exact technologies discussed
- exact mistakes made
- exact weak answers
- exact strong answers

Examples:
- If candidate says "No idea", explicitly mention that.
- If MongoDB was discussed, mention MongoDB specifically.
- If answer lacked examples, mention that specifically.

=====================================
FILLER GUIDELINES
=====================================

0-5 fillers:
low filler usage

5-10 fillers:
moderate filler usage

10-20 fillers:
noticeable filler usage

20+ fillers:
excessive filler usage

DO NOT exaggerate filler usage.

=====================================
SHORT ANSWER RULE
=====================================

If answers are extremely short like:
- "a"
- "aa"
- "ok"
- "yes"

then:
- technical score should be very low
- communication may still be decent if speaking was smooth

=====================================
NO VOICE DATA RULE
=====================================

If NO VOICE ANALYSIS AVAILABLE appears:
- DO NOT discuss confidence
- DO NOT discuss fluency
- DO NOT discuss pauses
- DO NOT discuss speaking behavior

=====================================
VERY IMPORTANT
=====================================

Strengths and weaknesses MUST align with scores.

Examples:
- High fluency → strengths mention fluency.
- High communication → strengths mention communication.
- High confidence → DO NOT mention nervousness.
- Low technical → weaknesses mention technical depth.

=====================================
COMPANY
=====================================

${companyName}

=====================================
INTERVIEW TYPE
=====================================

${interviewType}

=====================================
INTERVIEW DATA
=====================================

${formattedQA}

=====================================
OUTPUT RULES
=====================================

- Scores MUST be between 1 and 10.
- Return ONLY valid JSON.
- No markdown.
- No explanations outside JSON.

OUTPUT FORMAT:
{
  "technicalScore": number,
  "strengths": [string],
  "weaknesses": [string],
  "suggestions": [string]
}
`;
    // GEMINI CALL WITH RETRY
    const generateWithRetry = async (params, retries = 3, delay = 3000) => {
      for (let i = 0; i < retries; i++) {
        try {
          return await ai.models.generateContent(params);
        } catch (err) {
          if (err.status === 503 && i < retries - 1) {
            console.log(
              `Gemini 503, retrying in ${delay}ms... (${i + 1}/${retries})`,
            );
            await new Promise((res) => setTimeout(res, delay));
          } else {
            throw err;
          }
        }
      }
    };

    const result = await generateWithRetry({
      model: "gemini-2.5-flash",
      config: { responseMimeType: "application/json" },
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    const cleanedText = result.text.trim();

    console.log("===== GEMINI RESPONSE =====");

    console.log(cleanedText);

    const parsed = JSON.parse(cleanedText);

    // TECHNICAL SCORE
    const technicalScore = normalizeScore(parsed.technicalScore);

    // FLUENCY SCORE
    const avgFluency =
      validResponses.reduce((acc, item) => acc + (item.fluencyScore || 0), 0) /
      validResponses.length;

    const fluencyScore = Math.max(
      1,
      Math.min(10, Number(avgFluency.toFixed(1))),
    );

    // TOTAL FILLERS + PAUSES
    const totalFillers = validResponses.reduce(
      (acc, item) => acc + (item.fillerCount || 0),
      0,
    );

    const totalPauses = validResponses.reduce(
      (acc, item) => acc + (item.longPauseCount || 0),
      0,
    );

    // CONFIDENCE SCORE
    let confidenceScore = (fluencyScore + 8) / 2;

    // softer penalties
    if (totalFillers > 15) confidenceScore -= 1;

    if (totalFillers > 30) confidenceScore -= 1;

    if (totalPauses > 4) confidenceScore -= 1;

    if (totalPauses > 8) confidenceScore -= 1;

    confidenceScore = Math.max(
      1,
      Math.min(10, Number(confidenceScore.toFixed(1))),
    );

    // COMMUNICATION SCORE
    let communicationScore = (confidenceScore + fluencyScore) / 2;

    // slight technical clarity influence
    if (technicalScore >= 7) communicationScore += 0.5;

    if (technicalScore <= 3) communicationScore -= 0.5;

    communicationScore = Math.max(
      1,
      Math.min(10, Number(communicationScore.toFixed(1))),
    );

    // OVERALL SCORE
    let overallScore;

    if (interviewType === "HR") {
      overallScore = Number(
        (
          communicationScore * 0.4 +
          confidenceScore * 0.3 +
          fluencyScore * 0.2 +
          technicalScore * 0.1
        ).toFixed(1),
      );
    } else if (interviewType === "Technical") {
      overallScore = Number(
        (
          technicalScore * 0.5 +
          communicationScore * 0.2 +
          confidenceScore * 0.2 +
          fluencyScore * 0.1
        ).toFixed(1),
      );
    } else {
      overallScore = Number(
        (
          technicalScore * 0.35 +
          communicationScore * 0.25 +
          confidenceScore * 0.25 +
          fluencyScore * 0.15
        ).toFixed(1),
      );
    }

    // VERDICT
    let verdict = "Average";

    if (overallScore >= 8) verdict = "Excellent";
    else if (overallScore >= 6) verdict = "Good";
    else if (overallScore >= 4) verdict = "Average";
    else verdict = "Poor";

    // RETURN
    return {
      overallScore,

      communicationScore,

      technicalScore,

      confidenceScore,

      fluencyScore,

      verdict,

      strengths: Array.isArray(parsed.strengths) ? parsed.strengths : [],

      weaknesses: Array.isArray(parsed.weaknesses) ? parsed.weaknesses : [],

      suggestions: Array.isArray(parsed.suggestions) ? parsed.suggestions : [],
    };
  } catch (error) {
    console.error("===== GEMINI EVALUATION ERROR =====");

    console.error(error);

    throw new Error("Interview evaluation failed");
  }
}
