import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firebaseUid: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    fullName: {
      type: String,
      trim: true,
      maxlength: 50,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    mobile: {
      type: String,
      trim: true,
    },

    // Profile Details
    profilePicture: {
      type: String,
      default: process.env.DEFAULT_PROFILE_IMAGE_URL,
      required: true,
    },

    bio: {
      type: String,
      maxlength: 500,
      trim: true,
    },

    dateOfBirth: Date,

    gender: {
      type: String,
      enum: ["male", "female", "non-binary", "prefer-not-to-say"],
      lowercase: true,
    },

    // Languages
    languages: [
      {
        language: {
          type: String,
          trim: true,
        },
        proficiency: {
          type: String,
          enum: ["beginner", "intermediate", "advanced", "native"],
        },
      },
    ],
    currentLocation: {
      lat: {
        type: Number,
      },
      lng: {
        type: Number,
      },
    },

    // Social Links
    socialLinks: {
      facebook: String,
      twitter: String,
      instagram: String,
      linkedin: String,
    },
    socketId: {
      type: String,
      default: null,
    },
    futureDestinations: [
      {
        destination: String,
        plannedDate: Date,
        lat: Number,
        lng: Number,
      },
    ],
    profileCompletion: {
      basicInfo: {
        type: Boolean,
        default: false,
      },
      profilePicture: {
        type: Boolean,
        default: false,
      },
      bio: {
        type: Boolean,
        default: false,
      },
      phoneNumber: {
        type: Boolean,
        default: false,
      },
      languages: {
        type: Boolean,
        default: false,
      },
    },
    online: {
      type: Boolean,
      default: false,
    },
    activitiesJoined: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Activity",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

export default User;
