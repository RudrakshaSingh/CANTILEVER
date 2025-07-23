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
      default:
        "https://media.istockphoto.com/id/1130884625/vector/user-member-vector-icon-for-ui-user-interface-or-profile-face-avatar-app-in-circle-design.jpg?s=612x612&w=0&k=20&c=1ky-gNHiS2iyLsUPQkxAtPBWH1BZt0PKBB1WBtxQJRE=",
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
        },
        proficiency: {
          type: String,
          enum: ["beginner", "intermediate", "advanced", "native"],
          default: "intermediate",
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
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

export default User;
