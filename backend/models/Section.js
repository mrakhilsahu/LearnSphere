import mongoose from "mongoose";

const sectionSchema = new mongoose.Schema(
  {
    // section name like "Introduction"
    sectionName: {
      type: String,
      required: true,
      trim: true,
    },

    // subsections (videos)
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
