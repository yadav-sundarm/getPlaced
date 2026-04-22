import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
  {
    // ---- BASIC IDENTITY ----
    username: {
      type: String,
      required: true,
      trim: true,
    },

    firstName: {
      type: String,
      required: true,
      trim: true,
    },

    lastName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      select: false,
    },

    // ---- COLLEGE-SPECIFIC ----
    batchYear: {
      type: Number,
      required: true,
    },

    department: {
      type: String,
      required: true,
      enum: ["CSE", "IT", "AIML", "DS", "EXTC", "MECH", "MCA"],
    },

    role: {
      type: String,
      enum: ["student", "admin"],
      default: "student",
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    // ---- PLATFORM ACTIVITY ----
    testsAttempted: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "TestsModel",
      },
    ],

    meetingsAttended: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Meeting",
      },
    ],
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("User", userSchema);
