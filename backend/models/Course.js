import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
  {
    // course title
    title: {
      type: String,
      required: true,
      trim: true,
    },

    // short description
    description: {
      type: String,
      required: true,
      trim: true,
    },

    // learning outcomes
    whatYouWillLearn: [
      {
        type: String,
        required: true,
        trim: true,
      },
    ],

    // instructor reference
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // sections inside course
    courseContent: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Section",
      },
    ],

    // thumbnail image
    thumbnail: {
      type: String,
      required: true,
      trim: true,
    },

    // course price
    price: {
      type: Number,
      required: true,
    },

    // category reference
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    // simple tag strings
    tag: {
      type: [String],
      required: true,
    },

    // average rating
    rating: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Course", courseSchema);
