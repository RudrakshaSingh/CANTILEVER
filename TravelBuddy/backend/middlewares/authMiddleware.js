import admin from "firebase-admin";
import ApiError from "../utils/ApiError.js";

// Initialize Firebase Admin (do this once in your main app file)
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    }),
  });
}

// Simple auth middleware
const authMiddleware = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      throw new ApiError(401, "No token provided");
    }

    // Verify token
    const decodedToken = await admin.auth().verifyIdToken(token);
    const userRecord = await admin.auth().getUser(decodedToken.uid);

    // Check if email is verified
    
    if (!userRecord.emailVerified) {
      throw new ApiError(403, "Please verify your email first");
    }

    next();
  } catch {
    
    throw new ApiError(401, "Invalid token");
  }
};

export default authMiddleware;
