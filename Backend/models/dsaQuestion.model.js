import mongoose, { Schema } from "mongoose";

const dsaQuestionSchema = new Schema(
  {
    title: {
      type: String,
      // required: true,
      trim: true,
    },

    problemSlug: {
      type: String,
      // required: true,
      unique: true,
      lowercase: true,
      index: true,
    },

    difficultyLevel: {
      type: String,
      enum: ["easy", "medium", "hard"],
      // required: true,
    },

    topics: {
      type: [String], 
      index: true,
    },

    problemDescription: {
      type: String, 
      // required: true,
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
          // required: true,
        },
        code: {
          type: String,
        },
      },
    ],

    // solution: {
    //   content: {
    //     type: String, 
    //   },
    // },
  },
  { timestamps: true }
);

const DSAQuestion = mongoose.model("DsaQuestionModel", dsaQuestionSchema);

export default DSAQuestion;
