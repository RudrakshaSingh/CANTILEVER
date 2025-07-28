import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-hot-toast";
import {
  registerWithEmailPass,
  loginWithEmailPass,
  googleLogin,
  sendVerificationEmail,
  sendPasswordResetEmailToUser,
  logout,
  refreshUser,
  updateUserProfile,
  deleteAccountWithReauth,
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

// Logout User - Updated version with backend API call and token handling
export const logoutUser = createAsyncThunk(
  "user/logoutUser",
  async (_, { rejectWithValue, getState, dispatch }) => {
    try {
      const { user: currentUser, accessToken } = getState().user;

      // Call backend logout API first if we have user data and token
      if (currentUser?.firebaseUid && accessToken) {
        try {
          await axiosInstance.post(
            "/users/logout",
            {
              firebaseUid: currentUser.firebaseUid,
            },
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );
        } catch (error) {
          const errorMessage = error.response?.data?.message;

          // Check for token errors
          if (
            errorMessage === "Invalid token" ||
            errorMessage === "No token provided"
          ) {
            // Try to refresh the token
            try {
              const {
                user: refreshedUser,
                accessToken: newAccessToken,
                error: refreshError,
              } = await refreshUser();

              if (!refreshError && refreshedUser && newAccessToken) {
                // Update token in Redux
                dispatch(setAccessToken(newAccessToken));

                // Show toast and return - no retry logic as requested
                toast.error("Session expired. Please try logout again.");
                return rejectWithValue({
                  message: "Session expired. Please try logout again.",
                });
              } else {
                // Token refresh failed, proceed with Firebase logout
                toast.error("Session expired. Please try logout again.");
                return rejectWithValue({
                  message: "Session expired. Please try logout again.",
                });
              }
            } catch {
              // Token refresh exception, proceed with Firebase logout
              toast.error("Session expired. Please try logout again.");
              return rejectWithValue({
                message: "Session expired. Please try logout again.",
              });
            }
          } else {
            // Other backend errors - continue with Firebase logout
            console.error("Backend logout error:", error);
          }
        }
      }

      // Proceed with Firebase logout
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
    } catch (err) {
      console.error("Unexpected logout error:", err);
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
          const {
            user: refreshedUser,
            accessToken: newAccessToken,
            error: refreshError,
          } = await refreshUser();

          if (!refreshError && refreshedUser && newAccessToken) {
            // Update the access token immediately in Redux state
            dispatch(setAccessToken(newAccessToken));

            // Now retry the backend call with the new token
            try {
              const retryResponse = await axiosInstance.post(
                "/users/refresh-profile",
                {
                  firebaseUid: refreshedUser.uid,
                },
                {
                  headers: {
                    Authorization: `Bearer ${newAccessToken}`,
                  },
                }
              );

              const backendData = retryResponse.data.data;
              toast.success("User data refreshed successfully!", {
                duration: 3000,
              });

              return {
                user: backendData,
                accessToken: newAccessToken,
              };
            } catch {
              // If retry also fails, handle as auth error
              toast.error("Session expired. Please login again.");
              dispatch(clearUser());
              setTimeout(() => {
                redirectToLogin();
              }, 1000);

              return rejectWithValue({
                message: "Session expired. Please login again.",
                isAuthError: true,
              });
            }
          } else {
            // refreshUser failed, show error and redirect
            toast.error("Session expired. Please login again.");
            dispatch(clearUser());
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
          dispatch(clearUser());
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

// Delete User Account
export const deleteUserAccount = createAsyncThunk(
  "user/deleteUserAccount",
  async (_, { rejectWithValue, getState }) => {
    try {
      const { user: currentUser, accessToken } = getState().user;

      if (!currentUser || !accessToken) {
        const errorMessage = "No authenticated user found.";
        toast.error(errorMessage);
        return rejectWithValue({ message: errorMessage });
      }

      // First, delete Firebase account
      const { error, message, requiresReauth } =
        await deleteAccountWithReauth();

      if (error) {
        if (requiresReauth) {
          toast.error(
            "For security reasons, please log in again before deleting your account."
          );
          return rejectWithValue({
            message: "Recent authentication required",
            requiresReauth: true,
          });
        }

        let errorMessage = "Failed to delete account. Please try again.";
        if (error.code === "auth/user-not-found") {
          errorMessage = "User account not found.";
        } else if (error.code === "auth/operation-not-allowed") {
          errorMessage = "Account deletion is not allowed.";
        }

        toast.error(errorMessage);
        return rejectWithValue({ message: errorMessage, code: error.code });
      }

      // After successful Firebase deletion, call backend to clean up user data
      try {
        await axiosInstance.post(
          "/users/delete",
          {
            firebaseUid: currentUser.firebaseUid,
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
      } catch (error) {
        toast.error(error);
      }

      toast.success(message || "Account deleted successfully!", {
        duration: 4000,
      });

      // Redirect to register page after successful deletion
      // setTimeout(() => {
      //   window.location.href = "/user/register";
      // }, 2000);

      return { message };
    } catch {
      const errorMessage = "An unexpected error occurred. Please try again.";
      toast.error(errorMessage);
      return rejectWithValue({ message: errorMessage });
    }
  }
);

// Update User Profile
export const updateProfile = createAsyncThunk(
  "user/updateProfile",
  async ({ updates }, { rejectWithValue, getState, dispatch }) => {
    try {
      const { user: currentUser, accessToken } = getState().user;

      if (!currentUser || !accessToken) {
        const errorMessage = "No authenticated user found.";
        toast.error(errorMessage);
        return rejectWithValue({ message: errorMessage, isAuthError: true });
      }

      // Update Firebase profile first (for displayName)
      if (updates.fullName && updates.fullName !== currentUser.fullName) {
        try {
          const { error: firebaseError } = await updateUserProfile({
            displayName: updates.fullName,
          });

          if (firebaseError) {
            let errorMessage =
              "Failed to update Firebase profile. Please try again.";

            if (firebaseError.code === "auth/requires-recent-login") {
              errorMessage =
                "For security reasons, please log in again to update your profile.";
            } else if (firebaseError.code === "auth/user-not-found") {
              errorMessage = "User account not found. Please log in again.";
            }

            toast.error(errorMessage);
            return rejectWithValue({
              message: errorMessage,
              code: firebaseError.code,
              isAuthError: firebaseError.code === "auth/user-not-found",
            });
          }
        } catch (firebaseErr) {
          console.error("Firebase update error:", firebaseErr);
          const errorMessage =
            "Failed to update Firebase profile. Please try again.";
          toast.error(errorMessage);
          return rejectWithValue({ message: errorMessage });
        }
      }

      // Prepare FormData for backend API call
      const formData = new FormData();

      // Add firebaseUid first
      formData.append("firebaseUid", currentUser.firebaseUid);

      // Add all fields to FormData
      Object.keys(updates).forEach((key) => {
        const value = updates[key];

        if (key === "profilePicture") {
          // Handle file upload
          if (value instanceof File) {
            formData.append("profilePicture", value);
          }
        } else if (key === "languages") {
          // Handle languages array
          if (Array.isArray(value)) {
            formData.append("languages", JSON.stringify(value));
          }
        } else if (key === "futureDestinations") {
          // Handle future destinations array
          if (Array.isArray(value)) {
            formData.append("futureDestinations", JSON.stringify(value));
          }
        } else if (key === "socialLinks") {
          // Handle social links object
          if (typeof value === "object" && value !== null) {
            formData.append("socialLinks", JSON.stringify(value));
          }
        } else if (key === "dateOfBirth") {
          // Handle date fields
          if (value) {
            formData.append("dateOfBirth", value);
          }
        } else if (value !== null && value !== undefined && value !== "") {
          // Handle all other string/primitive fields
          formData.append(key, String(value));
        }
      });

      // Call backend API to update profile
      try {
        const backendResponse = await axiosInstance.put(
          "/users/update",
          formData,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );

        const backendData = backendResponse.data.data;

        toast.success("Profile updated successfully!", {
          duration: 3000,
        });

        return { user: backendData };
      } catch (error) {
        console.error("Backend update error:", error);

        const errorMessage = error.response?.data?.message;
        const errorStatus = error.response?.status;

        // Handle authentication errors
        if (
          errorStatus === 401 ||
          errorMessage === "Invalid token" ||
          errorMessage === "No token provided"
        ) {
          // Try to refresh the token
          try {
            const {
              user: refreshedUser,
              accessToken: newAccessToken,
              error: refreshError,
            } = await refreshUser();

            if (!refreshError && refreshedUser && newAccessToken) {
              // Update the access token in Redux
              dispatch(setAccessToken(newAccessToken));

              // Show toast and return - no retry logic
              toast.error(
                "Session expired. Please try updating your profile again."
              );
              return rejectWithValue({
                message:
                  "Session expired. Please try updating your profile again.",
              });
            } else {
              // Token refresh failed
              toast.error("Session expired. Please login again.");
              dispatch(clearUser());
              setTimeout(() => {
                window.location.href = "/user/login";
              }, 1000);

              return rejectWithValue({
                message: "Session expired. Please login again.",
                isAuthError: true,
              });
            }
          } catch (refreshErr) {
            console.error("Token refresh error:", refreshErr);
            toast.error("Session expired. Please login again.");
            dispatch(clearUser());
            setTimeout(() => {
              window.location.href = "/user/login";
            }, 1000);

            return rejectWithValue({
              message: "Session expired. Please login again.",
              isAuthError: true,
            });
          }
        } else {
          // Handle other HTTP errors
          let userFriendlyMessage =
            "Failed to update profile. Please try again.";

          toast.error(userFriendlyMessage);
          return rejectWithValue({
            message: userFriendlyMessage,
            originalError: errorMessage,
            status: errorStatus,
          });
        }
      }
    } catch (error) {
      console.error("Unexpected update profile error:", error);

      let errorMessage = "An unexpected error occurred. Please try again.";

      if (error.name === "NetworkError" || error.message.includes("network")) {
        errorMessage =
          "Network error. Please check your connection and try again.";
      } else if (error.message.includes("timeout")) {
        errorMessage = "Request timeout. Please try again.";
      }

      toast.error(errorMessage);
      return rejectWithValue({ message: errorMessage });
    }
  }
);
// Refresh Firebase Token - Simple function to refresh and set new token
export const refreshFirebaseToken = createAsyncThunk(
  "user/refreshFirebaseToken",
  async (_, { rejectWithValue, dispatch }) => {
    try {
      const {
        user: refreshedUser,
        accessToken: newAccessToken,
        error: refreshError,
      } = await refreshUser();

      if (refreshError || !refreshedUser || !newAccessToken) {
        // If refresh fails, clear user and redirect to login
        toast.error("Session expired. Please login again.");
        dispatch(clearUser());
        setTimeout(() => {
          redirectToLogin();
        }, 1000);

        return rejectWithValue({
          message: "Failed to refresh token. Please login again.",
          isAuthError: true,
        });
      }

      return {
        accessToken: newAccessToken,
        firebaseUid: refreshedUser.uid,
      };
    } catch {
      // Exception during refresh, clear user and redirect
      toast.error("Session expired. Please login again.");
      dispatch(clearUser());
      setTimeout(() => {
        redirectToLogin();
      }, 1000);

      return rejectWithValue({
        message: "An unexpected error occurred during token refresh.",
        isAuthError: true,
      });
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
    setAccessToken: (state, action) => {
      state.accessToken = action.payload;
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
      })

      // Refresh Firebase Token
      .addCase(refreshFirebaseToken.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(refreshFirebaseToken.fulfilled, (state, action) => {
        state.loading = false;
        // Update the access token
        if (action.payload.accessToken) {
          state.accessToken = action.payload.accessToken;
        }
      })
      .addCase(refreshFirebaseToken.rejected, (state, action) => {
        state.loading = false;

        // Handle auth errors by clearing state
        if (action.payload?.isAuthError === true) {
          state.user = null;
          state.accessToken = null;
          state.error = null; // Clear error since we're redirecting
        } else {
          state.error = action.payload?.message || "Token refresh failed";
        }
      })

      // Delete User Account
      .addCase(deleteUserAccount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUserAccount.fulfilled, (state) => {
        // Clear all user data after successful deletion
        state.user = null;
        state.accessToken = null;
        state.loading = false;
        state.error = null;
      })
      .addCase(deleteUserAccount.rejected, (state, action) => {
        state.loading = false;

        // Handle auth errors by clearing state
        if (action.payload?.isAuthError === true) {
          state.user = null;
          state.accessToken = null;
          state.error = null;
        } else {
          state.error = action.payload?.message || "Failed to delete account";
        }
      });
  },
});

// Export actions
export const {
  setUser,
  clearUser,
  setLoading,
  setError,
  clearError,
  setAccessToken,
} = userSlice.actions;

// Export reducer
export default userSlice.reducer;
