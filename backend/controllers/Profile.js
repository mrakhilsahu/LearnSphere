import User from "../models/User.js";
import Profile from "../models/Profile.js";
import uploadImageToCloudinary from "../utils/imageUploader.js";

/* ================= UPDATE PROFILE DETAILS ================= */
export const updateProfile = async (req, res) => {
  try {
    const { dateOfBirth, about, contactNumber, gender } = req.body;
    const userId = req.user.id;

    if (!contactNumber || !gender) {
      return res.status(400).json({
        success: false,
        message: "Contact number and gender are required",
      });
    }

    const userDetails = await User.findById(userId);
    if (!userDetails) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const profileDetails = await Profile.findById(userDetails.additionalDetails);
    if (!profileDetails) {
      return res.status(404).json({
        success: false,
        message: "Profile not found",
      });
    }

    if (dateOfBirth !== undefined) profileDetails.dateOfBirth = dateOfBirth;
    if (about !== undefined) profileDetails.about = about;

    profileDetails.contactNumber = contactNumber;
    profileDetails.gender = gender;

    await profileDetails.save();

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: profileDetails,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Error while updating profile",
      error: error.message,
    });
  }
};

/* ================= UPDATE DISPLAY PICTURE ================= */
export const updateDisplayPicture = async (req, res) => {
  try {
    const userId = req.user.id;

    // multer stores file here
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Display picture is required",
      });
    }

    // ✅ PASS FILE PATH, NOT FILE OBJECT
    const image = await uploadImageToCloudinary(
  req.file.path,
  process.env.FOLDER_NAME
 );


    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { image: image.secure_url },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Display picture updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.error("UPDATE DISPLAY PIC ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Error updating display picture",
      error: error.message,
    });
  }
};

/* ================= GET USER DETAILS ================= */
export const getUserDetails = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId)
      .populate("additionalDetails")
      .exec();

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Error fetching user details",
      error: error.message,
    });
  }
};

/* ================= DELETE ACCOUNT ================= */
export const deleteAccount = async (req, res) => {
  try {
    const userId = req.user.id;

    const userDetails = await User.findById(userId);
    if (!userDetails) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    await Profile.findByIdAndDelete(userDetails.additionalDetails);
    await User.findByIdAndDelete(userId);

    return res.status(200).json({
      success: true,
      message: "Account deleted successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Error deleting account",
      error: error.message,
    });
  }
};
