// controllers/Course.js
import Course from "../models/Course.js";
import Category from "../models/Category.js";

// CREATE COURSE
export const createCourse = async (req, res) => {
  try {
    const {
      title,
      description,
      whatYouWillLearn,
      price,
      category,
      tag,
    } = req.body;

    if (!title || !description || !price || !category) {
      return res.status(400).json({ success: false, message: "Missing fields" });
    }

    const course = await Course.create({
      title,
      description,
      whatYouWillLearn,
      price,
      category,
      instructor: req.user.id,
      tag,
      thumbnail: req.file.path
,
    });

    // attach course to category
    await Category.findByIdAndUpdate(category, {
      $push: { courses: course._id },
    });

    return res.status(201).json({ success: true, data: course });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

// GET ALL COURSES
export const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find({})
      .populate("instructor")
      .populate("category");

    return res.status(200).json({ success: true, data: courses });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

// COURSE DETAILS
export const getCourseDetails = async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId)
      .populate("instructor")
      .populate({
        path: "courseContent",
        populate: { path: "subSections" },
      });

    return res.status(200).json({ success: true, data: course });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};
//showAllcourse
export const showAllCourses = async (req, res) => {
  try {
    const courses = await Course.find({})
      .populate("instructor")
      .populate("category");

    res.status(200).json({
      success: true,
      data: courses,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch courses",
    });
  }
};
