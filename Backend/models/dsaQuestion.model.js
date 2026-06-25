import mongoose, { Schema } from "mongoose";

const dsaQuestionSchema = new Schema(
  {
    title: {
      type: String,
      trim: true,
    },

    problemSlug: {
      type: String,
      unique: true,
      lowercase: true,
      index: true,
    },

    difficultyLevel: {
      type: String,
      enum: ["easy", "medium", "hard"],
    },

    topics: {
      type: [String], 
      index: true,
    },

    problemDescription: {
      type: String, 
    },

    inputConstraints: {
      type: Schema.Types.Mixed, 
    },

    examples: [
      {
        exampleNumber: Number,
        exampleText: String,
      },
    ],

    hints: {
      type: [String],
    },

    starterCode: [
      {
        language: {
          type: String,
          enum: ["java", "python", "javascript"],
        },
        code: {
          type: String,
        },
      },
    ],

  },
  { timestamps: true }
);

const DSAQuestion = mongoose.model("DsaQuestionModel", dsaQuestionSchema);

export default DSAQuestion;
