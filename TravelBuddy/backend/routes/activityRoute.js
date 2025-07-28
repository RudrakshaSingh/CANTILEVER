import { Router } from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import { createActivity } from "../controllers/activityController.js";
import upload from "../middlewares/multermiddleware.js";

const router = Router();

router.post("/create",upload.none(), authMiddleware, createActivity);


export default router;
