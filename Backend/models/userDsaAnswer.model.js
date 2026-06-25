import mongoose, {Schema} from "mongoose"

const userDsaAnswerSchema = new Schema({
    userId:{
        type: Schema.Types.ObjectId,
        ref: "UserModel",
        required:true,
    },
    questionId:{
        type: Schema.Types.ObjectId,
        ref:"DsaQuestionModel",
        required:true,
    },
    problemSlug:{
        type:String,
    },
    language:{
        type:String,
        enum: ["java", "python", "javascript"],
    },
    code:{
        type:String,
        required:true,
    },
    success:{
        type: Boolean,
    },
    timeComplexity: Number, // ms
    spaceComplexity: Number, //kb or mb
}, {timestamps: true})


const userDsaAnswerModel = mongoose.model("userDsaAnswerModel", userDsaAnswerSchema)

export default userDsaAnswerModel