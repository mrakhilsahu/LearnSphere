import mongoose from "mongoose";

const ratingSchema = new mongoose.Schema(
  {
    // user who gave rating
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // course being reviewed
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },

    // rating value
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },

    // optional review text
    review: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("RatingAndReview", ratingSchema);
