import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-hot-toast";
import axiosInstance from "../../Helpers/axiosInstance";
import { clearUser, setAccessToken } from "./UserSlice";
import {
  handleTokenRefresh,
  isTokenAuthError,
  redirectToLogin,
} from "../../Helpers/tokenRefreshHandler";

const initialState = {
  activities: null,
  loading: false,
  error: null,
  singleActivity: null,
};

// Create Activity
export const createActivity = createAsyncThunk(
  "activity/createActivity",
  async ({ activityData }, { rejectWithValue, getState, dispatch }) => {
    try {
      const { user: currentUser, accessToken } = getState().user;

      if (!currentUser || !accessToken) {
        const errorMessage = "No authenticated user found.";
        toast.error(errorMessage);
        return rejectWithValue({ message: errorMessage, isAuthError: true });
      }

      // Prepare FormData for activity creation
      const formData = new FormData();
      formData.append("firebaseUid", currentUser.firebaseUid);

      Object.keys(activityData).forEach((key) => {
        const value = activityData[key];
        if (key === "location") {
          if (typeof value === "object" && value !== null) {
            formData.append("location", JSON.stringify(value));
          }
        } else if (value !== null && value !== undefined && value !== "") {
          formData.append(key, String(value));
        }
      });

      try {
        const response = await axiosInstance.post(
          "/activity/create",
          formData,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );

        const createdActivity = response.data.data;
        toast.success("Activity created successfully!", { duration: 3000 });
        return { activity: createdActivity };
      } catch (error) {
        console.error("Activity creation error:", error);
        const errorMessage = error.response?.data?.message;
        const errorStatus = error.response?.status;

        if (errorStatus === 401 || isTokenAuthError(errorMessage)) {
          const refreshResult = await handleTokenRefresh(
            dispatch,
            clearUser,
            setAccessToken
          );

          if (refreshResult.success) {
            dispatch(setAccessToken(refreshResult.newToken));
            toast.error(
              "Session refreshed. Please try creating the activity again.",
              {
                duration: 4000,
              }
            );
            return rejectWithValue({
              message:
                "Session refreshed. Please try creating the activity again.",
            });
          } else {
            toast.error("Session expired. Please login again.");
            dispatch(clearUser());
            setTimeout(() => {
              redirectToLogin();
            }, 1000);
            return rejectWithValue({
              message: refreshResult.message,
              isAuthError: true,
            });
          }
        } else {
          let userFriendlyMessage =
            errorMessage || "Failed to create activity. Please try again.";
          toast.error(userFriendlyMessage);
          return rejectWithValue({
            message: userFriendlyMessage,
            originalError: errorMessage,
            status: errorStatus,
          });
        }
      }
    } catch (error) {
      console.error("Unexpected activity creation error:", error);
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

// Update Activity
export const updateActivity = createAsyncThunk(
  "activity/updateActivity",
  async (
    { activityId, activityData },
    { rejectWithValue, getState, dispatch }
  ) => {
    try {
      const { user: currentUser, accessToken } = getState().user;

      if (!currentUser || !accessToken) {
        const errorMessage = "No authenticated user found.";
        toast.error(errorMessage);
        return rejectWithValue({ message: errorMessage, isAuthError: true });
      }

      if (!activityId) {
        const errorMessage = "Activity ID is required.";
        toast.error(errorMessage);
        return rejectWithValue({ message: errorMessage });
      }

      const formData = new FormData();
      formData.append("firebaseUid", currentUser.firebaseUid);
      Object.keys(activityData).forEach((key) => {
        const value = activityData[key];
        if (key === "location") {
          if (typeof value === "object" && value !== null) {
            formData.append("location", JSON.stringify(value));
          }
        } else if (value !== null && value !== undefined && value !== "") {
          formData.append(key, String(value));
        }
      });

      try {
        const response = await axiosInstance.put(
          `/activity/update/${activityId}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );

        const updatedActivity = response.data.data;
        toast.success("Activity updated successfully!", { duration: 3000 });
        return { activity: updatedActivity };
      } catch (error) {
        console.error("Activity update error:", error);
        const errorMessage = error.response?.data?.message;
        const errorStatus = error.response?.status;

        if (errorStatus === 401 || isTokenAuthError(errorMessage)) {
          const refreshResult = await handleTokenRefresh(
            dispatch,
            clearUser,
            setAccessToken
          );

          if (refreshResult.success) {
            dispatch(setAccessToken(refreshResult.newToken));
            toast.error(
              "Session refreshed. Please try updating the activity again.",
              {
                duration: 4000,
              }
            );
            return rejectWithValue({
              message:
                "Session refreshed. Please try updating the activity again.",
            });
          } else {
            toast.error("Session expired. Please login again.");
            dispatch(clearUser());
            setTimeout(() => {
              redirectToLogin();
            }, 1000);
            return rejectWithValue({
              message: refreshResult.message,
              isAuthError: true,
            });
          }
        } else {
          let userFriendlyMessage =
            errorMessage || "Failed to update activity. Please try again.";
          toast.error(userFriendlyMessage);
          return rejectWithValue({
            message: userFriendlyMessage,
            originalError: errorMessage,
            status: errorStatus,
          });
        }
      }
    } catch (error) {
      console.error("Unexpected activity update error:", error);
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

// Find Nearby Activities
export const findNearbyActivities = createAsyncThunk(
  "activity/findNearbyActivities",
  async (
    { firebaseUid, searchType, lat, lng, radius, name },
    { rejectWithValue, getState, dispatch }
  ) => {
    try {
      const { user: currentUser, accessToken } = getState().user;

      if (!currentUser || !accessToken) {
        const errorMessage = "No authenticated user found.";
        toast.error(errorMessage);
        return rejectWithValue({ message: errorMessage, isAuthError: true });
      }

      if (!firebaseUid) {
        const errorMessage = "Firebase UID is required.";
        toast.error(errorMessage);
        return rejectWithValue({ message: errorMessage });
      }

      if (searchType !== "activityName" && (!lat || !lng || !radius)) {
        const errorMessage =
          "Latitude, longitude, and radius are required for location-based search.";
        toast.error(errorMessage);
        return rejectWithValue({ message: errorMessage });
      }

      if (searchType === "activityName" && (!name || !name.trim())) {
        const errorMessage = "Activity name is required for name-based search.";
        toast.error(errorMessage);
        return rejectWithValue({ message: errorMessage });
      }

      try {
        const payload = { firebaseUid, searchType };
        if (searchType !== "activityName") {
          payload.lat = parseFloat(lat);
          payload.lng = parseFloat(lng);
          payload.radius = parseFloat(radius);
        } else {
          payload.name = name.trim();
        }

        const response = await axiosInstance.post("/activity/nearby", payload, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        const activities = response.data.data;
        toast.success(
          activities.length > 0
            ? "Activities found successfully!"
            : "No activities found.",
          { duration: 3000 }
        );
        return { activities };
      } catch (error) {
        console.error("Find nearby activities error:", error);
        const errorMessage = error.response?.data?.message;
        const errorStatus = error.response?.status;

        if (errorStatus === 401 || isTokenAuthError(errorMessage)) {
          const refreshResult = await handleTokenRefresh(
            dispatch,
            clearUser,
            setAccessToken
          );

          if (refreshResult.success) {
            dispatch(setAccessToken(refreshResult.newToken));
            toast.error(
              "Session refreshed. Please try searching for activities again.",
              { duration: 4000 }
            );
            return rejectWithValue({
              message:
                "Session refreshed. Please try searching for activities again.",
            });
          } else {
            toast.error("Session expired. Please login again.");
            dispatch(clearUser());
            setTimeout(() => {
              redirectToLogin();
            }, 1000);
            return rejectWithValue({
              message: refreshResult.message,
              isAuthError: true,
            });
          }
        } else {
          let userFriendlyMessage =
            errorMessage || "Failed to find activities. Please try again.";
          toast.error(userFriendlyMessage);
          return rejectWithValue({
            message: userFriendlyMessage,
            originalError: errorMessage,
            status: errorStatus,
          });
        }
      }
    } catch (error) {
      console.error("Unexpected find nearby activities error:", error);
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

// Join Activity
export const joinActivity = createAsyncThunk(
  "activity/joinActivity",
  async ({ activityId }, { rejectWithValue, getState, dispatch }) => {
    try {
      const { user: currentUser, accessToken } = getState().user;

      if (!currentUser || !accessToken) {
        const errorMessage = "No authenticated user found.";
        toast.error(errorMessage);
        return rejectWithValue({ message: errorMessage, isAuthError: true });
      }

      if (!activityId) {
        const errorMessage = "Activity ID is required.";
        toast.error(errorMessage);
        return rejectWithValue({ message: errorMessage });
      }

      try {
        const response = await axiosInstance.post(
          "/activity/join",
          { firebaseUid: currentUser.firebaseUid, activityId },
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );

        const updatedActivity = response.data.data;
        toast.success("Successfully joined the activity!", { duration: 3000 });
        return { activity: updatedActivity };
      } catch (error) {
        console.error("Join activity error:", error);
        const errorMessage = error.response?.data?.message;
        const errorStatus = error.response?.status;

        if (errorStatus === 401 || isTokenAuthError(errorMessage)) {
          const refreshResult = await handleTokenRefresh(
            dispatch,
            clearUser,
            setAccessToken
          );

          if (refreshResult.success) {
            dispatch(setAccessToken(refreshResult.newToken));
            toast.error(
              "Session refreshed. Please try joining the activity again.",
              {
                duration: 4000,
              }
            );
            return rejectWithValue({
              message:
                "Session refreshed. Please try joining the activity again.",
            });
          } else {
            toast.error("Session expired. Please login again.");
            dispatch(clearUser());
            setTimeout(() => {
              redirectToLogin();
            }, 1000);
            return rejectWithValue({
              message: refreshResult.message,
              isAuthError: true,
            });
          }
        } else {
          let userFriendlyMessage =
            errorMessage || "Failed to join activity. Please try again.";
          toast.error(userFriendlyMessage);
          return rejectWithValue({
            message: userFriendlyMessage,
            originalError: errorMessage,
            status: errorStatus,
          });
        }
      }
    } catch (error) {
      console.error("Unexpected join activity error:", error);
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

// Add User to Activity
export const addUserToActivity = createAsyncThunk(
  "activity/addUserToActivity",
  async (
    { userFirebaseUid, activityId },
    { rejectWithValue, getState, dispatch }
  ) => {
    try {
      const { user: currentUser, accessToken } = getState().user;

      if (!currentUser || !accessToken) {
        const errorMessage = "No authenticated user found.";
        toast.error(errorMessage);
        return rejectWithValue({ message: errorMessage, isAuthError: true });
      }

      if (!userFirebaseUid || !activityId) {
        const errorMessage = "User Firebase UID and Activity ID are required.";
        toast.error(errorMessage);
        return rejectWithValue({ message: errorMessage });
      }

      try {
        const response = await axiosInstance.post(
          "/activity/add-user",
          {
            creatorFirebaseUid: currentUser.firebaseUid,
            userFirebaseUid,
            activityId,
          },
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );

        const updatedActivity = response.data.data;
        toast.success("User successfully added to the activity!", {
          duration: 3000,
        });
        return { activity: updatedActivity };
      } catch (error) {
        console.error("Add user to activity error:", error);
        const errorMessage = error.response?.data?.message;
        const errorStatus = error.response?.status;

        if (errorStatus === 401 || isTokenAuthError(errorMessage)) {
          const refreshResult = await handleTokenRefresh(
            dispatch,
            clearUser,
            setAccessToken
          );

          if (refreshResult.success) {
            dispatch(setAccessToken(refreshResult.newToken));
            toast.error(
              "Session refreshed. Please try adding the user again.",
              {
                duration: 4000,
              }
            );
            return rejectWithValue({
              message: "Session refreshed. Please try adding the user again.",
            });
          } else {
            toast.error("Session expired. Please login again.");
            dispatch(clearUser());
            setTimeout(() => {
              redirectToLogin();
            }, 1000);
            return rejectWithValue({
              message: refreshResult.message,
              isAuthError: true,
            });
          }
        } else {
          let userFriendlyMessage =
            errorMessage || "Failed to add user to activity. Please try again.";
          toast.error(userFriendlyMessage);
          return rejectWithValue({
            message: userFriendlyMessage,
            originalError: errorMessage,
            status: errorStatus,
          });
        }
      }
    } catch (error) {
      console.error("Unexpected add user to activity error:", error);
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

// Delete Activity
export const deleteActivity = createAsyncThunk(
  "activity/deleteActivity",
  async ({ activityId }, { rejectWithValue, getState, dispatch }) => {
    try {
      const { user: currentUser, accessToken } = getState().user;

      if (!currentUser || !accessToken) {
        const errorMessage = "No authenticated user found.";
        toast.error(errorMessage);
        return rejectWithValue({ message: errorMessage, isAuthError: true });
      }

      if (!activityId) {
        const errorMessage = "Activity ID is required.";
        toast.error(errorMessage);
        return rejectWithValue({ message: errorMessage });
      }

      try {
        await axiosInstance.post(
          "/activity/delete",
          { firebaseUid: currentUser.firebaseUid, activityId },
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );

        toast.success("Activity deleted successfully!", { duration: 3000 });
        return { activityId };
      } catch (error) {
        console.error("Delete activity error:", error);
        const errorMessage = error.response?.data?.message;
        const errorStatus = error.response?.status;

        if (errorStatus === 401 || isTokenAuthError(errorMessage)) {
          const refreshResult = await handleTokenRefresh(
            dispatch,
            clearUser,
            setAccessToken
          );

          if (refreshResult.success) {
            dispatch(setAccessToken(refreshResult.newToken));
            toast.error(
              "Session refreshed. Please try deleting the activity again.",
              {
                duration: 4000,
              }
            );
            return rejectWithValue({
              message:
                "Session refreshed. Please try deleting the activity again.",
            });
          } else {
            toast.error("Session expired. Please login again.");
            dispatch(clearUser());
            setTimeout(() => {
              redirectToLogin();
            }, 1000);
            return rejectWithValue({
              message: refreshResult.message,
              isAuthError: true,
            });
          }
        } else {
          let userFriendlyMessage =
            errorMessage || "Failed to delete activity. Please try again.";
          toast.error(userFriendlyMessage);
          return rejectWithValue({
            message: userFriendlyMessage,
            originalError: errorMessage,
            status: errorStatus,
          });
        }
      }
    } catch (error) {
      console.error("Unexpected delete activity error:", error);
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

// Leave Activity
export const leaveActivity = createAsyncThunk(
  "activity/leaveActivity",
  async ({ activityId }, { rejectWithValue, getState, dispatch }) => {
    try {
      const { user, accessToken } = getState().user;

      if (!user || !accessToken) {
        const errorMessage = "No authenticated user found.";
        toast.error(errorMessage);
        return rejectWithValue({ message: errorMessage, isAuthError: true });
      }

      const response = await axiosInstance.post(
        `/activity/leave/${activityId}`,
        { firebaseUid: user.firebaseUid },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );

      toast.success("Successfully left the activity!", { duration: 3000 });
      return { activity: response.data.data }; // Expect backend to return updated activity
    } catch (error) {
      console.error("Leave activity error:", error);
      const errorMessage = error.response?.data?.message || "Failed to leave activity. Please try again.";
      const errorStatus = error.response?.status;

      if (errorStatus === 401 || isTokenAuthError(errorMessage)) {
        const refreshResult = await handleTokenRefresh(
          dispatch,
          clearUser,
          setAccessToken
        );

        if (refreshResult.success) {
          dispatch(setAccessToken(refreshResult.newToken));
          toast.error("Session refreshed. Please try leaving again.", { duration: 4000 });
          return rejectWithValue({ message: "Session refreshed. Please try leaving again." });
        } else {
          toast.error("Session expired. Please login again.");
          dispatch(clearUser());
          setTimeout(() => {
            redirectToLogin();
          }, 1000);
          return rejectWithValue({ message: refreshResult.message, isAuthError: true });
        }
      } else {
        toast.error(errorMessage);
        return rejectWithValue({ message: errorMessage, status: errorStatus });
      }
    }
  }
);

// Get My Activities
export const getMyActivities = createAsyncThunk(
  "activity/getMyActivities",
  async (_, { rejectWithValue, getState, dispatch }) => {
    try {
      const { user: currentUser, accessToken } = getState().user;

      if (!currentUser || !accessToken) {
        const errorMessage = "No authenticated user found.";
        toast.error(errorMessage);
        return rejectWithValue({ message: errorMessage, isAuthError: true });
      }

      try {
        const response = await axiosInstance.post(
          "/activity/my-activities",
          { firebaseUid: currentUser.firebaseUid },
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );

        const activities = response.data.data;
        toast.success(
          activities.length > 0
            ? "Activities fetched successfully!"
            : "No activities found.",
          { duration: 3000 }
        );
        return { activities };
      } catch (error) {
        console.error("Get my activities error:", error);
        const errorMessage = error.response?.data?.message;
        const errorStatus = error.response?.status;

        if (errorStatus === 401 || isTokenAuthError(errorMessage)) {
          const refreshResult = await handleTokenRefresh(
            dispatch,
            clearUser,
            setAccessToken
          );

          if (refreshResult.success) {
            dispatch(setAccessToken(refreshResult.newToken));
            toast.error(
              "Session refreshed. Please try fetching activities again.",
              { duration: 4000 }
            );
            return rejectWithValue({
              message:
                "Session refreshed. Please try fetching activities again.",
            });
          } else {
            toast.error("Session expired. Please login again.");
            dispatch(clearUser());
            setTimeout(() => {
              redirectToLogin();
            }, 1000);
            return rejectWithValue({
              message: refreshResult.message,
              isAuthError: true,
            });
          }
        } else {
          let userFriendlyMessage =
            errorMessage || "Failed to fetch activities. Please try again.";
          toast.error(userFriendlyMessage);
          return rejectWithValue({
            message: userFriendlyMessage,
            originalError: errorMessage,
            status: errorStatus,
          });
        }
      }
    } catch (error) {
      console.error("Unexpected get my activities error:", error);
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

// Activity Slice
const activitySlice = createSlice({
  name: "activity",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearActivities: (state) => {
      state.activities = null;
      state.singleActivity = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create Activity
      .addCase(createActivity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createActivity.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.activity) {
          if (state.activities) {
            state.activities.unshift(action.payload.activity);
          } else {
            state.activities = [action.payload.activity];
          }
          state.singleActivity = action.payload.activity;
        }
      })
      .addCase(createActivity.rejected, (state, action) => {
        state.loading = false;
        if (action.payload?.isAuthError === true) {
          state.error = null;
        } else {
          state.error = action.payload?.message || "Failed to create activity";
        }
      })
      // Update Activity
      .addCase(updateActivity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateActivity.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.activity) {
          state.singleActivity = action.payload.activity;
          if (state.activities) {
            const index = state.activities.findIndex(
              (act) => act._id === action.payload.activity._id
            );
            if (index !== -1) {
              state.activities[index] = action.payload.activity;
            }
          }
        }
      })
      .addCase(updateActivity.rejected, (state, action) => {
        state.loading = false;
        if (action.payload?.isAuthError === true) {
          state.error = null;
        } else {
          state.error = action.payload?.message || "Failed to update activity";
        }
      })
      // Find Nearby Activities
      .addCase(findNearbyActivities.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(findNearbyActivities.fulfilled, (state, action) => {
        state.loading = false;
        state.nearbyActivities = action.payload.activities || [];
      })
      .addCase(findNearbyActivities.rejected, (state, action) => {
        state.loading = false;
        if (action.payload?.isAuthError === true) {
          state.error = null;
        } else {
          state.error = action.payload?.message || "Failed to find activities";
        }
      })
      // Join Activity
      .addCase(joinActivity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(joinActivity.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.activity) {
          state.singleActivity = action.payload.activity;
          if (state.activities) {
            const index = state.activities.findIndex(
              (act) => act._id === action.payload.activity._id
            );
            if (index !== -1) {
              state.activities[index] = action.payload.activity;
            }
          }
        }
      })
      .addCase(joinActivity.rejected, (state, action) => {
        state.loading = false;
        if (action.payload?.isAuthError === true) {
          state.error = null;
        } else {
          state.error = action.payload?.message || "Failed to join activity";
        }
      })
      // Add User to Activity
      .addCase(addUserToActivity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addUserToActivity.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.activity) {
          state.singleActivity = action.payload.activity;
          if (state.activities) {
            const index = state.activities.findIndex(
              (act) => act._id === action.payload.activity._id
            );
            if (index !== -1) {
              state.activities[index] = action.payload.activity;
            }
          }
        }
      })
      .addCase(addUserToActivity.rejected, (state, action) => {
        state.loading = false;
        if (action.payload?.isAuthError === true) {
          state.error = null;
        } else {
          state.error =
            action.payload?.message || "Failed to add user to activity";
        }
      })
      // Delete Activity
      .addCase(deleteActivity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteActivity.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.activityId) {
          if (state.activities) {
            state.activities = state.activities.filter(
              (act) => act._id !== action.payload.activityId
            );
          }
          if (state.singleActivity?._id === action.payload.activityId) {
            state.singleActivity = null;
          }
        }
      })
      .addCase(deleteActivity.rejected, (state, action) => {
        state.loading = false;
        if (action.payload?.isAuthError === true) {
          state.error = null;
        } else {
          state.error = action.payload?.message || "Failed to delete activity";
        }
      })

      // Get My Activities
      .addCase(getMyActivities.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMyActivities.fulfilled, (state, action) => {
        state.loading = false;
        state.activities = action.payload.activities || [];
      })
      .addCase(getMyActivities.rejected, (state, action) => {
        state.loading = false;
        if (action.payload?.isAuthError === true) {
          state.error = null;
        } else {
          state.error = action.payload?.message || "Failed to fetch activities";
        }
      })

      // Leave Activity
      .addCase(leaveActivity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(leaveActivity.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.activity && state.activities) {
          // Remove the activity from activities if the user is no longer a participant
          state.activities = state.activities.filter(
            (act) => act._id !== action.payload.activity._id
          );
        }
      })
      .addCase(leaveActivity.rejected, (state, action) => {
        state.loading = false;
        if (action.payload?.isAuthError) {
          state.error = null;
        } else {
          state.error = action.payload?.message || "Failed to leave activity";
        }
      });
  },
});

// Export actions
export const { clearError, clearActivities } = activitySlice.actions;

// Export reducer
export default activitySlice.reducer;
