import asyncHandler from "../utils/AsyncHandler.js";
import User from "../models/userModel.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";

export const registerUser = asyncHandler(async (req, res) => {
    const { fullName, email, firebaseUid } = req.body;

    if (!fullName || !email || !firebaseUid) {
      throw new ApiError(400, "All fields are required");
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new ApiError(
        400,
        "User already exists with this firebaseUid or email"
      );
    }

    const user = await User.create({ fullName, email, firebaseUid });

    res
      .status(201)
      .json(new ApiResponse(201, user, "User registered successfully"));
  
});

export const getUserByFirebaseUid = asyncHandler(async (req, res) => {

    const { firebaseUid, fullName, email } = req.body;

    if (!firebaseUid) {
      throw new ApiError(400, "Firebase UID is required");
    }

    let user = await User.findOne({ firebaseUid });
    if (!user) {
      // Create user if not found
      if (!fullName || !email) {
        throw new ApiError(400, "fullName and email are required to register new user");
      }
      user = await User.create({ fullName, email, firebaseUid });
      return res.status(201).json(new ApiResponse(201, user, "User registered successfully"));
    }

    res.status(200).json(new ApiResponse(200, user, "User found successfully"));
 
});

export const getProfile= asyncHandler(async (req, res) => {
  
    const { firebaseUid } = req.body;

    if (!firebaseUid) {
      throw new ApiError(400, "Firebase UID is required");
    }

    const user = await User.findOne({ firebaseUid });
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    res.status(200).json(new ApiResponse(200, user, "User found successfully"));
  
});

export const updateUser = asyncHandler(async (req, res) => {
  const { firebaseUid, fullName, mobile, bio, dateOfBirth, gender, languages, socialLinks, futureDestinations } = req.body;

  if (!firebaseUid) {
    throw new ApiError(400, "Firebase UID is required");
  }

  const user = await User.findOne({ firebaseUid });
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // Handle profile image update only if new file is provided
  const ProfilePictureLocalPath = req.file?.path;

  if (ProfilePictureLocalPath) {
    // Check if current profile image is not the default URL
    if (user.profileImage && user.profileImage !== process.env.DEFAULT_PROFILE_IMAGE_URL) {
      try {
        // Delete existing image from Cloudinary
        const deleteResult = await deleteFromCloudinaryByUrl(user.profileImage);
        if (deleteResult.success) {
          console.log('Previous profile image deleted successfully');
        } else {
          console.log('Failed to delete previous image:', deleteResult.error);
        }
      } catch (error) {
        console.error('Error deleting previous profile image:', error);
        // Continue with upload even if delete fails
      }
    }

    // Upload new profile image to Cloudinary
    const profileImage = await uploadOnCloudinary(ProfilePictureLocalPath);
    if (!profileImage) {
      throw new ApiError(400, "Error uploading profile picture");
    }
    user.profileImage = profileImage.url;
  }

  // Update user fields (profile image only updated if new file was provided)
  user.fullName = fullName;
  user.mobile = mobile;
  user.bio = bio;
  user.dateOfBirth = dateOfBirth;
  user.gender = gender;
  user.languages = languages;
  user.socialLinks = socialLinks;
  user.futureDestinations = futureDestinations;

  await user.save();
  res.status(200).json(new ApiResponse(200, user, "User updated successfully"));
});