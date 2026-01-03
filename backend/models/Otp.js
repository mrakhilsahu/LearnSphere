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

// send OTP email
async function verificationEmail(email, otp) {
  return await mailSender(
    email,
    "Verification email from LMS",
    `<h2>Your OTP is ${otp}</h2>`
  );
}

// ✅ CORRECT async pre hook
otpSchema.pre("save", async function () {
  await verificationEmail(this.email, this.otp);
});

export default mongoose.model("OTP", otpSchema);
