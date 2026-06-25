import mongoose, { Schema } from "mongoose";

const userDsaAnswerSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    questionId: {
      type: Schema.Types.ObjectId,
      ref: "DsaQuestionModel",
      required: true,
    },
    problemSlug: String,
    language: {
      type: String,
      enum: ["java", "python", "javascript", "cpp"],
    },
    code: {
      type: String,
      required: true,
    },
    verdict: {
      type: String,
      enum: ["AC", "WA"],
      required: true,
    },
    timeComplexity: Number,
    spaceComplexity: Number,
  },
  { timestamps: true },
);

const userDsaAnswerModel = mongoose.model(
  "userDsaAnswerModel",
  userDsaAnswerSchema,
);

export default userDsaAnswerModel;
