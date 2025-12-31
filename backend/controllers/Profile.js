import Profile from "../models/Profile.js";
import User from "../models/User.js";

// update profile
export const updateProfile = async (req, res) => {
  try {
    // get data from request body
    const { dateOfBirth, about, contactNumber, gender } = req.body;

    // get user id from auth middleware
    const userId = req.user.id;

    // validation
    if (!contactNumber || !gender) {
      return res.status(400).json({
        success: false,
        message: "Contact number and gender are required",
      });
    }

    // find user and profile
    const userDetails = await User.findById(userId);
    const profileDetails = await Profile.findById(
      userDetails.additionalDetails
    );

    // update profile
    profileDetails.dateOfBirth = dateOfBirth;
    profileDetails.about = about;
    profileDetails.contactNumber = contactNumber;
    profileDetails.gender = gender;

    await profileDetails.save();  // to save in db 

    // return response
    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: profileDetails,
    });
   } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error while updating profile",
      error: error.message,
    });
  }
};

//delete account
export const deleteAccount = async (req, res) => {
  try {
    // get user id from auth middleware
    const userId = req.user.id;

    // find user
    const userDetails = await User.findById(userId);
    if (!userDetails) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // delete associated profile
    await Profile.findByIdAndDelete(userDetails.additionalDetails);

    // delete user account
    await User.findByIdAndDelete(userId);

    // return response
    return res.status(200).json({
      success: true,
      message: "Account deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error while deleting account",
      error: error.message,
    });
  }
};

// get all users details
export const getAllUserDetails = async (req, res) => {
  try {
    // fetch all users with populated profile
    const users = await User.find({})
      .populate("additionalDetails")
      .select("-password");

    // return response
    return res.status(200).json({
      success: true,
      message: "All user details fetched successfully",
      data: users,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error while fetching user details",
      error: error.message,
    });
  }
};