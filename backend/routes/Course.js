import express from "express";
import { auth, isInstructor } from "../middlewares/authmiddleware.js";
import upload from "../middlewares/multer.js";
import {
  createCourse,
  showAllCourses,
  getCourseDetails,
} from "../controllers/Course.js";

const router = express.Router();

router.post("/create",auth,isInstructor,upload.single("thumbnail"),createCourse);
router.get("/showAll", showAllCourses);
router.get("/:courseId", getCourseDetails);

export default router;
