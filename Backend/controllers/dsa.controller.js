import DsaQuestionModel from "../models/dsaQuestion.model.js";
import CustomApiError from "../utils/customApiError.js";
import CustomApiResponse from "../utils/customApiResponse.js";
import userDsaAnswerModel from "../models/userDsaAnswer.model.js";
import axios from "axios";
import mongoose from "mongoose";

const getTopicWiseDSAQuestions = async (req, res) => {
  const { topic } = req.query;

  if (!topic) {
    throw new CustomApiError("Topic is required to fetch questions !!", 400);
  }

  const topicWiseQuestions = await DsaQuestionModel.find({
    topics: topic,
  }).select(
    "-problemDescription -inputConstraints -examples -hints -starterCode",
  );

  if (!topicWiseQuestions || topicWiseQuestions.length === 0) {
    throw new CustomApiError("No questions found for the specified topic", 404);
  }

  return res
    .status(200)
    .json(
      new CustomApiResponse(
        "Successfully retrieved topic-wise questions !!",
        200,
        { topicWiseQuestions },
      ),
    );
};

const getDSATopics = async (req, res) => {
  const questions = await DsaQuestionModel.find();

  const allQuestionsTopics = questions.map((q) => q?.topics).flat();
  const allUniqueTopics = [...new Set(allQuestionsTopics)];

  if (allUniqueTopics.length === 0) {
    throw new CustomApiError("Topics could not be fetched", 500);
  }

  return res.status(200).json(
    new CustomApiResponse("Successfully retrieved all DSA topics !!", 200, {
      allUniqueTopics,
    }),
  );
};

const getSingleDSAQuestion = async (req, res) => {
  const { questionId } = req.query;

  if (!questionId) {
    throw new CustomApiError(
      "Couldn't fetch question details without questionId !!",
      400,
    );
  }

  const dsaQuestion = await DsaQuestionModel.findById(questionId);

  if (!dsaQuestion) {
    throw new CustomApiError(
      "Couldn't fetch the question from database !!",
      500,
    );
  }

  return res
    .status(200)
    .json(
      new CustomApiResponse(
        "Successfully retrieved the question details !!",
        200,
        { dsaQuestion },
      ),
    );
};

const runCode = async (req, res) => {
  try {
    const { language, code, stdin = "", questionId, userId } = req.body;

    const languageConfig = {
      python: { language: "python3", versionIndex: "3" },
      javascript: { language: "nodejs", versionIndex: "4" },
      java: { language: "java", versionIndex: "3" },
      cpp: { language: "cpp17", versionIndex: "0" },
    };

    const selectedLanguage = languageConfig[language];

    if (!selectedLanguage) {
      return res
        .status(400)
        .json({ success: false, message: "Unsupported language" });
    }

    const response = await axios.post("https://api.jdoodle.com/v1/execute", {
      clientId: process.env.JDOODLE_CLIENT_ID,
      clientSecret: process.env.JDOODLE_CLIENT_SECRET,
      script: code,
      stdin,
      language: selectedLanguage.language,
      versionIndex: selectedLanguage.versionIndex,
    });

    const result = response.data;
    if (questionId && userId) {
      const verdict = result.statusCode === 200 ? "AC" : "WA";
      const savedAnswer = await userDsaAnswerModel.create({
        userId: new mongoose.Types.ObjectId(userId),
        questionId: new mongoose.Types.ObjectId(questionId),
        language,
        code,
        verdict,
        timeComplexity: result.cpuTime ? parseFloat(result.cpuTime) : null,
        spaceComplexity: result.memory ? parseFloat(result.memory) : null,
      });

      console.log("Saved Answer:", savedAnswer);
    }

    return res.status(200).json({
      success: true,
      output: result.output,
      memory: result.memory,
      cpuTime: result.cpuTime,
      statusCode: result.statusCode,
    });
  } catch (error) {
    console.log("JDoodle Error:", error.response?.data || error.message);
    return res.status(500).json({
      success: false,
      message: "Code execution failed",
      error: error.response?.data || error.message,
    });
  }
};

const getSolvedQuestions = async (req, res) => {
  const { userId } = req.query;
  const solvedIds = await userDsaAnswerModel.distinct("questionId", {
    userId: new mongoose.Types.ObjectId(userId),
    verdict: "AC",
  });
  return res.status(200).json(
    new CustomApiResponse("Solved questions fetched", 200, {
      solvedIds: solvedIds.map((id) => id.toString()),
    })
  );
};

export { getTopicWiseDSAQuestions, getDSATopics, getSingleDSAQuestion, runCode, getSolvedQuestions };

