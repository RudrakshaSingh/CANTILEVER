import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-hot-toast";
import {
  registerWithEmailPass,
  loginWithEmailPass,
  googleLogin,
  sendVerificationEmail,
  verifyEmail,
  sendPasswordResetEmailToUser,
  checkPasswordResetCode,
  confirmPasswordResetWithCode,
  logout,
  refreshUser,
  updateUserProfile,
} from "../../Helpers/firebaseConfig";
import axiosInstance from "../../Helpers/axiosInstance";

const initialState = {
  user: null,
  loading: false,
  error: null,
  accessToken: null,
};

// Async Thunks for Firebase Auth Operations

// Register with Email and Password
export const registerUser = createAsyncThunk(
  "user/registerUser",
  async ({ email, password, fullName }, { rejectWithValue }) => {
    try {
      const { user, error, message } = await registerWithEmailPass(
        email,
        password,
        fullName
      );

      if (error) {
        let errorMessage = "Account creation failed. Please try again.";
        if (error.code === "auth/email-already-in-use") {
          errorMessage =
            "This email is already registered. Please use a different email.";
        } else if (error.code === "auth/weak-password") {
          errorMessage =
            "Password is too weak. Please choose a stronger password.";
        } else if (error.code === "auth/invalid-email") {
          errorMessage = "Invalid email address format.";
        }

        toast.error(errorMessage);
        return rejectWithValue({ message: errorMessage, code: error.code });
      }

      toast.success(
        message || "Registration successful! Please verify your email.",
        {
          duration: 4000,
        }
      );

      return { user, message };
    } catch {
      const errorMessage = "An unexpected error occurred. Please try again.";
      toast.error(errorMessage);
      return rejectWithValue({ message: errorMessage });
    }
  }
);

// Login with Email and Password
export const loginUser = createAsyncThunk(
  "user/loginUser",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const { user, error, needsVerification } = await loginWithEmailPass(
        email,
        password
      );

      if (error) {
        let errorMessage = "Login failed. Please check your credentials.";

        if (needsVerification) {
          errorMessage = "Please verify your email before logging in.";
          toast.error(errorMessage);
          return rejectWithValue({ message: errorMessage });
        }

        if (error.code === "auth/user-not-found") {
          errorMessage = "No account found with this email address.";
        } else if (error.code === "auth/wrong-password") {
          errorMessage = "Incorrect password. Please try again.";
        } else if (error.code === "auth/invalid-email") {
          errorMessage = "Invalid email address format.";
        } else if (error.code === "auth/user-disabled") {
          errorMessage = "This account has been disabled.";
        }

        toast.error(errorMessage);
        return rejectWithValue({ message: errorMessage, code: error.code });
      }

      // Get Firebase access token
      const accessToken = await user.getIdToken();

      // Send user data to backend after successful Firebase login
      let backendData = null;
      try {
        const backendResponse = await axiosInstance.post("/users/profile", {
          fullName: user.displayName || user.email?.split("@")[0] || "User",
          email: user.email,
          firebaseUid: user.uid,
        });

        backendData = backendResponse.data.data; // Extract the data from the response
      } catch (error) {
        toast.error(
          error.response.data.message ||
            "Failed to sync with backend. Please try again later."
        );
        return rejectWithValue({
          message:
            error.response.data.message || "Failed to sync with backend.",
        });
      }

      toast.success(
        `Welcome back, ${backendData?.fullName || user.displayName || "User"}!`,
        {
          duration: 3000,
        }
      );
      console.log("User logged in:", user);

      return {
        accessToken,
        backendData,
      };
    } catch {
      const errorMessage = "An unexpected error occurred. Please try again.";
      toast.error(errorMessage);
      return rejectWithValue({ message: errorMessage });
    }
  }
);

// Google Login
export const googleSignIn = createAsyncThunk(
  "user/googleSignIn",
  async (_, { rejectWithValue }) => {
    try {
      const { user, error } = await googleLogin();

      if (error) {
        let errorMessage = "Google sign-in failed. Please try again.";
        if (error.code === "auth/popup-closed-by-user") {
          errorMessage = "Sign-in was cancelled. Please try again.";
        } else if (error.code === "auth/popup-blocked") {
          errorMessage =
            "Popup was blocked. Please allow popups and try again.";
        }

        toast.error(errorMessage);
        return rejectWithValue({ message: errorMessage, code: error.code });
      }

      // Get Firebase access token
      const accessToken = await user.getIdToken();

      // Send user data to backend after successful Google login
      let backendData = null;
      try {
        const backendResponse = await axiosInstance.post("/users/profile", {
          fullName: user.displayName || user.email?.split("@")[0] || "User",
          email: user.email,
          firebaseUid: user.uid,
        });

        console.log("Backend Google login response:", backendResponse.data);
        backendData = backendResponse.data.data; // Extract the data from the response
      } catch (error) {
        toast.error(
          error.response.data.message ||
            "Failed to sync with backend. Please try again later."
        );
        return rejectWithValue({
          message:
            error.response.data.message || "Failed to sync with backend.",
        });
      }

      toast.success(
        `Welcome back, ${backendData?.fullName || user.displayName || "User"}!`,
        {
          duration: 3000,
        }
      );

      console.log("User logged in with Google:", user);

      return {
        accessToken,
        backendData,
      };
    } catch {
      const errorMessage = "An unexpected error occurred. Please try again.";
      toast.error(errorMessage);
      return rejectWithValue({ message: errorMessage });
    }
  }
);

// Send Verification Email
export const sendVerificationEmailThunk = createAsyncThunk(
  "user/sendVerificationEmail",
  async (_, { rejectWithValue }) => {
    try {
      const { error, message } = await sendVerificationEmail();

      if (error) {
        const errorMessage =
          "Failed to resend verification email. Please try again.";
        toast.error(errorMessage);
        return rejectWithValue({ message: errorMessage });
      }

      toast.success(message || "Verification email resent successfully!", {
        duration: 4000,
      });

      return { message };
    } catch {
      const errorMessage = "An unexpected error occurred. Please try again.";
      toast.error(errorMessage);
      return rejectWithValue({ message: errorMessage });
    }
  }
);

// Verify Email with Action Code
export const verifyEmailThunk = createAsyncThunk(
  "user/verifyEmail",
  async ({ actionCode }, { rejectWithValue }) => {
    try {
      const { error, message } = await verifyEmail(actionCode);

      if (error) {
        let errorMessage = "Email verification failed. Please try again.";
        if (error.code === "auth/invalid-action-code") {
          errorMessage = "Invalid or expired verification link.";
        } else if (error.code === "auth/expired-action-code") {
          errorMessage =
            "Verification link has expired. Please request a new one.";
        }

        toast.error(errorMessage);
        return rejectWithValue({ message: errorMessage, code: error.code });
      }

      toast.success(message || "Email verified successfully!", {
        duration: 4000,
      });

      return { message };
    } catch {
      const errorMessage = "An unexpected error occurred during verification.";
      toast.error(errorMessage);
      return rejectWithValue({ message: errorMessage });
    }
  }
);

// Send Password Reset Email
export const sendPasswordResetEmail = createAsyncThunk(
  "user/sendPasswordResetEmail",
  async ({ email }, { rejectWithValue }) => {
    try {
      const { error, message } = await sendPasswordResetEmailToUser(email);

      if (error) {
        let errorMessage =
          "Failed to send password reset email. Please try again.";
        if (error.code === "auth/user-not-found") {
          errorMessage = "No account found with this email address.";
        } else if (error.code === "auth/invalid-email") {
          errorMessage = "Invalid email address format.";
        }

        toast.error(errorMessage);
        return rejectWithValue({ message: errorMessage, code: error.code });
      }

      toast.success(
        message || "Password reset email sent! Please check your inbox.",
        {
          duration: 4000,
        }
      );

      return { message };
    } catch {
      const errorMessage = "An unexpected error occurred. Please try again.";
      toast.error(errorMessage);
      return rejectWithValue({ message: errorMessage });
    }
  }
);

// Verify Password Reset Code
export const verifyPasswordResetCode = createAsyncThunk(
  "user/verifyPasswordResetCode",
  async ({ actionCode }, { rejectWithValue }) => {
    try {
      const { email, error, message } = await checkPasswordResetCode(
        actionCode
      );

      if (error) {
        let errorMessage = "Invalid or expired reset link.";
        if (error.code === "auth/invalid-action-code") {
          errorMessage = "Invalid password reset link.";
        } else if (error.code === "auth/expired-action-code") {
          errorMessage = "Password reset link has expired.";
        }

        toast.error(errorMessage);
        return rejectWithValue({ message: errorMessage, code: error.code });
      }

      return { email, message };
    } catch {
      const errorMessage = "An unexpected error occurred. Please try again.";
      toast.error(errorMessage);
      return rejectWithValue({ message: errorMessage });
    }
  }
);

// Reset Password with New Password
export const resetPassword = createAsyncThunk(
  "user/resetPassword",
  async ({ actionCode, newPassword }, { rejectWithValue }) => {
    try {
      const { error, message } = await confirmPasswordResetWithCode(
        actionCode,
        newPassword
      );

      if (error) {
        let errorMessage = "Failed to reset password. Please try again.";
        if (error.code === "auth/weak-password") {
          errorMessage =
            "Password is too weak. Please choose a stronger password.";
        } else if (error.code === "auth/invalid-action-code") {
          errorMessage = "Invalid or expired reset link.";
        }

        toast.error(errorMessage);
        return rejectWithValue({ message: errorMessage, code: error.code });
      }

      toast.success(
        message || "Password reset successfully! You can now login.",
        {
          duration: 4000,
        }
      );

      return { message };
    } catch {
      const errorMessage = "An unexpected error occurred. Please try again.";
      toast.error(errorMessage);
      return rejectWithValue({ message: errorMessage });
    }
  }
);

// Logout User
export const logoutUser = createAsyncThunk(
  "user/logoutUser",
  async (_, { rejectWithValue }) => {
    try {
      const { error } = await logout();

      if (error) {
        const errorMessage = "Failed to logout. Please try again.";
        toast.error(errorMessage);
        return rejectWithValue({ message: errorMessage });
      }

      toast.success("Logged out successfully!", {
        duration: 2000,
      });

      return {};
    } catch {
      const errorMessage = "An unexpected error occurred during logout.";
      toast.error(errorMessage);
      return rejectWithValue({ message: errorMessage });
    }
  }
);

// Helper function to handle authentication redirects
const redirectToLogin = () => {
  window.location.href = "/user/login";
};

// Refresh User Data - Modified version with auth error handling and refreshUser fallback
export const refreshUserData = createAsyncThunk(
  "user/refreshUserData",
  async (_, { rejectWithValue, dispatch, getState }) => {
    try {
      const { user: currentUser, accessToken } = getState().user;

      // Call backend API with access token in header and firebaseUid in body
      const backendResponse = await axiosInstance.post(
        "/users/refresh-profile",
        {
          firebaseUid: currentUser?.firebaseUid,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      console.log("Backend profile refresh response:", backendResponse.data);

      const backendData = backendResponse.data.data;
      toast.success("User data refreshed successfully!", {
        duration: 3000,
      });
      return {
        user: backendData,
      };
    } catch (error) {
      const errorMessage = error.response?.data?.message;

      // Check for specific authentication errors - ONLY these 2 messages
      if (
        errorMessage === "Invalid token" ||
        errorMessage === "No token provided"
      ) {
        // First, try to refresh the Firebase user
        try {
          const { user: refreshedUser, error: refreshError } =
            await refreshUser();

          if (!refreshError && refreshedUser) {
            // Get new Firebase access token
            const newAccessToken = await refreshedUser.getIdToken();

            // Show toast to try again (don't retry automatically)
            toast.error("Session token refreshed. Please try again.");

            return rejectWithValue({
              message: "Session token refreshed. Please try again.",
              accessToken: newAccessToken,
            });
          } else {
            // refreshUser failed, show error and redirect
            toast.error("Session expired. Please login again.");

            // Clear Redux user state immediately
            dispatch(clearUser());

            // Redirect to login page after a short delay
            setTimeout(() => {
              redirectToLogin();
            }, 1000);

            return rejectWithValue({
              message: "Session expired. Please login again.",
              isAuthError: true,
            });
          }
        } catch {
          // Exception during refreshUser, show error and redirect
          toast.error("Session expired. Please login again.");

          // Clear Redux user state immediately
          dispatch(clearUser());

          // Redirect to login page after a short delay
          setTimeout(() => {
            redirectToLogin();
          }, 1000);

          return rejectWithValue({
            message: "Session expired. Please login again.",
            isAuthError: true,
          });
        }
      }

      // Handle other errors normally
      toast.error(
        errorMessage || "Failed to sync with backend. Please try again later."
      );
      return rejectWithValue({
        message: errorMessage || "An unexpected error occurred",
      });
    }
  }
);

// Update User Profile
export const updateProfile = createAsyncThunk(
  "user/updateProfile",
  async ({ updates }, { rejectWithValue }) => {
    try {
      const { error } = await updateUserProfile(updates);

      if (error) {
        const errorMessage = "Failed to update profile. Please try again.";
        toast.error(errorMessage);
        return rejectWithValue({ message: errorMessage });
      }

      // Call backend API to update profile
      try {
        const backendResponse = await axiosInstance.put(
          "/users/profile",
          updates
        );
        const backendData = backendResponse.data.data;

        toast.success("Profile updated successfully!", {
          duration: 3000,
        });

        return { user: backendData };
      } catch (error) {
        toast.error(
          error.response.data.message ||
            "Failed to sync profile update with backend. Please try again later."
        );
        return rejectWithValue({
          message:
            error.response.data.message ||
            "Failed to sync profile update with backend.",
        });
      }
    } catch {
      const errorMessage = "An unexpected error occurred. Please try again.";
      toast.error(errorMessage);
      return rejectWithValue({ message: errorMessage });
    }
  }
);

// User Slice
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    // Synchronous actions
    setUser: (state, action) => {
      state.user = action.payload;
      state.loading = false;
      state.error = null;
    },
    clearUser: (state) => {
      state.user = null;
      state.accessToken = null;
      state.loading = false;
      state.error = null;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Register User
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })

      // Login User
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.accessToken = action.payload.accessToken;

        // Store only backend data as user
        if (action.payload.backendData) {
          state.user = { ...action.payload.backendData };
        }

        console.log("User logged in:", state.user);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })

      // Google Sign In
      .addCase(googleSignIn.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(googleSignIn.fulfilled, (state, action) => {
        state.loading = false;
        state.accessToken = action.payload.accessToken;

        // Store only backend data as user (same pattern as loginUser)
        if (action.payload.backendData) {
          state.user = { ...action.payload.backendData };
        }

        console.log("User logged in with Google:", state.user);
      })
      .addCase(googleSignIn.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })

      // Send Verification Email
      .addCase(sendVerificationEmailThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(sendVerificationEmailThunk.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(sendVerificationEmailThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })

      // Verify Email
      .addCase(verifyEmailThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(verifyEmailThunk.fulfilled, (state) => {
        state.loading = false;
        // Update user's emailVerified status if user is logged in
        if (state.user) {
          state.user.emailVerified = true;
        }
      })
      .addCase(verifyEmailThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })

      // Send Password Reset Email
      .addCase(sendPasswordResetEmail.pending, (state) => {
        state.loading = true;
      })
      .addCase(sendPasswordResetEmail.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(sendPasswordResetEmail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })

      // Verify Password Reset Code
      .addCase(verifyPasswordResetCode.pending, (state) => {
        state.loading = true;
      })
      .addCase(verifyPasswordResetCode.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(verifyPasswordResetCode.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })

      // Reset Password
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })

      // Logout User
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.accessToken = null;
        state.loading = false;
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })

      // Refresh User Data
      .addCase(refreshUserData.pending, (state) => {
        state.loading = true;
      })
      .addCase(refreshUserData.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.user) {
          state.user = action.payload.user;
        }
        if (action.payload.accessToken) {
          state.accessToken = action.payload.accessToken;
        }
      })
      .addCase(refreshUserData.rejected, (state, action) => {
        state.loading = false;

        // Only clear Redux state if isAuthError is true (only for "Invalid token" or "No token provided")
        if (action.payload?.isAuthError === true) {
          // Clear Redux state only - no localStorage
          state.user = null;
          state.accessToken = null;
          state.error = null; // Clear error since we're redirecting
        } else {
          // For all other errors, just set the error message
          state.error = action.payload?.message || "An error occurred";
        }
      })

      // Update Profile
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.user) {
          state.user = action.payload.user;
        }
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      });
  },
});

// Export actions
export const { setUser, clearUser, setLoading, setError, clearError } =
  userSlice.actions;

// Export reducer
export default userSlice.reducer;
