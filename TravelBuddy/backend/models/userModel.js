import mongoose from "mongoose";
const LANGUAGE_OPTIONS = [
  // Major World Languages
  'English', 'Mandarin', 'Hindi', 'Spanish', 'French', 'Arabic', 'Bengali', 'Portuguese',
  'Russian', 'Urdu', 'Indonesian', 'German', 'Japanese', 'Swahili', 'Marathi', 'Telugu',
  'Turkish', 'Tamil', 'Vietnamese', 'Korean', 'Italian', 'Thai', 'Gujarati', 'Polish',
  'Ukrainian', 'Persian', 'Malayalam', 'Kannada', 'Oriya', 'Punjabi', 'Azerbaijani', 'Dutch',
  'Kurdish', 'Romanian', 'Sinhalese', 'Greek', 'Hungarian', 'Czech', 'Belarusian', 'Kazakh',
  'Swedish', 'Serbian', 'Amharic', 'Norwegian', 'Danish', 'Finnish', 'Slovak', 'Bulgarian',
  'Croatian', 'Bosnian', 'Albanian', 'Lithuanian', 'Slovenian', 'Latvian', 'Estonian',
  'Macedonian', 'Moldovan', 'Maltese', 'Icelandic', 'Irish', 'Welsh', 'Basque', 'Catalan',
  'Galician',

  // Asian Languages
  'Chinese-Traditional', 'Chinese-Simplified', 'Cantonese', 'Tibetan', 'Mongolian',
  'Burmese', 'Khmer', 'Lao', 'Nepali', 'Bhutanese', 'Maldivian', 'Filipino', 'Malay',
  'Brunei', 'Javanese', 'Sundanese', 'Balinese',

  // African Languages
  'Yoruba', 'Igbo', 'Hausa', 'Zulu', 'Xhosa', 'Afrikaans', 'Somali', 'Oromo', 'Amharic',
  'Tigrinya', 'Akan', 'Twi', 'Fula', 'Lingala', 'Shona', 'Kinyarwanda', 'Kirundi', 'Luganda',
  'Wolof', 'Bambara', 'Malagasy',

  // Middle Eastern Languages
  'Hebrew', 'Turkish', 'Kurdish', 'Armenian', 'Georgian', 'Pashto', 'Dari', 'Balochi', 'Sindhi',

  // American Indigenous Languages
  'Quechua', 'Guarani', 'Nahuatl', 'Maya', 'Navajo', 'Cherokee',

  // Pacific Languages
  'Hawaiian', 'Maori', 'Fijian', 'Samoan', 'Tongan', 'Tahitian',

  // Sign Languages
  'American-Sign-Language', 'British-Sign-Language', 'International-Sign',

  // Other/Constructed Languages
  'Esperanto', 'Latin'
];

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
          enum: LANGUAGE_OPTIONS,
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
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

export default User;
