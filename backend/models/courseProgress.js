import mongoose from "mongoose";

const courseProgressSchema = new mongoose.Schema({
  // reference to course
  courseID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },

  // completed video ids
  completedVideos: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubSection",
    },
  ],
});

export default mongoose.model("CourseProgress", courseProgressSchema);
