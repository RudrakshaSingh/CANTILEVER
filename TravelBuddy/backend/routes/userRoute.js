import { Router } from "express";
import { registerUser, getUserByFirebaseUid } from "../controllers/userController.js";

const router = Router();

router.post('/register', registerUser);
router.post('/profile', getUserByFirebaseUid);

export default router;