import { Router } from "express";
import {
  registerUser,
  getUserByFirebaseUid,
  getProfile,
  updateUser, 
  deleteUser
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

export default router;
