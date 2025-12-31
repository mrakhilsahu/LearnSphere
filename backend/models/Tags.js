// models/Tag.js
import mongoose from "mongoose";
import coures from "./coures";

const tagSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true, // important: avoid duplicate tags
    },
    description: {
      type: String,
      trim: true,
    },
    coures:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"coures",
    }
  },

  { timestamps: true }
);

export default mongoose.model("Tag", tagSchema);
