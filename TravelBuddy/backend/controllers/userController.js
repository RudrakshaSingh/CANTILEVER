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
