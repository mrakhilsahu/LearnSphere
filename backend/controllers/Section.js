// controllers/Section.js
import Section from "../models/Section.js";
import Course from "../models/Course.js";

export const createSection = async (req, res) => {
  try {
    const { sectionName, courseId } = req.body;

    const section = await Section.create({ sectionName });

    await Course.findByIdAndUpdate(courseId, {
      $push: { courseContent: section._id },
    });

    return res.status(201).json({ success: true, data: section });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};
