import mongoose from "mongoose";
import TestsModel from "../models/tests.model.js";
import userDsaAnswerModel from "../models/userDsaAnswer.model.js";
import InterviewResultModel from "../models/interviewResult.model.js";
import DsaQuestionModel from "../models/dsaQuestion.model.js";

export const getDashboardStats = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user._id); // ✅ ObjectId

    const tests = await TestsModel.find({ userId });
    console.log("tests found:", tests.length, tests);
    console.log("allDsaRecords", await userDsaAnswerModel.find({ userId }));
    console.log(
      "acSubmissions",
      await userDsaAnswerModel.distinct("questionId", {
        userId,
        verdict: "AC",
      }),
    );

    let aptitudeScore = 0;
    if (tests.length > 0) {
      const avg =
        tests.reduce((acc, t) => {
          const total = t.totalQuestions || 20;
          return acc + (t.score / total) * 100;
        }, 0) / tests.length;
      aptitudeScore = Math.round(avg);
    }

    const totalDsaQuestions = await DsaQuestionModel.countDocuments();
    console.log("totalDsaQuestions:", totalDsaQuestions);

    const acSubmissions = await userDsaAnswerModel.distinct("questionId", {
      userId,
      verdict: "AC",
    });
    console.log("acSubmissions:", acSubmissions);

    const allDsaRecords = await userDsaAnswerModel.find({ userId });
    console.log("allDsaRecords:", allDsaRecords);

    const dsaScore = acSubmissions.length;

    const interviews = await InterviewResultModel.find({ userId });
    let communicationScore = 0;
    if (interviews.length > 0) {
      const avg =
        interviews.reduce((acc, i) => acc + i.communicationScore, 0) /
        interviews.length;
      communicationScore = Math.round((avg / 10) * 100);
    }

    const recentActivity = [];

    const recentDsa = await userDsaAnswerModel
      .findOne({ userId, verdict: "AC" })
      .sort({ createdAt: -1 })
      .populate("questionId", "title difficultyLevel"); // ✅ fixed field name

    if (recentDsa) {
      recentActivity.push({
        type: "dsa",
        label: recentDsa.questionId?.title || "DSA Question",
        difficulty: recentDsa.questionId?.difficultyLevel || "", // ✅
        time: recentDsa.createdAt,
      });
    }

    const recentTest = await TestsModel.findOne({ userId }).sort({
      createdAt: -1,
    });
    if (recentTest) {
      recentActivity.push({
        type: "aptitude",
        label: `${recentTest.testType} Test`,
        score: `${recentTest.score}/${recentTest.totalQuestions || 20}`,
        time: recentTest.createdAt,
      });
    }

    const recentInterview = await InterviewResultModel.findOne({ userId }).sort(
      { createdAt: -1 },
    );
    if (recentInterview) {
      recentActivity.push({
        type: "interview",
        label: `${recentInterview.companyName} Mock Interview`,
        score: `${recentInterview.overallScore}/10`,
        verdict: recentInterview.verdict,
        time: recentInterview.createdAt,
      });
    }

    recentActivity.sort((a, b) => new Date(b.time) - new Date(a.time));

    return res.status(200).json({
      aptitudeScore,
      dsaScore,
      communicationScore,
      recentActivity,
    });
  } catch (error) {
    console.error("Dashboard Stats Error:", error);
    return res.status(500).json({ message: "Failed to fetch dashboard stats" });
  }
};
