import extractAllData from "./extractAllData.js"
import mathQuestions from "./extractMathQuestions.js"
import computerQuestions from "./extractComputerQuestions.js"
import logicalQuestions from "./extractLogicalQuestions.js"
import questionsModel from "../models/questions.model.js"
import customApiError from "./customApiError.js"
import CustomApiResponse from "./customApiResponse.js"
import extractDSAQuestions from "./extractDSAQuestions.js"
import fs from "fs"
import DsaQuestionModel from "../models/dsaQuestion.model.js"


const seedAptitudeQuestionsInDatabase = async() =>{

    const mockQuestionsData = await extractAllData()

    const mathQuestionsData = await mathQuestions()

    const computerQuestionsData = await computerQuestions()

    const logicalQuestionsData = await logicalQuestions()

    const allQuestions = []

    mathQuestionsData.map((singleQuestion)=>{
        allQuestions.push({
            question: singleQuestion?.Question,
            options:{
                A: singleQuestion?.['Option A'],
                B: singleQuestion?.['Option B'],
                C: singleQuestion?.['Option C'],
                D: singleQuestion?.['Option D'],
           },
             correctAnswer: singleQuestion?.Answer,
            category: "math",
        })
    })


    logicalQuestionsData.map((singleQuestion)=>{
        allQuestions.push({
            question: singleQuestion?.Question,
            options:{
                A: singleQuestion?.['Option A'],
                B: singleQuestion?.['Option B'],
                C: singleQuestion?.['Option C'],
                D: singleQuestion?.['Option D'],
           },
             correctAnswer: singleQuestion?.Answer,
            category: "logical",
        })
    })


    computerQuestionsData.map((singleQuestion)=>{
        allQuestions.push({
            question: singleQuestion?.Question,
            options:{
                A: singleQuestion?.['Option A'],
                B: singleQuestion?.['Option B'],
                C: singleQuestion?.['Option C'],
                D: singleQuestion?.['Option D'],
           },
             correctAnswer: singleQuestion?.Answer,
            category: "computer",
        })
    })


    mockQuestionsData.map((singleQuestion)=>{
        allQuestions.push({
            question: singleQuestion?.Question,
            options:{
                A: singleQuestion?.['Option A'],
                B: singleQuestion?.['Option B'],
                C: singleQuestion?.['Option C'],
                D: singleQuestion?.['Option D'],
           },
            correctAnswer: singleQuestion?.Answer,
            category: "mock",
        })
    })

    try {
        await questionsModel.insertMany(allQuestions)
        console.log("Data extracted and stored in database successfullyy")
        // return res.status(200).json(
        //     new CustomApiResponse("Sucessfully stored questions !!", 200, {allQuestions})
        // )
    } catch (error) {
        throw new customApiError("Error while uploading the data !!", 500,error)
    }


}



const seedDSAQuestionsInDatabase = async () =>{
    const dsaQuestions = await extractDSAQuestions()

    console.log(dsaQuestions)

    try {
        await DsaQuestionModel.insertMany(dsaQuestions)
        console.log("Data extracted and stored in database successfullyy")
    } catch (error) {
        throw new customApiError("Error while uploading the data !!", 500, error)
    }

}




export  {seedAptitudeQuestionsInDatabase, seedDSAQuestionsInDatabase}