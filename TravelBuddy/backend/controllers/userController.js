import asyncHandler from "../utils/AsyncHandler.js";
import User from "../models/userModel.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";

export const registerUser = asyncHandler(async (req, res) => {
  try {
    const { fullName, email, firebaseUid } = req.body;
    console.log("ddd");

    if (!fullName || !email || !firebaseUid) {
      throw new ApiError(400, "All fields are required");
    }
    console.log("Registering user:", { fullName, email, firebaseUid });
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
  } catch (error) {
    throw new ApiError(
      error.statusCode || 500,
      error.message || "Internal Server Error in registerUser"
    );
  }
});

export const getUserByFirebaseUid = asyncHandler(async (req, res) => {
  try {
    const { firebaseUid } = req.body;

    if (!firebaseUid) {
      throw new ApiError(400, "Firebase UID is required");
    }

    const user = await User.findOne({ firebaseUid });
    if (!user) {
      const newUser = await registerUser(req, res);
      res
        .status(200)
        .json(new ApiResponse(200, user, "User found successfully"));
      return;
    }

    res.status(200).json(new ApiResponse(200, user, "User found successfully"));
  } catch (error) {
    throw new ApiError(
      error.statusCode || 500,
      error.message || "Internal Server Error in getUserByFirebaseUid"
    );
  }
});
