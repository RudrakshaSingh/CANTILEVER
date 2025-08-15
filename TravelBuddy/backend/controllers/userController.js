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

  res
    .status(200)
    .json(new ApiResponse(200, null, "User logged out successfully"));
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

export const findNearbyPeople = asyncHandler(async (req, res) => {
  const { firebaseUid, searchType, lat, lng, radius, name } = req.body;

  // Validate Firebase UID
  if (!firebaseUid) {
    throw new ApiError(400, "Firebase UID is required");
  }

  // Find user by Firebase UID
  const user = await User.findOne({ firebaseUid }).select("_id currentLocation friends");
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // Validate searchType
  if (!["userLocation", "placeLocation", "userName"].includes(searchType)) {
    throw new ApiError(
      400,
      "Invalid search type. Must be 'userLocation', 'placeLocation', or 'userName'"
    );
  }

  let users = [];

  if (searchType === "userName") {
    // Validate name for userName search
    if (!name || !name.trim()) {
      throw new ApiError(400, "User name is required for name-based search");
    }

    // Search by user name (case-insensitive)
    users = await User.find({
      fullName: { $regex: name.trim(), $options: "i" },
      _id: { $ne: user._id }, // Exclude the requesting user
    }).select(
      "_id fullName email profilePicture bio languages firebaseUid currentLocation"
    );
  } else {
    // Validate coordinates and radius for location-based searches
    let searchLat, searchLng;

    if (searchType === "userLocation") {
      // Use the requesting user's currentLocation
      if (!user.currentLocation || !user.currentLocation.coordinates || user.currentLocation.coordinates.length !== 2) {
        throw new ApiError(400, "User's current location is not set");
      }
      searchLng = user.currentLocation.coordinates[0]; // longitude
      searchLat = user.currentLocation.coordinates[1]; // latitude
    } else {
      // Use provided lat/lng for placeLocation
      if (!lat || !lng || isNaN(lat) || isNaN(lng)) {
        throw new ApiError(
          400,
          "Valid latitude and longitude are required for place-based search"
        );
      }
      searchLat = parseFloat(lat);
      searchLng = parseFloat(lng);
    }

    if (
      searchLat < -90 ||
      searchLat > 90 ||
      searchLng < -180 ||
      searchLng > 180
    ) {
      throw new ApiError(
        400,
        "Invalid coordinates: latitude must be -90 to 90, longitude -180 to 180"
      );
    }

    if (!radius || isNaN(radius) || parseFloat(radius) <= 0) {
      throw new ApiError(
        400,
        "Valid radius (in meters) is required for location-based search"
      );
    }
    const maxDistance = parseFloat(radius);

    // Log for debugging
    console.log("findNearbyPeople query:", {
      searchType,
      coordinates: [searchLng, searchLat],
      maxDistance,
    });

    // Find nearby users
    users = await User.find({
      currentLocation: {
        $nearSphere: {
          $geometry: {
            type: "Point",
            coordinates: [searchLng, searchLat], // [lng, lat]
          },
          $maxDistance: maxDistance, // In meters
        },
      },
      _id: { $ne: user._id }, // Exclude the requesting user
    }).select(
      "_id fullName email profilePicture bio languages firebaseUid currentLocation"
    );
  }

  // Add isFriend property to each user
  users = users.map((u) => ({
    ...u.toObject(),
    isFriend: user.friends.includes(u._id),
  }));

  // Log response for debugging
  console.log("findNearbyPeople response:", {
    userCount: users.length,
    users: users.map((u) => ({
      _id: u._id,
      fullName: u.fullName,
      currentLocation: u.currentLocation,
      isFriend: u.isFriend,
    })),
  });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        users,
        users.length > 0
          ? "Users found successfully"
          : "No users found"
      )
    );
});

export const updateUserLocation = asyncHandler(async (req, res) => {
  const { firebaseUid, lat, lng } = req.body;

  if (!firebaseUid) {
    throw new ApiError(400, "Firebase UID is required");
  }

  if (!lat || !lng || isNaN(lat) || isNaN(lng)) {
    throw new ApiError(400, "Valid latitude and longitude are required");
  }

  const user = await User.findOne({ firebaseUid });
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  user.currentLocation = {
    type: "Point",
    coordinates: [parseFloat(lng), parseFloat(lat)], // [lng, lat]
  };
  await user.save();

  res.status(200).json(new ApiResponse(200, user, "User location updated successfully"));
});

export const getFriendProfile = asyncHandler(async (req, res) => {
  const { firebaseUid, friendId } = req.body;

  // Validate input
  if (!firebaseUid || !friendId) {
    throw new ApiError(400, "Both firebaseUid and friendId are required");
  }

  // Fetch requesting user to check friends list
  const user = await User.findOne({ firebaseUid }).select("_id friends");
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // Fetch friend's profile, deselecting sensitive fields
  const friend = await User.findById(friendId).select(
    "-firebaseUid -email -mobile -socketId -profileCompletion -friends -createdAt -updatedAt"
  );
  if (!friend) {
    throw new ApiError(404, "Friend not found");
  }

  // Add isFriend property
  const friendData = {
    ...friend.toObject(),
    isFriend: user.friends.includes(friend._id),
  };

  res.status(200).json(new ApiResponse(200, friendData, "Friend profile retrieved successfully"));
});