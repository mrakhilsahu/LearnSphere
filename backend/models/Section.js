// models/Section.js
import mongoose from "mongoose";

const sectionSchema = new mongoose.Schema(
  {
    sectionName: {
      type: String,
      required: true,
      trim: true,
    },
    subSections: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SubSection",
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Section", sectionSchema);
