// models/OTP.js
import mongoose from "mongoose";
import mailSender from "../utils/mailsender.js";

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
  },
  otp: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 5 * 60,
  },
});

// async function to send verification email
async function verificationEmail(email, title, otp) {
  try {
    const mailResponse = await mailSender(email, "Verification email from LMS", `<h2>Your OTP is ${otp}</h2>`);
    return mailResponse;
  } catch (error) {
    throw error;
  }
}

// pre-save hook
otpSchema.pre("save", async function (next) {
  try {
    await verificationEmail(this.email, "Verification email from LMS", this.otp);
    next();
  } catch (error) {
    next(error);
  }
});

export default mongoose.model("OTP", otpSchema);
