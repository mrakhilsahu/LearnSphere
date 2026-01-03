import express from "express";
import { auth } from "../middlewares/authmiddleware.js";
import {
  getUserDetails,
  updateProfile,
} from "../controllers/Profile.js";

const router = express.Router();

router.get("/profile", auth, getUserDetails);
router.put("/updateProfile", auth, updateProfile);

export default router;
