import fs from "fs";

import MockInterview from "../models/mockInterview.model.js";

import { generateMockInterviewQuestions } from "../services/geminiMockInterview.service.js";

import { evaluateMockInterview } from "../services/mockInterviewEvaluation.service.js";

import { transcribeAudio } from "../services/assemblyAI.service.js";

// ======================================
// GET ALL COMPANIES
// ======================================
export const getAllMockInterviewCompanies = async (req, res) => {
  try {
    const companies = await MockInterview.find();

    return res.status(200).json(companies);
  } catch (error) {
    console.error("Fetch Companies Error:", error);

    return res.status(500).json({
      message: "Failed to fetch companies",
    });
  }
};

// ======================================
// START MOCK INTERVIEW
// ======================================
export const startMockInterview = async (req, res) => {
  try {
    const { companyName, interviewType } = req.body;

    if (!companyName || !interviewType) {
      return res.status(400).json({
        message: "companyName and interviewType are required",
      });
    }

    const company = await MockInterview.findOne({
      companyName,
    });

    if (!company) {
      return res.status(404).json({
        message: "Company not found",
      });
    }

    // HR QUESTIONS
    const hrReferenceQuestions = company.rounds
      .filter((round) => round.roundType === "HR")
      .flatMap((round) => round.questions);

    // TECHNICAL QUESTIONS
    const technicalReferenceQuestions = company.rounds
      .filter((round) => round.roundType === "Technical")
      .flatMap((round) => round.questions);

    // GEMINI QUESTION GENERATION
    const geminiResponse = await generateMockInterviewQuestions({
      companyName,

      interviewType,

      hrReferenceQuestions,

      technicalReferenceQuestions,
    });

    let finalQuestions = [];

    if (interviewType === "HR") {
      finalQuestions = geminiResponse.questions;
    }

    if (interviewType === "Technical") {
      finalQuestions = geminiResponse.questions;
    }

    if (interviewType === "Mixed") {
      finalQuestions = [
        ...geminiResponse.hrQuestions,

        ...geminiResponse.technicalQuestions,
      ];
    }

    return res.status(200).json({
      companyName,

      interviewType,

      totalQuestions: finalQuestions.length,

      questions: finalQuestions,
    });
  } catch (error) {
    console.error("Start Mock Interview Error:", error);

    return res.status(500).json({
      message: "Failed to start mock interview",
    });
  }
};

// ======================================
// EVALUATE MOCK INTERVIEW
// ======================================
export const evaluateMockInterviewController = async (req, res) => {
  try {
    console.log("FILES:", req.files);

    const { companyName, interviewType, interviewDuration } = req.body;
    // =====================================
    // FIND TOTAL RESPONSE COUNT
    // =====================================
    const responseIndexes = new Set();

    Object.keys(req.body).forEach((key) => {
      const match = key.match(/responses\[(\d+)\]/);

      if (match) {
        responseIndexes.add(Number(match[1]));
      }
    });

    req.files.forEach((file) => {
      const match = file.fieldname.match(/responses\[(\d+)\]/);

      if (match) {
        responseIndexes.add(Number(match[1]));
      }
    });

    const sortedIndexes = [...responseIndexes].sort((a, b) => a - b);

    console.log("INDEXES:", sortedIndexes);

    // =====================================
    // BUILD RESPONSES
    // =====================================
    const responses = [];

    for (const i of sortedIndexes) {
      const question = req.body[`responses[${i}][question]`]
        ? String(req.body[`responses[${i}][question]`])
        : "";

      const typedAnswer = req.body[`responses[${i}][answer]`]
        ? String(req.body[`responses[${i}][answer]`])
        : "";

      const audioFile = req.files.find(
        (file) => file.fieldname === `responses[${i}][audio]`,
      );

      let voiceData = {
        text: "",

        confidence: 0,

        fillerCount: 0,

        longPauseCount: 0,

        wordsPerMinute: 0,

        speakingPace: "Balanced",

        fluencyScore: 0,

        positiveSentiment: 0,

        negativeSentiment: 0,
      };

      // =====================================
      // TRANSCRIBE AUDIO
      // =====================================
      if (audioFile) {
        console.log("TRANSCRIBING:", audioFile.path);

        try {
          voiceData = await transcribeAudio(audioFile.path);

          console.log("VOICE DATA:", voiceData);
        } catch (err) {
          console.log("TRANSCRIPTION FAILED");
          console.log(err.message);
        }
      }

      // =====================================
      // FINAL ANSWER
      // =====================================
      const finalAnswer =
        typedAnswer && typedAnswer.trim().length > 0
          ? typedAnswer.trim()
          : voiceData.text?.trim() || "";
      responses.push({
        question: question || "Question not available",
        answer: finalAnswer,

        fillerCount: voiceData.fillerCount || 0,

        longPauseCount: voiceData.longPauseCount || 0,

        wordsPerMinute: voiceData.wordsPerMinute || 0,

        speakingPace: voiceData.speakingPace || "Balanced",

        fluencyScore: voiceData.fluencyScore || 0,

        positiveSentiment: voiceData.positiveSentiment || 0,

        negativeSentiment: voiceData.negativeSentiment || 0,
      });
    }

    console.log("FINAL RESPONSES:", responses);

    // =====================================
    // VALIDATION
    // =====================================
    if (!responses.length) {
      responses.push({
        question: "No question provided",
        answer: "",

        fillerCount: 0,

        longPauseCount: 0,

        wordsPerMinute: 0,

        speakingPace: "Balanced",

        fluencyScore: 0,

        positiveSentiment: 0,

        negativeSentiment: 0,
      });
    }

    // =====================================
    // GEMINI EVALUATION
    // =====================================
    const evaluation = await evaluateMockInterview({
      companyName,

      interviewType,

      responses,
    });

    // =====================================
    // ANALYTICS
    // =====================================

    const avgFluency =
      responses.reduce((acc, item) => acc + (item.fluencyScore || 0), 0) /
      responses.length;

    const totalFillers = responses.reduce(
      (acc, item) => acc + (item.fillerCount || 0),
      0,
    );

    const totalPauses = responses.reduce(
      (acc, item) => acc + (item.longPauseCount || 0),
      0,
    );

    const avgWPM =
      responses.reduce((acc, item) => acc + (item.wordsPerMinute || 0), 0) /
      responses.length;

    const totalPositive = responses.reduce(
      (acc, item) => acc + (item.positiveSentiment || 0),
      0,
    );

    const totalNegative = responses.reduce(
      (acc, item) => acc + (item.negativeSentiment || 0),
      0,
    );

    // =====================================
    // RESPONSE
    // =====================================
    return res.status(200).json({
      ...evaluation,

      fluencyScore: Number(avgFluency.toFixed(1)),

      fillerWords: totalFillers,

      longPauseCount: totalPauses,

      wordsPerMinute: Math.round(avgWPM),

      speakingPace:
        avgWPM < 90 ? "Too Slow" : avgWPM > 170 ? "Too Fast" : "Balanced",

      positiveSentiment: totalPositive,

      negativeSentiment: totalNegative,

      interviewDuration: Number(interviewDuration) || 0,
    });
  } catch (error) {
    console.error("Evaluate Interview Error:", error);

    return res.status(500).json({
      message: "Interview evaluation failed",
    });
  }
};
