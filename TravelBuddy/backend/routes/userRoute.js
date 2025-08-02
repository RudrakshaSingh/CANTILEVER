import { Router } from "express";
import {
  registerUser,
  getUserByFirebaseUid,
  getProfile,
  updateUser, 
  deleteUser,
  logoutUser,
  updateUserLocation,
  findNearbyPeople
} from "../controllers/userController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import upload from "../middlewares/multermiddleware.js";

const router = Router();

router.post("/register", registerUser);
router.post("/profile", getUserByFirebaseUid);
router.post("/refresh-profile", authMiddleware, getProfile);
router.put(
  "/update",
  authMiddleware,
  upload.single("profilePicture"),
  updateUser
);
router.post("/delete", deleteUser);
router.post("/logout", authMiddleware,logoutUser);
router.post("/update-location", authMiddleware, updateUserLocation);
router.post("/find-nearby", authMiddleware, findNearbyPeople);


export default router;
