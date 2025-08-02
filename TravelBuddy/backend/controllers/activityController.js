import asyncHandler from "../utils/AsyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";
import User from "../models/userModel.js";
import Activity from "../models/activityModel.js";
import mongoose from "mongoose";

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

  // Check if requesting user's profile is complete
  if (!Object.values(user.profileCompletion).every(field => field === true)) {
    throw new ApiError(400, "Please complete your profile before creating an activity");
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

export const updateActivity = asyncHandler(async (req, res) => {
  const { activityId } = req.params;
  const {
    firebaseUid,
    title,
    description,
    startDate,
    time,
    location,
    maxParticipants,
    visibility,
  } = req.body;

  // Validate Firebase UID
  if (!firebaseUid) {
    throw new ApiError(400, "Firebase UID is required");
  }

  // Validate activityId
  if (!activityId) {
    throw new ApiError(400, "Activity ID is required");
  }

  // Find user by Firebase UID
  const user = await User.findOne({ firebaseUid }).select("_id");
  if (!user) {
    throw new ApiError(404, "User not found");
  }


  // Find activity and verify creator
  const activity = await Activity.findById(activityId);
  if (!activity) {
    throw new ApiError(404, "Activity not found");
  }
  if (!activity.creator.equals(user._id)) {
    throw new ApiError(
      403,
      "Only the activity creator can update this activity"
    );
  }

  // Validate fields if provided
  if (title !== undefined && !title?.trim()) {
    throw new ApiError(400, "Title cannot be empty");
  }
  if (description !== undefined && !description?.trim()) {
    throw new ApiError(400, "Description cannot be empty");
  }
  if (description && description.trim().length > 1000) {
    throw new ApiError(400, "Description must be 1000 characters or less");
  }
  if (startDate) {
    const activityStartDate = new Date(startDate);
    if (isNaN(activityStartDate.getTime())) {
      throw new ApiError(400, "Invalid start date format");
    }
    if (activityStartDate < new Date()) {
      throw new ApiError(400, "Start date cannot be in the past");
    }
  }
  if (time !== undefined && !time?.trim()) {
    throw new ApiError(400, "Time cannot be empty");
  }
  if (maxParticipants !== undefined) {
    if (isNaN(maxParticipants) || parseInt(maxParticipants) < 1) {
      throw new ApiError(400, "Max participants must be at least 1");
    }
    if (parseInt(maxParticipants) < activity.participantsList.length) {
      throw new ApiError(
        400,
        "Max participants cannot be less than current participants"
      );
    }
  }
  console.log("uhbvurug", req.body);

  if (visibility && !["Public", "Private"].includes(visibility)) {
    throw new ApiError(400, "Visibility must be either 'Public' or 'Private'");
  }
  let validatedLocation;
  if (location) {
    try {
      const parsed =
        typeof location === "string" ? JSON.parse(location) : location;
      if (
        !parsed?.address ||
        !parsed?.coordinates ||
        !Array.isArray(parsed.coordinates) ||
        parsed.coordinates.length !== 2
      ) {
        throw new Error("Invalid location format");
      }
      const [longitude, latitude] = parsed.coordinates;
      if (
        isNaN(longitude) ||
        isNaN(latitude) ||
        longitude < -180 ||
        longitude > 180 ||
        latitude < -90 ||
        latitude > 90
      ) {
        throw new Error("Invalid coordinates");
      }
      validatedLocation = {
        address: parsed.address.trim(),
        coordinates: [longitude, latitude],
      };
    } catch {
      throw new ApiError(400, "Invalid location format");
    }
  }

  // Update activity fields
  const updates = {};
  if (title) updates.title = title.trim();
  if (description) updates.description = description.trim();
  if (startDate) updates.startDate = new Date(startDate);
  if (time) updates.time = time.trim();
  if (location) {
    updates.location = {
      address: validatedLocation.address,
      type: "Point",
      coordinates: validatedLocation.coordinates,
    };
  }
  if (maxParticipants) updates.maxParticipants = parseInt(maxParticipants);
  if (visibility) updates.visibility = visibility;

  // Perform the update
  const updatedActivity = await Activity.findByIdAndUpdate(
    activityId,
    { $set: updates },
    { new: true, runValidators: true }
  )
    .populate("creator")
    .populate("participantsList.user");

  if (!updatedActivity) {
    throw new ApiError(500, "Failed to update activity");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, updatedActivity, "Activity updated successfully")
    );
});

export const findNearbyActivities = asyncHandler(async (req, res) => {
  const { firebaseUid, searchType, lat, lng, radius, name } = req.body;

  // Validate Firebase UID
  if (!firebaseUid) {
    throw new ApiError(400, "Firebase UID is required");
  }

  // Find user by Firebase UID
  const user = await User.findOne({ firebaseUid }).select("_id");
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // Validate searchType
  if (!["userLocation", "placeLocation", "activityName"].includes(searchType)) {
    throw new ApiError(
      400,
      "Invalid search type. Must be 'userLocation', 'placeLocation', or 'activityName'"
    );
  }

  let activities = [];

  if (searchType === "activityName") {
    // Validate name for activityName search
    if (!name || !name.trim()) {
      throw new ApiError(
        400,
        "Activity name is required for name-based search"
      );
    }

    // Search by activity name (case-insensitive)
    activities = await Activity.find({
      title: { $regex: name.trim(), $options: "i" },
      creator: { $ne: user._id }, // Exclude activities created by the user
    })
      .populate("creator", "fullName")
      .select(
        "title description startDate time location maxParticipants participantsList visibility"
      );
  } else {
    // Validate coordinates and radius for location-based searches
    if (!lat || !lng || isNaN(lat) || isNaN(lng)) {
      throw new ApiError(
        400,
        "Valid latitude and longitude are required for location-based search"
      );
    }
    const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);
    if (
      latitude < -90 ||
      latitude > 90 ||
      longitude < -180 ||
      longitude > 180
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

    // Find nearby activities
    activities = await Activity.find({
      "location.coordinates": {
        $nearSphere: {
          $geometry: {
            type: "Point",
            coordinates: [longitude, latitude],
          },
          $maxDistance: maxDistance,
        },
      },
      creator: { $ne: user._id }, // Exclude activities created by the user
    })
      .populate("creator", "fullName")
      .select(
        "title description startDate time location maxParticipants participantsList visibility"
      );
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        activities,
        activities.length > 0
          ? "Activities found successfully"
          : "No activities found"
      )
    );
});

export const joinActivity = asyncHandler(async (req, res) => {
  const { firebaseUid, activityId } = req.body;

  // Validate inputs
  if (!firebaseUid) {
    throw new ApiError(400, "Firebase UID is required");
  }
  if (!activityId) {
    throw new ApiError(400, "Activity ID is required");
  }

  // Find user by Firebase UID
  const user = await User.findOne({ firebaseUid }).select(
    "_id activitiesJoined profileCompletion"
  );
  if (!user) {
    throw new ApiError(404, "User not found");
  }
   // Check if requesting user's profile is complete
  if (!Object.values(user.profileCompletion).every(field => field === true)) {
    throw new ApiError(400, "Please complete your profile before joining an activity");
  }

  // Find activity
  const activity = await Activity.findById(activityId).populate(
    "creator",
    "fullName"
  );
  if (!activity) {
    throw new ApiError(404, "Activity not found");
  }

  // Check if activity is public
  if (activity.visibility !== "Public") {
    throw new ApiError(
      403,
      "This activity is private and cannot be joined directly"
    );
  }

  // Check if activity is in the future
  if (new Date(activity.startDate) < new Date()) {
    throw new ApiError(400, "Cannot join a past activity");
  }

  // Check if user is already a participant
  if (activity.participantsList.some((p) => p.user.equals(user._id))) {
    throw new ApiError(400, "User is already a participant in this activity");
  }

  // Check if activity is full
  if (activity.participantsList.length >= activity.maxParticipants) {
    throw new ApiError(
      400,
      "Activity is full and cannot accept more participants"
    );
  }

  // Add user to activity
  activity.participantsList.push({
    user: user._id,
    joinedAt: new Date(),
  });
  await activity.save();

  // Update user's activitiesJoined
  user.activitiesJoined.push(activity._id);
  await user.save({ validateBeforeSave: false });

  // Re-fetch activity with populated fields to return updated data
  const updatedActivity = await Activity.findById(activityId)
    .populate("creator")
    .populate("participantsList.user");

  return res
    .status(200)
    .json(
      new ApiResponse(200, updatedActivity, "Successfully joined the activity")
    );
});

export const addUserToActivity = asyncHandler(async (req, res) => {
  const { creatorFirebaseUid, userFirebaseUid, activityId } = req.body;

  // Validate inputs
  if (!creatorFirebaseUid) {
    throw new ApiError(400, "Creator Firebase UID is required");
  }
  if (!userFirebaseUid) {
    throw new ApiError(400, "User Firebase UID is required");
  }
  if (!activityId) {
    throw new ApiError(400, "Activity ID is required");
  }

  // Find creator by Firebase UID
  const creator = await User.findOne({
    firebaseUid: creatorFirebaseUid,
  }).select("_id");
  if (!creator) {
    throw new ApiError(404, "Creator not found");
  }

  // Find user to add by Firebase UID
  const userToAdd = await User.findOne({ firebaseUid: userFirebaseUid }).select(
    "_id activitiesJoined"
  );
  if (!userToAdd) {
    throw new ApiError(404, "User to add not found");
  }

  // Prevent adding self
  if (creator._id.equals(userToAdd._id)) {
    throw new ApiError(400, "Creator cannot add themselves as a participant");
  }

  // Find activity
  const activity = await Activity.findById(activityId).populate(
    "creator",
    "fullName"
  );
  if (!activity) {
    throw new ApiError(404, "Activity not found");
  }

  // Verify creator
  if (!activity.creator._id.equals(creator._id)) {
    throw new ApiError(403, "Only the activity creator can add users");
  }

  // Check if activity is in the future
  if (new Date(activity.startDate) < new Date()) {
    throw new ApiError(400, "Cannot add users to a past activity");
  }

  // Check if user is already a participant
  if (activity.participantsList.some((p) => p.user.equals(userToAdd._id))) {
    throw new ApiError(400, "User is already a participant in this activity");
  }

  // Check if activity is full
  if (activity.participantsList.length >= activity.maxParticipants) {
    throw new ApiError(
      400,
      "Activity is full and cannot accept more participants"
    );
  }

  // Add user to activity
  activity.participantsList.push({
    user: userToAdd._id,
    joinedAt: new Date(),
  });
  await activity.save();

  // Update user's activitiesJoined
  userToAdd.activitiesJoined.push(activity._id);
  await userToAdd.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(
      new ApiResponse(200, activity, `User successfully added to the activity`)
    );
});

export const deleteActivity = asyncHandler(async (req, res) => {
  const { firebaseUid, activityId } = req.body;
  console.log("del", req.body);

  // Validate inputs
  if (!firebaseUid) {
    throw new ApiError(400, "Firebase UID is required");
  }
  if (!activityId) {
    throw new ApiError(400, "Activity ID is required");
  }

  // Find user by Firebase UID
  const user = await User.findOne({ firebaseUid }).select("_id");
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // Find activity
  const activity = await Activity.findById(activityId);
  if (!activity) {
    throw new ApiError(404, "Activity not found");
  }

  // Verify creator
  if (!activity.creator.equals(user._id)) {
    throw new ApiError(
      403,
      "Only the activity creator can delete this activity"
    );
  }

  // Start a transaction to ensure atomicity
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Remove activity from all participants' activitiesJoined
    const participantIds = activity.participantsList.map((p) => p.user);
    await User.updateMany(
      { _id: { $in: participantIds } },
      { $pull: { activitiesJoined: activity._id } },
      { session }
    );

    // Delete the activity
    await Activity.findByIdAndDelete(activityId, { session });

    // Commit the transaction
    await session.commitTransaction();

    return res
      .status(200)
      .json(new ApiResponse(200, null, "Activity deleted successfully"));
  } catch (error) {
    // Abort transaction on error
    await session.abortTransaction();
    throw new ApiError(500, "Failed to delete activity");
  } finally {
    session.endSession();
  }
});

export const leaveActivity = asyncHandler(async (req, res) => {
  const { activityId } = req.params;
  const { firebaseUid } = req.body;

  // Validate inputs
  if (!firebaseUid) {
    throw new ApiError(400, "Firebase UID is required");
  }
  if (!activityId) {
    throw new ApiError(400, "Activity ID is required");
  }

  // Find user by Firebase UID
  const user = await User.findOne({ firebaseUid }).select(
    "_id activitiesJoined"
  );
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // Find activity
  const activity = await Activity.findById(activityId).populate(
    "creator",
    "fullName"
  );
  if (!activity) {
    throw new ApiError(404, "Activity not found");
  }

  // Check if user is the creator
  if (activity.creator._id.equals(user._id)) {
    throw new ApiError(403, "Activity creator cannot leave their own activity");
  }

  // Check if user is a participant
  if (!activity.participantsList.some((p) => p.user.equals(user._id))) {
    throw new ApiError(400, "User is not a participant in this activity");
  }

  // Start a transaction to ensure atomicity
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Remove user from activity's participantsList
    activity.participantsList = activity.participantsList.filter(
      (p) => !p.user.equals(user._id)
    );
    await activity.save({ session });

    // Remove activity from user's activitiesJoined
    await User.updateOne(
      { _id: user._id },
      { $pull: { activitiesJoined: activity._id } },
      { session }
    );

    // Commit the transaction
    await session.commitTransaction();

    const updatedActivity = await Activity.findById(activityId)
      .populate("creator")
      .populate("participantsList.user");
    return res
      .status(200)
      .json(
        new ApiResponse(200, updatedActivity, "Successfully left the activity")
      );
  } catch (error) {
    // Abort transaction on error
    await session.abortTransaction();
    throw new ApiError(500, "Failed to leave activity");
  } finally {
    session.endSession();
  }
});

export const myActivities = asyncHandler(async (req, res) => {
  const { firebaseUid } = req.body;

  // Validate Firebase UID
  if (!firebaseUid) {
    throw new ApiError(400, "Firebase UID is required");
  }

  // Find user by Firebase UID
  const user = await User.findOne({ firebaseUid }).select("_id");
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // Fetch activities where the user is either the creator or a participant
  const activities = await Activity.find({
    $or: [
      { creator: user._id }, // Activities created by the user
      { "participantsList.user": user._id }, // Activities the user has joined
    ],
  })
    .populate("creator", "fullName")
    .select(
      "title description startDate time location maxParticipants participantsList visibility"
    );
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        activities,
        activities.length > 0
          ? "Activities fetched successfully"
          : "No activities found"
      )
    );
});

export const getSingleActivity = asyncHandler(async (req, res) => {
  const { activityId } = req.params;
  const { firebaseUid } = req.body;

  // Validate inputs
  if (!firebaseUid) {
    throw new ApiError(400, "Firebase UID is required");
  }
  if (!activityId) {
    throw new ApiError(400, "Activity ID is required");
  }

  // Find user by Firebase UID
  const user = await User.findOne({ firebaseUid }).select("_id");
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // Find activity by ID and populate all referenced fields
  const activity = await Activity.findById(activityId)
    .populate("creator") // Populate all fields of the creator
    .populate("participantsList.user"); // Populate all fields of users in participantsList
  if (!activity) {
    throw new ApiError(404, "Activity not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, activity, "Activity fetched successfully"));
});
