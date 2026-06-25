import Router from "express"
import {getTopicWiseDSAQuestions, getDSATopics, getSingleDSAQuestion, runCode} from "../controllers/dsa.controller.js"
import {verifyJWT} from "../middlewares/verifyUser.middleware.js"

const router = Router()

router.get("/get-dsa-topics", getDSATopics),
router.post("/get-topic-wise-dsa-questions", getTopicWiseDSAQuestions)
router.post("/get-single-dsa-question", getSingleDSAQuestion)
router.post("/run-code",verifyJWT, runCode)


export default router