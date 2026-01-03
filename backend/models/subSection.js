import mongoose from "mongoose";

const subSectionSchema = new mongoose.Schema(
  {
    // video title
    title: {
      type: String,
      required: true,
      trim: true,
    },

    // cloudinary video url
    videoUrl: {
      type: String,
      required: true,
      trim: true,
    },

    // duration of video
    duration: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("SubSection", subSectionSchema);
