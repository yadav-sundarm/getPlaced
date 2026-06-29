import CustomApiResponse from "../utils/customApiResponse.js";
import { ai } from "../utils/gemini.js";

export const generateDsaFeedback = async (req, res) => {
  const {
    code,
    language,
    timeComplexity,
    spaceComplexity,
    questionTitle,
    questionDescription,
  } = req.body;

  console.log("GEMINI BACKEND LOGS");

  const prompt = `
    You are an experienced Data Structures and Algorithms mentor.

Evaluate the student's solution.

Question Title:
${questionTitle}

Question Description:
${questionDescription}

Programming Language:
${language}

Student Code:
\`\`\`${language}
${code}
\`\`\`

Time Complexity:
${timeComplexity}

Space Complexity:
${spaceComplexity}

Do NOT decide whether the solution is correct.

Return ONLY valid JSON in this exact format:

{
  "summary": "",
  "strengths": [],
  "improvements": [],
  "timeComplexity": "",
  "spaceComplexity": "",
  "codingStyle": "",
  "nextSteps": [],
  "motivation": ""
}

Rules:
- Be encouraging and constructive.
- Do not criticize harshly.
- Keep each point concise.
- Do not include markdown.
    `;

  try {
    const models = ["gemini-2.5-flash", "gemini-2.0-flash"];

    let actualReview;

    for (const model of models) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents: prompt,
        });
        actualReview = response.candidates[0].content.parts[0]?.text;
        break;
      } catch (err) {
        const is503 =
          err.message?.includes("503") || err.message?.includes("UNAVAILABLE");
        if (is503) {
          console.log(`${model} unavailable, trying next...`);
          continue;
        }
        throw err;
      }
    }

    if (!actualReview) throw new Error("All Gemini models unavailable");

    console.log("Gemini Response:");
    console.log(actualReview);

    const data = JSON.parse(actualReview);

    return res.status(200).json(
      new CustomApiResponse({
        message: "Fetched the ai response successfully",
        statusCode: 200,
        data: data,
      }),
    );
  } catch (error) {
    console.error("===== GEMINI ERROR =====");
    console.error(error);
    console.error("Message:", error.message);
    console.error("Stack:", error.stack);

    if (error.response) {
      console.error(error.response);
    }

    return res.status(500).json({
      message: error.message,
    });
  }
};
