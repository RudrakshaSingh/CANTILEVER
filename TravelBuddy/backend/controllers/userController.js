import asyncHandler from "../utils/AsyncHandler.js";
import User from "../models/userModel.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import deleteFromCloudinaryByUrl from "../utils/deleteCloudinary.js";
import uploadOnCloudinary from "../utils/Cloudinary.js";

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
      throw new ApiError(
        400,
        "fullName and email are required to register new user"
      );
    }

    user = await User.create({
      fullName,
      email,
      firebaseUid,
      online: true, // ✅ Set online to true on creation
    });

    return res
      .status(201)
      .json(new ApiResponse(201, user, "User registered successfully"));
  }

  // ✅ User found — update online status
  if (!user.online) {
    user.online = true;
    await user.save(); // Save only if changed
  }

  res.status(200).json(new ApiResponse(200, user, "User found successfully"));
});

export const getProfile = asyncHandler(async (req, res) => {
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

export const deleteUser = asyncHandler(async (req, res) => {
  const { firebaseUid } = req.body;

  if (!firebaseUid) {
    throw new ApiError(400, "Firebase UID is required");
  }

  const user = await User.findOne({ firebaseUid });
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // Delete user from database
  await User.deleteOne({ firebaseUid });
  res.status(200).json(new ApiResponse(200, user, "User deleted successfully"));
});

export const updateUser = asyncHandler(async (req, res) => {
  const {
    firebaseUid,
    fullName,
    mobile,
    bio,
    dateOfBirth,
    gender,
    languages,
    socialLinks,
    futureDestinations,
  } = req.body;

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
    if (
      user.profilePicture &&
      user.profilePicture !== process.env.DEFAULT_PROFILE_IMAGE_URL
    ) {
      try {
        // Delete existing image from Cloudinary
        const deleteResult = await deleteFromCloudinaryByUrl(
          user.profilePicture
        );
        if (!deleteResult.success) {
          throw new ApiError(400, "Error deleting previous profile image");
          return;
        }
      } catch (error) {
        // console.error('Error deleting previous profile image:', error);
        throw new ApiError(400, "Error deleting previous profile image");
      }
    }

    // Upload new profile image to Cloudinary
    const profileImage = await uploadOnCloudinary(ProfilePictureLocalPath);
    if (!profileImage) {
      throw new ApiError(400, "Error uploading profile picture");
    }
    user.profilePicture = profileImage.url;
  }

  // Update user fields only if they are provided
  if (fullName !== undefined) {
    user.fullName = fullName;
  }

  if (mobile !== undefined) {
    user.mobile = mobile;
  }

  if (bio !== undefined) {
    user.bio = bio;
  }

  if (dateOfBirth !== undefined) {
    user.dateOfBirth = dateOfBirth;
  }

  if (gender !== undefined) {
    user.gender = gender;
  }

  if (languages !== undefined) {
    try {
      // Parse languages if it's a string, otherwise use as-is
      user.languages =
        typeof languages === "string" ? JSON.parse(languages) : languages;
    } catch (error) {
      throw new ApiError(400, "Invalid languages format");
    }
  }

  if (socialLinks !== undefined) {
    try {
      // Parse socialLinks if it's a string, otherwise use as-is
      user.socialLinks =
        typeof socialLinks === "string" ? JSON.parse(socialLinks) : socialLinks;
    } catch (error) {
      throw new ApiError(400, "Invalid socialLinks format");
    }
  }

  if (futureDestinations !== undefined) {
    try {
      // Parse futureDestinations if it's a string, otherwise use as-is
      user.futureDestinations =
        typeof futureDestinations === "string"
          ? JSON.parse(futureDestinations)
          : futureDestinations;
    } catch (error) {
      throw new ApiError(400, "Invalid futureDestinations format");
    }
  }

  // Update profile completion status
  updateProfileCompletion(user);

  await user.save();
  res.status(200).json(new ApiResponse(200, user, "User updated successfully"));
});

export const logoutUser = asyncHandler(async (req, res) => {
  const { firebaseUid } = req.body;

  if (!firebaseUid) {
    throw new ApiError(400, "Firebase UID is required");
  }

  const user = await User.findOne({ firebaseUid });
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // ✅ Set online to false
  user.online = false;
  await user.save();

  res.status(200).json(new ApiResponse(200, null, "User logged out successfully"));
});

// Helper function to update profile completion status
const updateProfileCompletion = (user) => {
  // Check basic info (fullName, dateOfBirth, gender)
  user.profileCompletion.basicInfo = !!(
    user.fullName &&
    user.dateOfBirth &&
    user.gender
  );

  // Check profile picture (true only if URL is not default)
  user.profileCompletion.profilePicture = !!(
    user.profilePicture &&
    user.profilePicture !== process.env.DEFAULT_PROFILE_IMAGE_URL
  );

  // Check bio
  user.profileCompletion.bio = !!(user.bio && user.bio.trim().length > 0);

  // Check phone number
  user.profileCompletion.phoneNumber = !!(
    user.mobile && user.mobile.trim().length > 0
  );

  // Check languages (at least one language with proficiency)
  user.profileCompletion.languages = !!(
    user.languages &&
    user.languages.length > 0 &&
    user.languages.some((lang) => lang.language && lang.proficiency)
  );
};

export const updateUserLocation = asyncHandler(async (req, res) => {
  const { firebaseUid, lat, lng } = req.body;

  if (!firebaseUid) {
    throw new ApiError(400, "Firebase UID is required");
  }

  const user = await User.findOne({ firebaseUid });
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  user.currentLocation.lat = lat;
  user.currentLocation.lng = lng;
  await user.save();

  res.status(200).json(new ApiResponse(200, user, "User location updated successfully"));
});