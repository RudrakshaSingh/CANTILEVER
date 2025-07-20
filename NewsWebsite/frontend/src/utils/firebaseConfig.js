// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  onAuthStateChanged,
  sendEmailVerification,
  applyActionCode,
  checkActionCode,
  reload
} from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth
const auth = getAuth(app);

// Initialize Google Provider
const googleProvider = new GoogleAuthProvider();

// Register with email and password
export const registerWithEmailPass = async (email, password, displayName = null) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Update profile with display name if provided
    if (displayName) {
      await updateProfile(user, { displayName });
    }
    
    // Send email verification
    await sendEmailVerification(user);
    
    return { 
      user, 
      error: null, 
      message: "Registration successful! Please check your email to verify your account." 
    };
  } catch (error) {
    return { user: null, error };
  }
};

// Login with email and password
export const loginWithEmailPass = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Check if email is verified
    if (!user.emailVerified) {
      return { 
        user: null, 
        error: new Error("Please verify your email before logging in."),
        needsVerification: true
      };
    }
    
    return { user, error: null };
  } catch (error) {
    return { user: null, error };
  }
};

// Send email verification to current user
export const sendVerificationEmail = async () => {
  try {
    const user = auth.currentUser;
    if (user) {
      await sendEmailVerification(user);
      return { 
        error: null, 
        message: "Verification email sent! Please check your inbox." 
      };
    }
    return { error: new Error("No authenticated user") };
  } catch (error) {
    return { error };
  }
};

// Verify email with action code (from email link)
export const verifyEmail = async (actionCode) => {
  try {
    await applyActionCode(auth, actionCode);
    
    // Reload user to get updated emailVerified status
    if (auth.currentUser) {
      await reload(auth.currentUser);
    }
    
    return { 
      error: null, 
      message: "Email verified successfully!" 
    };
  } catch (error) {
    return { error };
  }
};

// Check action code validity (optional - to get info about the code)
export const checkVerificationCode = async (actionCode) => {
  try {
    const info = await checkActionCode(auth, actionCode);
    return { info, error: null };
  } catch (error) {
    return { info: null, error };
  }
};

// Check if current user's email is verified
export const isEmailVerified = () => {
  const user = auth.currentUser;
  return user ? user.emailVerified : false;
};

// Refresh user data (useful after email verification)
export const refreshUser = async () => {
  try {
    if (auth.currentUser) {
      await reload(auth.currentUser);
      return { user: auth.currentUser, error: null };
    }
    return { user: null, error: new Error("No authenticated user") };
  } catch (error) {
    return { user: null, error };
  }
};

// Google login (already verified by Google)
export const googleLogin = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return { user: result.user, error: null };
  } catch (error) {
    return { user: null, error };
  }
};

// Logout
export const logout = async () => {
  try {
    await signOut(auth);
    return { error: null };
  } catch (error) {
    return { error };
  }
};

// Auth state change listener
export const onAuthStateChange = (callback) => {
  return onAuthStateChanged(auth, callback);
};

// Get current user
export const getUser = () => {
  return auth.currentUser;
};

// Update user profile
export const updateUserProfile = async (updates) => {
  try {
    if (auth.currentUser) {
      await updateProfile(auth.currentUser, updates);
      return { error: null };
    }
    return { error: new Error("No authenticated user") };
  } catch (error) {
    return { error };
  }
};

// Export auth instance for additional use
export { auth };