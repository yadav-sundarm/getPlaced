import mongoose, { Schema } from "mongoose";

const interviewResultSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    companyName: {
      type: String,
      required: true,
    },
    interviewType: {
      type: String,
      required: true,
    },
    overallScore: {
      type: Number,
      required: true,
    },
    communicationScore: {
      type: Number,
      required: true,
    },
    technicalScore: {
      type: Number,
      required: true,
    },
    confidenceScore: {
      type: Number,
      required: true,
    },
    fluencyScore: {
      type: Number,
      required: true,
    },
    verdict: {
      type: String,
      enum: ["Excellent", "Good", "Average", "Poor"],
      required: true,
    },
  },
  { timestamps: true },
);

export default mongoose.model("InterviewResult", interviewResultSchema);
