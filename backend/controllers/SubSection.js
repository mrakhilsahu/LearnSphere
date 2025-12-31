import SubSection from "../models/subSection.js";
import Section from "../models/Section.js";
import { imageUploadToCloudinary } from "../utils/ImageUploader.js";

// create subsection
export const createSubSection = async (req, res) => {
  try {
    // fetch data from request body
    const { title, description, sectionId } = req.body;

    // extract video file
    const video = req.files?.video;

    // validation
    if (!title || !description || !sectionId || !video) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // upload video to cloudinary
    const uploadedVideo = await imageUploadToCloudinary(video,process.env.CLOUDINARY_FOLDER );

    // create subsection
    const newSubSection = await SubSection.create({
      title,
      description,
      videoUrl: uploadedVideo.secure_url,
    });

    // update section with subsection ObjectId
    await Section.findByIdAndUpdate(
      sectionId,
      { $push: { subSection: newSubSection._id } },
      { new: true }
    );

    // return response
    return res.status(201).json({
      success: true,
      message: "SubSection created successfully",
      data: newSubSection,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error while creating subsection",
      error: error.message,
    });
  }
};
