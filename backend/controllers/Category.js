// controllers/Category.js
import Category from "../models/Category.js";
import Course from "../models/Course.js";

// create category
export const createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    // basic validation
    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Category name is required",
      });
    }

    // prevent duplicate categories
    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return res.status(409).json({
        success: false,
        message: "Category already exists",
      });
    }

    const category = await Category.create({
      name,
      description,
    });

    return res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: category,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to create category",
      error: error.message,
    });
  }
};

// get all categories
export const getAllCategories = async (req, res) => {
  try {
    // only required fields are selected for lightweight response
    const categories = await Category.find({}, { name: true, description: true });

    return res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch categories",
      error: error.message,
    });
  }
};

// get category page details
export const getCategoryPageDetails = async (req, res) => {
  try {
    const { categoryId } = req.params;

    // fetch selected category with its courses
    const selectedCategory = await Category.findById(categoryId)
      .populate({
        path: "courses",
        populate: {
          path: "instructor",
        },
      });

    if (!selectedCategory) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    // fetch other categories except the selected one
    const differentCategories = await Category.find({
      _id: { $ne: categoryId },
    }).populate("courses");

    return res.status(200).json({
      success: true,
      data: {
        selectedCategory,
        differentCategories,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to load category details",
      error: error.message,
    });
  }
};
