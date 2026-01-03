import User from "../models/User.js";
import Profile from "../models/Profile.js";
import OTP from "../models/OTP.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

/* ================= SEND OTP ================= */
export const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: "Email required" });
    }

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    // Generate unique 6-digit OTP
    let otp;
    let exists;
    do {
      otp = Math.floor(100000 + Math.random() * 900000).toString();
      exists = await OTP.findOne({ otp });
    } while (exists);

    // Save OTP with expiry (5 minutes)
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
    await OTP.create({ email, otp, expiresAt });

    return res.status(200).json({ success: true, message: "OTP sent successfully", otp }); // remove otp in production
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "OTP failed" });
  }
};

/* ================= SIGNUP ================= */
export const signup = async (req, res) => {
  try {
    const { firstName, lastName, email, password, confirmPassword, otp, accountType } = req.body;

    if (!firstName || !lastName || !email || !password || !confirmPassword || !otp) {
      return res.status(400).json({ success: false, message: "All fields required" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ success: false, message: "Passwords do not match" });
    }

    // Get latest OTP for email
    const recentOtp = await OTP.findOne({ email }).sort({ createdAt: -1 });
    if (!recentOtp || recentOtp.otp !== otp || recentOtp.expiresAt < new Date()) {
      return res.status(400).json({ success: false, message: "Invalid or expired OTP" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create empty profile
    const profile = await Profile.create({
      gender: null,
      dateOfBirth: null,
      about: null,
      contactNumber: null,
    });

    // Create user
    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      accountType,
      additionalDetails: profile._id,
      image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName}`,
    });

    // Delete OTP after successful signup
    await OTP.findByIdAndDelete(recentOtp._id);

    return res.status(201).json({ success: true, message: "User registered successfully", user });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Signup failed" });
  }
};

/* ================= LOGIN ================= */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Credentials required" });
    }

    const user = await User.findOne({ email }).populate("additionalDetails");
    if (!user) {
      return res.status(401).json({ success: false, message: "User not found" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ success: false, message: "Incorrect password" });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user._id, accountType: user.accountType },
      process.env.JWT_SECRET,
      { expiresIn: "3h" }
    );

    return res
      .cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 3 * 60 * 60 * 1000,
      })
      .status(200)
      .json({ success: true, token, user });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Login failed" });
  }
};
