import Section from "../models/Section.js";
import Course from "../models/coures.js";

// create section
export const createSection = async (req, res) => {
  try {
    // fetch data from request body
    const { sectionName, courseId } = req.body;

    // validation
    if (!sectionName || !courseId) {
      return res.status(400).json({
        success: false,
        message: "Section name and course ID are required",
      });
    }

    // create section
    const newSection = await Section.create({ sectionName });

    // update course with section ObjectId
    await Course.findByIdAndUpdate(
      courseId,
      { $push: { courseContent: newSection._id } },
      { new: true }
    );

    // return response
    return res.status(201).json({
      success: true,
      message: "Section created successfully",
      data: newSection,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error while creating section",
      error: error.message,
    });
  }
};

// update section
export const updateSection = async (req, res) => {
  try {
    // fetch data
    const { sectionId, sectionName } = req.body;

    // validation
    if (!sectionId || !sectionName) {
      return res.status(400).json({
        success: false,
        message: "Section ID and new name are required",
      });
    }

    // update section
    const updatedSection = await Section.findByIdAndUpdate(
      sectionId,
      { sectionName },
      { new: true }
    );

    // return response
    return res.status(200).json({
      success: true,
      message: "Section updated successfully",
      data: updatedSection,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error while updating section",
      error: error.message,
    });
  }
};

// delete section
export const deleteSection = async (req, res) => {
  try {
    // fetch data
    const { sectionId, courseId } = req.body;

    // validation
    if (!sectionId || !courseId) {
      return res.status(400).json({
        success: false,
        message: "Section ID and course ID are required",
      });
    }

    // remove section reference from course
    await Course.findByIdAndUpdate(courseId, {
      $pull: { courseContent: sectionId },
    });

    // delete section
    await Section.findByIdAndDelete(sectionId);

    // return response
    return res.status(200).json({
      success: true,
      message: "Section deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error while deleting section",
      error: error.message,
    });
  }
};
