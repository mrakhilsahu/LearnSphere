import crypto from "crypto";
import User from "../models/User";
import mailSender from "../utils/mailsender";

// reset password
exports.resetPasswordToken = async (req, res) => {
  try {
    // get email from req body
    const { email } = req.body;

    // validation on email
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    // check user for this email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // generate token
    const token = crypto.randomBytes(20).toString("hex");

    // update user by adding token and expiration time
    await User.findOneAndUpdate(
      { email },
      {
        resetPasswordToken: token,
        resetPasswordExpires: Date.now() + 5 * 60 * 1000, // 5 minutes
      },
      { new: true }
    );

    // create url
    const resetUrl = `http://localhost:3000/reset-password/${token}`;

    // send mail containing the url
    await mailSender(
      email,
      "Password Reset Link",
      `<p>Click the link below to reset your password:</p>
       <a href="${resetUrl}">${resetUrl}</a>`
    );

    // return response
    return res.status(200).json({
      success: true,
      message: "Reset password link sent to email",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to send reset password email",
    });
  }
};

// reset password
exports.resetPassword = async (req, res) => {
  try {
    // fetch data
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

    // get user details from db by token
    const user = await User.findOne({resetPasswordToken: token, });

    // check if no entry, token wrong or expires
    if (!user || user.resetPasswordExpires < Date.now()) {
      return res.status(400).json({
        success: false,
        message: "Token is invalid or expired",
      });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // update password
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    // response
    return res.status(200).json({
      success: true,
      message: "Password reset successful",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to reset password",
    });
  }
};
