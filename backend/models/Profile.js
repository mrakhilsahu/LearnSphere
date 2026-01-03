import mongoose from "mongoose";

const profileSchema = new mongoose.Schema({
  // optional user details
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
