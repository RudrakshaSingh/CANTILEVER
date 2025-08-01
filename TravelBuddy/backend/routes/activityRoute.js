import { Router } from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import {
  createActivity,
  updateActivity,
  findNearbyActivities,
  joinActivity,
  addUserToActivity,
  deleteActivity,
  leaveActivity,
  myActivities,
  getSingleActivity,
} from "../controllers/activityController.js";
import upload from "../middlewares/multermiddleware.js";

const router = Router();

// Create an activity (FormData)
router.post("/create", upload.none(), authMiddleware, createActivity);

// Update an activity (FormData)
router.put("/update/:activityId", upload.none(), authMiddleware, updateActivity);

// Find nearby activities (JSON)
router.post("/nearby", authMiddleware, findNearbyActivities);

// Join an activity (JSON)
router.post("/join", authMiddleware, joinActivity);

// Add a user to an activity (JSON)
router.post("/add-user", authMiddleware, addUserToActivity);

// Delete an activity (JSON)
router.post("/delete", authMiddleware, deleteActivity);

// Leave an activity (JSON)
router.post("/leave/:activityId", authMiddleware, leaveActivity);

// Get activities user has joined or created (JSON)
router.post("/my-activities", authMiddleware, myActivities);

// Route to get a single activity by ID
router.post("/single-activity/:activityId", getSingleActivity);

export default router;