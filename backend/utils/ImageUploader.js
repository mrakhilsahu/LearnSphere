// utils/imageUploader.js
import cloudinary from "cloudinary";

export const imageUploadToCloudinary = async (file,folder,height,quality) => {
  const options = { folder };

  // optional transformations
  if (height) options.height = height;
  if (quality) options.quality = quality;

  options.resource_type = "auto";

  // upload file to cloudinary
  const uploadResponse = await cloudinary.v2.uploader.upload(
    file.tempFilePath,
    options
  );

  return uploadResponse;
};
