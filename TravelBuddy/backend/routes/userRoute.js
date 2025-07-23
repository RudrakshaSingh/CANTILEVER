import { Router } from "express";
import { registerUser, getUserByFirebaseUid, getProfile } from "../controllers/userController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = Router();

router.post('/register', registerUser);
router.post('/profile', getUserByFirebaseUid);
router.post('/refresh-profile', authMiddleware, getProfile);


export default router;