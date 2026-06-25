import mongoose, { Schema } from "mongoose";

const testsModel = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserModel",
    },

    testType: {
      type: String,
      enum: ["Math", "Logical", "Computer", "Mock"],
      required: true,
    },
    questions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "QuestionsModel",
        required: true,
      },
    ],
    score: {
      type: Number,
      default: 0,
    },
    totalQuestions: {
      type: Number,
      default: 20,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("TestsModel", testsModel);
