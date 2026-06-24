import asyncHandler from "../utils/asyncHandler.js";
import CustomApiError from "../utils/customApiError.js";
import CustomApiResponse from "../utils/customApiResponse.js";
import ExperienceSubmission from "../models/experienceSubmission.model.js";

/* ═══════════════════════════════════════════════
   POST /api/experience/submit
   Student submits a new experience (goes to pending)
═══════════════════════════════════════════════ */
export const submitExperience = asyncHandler(async (req, res) => {
  const {
    companyName,
    jobProfile,
    year,
    totalRounds,
    rounds,
    tips,
    difficulty,
    result,
  } = req.body;

  // ── Validation ──
  if (!companyName || !jobProfile || !totalRounds || !rounds) {
    throw new CustomApiError(
      "companyName, jobProfile, totalRounds, and rounds are required",
      400,
    );
  }

  if (!Array.isArray(rounds) || rounds.length === 0) {
    throw new CustomApiError("rounds must be a non-empty array", 400);
  }

  for (const [i, round] of rounds.entries()) {
    if (!round.roundNumber || !round.roundType) {
      throw new CustomApiError(
        `Round ${i + 1} is missing roundNumber or roundType`,
        400,
      );
    }
    if (!round.questions || round.questions.length === 0) {
      throw new CustomApiError(
        `Round ${i + 1} must have at least one question`,
        400,
      );
    }
    // Clean empty question strings
    round.questions = round.questions.filter((q) => q && q.trim().length > 0);
    if (round.questions.length === 0) {
      throw new CustomApiError(
        `Round ${i + 1} has no valid (non-empty) questions`,
        400,
      );
    }
  }

  const submission = await ExperienceSubmission.create({
    submittedBy: req.user._id,
    companyName: companyName.trim(),
    jobProfile: jobProfile.trim(),
    year: year || new Date().getFullYear(),
    totalRounds: Number(totalRounds),
    rounds,
    tips: tips?.trim() || "",
    difficulty: difficulty || undefined,
    result: result || "Waiting",
    status: "pending",
    source: "student_form",
  });

  return res
    .status(201)
    .json(
      new CustomApiResponse(
        "Experience submitted successfully. It will be visible after admin approval.",
        201,
        { submissionId: submission._id, status: submission.status },
      ),
    );
});

/* ═══════════════════════════════════════════════
   GET /api/experience/my-submissions
   Student views their own submission history
═══════════════════════════════════════════════ */
export const getMySubmissions = asyncHandler(async (req, res) => {
  const submissions = await ExperienceSubmission.find({
    submittedBy: req.user._id,
  })
    .select(
      "companyName jobProfile year status createdAt reviewNote reviewedAt",
    )
    .sort({ createdAt: -1 });

  return res
    .status(200)
    .json(
      new CustomApiResponse("Your submissions fetched", 200, { submissions }),
    );
});
