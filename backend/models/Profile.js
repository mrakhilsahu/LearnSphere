// models/Profile.js
import mongoose from "mongoose";

const profileSchema = new mongoose.Schema({
  gender: {
    type: String,
    trim: true,
  },
  dateOfBirth: {
    type: String,
    trim: true,
  },
  about: {
    type: String,
    trim: true,
  },
  contactNumber: {
    type: String,
    trim: true,
  },
});

export default mongoose.model("Profile", profileSchema);
