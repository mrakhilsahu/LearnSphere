import Category from "../models/Category.js";

// create category
export const createCategory = async (req, res) => {
  try {
    // fetch data from request body
    const { name, description } = req.body;

    // basic validation
    if (!name || !description) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // create entry in database
    const categoryDetails = await Category.create({
      name,
      description,
    });

    // return response
    return res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: categoryDetails,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error while creating category",
      error: error.message,
    });
  }
};

// get all categories
export const getAllCategories = async (req, res) => {
  try {
    // fetch all categories from database
    const allCategories = await Category.find(
      {},
      { name: true, description: true }
    );

    // return response
    return res.status(200).json({
      success: true,
      message: "All categories fetched successfully",
      data: allCategories,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error while fetching categories",
      error: error.message,
    });
  }
};
