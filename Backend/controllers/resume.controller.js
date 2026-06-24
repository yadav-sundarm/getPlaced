// resume.controller.js
import fs from "fs";
import { parseResume } from "../services/resumeparser.service.js";
import { analyzeResumeWithGemini } from "../services/resumeAnalyzerGemini.js";

export const analyzeResume = async (req, res) => {
  try {
    const resumeText = await parseResume(req.file);
    const analysis = await analyzeResumeWithGemini(resumeText);

    fs.unlinkSync(req.file.path);

    res.json({
      atsScore: analysis.atsScore,
      breakdown: {
        keywordMatch: analysis.keywordMatch,
        formatting: analysis.formattingScore,
      },
      suggestions: analysis.suggestions,
    });
  } catch (err) {
    console.error("[Resume Analyze] Error:", err.message);
    res
      .status(500)
      .json({ message: "Resume analysis failed. Please try again." });
  }
};
