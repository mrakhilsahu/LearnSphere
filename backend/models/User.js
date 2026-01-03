import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    // basic user info
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
      trim: true,
      unique: true, // no duplicate emails
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },

    // role-based access
    accountType: {
      type: String,
      enum: ["student", "instructor", "admin"],
      required: true,
    },

    // reference to Profile model
    additionalDetails: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Profile",
    },

    // courses created (instructor) or enrolled (student)
    courses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
      },
    ],

    // profile image
    image: {
      type: String,
      trim: true,
    },

    // track progress of enrolled courses
    courseProgress: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "CourseProgress",
      },
    ],

    // password reset fields
    resetPasswordToken: {
      type: String,
    },
    resetPasswordExpires: {
      type: Date,
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
