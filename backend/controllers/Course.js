import Course from "../models/coures.js";
import User from "../models/User.js";
import Tags from "../models/Category.js";
import { imageUploadToCloudinary } from "../utils/ImageUploader.js";

// create course
export const createCourse = async (req, res) => {
  try {
    // fetch data from request body
    const {courseName,courseDescription,whatYouWillLearn,price,tag,} = req.body;

    // get thumbnail from files
    const thumbnail = req.files?.thumbnail;

    // basic validation
    if (!courseName ||!courseDescription ||!whatYouWillLearn ||!price ||!tag ||!thumbnail) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // get instructor id from auth middleware
    const instructorId = req.user.id;

    // check instructor exists and is instructor
    const instructorDetails = await User.findById(instructorId);
    if (!instructorDetails || instructorDetails.accountType !== "instructor") {
      return res.status(403).json({
        success: false,
        message: "Only instructors can create courses",
      });
    }

    // check tag validity
    const tagDetails = await Tags.findById(tag); // tag is a id here ,
    if (!tagDetails) {
      return res.status(404).json({
        success: false,
        message: "Invalid tag",
      });
    }

    // upload image to cloudinary
    const thumbnailImage = await imageUploadToCloudinary(thumbnail,process.env.CLOUDINARY_FOLDER );

    // create course entry
    const newCourse = await Course.create({
      courseName,
      courseDescription,
      instructor: instructorId,
      whatYouWillLearn,
      price,
      tag,
      thumbnail: thumbnailImage.secure_url,
    });

    // add course to instructor schema
    await User.findByIdAndUpdate(
      instructorId,
      { $push: { courses: newCourse._id } },
      { new: true }
    );

    // update tag schema
    await Tags.findByIdAndUpdate(
      tag,
      { $push: { courses: newCourse._id } },
      { new: true }
    );

    // return response
    return res.status(201).json({
      success: true,
      message: "Course created successfully",
      data: newCourse,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error while creating course",
      error: error.message,
    });
  }
};

// show all courses
export const showAllCourses = async (req, res) => {
  try {
    // fetch all courses (only required fields)
    const allCourses = await Course.find(
      { status: "Published" },
      {
        courseName: true,
        price: true,
        thumbnail: true,
        instructor: true,
        tag: true,
      }
    )
      .populate("instructor", "firstName lastName")
      .populate("tag", "name");

    // return response
    return res.status(200).json({
      success: true,
      message: "All courses fetched successfully",
      data: allCourses,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error while fetching courses",
      error: error.message,
    });
  }
};