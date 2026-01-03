// controllers/ResetPassword.js
import crypto from "crypto";
import bcrypt from "bcrypt";
import User from "../models/User.js";
import mailSender from "../utils/mailsender.js";

/* ======================================================
   FORGOT PASSWORD → SEND RESET LINK
====================================================== */
export const resetPasswordToken = async (req, res) => {
  try {
    const { email } = req.body;

    // validation
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    // check user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // generate token
    const token = crypto.randomBytes(32).toString("hex");

    // save token & expiry
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 5 * 60 * 1000; // 5 min
    await user.save();

    // frontend URL
    const resetUrl = `http://localhost:3000/reset-password/${token}`;

    // send email
    await mailSender(
      email,
      "Password Reset",
      `
      <h3>Password Reset Request</h3>
      <p>Click the link below to reset your password:</p>
      <a href="${resetUrl}">${resetUrl}</a>
      <p>This link will expire in 5 minutes.</p>
      `
    );

    return res.status(200).json({
      success: true,
      message: "Reset password link sent to email",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Error while sending reset email",
    });
  }
};

/* ======================================================
   RESET PASSWORD → USING TOKEN
====================================================== */
export const resetPassword = async (req, res) => {
  try {
    const { password, confirmPassword, token } = req.body;

    // validation
    if (!password || !confirmPassword || !token) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match",
      });
    }

    // find user by token
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Token is invalid or expired",
      });
    }

    // hash new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // update password & clear token
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password reset successful",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to reset password",
    });
  }
};
