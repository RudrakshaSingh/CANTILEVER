import asyncHandler from "../utils/AsyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import User from "../models/userModel.js";
import Activity from "../models/activityModel.js";

export const createActivity = asyncHandler(async (req, res) => {
  const {
    firebaseUid,
    title,
    description,
    startDate,
    time,
    location,
    maxParticipants,
    visibility = "Public",
  } = req.body;

  // Validate Firebase UID
  if (!firebaseUid) {
    throw new ApiError(400, "Firebase UID is required");
  }

  // Find user by Firebase UID
  const user = await User.findOne({ firebaseUid });
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // Validate required fields
  if (!title || !description || !startDate || !time) {
    throw new ApiError(
      400,
      "Title, description, start date, and time are required"
    );
  }

  // Parse location if it's a string
  let parsedLocation;
  try {
    parsedLocation =
      typeof location === "string" ? JSON.parse(location) : location;
  } catch (error) {
    throw new ApiError(400, "Invalid location format");
  }

  if (!parsedLocation?.address || !parsedLocation?.coordinates) {
    throw new ApiError(400, "Location address and coordinates are required");
  }

  if (!maxParticipants || maxParticipants < 1) {
    throw new ApiError(400, "Max participants must be at least 1");
  }

  // Validate date logic
  const activityStartDate = new Date(startDate);
  const now = new Date();

  if (activityStartDate < now) {
    throw new ApiError(400, "Start date cannot be in the past");
  }

  // Validate coordinates (longitude, latitude)
  const [longitude, latitude] = parsedLocation.coordinates;
  if (longitude < -180 || longitude > 180 || latitude < -90 || latitude > 90) {
    throw new ApiError(400, "Invalid coordinates");
  }

  // Validate visibility
  if (!["Public", "Private"].includes(visibility)) {
    throw new ApiError(400, "Visibility must be either 'Public' or 'Private'");
  }

  // Create the activity
  const activity = await Activity.create({
    title: title.trim(),
    description: description.trim(),
    creator: user._id,
    startDate: activityStartDate,
    time: time.trim(),
    location: {
      address: parsedLocation.address.trim(),
      type: "Point",
      coordinates: [longitude, latitude],
    },
    maxParticipants: parseInt(maxParticipants),
    participantsList: [
      {
        user: user._id,
      },
    ],
    visibility,
  });

  // ✅ Update the user's activitiesJoined array
  user.activitiesJoined.push(activity._id);
  await user.save();

  return res
    .status(201)
    .json(new ApiResponse(201, activity, "Activity created successfully"));
});
