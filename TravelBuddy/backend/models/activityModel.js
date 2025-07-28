import mongoose from "mongoose";
const activitySchema = new mongoose.Schema(
  {
    // Basic activity information
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },

    // Activity creator
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    startDate: {
      type: Date,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },

    // Location information
    location: {
      address: {
        type: String,
        required: true,
      },
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true,
      },
    },
    maxParticipants: {
      type: Number,
      required: true,
    },
    participantsList: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      },
    ],
    visibility: {
      type: String,
      enum: ["Public", "Private"],
      default: "Public",
    },
  },
  {
    timestamps: true,
  }
);

activitySchema.index({ "location.coordinates": "2dsphere" }); // Geospatial index

const Activity = mongoose.model("Activity", activitySchema);
export default Activity;
