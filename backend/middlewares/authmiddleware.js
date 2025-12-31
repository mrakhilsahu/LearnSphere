import User from "../models/User";
import jwt from "jsonwebtoken";
import { configDotenv } from "dotenv";

configDotenv();

// auth middleware
exports.auth = async (req, res, next) => {
  try {
    // extract token
    const token =
      req.cookies?.token ||
      req.body?.token ||
      req.header("Authorization")?.replace("Bearer ", "");

    // if token missing, then return response
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token missing",
      });
    }

    // verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // attach user info to request
    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }
};
// middlewares/isStudent.js

exports.isStudent = (req, res, next) => {
  try {
    // check role from authenticated user
    if (req.user.accountType !== "student") {
      return res.status(403).json({
        success: false,
        message: "This route is accessible only to students",
      });
    }

    // allow access
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Authorization failed",
    });
  }
};
// middlewares/isInstructor.js

exports.isInstructor = (req, res, next) => {
  try {
    // check accountType from authenticated user
    if (req.user.accountType !== "Instructor") {
      return res.status(403).json({
        success: false,
        message: "This route is accessible only to instructors",
      });
    }

    // allow access
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Authorization failed",
    });
  }
};
// middlewares/isAdmin.js

exports.isAdmin = (req, res, next) => {
  try {
    // check accountType from authenticated user
    if (req.user.accountType !== "Admin") {
      return res.status(403).json({
        success: false,
        message: "This route is accessible only to admins",
      });
    }

    // allow access
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Authorization failed",
    });
  }
};


