import fs from "fs";
import asyncHandler from "../utils/asyncHandler.js";
import CustomApiError from "../utils/customApiError.js";
import CustomApiResponse from "../utils/customApiResponse.js";
import ExperienceSubmission from "../models/experienceSubmission.model.js";
import MockInterview from "../models/mockInterview.model.js";
import { parseResume } from "../services/resumeparser.service.js";
import { GoogleGenAI } from "@google/genai";

/* ═══════════════════════════════════════════════
   GET /api/admin/submissions?status=pending&page=1
   Lists all experience submissions, filterable by status
═══════════════════════════════════════════════ */
export const listSubmissions = asyncHandler(async (req, res) => {
  const { status = "pending", page = 1, limit = 10 } = req.query;

  const filter = {};
  if (status !== "all") filter.status = status;

  const skip = (Number(page) - 1) * Number(limit);

  const [submissions, total] = await Promise.all([
    ExperienceSubmission.find(filter)
      .populate("submittedBy", "firstName lastName email department batchYear")
      .populate("reviewedBy", "firstName lastName email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit)),
    ExperienceSubmission.countDocuments(filter),
  ]);

  return res.status(200).json(
    new CustomApiResponse("Submissions fetched", 200, {
      submissions,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / Number(limit)),
      },
    }),
  );
});

/* ═══════════════════════════════════════════════
   GET /api/admin/submissions/:id
   Single submission detail
═══════════════════════════════════════════════ */
export const getSubmission = asyncHandler(async (req, res) => {
  const submission = await ExperienceSubmission.findById(req.params.id)
    .populate("submittedBy", "firstName lastName email department batchYear")
    .populate("reviewedBy", "firstName lastName email");

  if (!submission) throw new CustomApiError("Submission not found", 404);

  return res
    .status(200)
    .json(new CustomApiResponse("Submission fetched", 200, { submission }));
});

/* ═══════════════════════════════════════════════
   PATCH /api/admin/submissions/:id/approve
   Approves a submission → copies it into MockInterview collection
═══════════════════════════════════════════════ */
export const approveSubmission = asyncHandler(async (req, res) => {
  const { reviewNote } = req.body;

  const submission = await ExperienceSubmission.findById(req.params.id);
  if (!submission) throw new CustomApiError("Submission not found", 404);

  if (submission.status === "approved") {
    throw new CustomApiError("Submission is already approved", 400);
  }

  // ── Push into MockInterview collection ──
  // Check if an entry for this company already exists
  let mockEntry = await MockInterview.findOne({
    companyName: { $regex: new RegExp(`^${submission.companyName}$`, "i") },
  });

  // Build rounds in MockInterview's format
  const newRounds = submission.rounds.map((r) => ({
    roundNumber: r.roundNumber,
    roundType:
      r.roundType === "Aptitude" ||
      r.roundType === "Coding" ||
      r.roundType === "GD" ||
      r.roundType === "Managerial"
        ? "Technical" // MockInterview schema only allows HR | Technical
        : r.roundType,
    questions: r.questions,
  }));

  if (mockEntry) {
    // Merge: append rounds that don't duplicate
    for (const nr of newRounds) {
      const exists = mockEntry.rounds.some(
        (er) =>
          er.roundNumber === nr.roundNumber && er.roundType === nr.roundType,
      );
      if (!exists) mockEntry.rounds.push(nr);
      else {
        // Append new unique questions to existing round
        const existing = mockEntry.rounds.find(
          (er) =>
            er.roundNumber === nr.roundNumber && er.roundType === nr.roundType,
        );
        const uniqueQs = nr.questions.filter(
          (q) => !existing.questions.includes(q),
        );
        existing.questions.push(...uniqueQs);
      }
    }
    await mockEntry.save();
  } else {
    mockEntry = await MockInterview.create({
      companyName: submission.companyName,
      rounds: newRounds,
    });
  }

  // ── Mark submission as approved ──
  submission.status = "approved";
  submission.reviewedBy = req.user._id;
  submission.reviewNote = reviewNote || "";
  submission.reviewedAt = new Date();
  await submission.save();

  return res.status(200).json(
    new CustomApiResponse(
      "Submission approved and pushed to MockInterview",
      200,
      {
        submission,
        mockInterviewId: mockEntry._id,
      },
    ),
  );
});

/* ═══════════════════════════════════════════════
   PATCH /api/admin/submissions/:id/reject
   Rejects a submission with an optional note
═══════════════════════════════════════════════ */
export const rejectSubmission = asyncHandler(async (req, res) => {
  const { reviewNote } = req.body;

  const submission = await ExperienceSubmission.findById(req.params.id);
  if (!submission) throw new CustomApiError("Submission not found", 404);

  if (submission.status === "rejected") {
    throw new CustomApiError("Submission is already rejected", 400);
  }

  submission.status = "rejected";
  submission.reviewedBy = req.user._id;
  submission.reviewNote = reviewNote || "";
  submission.reviewedAt = new Date();
  await submission.save();

  return res
    .status(200)
    .json(new CustomApiResponse("Submission rejected", 200, { submission }));
});

/* ═══════════════════════════════════════════════
   POST /api/admin/upload-pdf
   Admin uploads a PDF of interview experience →
   Gemini parses it → directly inserted into MockInterview + stored as approved submission
═══════════════════════════════════════════════ */
export const uploadExperiencePdf = asyncHandler(async (req, res) => {
  if (!req.file) throw new CustomApiError("No PDF file uploaded", 400);

  let rawText;
  try {
    rawText = await parseResume(req.file); // reuses existing pdf-parse / mammoth service
  } finally {
    // Always clean up temp file
    if (req.file?.path && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
  }

  if (!rawText || rawText.trim().length < 50) {
    throw new CustomApiError(
      "Could not extract meaningful text from the PDF. Please check the file.",
      422,
    );
  }

  // ── Ask Gemini to structure the raw text ──
  // Instantiate here so it always reads the current env var, not a stale module-load value
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_EXPERIENCE_PDF_API_KEY,
  });

  const prompt = `
You are a parser that extracts structured interview experience data from raw text.
Given the following text extracted from an interview experience document, return ONLY a valid JSON object — no markdown fences, no explanation.

The JSON must follow this exact shape:
{
  "companyName": "string",
  "jobProfile": "string",
  "year": number,
  "totalRounds": number,
  "rounds": [
    {
      "roundNumber": number,
      "roundType": "HR" | "Technical",
      "roundName": "optional string e.g. 'Coding Round'",
      "questions": ["question 1", "question 2"]
    }
  ],
  "tips": "optional general tips string",
  "difficulty": "Easy" | "Medium" | "Hard",
  "result": "Selected" | "Not Selected" | "Waiting"
}

Rules:
- roundType must be exactly "HR" or "Technical". Map Aptitude/Coding/GD/Managerial → "Technical".
- If year is not mentioned, use ${new Date().getFullYear()}.
- If result is not mentioned, use "Waiting".
- questions array must have at least 1 item per round.
- Do not include any extra keys.

RAW TEXT:
${rawText}
`;

  let result;
  try {
    result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });
  } catch (geminiErr) {
    console.error("[Admin PDF Upload] Gemini API error:", geminiErr.message);
    throw new CustomApiError("Failed to process PDF. Please try again.", 502);
  }

  const jsonText = result.text.replace(/```json|```/g, "").trim();

  let parsed;
  try {
    const clean = jsonText.replace(/^```json|^```|```$/gm, "").trim();
    parsed = JSON.parse(clean);
  } catch (parseErr) {
    console.error(
      "[Admin PDF Upload] JSON parse error:",
      parseErr.message,
      "\nRaw:",
      jsonText.slice(0, 300),
    );
    throw new CustomApiError("Failed to process PDF. Please try again.", 502);
  }

  // ── Validate minimum required fields ──
  if (
    !parsed.companyName ||
    !parsed.rounds ||
    !Array.isArray(parsed.rounds) ||
    parsed.rounds.length === 0
  ) {
    throw new CustomApiError(
      "Parsed PDF is missing required fields (companyName or rounds). Check the PDF content.",
      422,
    );
  }

  // ── Insert directly into MockInterview ──
  let mockEntry = await MockInterview.findOne({
    companyName: { $regex: new RegExp(`^${parsed.companyName}$`, "i") },
  });

  if (mockEntry) {
    for (const nr of parsed.rounds) {
      const existing = mockEntry.rounds.find(
        (er) =>
          er.roundNumber === nr.roundNumber && er.roundType === nr.roundType,
      );
      if (existing) {
        const uniqueQs = nr.questions.filter(
          (q) => !existing.questions.includes(q),
        );
        existing.questions.push(...uniqueQs);
      } else {
        mockEntry.rounds.push(nr);
      }
    }
    await mockEntry.save();
  } else {
    mockEntry = await MockInterview.create({
      companyName: parsed.companyName,
      rounds: parsed.rounds,
    });
  }

  // ── Also store as an approved submission for audit trail ──
  const submission = await ExperienceSubmission.create({
    submittedBy: req.user._id,
    companyName: parsed.companyName,
    jobProfile: parsed.jobProfile || "Not specified",
    year: parsed.year || new Date().getFullYear(),
    totalRounds: parsed.totalRounds || parsed.rounds.length,
    rounds: parsed.rounds.map((r, i) => ({
      roundNumber: r.roundNumber ?? i + 1,
      roundType: r.roundType,
      roundName: r.roundName,
      questions: r.questions,
    })),
    tips: parsed.tips,
    difficulty: parsed.difficulty,
    result: parsed.result || "Waiting",
    status: "approved",
    reviewedBy: req.user._id,
    reviewNote: "Auto-approved via admin PDF upload",
    reviewedAt: new Date(),
    source: "admin_pdf",
  });

  return res.status(201).json(
    new CustomApiResponse(
      "PDF parsed and experience added to MockInterview database",
      201,
      {
        parsed,
        submissionId: submission._id,
        mockInterviewId: mockEntry._id,
      },
    ),
  );
});

/* ═══════════════════════════════════════════════
   GET /api/admin/stats
   Quick counts for admin dashboard overview
═══════════════════════════════════════════════ */
export const getAdminStats = asyncHandler(async (req, res) => {
  const [pending, approved, rejected, totalCompanies] = await Promise.all([
    ExperienceSubmission.countDocuments({ status: "pending" }),
    ExperienceSubmission.countDocuments({ status: "approved" }),
    ExperienceSubmission.countDocuments({ status: "rejected" }),
    MockInterview.countDocuments(),
  ]);

  return res.status(200).json(
    new CustomApiResponse("Stats fetched", 200, {
      pending,
      approved,
      rejected,
      totalCompanies,
    }),
  );
});
