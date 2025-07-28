import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-hot-toast";
import { refreshUser } from "../../Helpers/firebaseConfig";
import axiosInstance from "../../Helpers/axiosInstance";

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
      console.log("hhhh");

      // Prepare FormData for activity creation
      const formData = new FormData();

      // Add firebaseUid first
      formData.append("firebaseUid", currentUser.firebaseUid);

      // Add all activity fields to FormData
      Object.keys(activityData).forEach((key) => {
        const value = activityData[key];

        if (key === "location") {
          // Handle location object with coordinates
          if (typeof value === "object" && value !== null) {
            formData.append("location", JSON.stringify(value));
          }
        } else if (value !== null && value !== undefined && value !== "") {
          // Handle all other string/primitive fields
          formData.append(key, String(value));
        }
      });

      // Call backend API to create activity
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

        toast.success("Activity created successfully!", {
          duration: 3000,
        });

        return { activity: createdActivity };

      } catch (error) {
        console.error("Activity creation error:", error);
        
        const errorMessage = error.response?.data?.message;
        const errorStatus = error.response?.status;

        // Handle authentication errors
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
              // Update the access token in Redux
              dispatch({ type: 'user/setAccessToken', payload: newAccessToken });
              
              // Show toast and return - no retry logic
              toast.error("Session expired. Please try creating the activity again.");
              return rejectWithValue({
                message: "Session expired. Please try creating the activity again."
              });
            } else {
              // Token refresh failed
              toast.error("Session expired. Please login again.");
              dispatch({ type: 'user/clearUser' });
              setTimeout(() => {
                window.location.href = "/user/login";
              }, 1000);

              return rejectWithValue({
                message: "Session expired. Please login again.",
                isAuthError: true,
              });
            }
          } catch (refreshErr) {
            console.error('Token refresh error:', refreshErr);
            toast.error("Session expired. Please login again.");
            dispatch({ type: 'user/clearUser' });
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
          toast.error(errorMessage || "Failed to create activity. Please try again.");
          return rejectWithValue({
            message: errorMessage || "Failed to create activity. Please try again.",
            originalError: errorMessage,
            status: errorStatus,
          });
        }
      }

    } catch (error) {
      console.error('Unexpected activity creation error:', error);
      
      let errorMessage = "An unexpected error occurred. Please try again.";
      
      if (error.name === 'NetworkError' || error.message.includes('network')) {
        errorMessage = "Network error. Please check your connection and try again.";
      } else if (error.message.includes('timeout')) {
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
  reducers: {},

  extraReducers: (builder) => {
    builder
      // Create Activity
      .addCase(createActivity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createActivity.fulfilled, (state, action) => {
        state.loading = false;

        // Add the new activity to the activities array
        if (action.payload.activity) {
          if (state.activities) {
            state.activities.unshift(action.payload.activity); // Add to beginning
          } else {
            state.activities = [action.payload.activity];
          }
        }
      })
      .addCase(createActivity.rejected, (state, action) => {
        state.loading = false;

        // Handle auth errors by not setting error (since we're redirecting)
        if (action.payload?.isAuthError === true) {
          state.error = null;
        } else {
          state.error = action.payload?.message || "Failed to create activity";
        }
      });
  },
});

// Export reducer
export default activitySlice.reducer;