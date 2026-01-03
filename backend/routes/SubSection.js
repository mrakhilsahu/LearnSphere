import express from "express";
import { auth, isInstructor } from "../middlewares/authmiddleware.js";
import upload from "../middlewares/multer.js";
import { createSubSection } from "../controllers/SubSection.js";

const router = express.Router();

router.post("/addSubSection",
  auth,
  isInstructor,
  upload.single("video"),
  createSubSection
);

export default router;
