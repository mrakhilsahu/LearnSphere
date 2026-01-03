import express from "express";
import { auth, isInstructor } from "../middlewares/authmiddleware.js";
import { createSection } from "../controllers/Section.js";

const router = express.Router();

router.post("/addSection", auth, isInstructor, createSection);

export default router;
