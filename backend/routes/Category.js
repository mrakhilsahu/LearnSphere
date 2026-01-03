import express from "express";
import { auth, isAdmin } from "../middlewares/authmiddleware.js";
import {
  createCategory,
  getAllCategories,
  getCategoryPageDetails,
} from "../controllers/Category.js";

const router = express.Router();

// admin creates category
router.post("/createNewCategory", auth, isAdmin, createCategory);

// public
router.get("/AllCategories", getAllCategories);
router.get("/:categoryId", getCategoryPageDetails);

export default router;
