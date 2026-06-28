import CustomApiResponse from "../utils/customApiResponse.js";
import { ai } from "../utils/gemini.js";

export const generateDsaFeedback = async (req, res) => {

    const {code, language, timeComplexity, spaceComplexity, questionTitle, questionDescription} = req.body


    console.log("GEMINI BACKEND LOGS")


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
        const response = await ai.models.generateContent({
            model: "gemini-3.1-flash-lite",
            contents: prompt,
        })

        const actualReview = await response.candidates[0].content.parts[0]?.text

        const data = await JSON.parse(actualReview)

        return res.status(200).json(
           new CustomApiResponse({message: "Fetched the ai response successfully", statusCode: 200, data:data})
        )

    } catch (error) {
        return res.status(500).json({
        message: error.message
    });
    }
};
