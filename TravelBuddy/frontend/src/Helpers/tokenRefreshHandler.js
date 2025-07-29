// utils/tokenRefreshHandler.js
import { toast } from "react-hot-toast";
import { refreshUser } from "../Helpers/firebaseConfig";

/**
 * Global utility to handle token refresh when receiving auth errors from backend
 * @param {Function} dispatch - Redux dispatch function
 * @param {Function} clearUser - Action to clear user from Redux
 * @param {Function} setAccessToken - Action to set new access token
 * @returns {Object} - Returns { success: boolean, newToken?: string, firebaseUid?: string }
 */
export const handleTokenRefresh = async (dispatch, clearUser, setAccessToken) => {
  try {
    const {
      user: refreshedUser,
      accessToken: newAccessToken,
      error: refreshError,
    } = await refreshUser();

    if (!refreshError && refreshedUser && newAccessToken) {
      // Update the access token in Redux
      dispatch(setAccessToken(newAccessToken));
      
      return {
        success: true,
        newToken: newAccessToken,
        firebaseUid: refreshedUser.uid,
      };
    } else {
      // Token refresh failed
      toast.error("Session expired. Please login again.");
      dispatch(clearUser());
      setTimeout(() => {
        window.location.href = "/user/login";
      }, 1000);

      return {
        success: false,
        message: "Token refresh failed",
      };
    }
  } catch (refreshErr) {
    console.error("Token refresh error:", refreshErr);
    toast.error("Session expired. Please login again.");
    dispatch(clearUser());
    setTimeout(() => {
      window.location.href = "/user/login";
    }, 1000);

    return {
      success: false,
      message: "Token refresh exception",
    };
  }
};

/**
 * Check if error message indicates token authentication issues
 * @param {string} errorMessage - Error message from backend
 * @returns {boolean} - True if it's a token auth error
 */
export const isTokenAuthError = (errorMessage) => {
  return errorMessage === "Invalid token" || errorMessage === "No token provided";
};

/**
 * Helper function to handle authentication redirects
 */
export const redirectToLogin = () => {
  window.location.href = "/user/login";
};