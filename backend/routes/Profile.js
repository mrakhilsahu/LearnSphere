import express from "express";
import { auth } from "../middlewares/authmiddleware.js";
import {
  updateProfile,
  updateDisplayPicture,
  getUserDetails,
  deleteAccount,
} from "../controllers/Profile.js";
import upload from "../middlewares/multer.js";

const router = express.Router();

/* ================= PROFILE ROUTES ================= */

// get logged-in user profile
router.get("/me", auth, getUserDetails);

// update profile details (about, DOB, gender, contact)
router.put("/update-profile", auth, updateProfile);

// update profile picture
router.put(
  "/update-display-picture",
  auth,
  upload.single("displayPicture"),
  updateDisplayPicture
);

// delete user account
router.delete("/delete-account", auth, deleteAccount);

export default router;
