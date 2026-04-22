import customApiError from "../utils/customApiError.js"
import asyncHandler from "../utils/asyncHandler.js"
import questionsModel from "../models/questions.model.js"
import customApiResponse from "../utils/customApiResponse.js"

const getAllQuestions = async (req, res) => {
    

    const allQuestions = await questionsModel.find().select("-correctAnswer")


    return res.status(200).json(
        new customApiResponse("Sucessfully retrived mock questions !!", 200, { allQuestions })
    )
}

const getMathQuestions = asyncHandler(async (req, res) => {
    
    const allQuestions = await questionsModel.find({ category: "math" }).select("-correctAnswer")


    return res.status(200).json(
        new customApiResponse("Sucessfully retrived math questions !!", 200, { allQuestions })
    )
})

const getLogicalQuestions = async (req, res) => {
    

    const allQuestions = await questionsModel.find({ category: "logical" }).select("-correctAnswer")


    return res.status(200).json(
        new customApiResponse("Sucessfully retrived logical questions !!", 200, { allQuestions })
    )
}

const getComputerQuestions = async (req, res) => {
  
    const allQuestions = await questionsModel.find({ category: "computer" }).select("-correctAnswer")


    return res.status(200).json(
        new customApiResponse("Sucessfully retrived computer questions !!", 200, { allQuestions })
    )
}



const TEST_DURATION = 20 * 60 * 1000; // 20 mins

const submitTest = asyncHandler(async (req, res) => {
    const { answers, startTime } = req.body;

    if (!startTime) {
        throw new customApiError(400, "Test start time missing");
    }

    const now = Date.now();
    const endTime = parseInt(startTime) + TEST_DURATION;

    if (now > endTime) {
        throw new customApiError(403, "Time is over! Test expired.");
    }

    let score = 0;

    const questionIds = Object.keys(answers);

    // 🔥 Optimized DB query (IMPORTANT)
    const questions = await questionsModel.find({
        _id: { $in: questionIds },
    });

    const questionMap = {};
    questions.forEach((q) => {
        questionMap[q._id] = q;
    });

    for (const qid of questionIds) {
        if (answers[qid] === questionMap[qid]?.correctAnswer) {
            score++;
        }
    }

    return res.status(200).json(
        new customApiResponse("Test evaluated successfully", 200, { score })
    );
});


export {
    getAllQuestions,
    getComputerQuestions,
    getLogicalQuestions,
    getMathQuestions,
    submitTest,
}

