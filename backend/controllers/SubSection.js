// controllers/SubSection.js
import SubSection from "../models/subSection.js";
import Section from "../models/Section.js";
import  imageUploadToCloudinary  from "../utils/imageUploader.js";

export const createSubSection = async (req, res) => {
  try {
    const { title, description, sectionId } = req.body;
    const video = req.file.path;

    const upload = await imageUploadToCloudinary(video, process.env.CLOUDINARY_FOLDER);

    const subSection = await SubSection.create({
      title,
      description,
      videoUrl: upload.secure_url,
      duration: "5 min",
    });

    await Section.findByIdAndUpdate(sectionId, {
      $push: { subSections: subSection._id },
    });

    return res.status(201).json({ success: true, data: subSection });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};
