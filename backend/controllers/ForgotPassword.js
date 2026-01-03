// // controllers/ResetPassword.js
// import crypto from "crypto";
// import User from "../models/User.js";
// import mailSender from "../utils/mailsender.js";

// export const forgotPassword = async (req, res) => {
//   try {
//     const { email } = req.body;
//     if (!email) {
//       return res.status(400).json({ success: false, message: "Email required" });
//     }

//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(404).json({ success: false, message: "User not found" });
//     }

//     const token = crypto.randomBytes(20).toString("hex");

//     user.resetPasswordToken = token;
//     user.resetPasswordExpires = Date.now() + 5 * 60 * 1000;
//     await user.save();

//     const resetLink = `http://localhost:3000/reset-password/${token}`;

//     await mailSender(
//       email,
//       "Reset Password",
//       `Click here to reset password: ${resetLink}`
//     );

//     res.status(200).json({
//       success: true,
//       message: "Reset password link sent",
//     });
//   } catch (error) {
//     res.status(500).json({ success: false, message: "Something went wrong" });
//   }
// };
