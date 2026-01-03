import { v2 as cloudinary } from "cloudinary";

const imageUploadToCloudinary = async (filePath, folder) => {
  const options = {
    folder,
    resource_type: "auto",
  };

  const uploadResponse = await cloudinary.uploader.upload(
    filePath,
    options
  );

  return uploadResponse;
};

export default imageUploadToCloudinary;
