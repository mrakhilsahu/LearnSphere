import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    // category name like Web Dev, Backend
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },

    description: {
      type: String,
      trim: true,
    },

    // courses under this category
    courses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Category", categorySchema);
