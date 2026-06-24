import mongoose from "mongoose";

const RoundDetailSchema = new mongoose.Schema(
  {
    roundNumber: {
      type: Number,
      required: true,
    },
    roundType: {
      type: String,
      required: true,
      enum: ["HR", "Technical", "Aptitude", "GD", "Coding", "Managerial"],
    },
    roundName: {
      type: String,
      trim: true,
    },
    questions: {
      type: [String],
      required: true,
      validate: {
        validator: (arr) => arr.length > 0,
        message: "At least one question per round is required",
      },
    },
  },
  { _id: false },
);

const ExperienceSubmissionSchema = new mongoose.Schema(
  {
    // Who submitted
    submittedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Core interview data
    companyName: {
      type: String,
      required: true,
      trim: true,
    },
    jobProfile: {
      type: String,
      required: true,
      trim: true,
    },
    year: {
      type: Number,
      required: true,
    },
    totalRounds: {
      type: Number,
      required: true,
      min: 1,
    },
    rounds: {
      type: [RoundDetailSchema],
      required: true,
    },

    // Extra context the student can share
    tips: {
      type: String,
      trim: true,
    },
    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
    },
    result: {
      type: String,
      enum: ["Selected", "Not Selected", "Waiting"],
    },

    // Admin workflow
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    reviewNote: {
      type: String,
      trim: true,
    },
    reviewedAt: {
      type: Date,
      default: null,
    },

    // Source tracking  (form vs pdf-upload-by-admin)
    source: {
      type: String,
      enum: ["student_form", "admin_pdf"],
      default: "student_form",
    },
  },
  {
    timestamps: true, // createdAt = submission time
  },
);

// Index for fast admin queries
ExperienceSubmissionSchema.index({ status: 1, createdAt: -1 });
ExperienceSubmissionSchema.index({ submittedBy: 1 });

export default mongoose.model(
  "ExperienceSubmission",
  ExperienceSubmissionSchema,
);
