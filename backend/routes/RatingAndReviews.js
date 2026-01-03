import express from "express";
import {
  createRatingAndReview,
  getAverageRating,
  getAllRatingsAndReviews,
} from "../controllers/RatingAndReviews.js"; // controller path ✅

import { auth } from "../middlewares/authmiddleware.js"; // middleware path ✅

const router = express.Router();

// Create a new rating & review (auth required)
router.post("/create", auth, createRatingAndReview);

// Get average rating of a course
router.get("/average/:courseId", getAverageRating);

// Get all ratings & reviews
router.get("/all", getAllRatingsAndReviews);

export default router;
