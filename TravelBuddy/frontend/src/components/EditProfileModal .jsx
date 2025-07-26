/* eslint-disable no-useless-escape */
import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import {
  X,
  User,
  Phone,
  Calendar,
  MapPin,
  Languages,
  Globe,
  Plus,
  Minus,
  Camera,
  Save,
  FileText,
  Upload,
  AlertCircle,
  CheckCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { updateProfile, clearError } from "../Redux/Slices/UserSlice"; // Update with correct path
import { LANGUAGE_OPTIONS } from "../constants/LanguageOptions";

// Language Autocomplete Component
const LanguageAutocomplete = ({ value, onChange, onBlur, disabled, error, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filteredOptions, setFilteredOptions] = useState([]);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const filtered = LANGUAGE_OPTIONS.filter(option =>
      option.toLowerCase().includes(value.toLowerCase())
    ).slice(0, 10); // Limit to 10 options for performance
    setFilteredOptions(filtered);
    setHighlightedIndex(-1);
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    onChange(inputValue);
    setIsOpen(true);
  };

  const handleOptionClick = (option) => {
    onChange(option);
    setIsOpen(false);
    inputRef.current?.blur();
  };

  const handleKeyDown = (e) => {
    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'Enter') {
        setIsOpen(true);
        return;
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev < filteredOptions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev > 0 ? prev - 1 : filteredOptions.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && filteredOptions[highlightedIndex]) {
          handleOptionClick(filteredOptions[highlightedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        inputRef.current?.blur();
        break;
    }
  };

  const handleFocus = () => {
    setIsOpen(true);
  };

  const handleBlur = () => {
    // Delay to allow option click to register
    setTimeout(() => {
      setIsOpen(false);
      onBlur && onBlur();
    }, 150);
  };

  return (
    <div className="relative">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          onBlur={handleBlur}
          disabled={disabled}
          className={`w-full px-4 py-2 bg-white/80 backdrop-blur-sm border-2 rounded-lg focus:ring-4 focus:ring-green-500/20 focus:border-green-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed pr-10 ${
            error ? "border-red-400" : "border-gray-200"
          }`}
          placeholder={placeholder}
          maxLength={30}
          autoComplete="off"
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          {isOpen ? (
            <ChevronUp className="w-4 h-4 text-gray-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-400" />
          )}
        </div>
      </div>

      {isOpen && filteredOptions.length > 0 && (
        <div
          ref={dropdownRef}
          className="absolute z-[200] w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-2xl max-h-60 overflow-auto"
          style={{ boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}
        >
          {filteredOptions.map((option, optionIndex) => (
            <div
              key={option}
              className={`px-4 py-2 cursor-pointer transition-colors duration-150 ${
                highlightedIndex === optionIndex
                  ? 'bg-green-50 text-green-900'
                  : 'hover:bg-gray-50'
              }`}
              onClick={() => handleOptionClick(option)}
              onMouseEnter={() => setHighlightedIndex(optionIndex)}
            >
              {option}
            </div>
          ))}
        </div>
      )}

      {isOpen && filteredOptions.length === 0 && value.trim() && (
        <div
          ref={dropdownRef}
          className="absolute z-[200] w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-2xl"
          style={{ boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}
        >
          <div className="px-4 py-2 text-gray-500 text-sm">
            No languages found matching "{value}"
          </div>
        </div>
      )}
    </div>
  );
};

const EditProfileModal = ({ isOpen, onClose, user }) => {
  const dispatch = useDispatch();
  const { loading: isUpdating, error: reduxError } = useSelector(
    (state) => state.user
  );

  const [formData, setFormData] = useState({
    fullName: "",
    mobile: "",
    bio: "",
    dateOfBirth: "",
    gender: "",
    profilePicture: null,
    profilePicturePreview: "",
    languages: [],
    socialLinks: {
      facebook: "",
      twitter: "",
      instagram: "",
      linkedin: "",
    },
    futureDestinations: [],
  });

  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const fileInputRef = useRef(null);

  // Initialize form data when modal opens or user changes
  useEffect(() => {
    if (isOpen && user) {
      setFormData({
        fullName: user.fullName || "",
        mobile: user.mobile || "",
        bio: user.bio || "",
        dateOfBirth: user.dateOfBirth
          ? new Date(user.dateOfBirth).toISOString().split("T")[0]
          : "",
        gender: user.gender || "",
        profilePicture: null,
        profilePicturePreview: user.profilePicture || "",
        languages: user.languages || [],
        socialLinks: {
          facebook: user.socialLinks?.facebook || "",
          twitter: user.socialLinks?.twitter || "",
          instagram: user.socialLinks?.instagram || "",
          linkedin: user.socialLinks?.linkedin || "",
        },
        futureDestinations: user.futureDestinations || [],
      });
      setErrors({});
      setSubmitAttempted(false);
      // Clear any previous Redux errors
      dispatch(clearError());
    }
  }, [isOpen, user, dispatch]);

  // Clear Redux errors when modal closes
  useEffect(() => {
    if (!isOpen) {
      dispatch(clearError());
    }
  }, [isOpen, dispatch]);

  const validateForm = () => {
    const newErrors = {};

    // Validate full name
    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = "Full name must be at least 2 characters";
    } else if (formData.fullName.length > 50) {
      newErrors.fullName = "Full name must be 50 characters or less";
    } else if (!/^[a-zA-Z\s\-'\.]+$/.test(formData.fullName.trim())) {
      newErrors.fullName =
        "Full name can only contain letters, spaces, hyphens, apostrophes, and periods";
    }

    // Validate bio length
    if (formData.bio && formData.bio.length > 500) {
      newErrors.bio = "Bio must be 500 characters or less";
    }

    // Validate mobile (more comprehensive pattern)
    if (formData.mobile && formData.mobile.trim()) {
      const mobilePattern = /^[\+]?[1-9][\d]{0,15}$/;
      const cleanMobile = formData.mobile.replace(/[\s\-\(\)]/g, "");
      if (!mobilePattern.test(cleanMobile)) {
        newErrors.mobile = "Please enter a valid phone number (10-16 digits)";
      }
    }

    // Validate date of birth
    if (formData.dateOfBirth) {
      const birthDate = new Date(formData.dateOfBirth);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();

      if (birthDate > today) {
        newErrors.dateOfBirth = "Date of birth cannot be in the future";
      } else if (age > 120) {
        newErrors.dateOfBirth = "Please enter a valid date of birth";
      }
    }

    // Validate languages
    formData.languages.forEach((lang, index) => {
      if (!lang.language.trim()) {
        newErrors[`language_${index}`] = "Language name is required";
      } else if (lang.language.length > 30) {
        newErrors[`language_${index}`] =
          "Language name must be 30 characters or less";
      } else if (!LANGUAGE_OPTIONS.includes(lang.language.trim())) {
        newErrors[`language_${index}`] = "Please select a valid language from the list";
      }
    });

    // Validate future destinations
    formData.futureDestinations.forEach((dest, index) => {
      if (!dest.destination.trim()) {
        newErrors[`destination_${index}`] = "Destination name is required";
      } else if (dest.destination.length > 100) {
        newErrors[`destination_${index}`] =
          "Destination name must be 100 characters or less";
      }

      // Validate coordinates if provided
      if ((dest.lat && !dest.lng) || (!dest.lat && dest.lng)) {
        newErrors[`coordinates_${index}`] =
          "Both latitude and longitude are required";
      }

      if (dest.lat && (isNaN(dest.lat) || dest.lat < -90 || dest.lat > 90)) {
        newErrors[`lat_${index}`] = "Latitude must be between -90 and 90";
      }

      if (dest.lng && (isNaN(dest.lng) || dest.lng < -180 || dest.lng > 180)) {
        newErrors[`lng_${index}`] = "Longitude must be between -180 and 180";
      }

      // Validate planned date
      if (dest.plannedDate) {
        const plannedDate = new Date(dest.plannedDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (plannedDate < today) {
          newErrors[`plannedDate_${index}`] =
            "Planned date cannot be in the past";
        }
      }
    });

    // Validate social links
    Object.entries(formData.socialLinks).forEach(([platform, url]) => {
      if (url && url.trim()) {
        try {
          new URL(url);
        } catch {
          newErrors[
            `socialLink_${platform}`
          ] = `Please enter a valid ${platform} URL`;
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }

    // Clear Redux error when user makes changes
    if (reduxError) {
      dispatch(clearError());
    }
  };

  const handleSocialLinkChange = (platform, value) => {
    setFormData((prev) => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [platform]: value,
      },
    }));

    // Clear error when user starts typing
    if (errors[`socialLink_${platform}`]) {
      setErrors((prev) => ({
        ...prev,
        [`socialLink_${platform}`]: "",
      }));
    }
  };

  const handleProfilePictureChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/webp",
      ];
      if (!allowedTypes.includes(file.type)) {
        setErrors((prev) => ({
          ...prev,
          profilePicture:
            "Please select a valid image file (JPEG, PNG, GIF, or WebP)",
        }));
        return;
      }

      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          profilePicture: "Image size must be less than 5MB",
        }));
        return;
      }

      // Create preview URL
      const previewUrl = URL.createObjectURL(file);

      setFormData((prev) => ({
        ...prev,
        profilePicture: file,
        profilePicturePreview: previewUrl,
      }));

      // Clear any previous errors
      setErrors((prev) => ({
        ...prev,
        profilePicture: "",
      }));
    }
  };

  const handleRemoveProfilePicture = () => {
    // Clean up the preview URL if it was created
    if (
      formData.profilePicturePreview &&
      formData.profilePicturePreview.startsWith("blob:")
    ) {
      URL.revokeObjectURL(formData.profilePicturePreview);
    }

    setFormData((prev) => ({
      ...prev,
      profilePicture: null,
      profilePicturePreview: "",
    }));

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const addLanguage = () => {
    setFormData((prev) => ({
      ...prev,
      languages: [...prev.languages, { language: "", proficiency: "beginner" }],
    }));
  };

  const removeLanguage = (index) => {
    setFormData((prev) => ({
      ...prev,
      languages: prev.languages.filter((_, i) => i !== index),
    }));

    // Clear related errors
    const newErrors = { ...errors };
    delete newErrors[`language_${index}`];
    setErrors(newErrors);
  };

  const updateLanguage = (index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      languages: prev.languages.map((lang, i) =>
        i === index ? { ...lang, [field]: value } : lang
      ),
    }));

    // Clear error when user starts typing
    if (field === "language" && errors[`language_${index}`]) {
      setErrors((prev) => ({
        ...prev,
        [`language_${index}`]: "",
      }));
    }
  };

  const addDestination = () => {
    setFormData((prev) => ({
      ...prev,
      futureDestinations: [
        ...prev.futureDestinations,
        {
          destination: "",
          plannedDate: "",
          lat: "",
          lng: "",
        },
      ],
    }));
  };

  const removeDestination = (index) => {
    setFormData((prev) => ({
      ...prev,
      futureDestinations: prev.futureDestinations.filter((_, i) => i !== index),
    }));

    // Clear related errors
    const newErrors = { ...errors };
    delete newErrors[`destination_${index}`];
    delete newErrors[`coordinates_${index}`];
    delete newErrors[`lat_${index}`];
    delete newErrors[`lng_${index}`];
    delete newErrors[`plannedDate_${index}`];
    setErrors(newErrors);
  };

  const updateDestination = (index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      futureDestinations: prev.futureDestinations.map((dest, i) =>
        i === index ? { ...dest, [field]: value } : dest
      ),
    }));

    // Clear related errors
    const errorKey = `${field}_${index}`;
    if (errors[errorKey]) {
      setErrors((prev) => ({
        ...prev,
        [errorKey]: "",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitAttempted(true);

    if (!validateForm()) {
      toast.error("Please fix the errors before submitting");
      return;
    }

    setIsSaving(true);

    // Process data for submission
    const processedData = {
      fullName: formData.fullName.trim(),
      mobile: formData.mobile.trim(),
      bio: formData.bio.trim(),
      dateOfBirth: formData.dateOfBirth || null,
      gender: formData.gender || null,
      languages: formData.languages
        .filter((lang) => lang.language.trim())
        .map((lang) => ({
          language: lang.language.trim(),
          proficiency: lang.proficiency,
        })),
      socialLinks: Object.fromEntries(
        Object.entries(formData.socialLinks).map(([key, value]) => [
          key,
          value.trim(),
        ])
      ),
      futureDestinations: formData.futureDestinations
        .filter((dest) => dest.destination.trim())
        .map((dest) => ({
          destination: dest.destination.trim(),
          lat: dest.lat ? parseFloat(dest.lat) : null,
          lng: dest.lng ? parseFloat(dest.lng) : null,
          plannedDate: dest.plannedDate || null,
        })),
    };

    // Only include profilePicture if a new file was selected
    if (formData.profilePicture instanceof File) {
      processedData.profilePicture = formData.profilePicture;
    }

    // Dispatch the updateProfile action
     await dispatch(updateProfile({ updates: processedData }));

    setIsSaving(false);
    onClose();
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (
        formData.profilePicturePreview &&
        formData.profilePicturePreview.startsWith("blob:")
      ) {
        URL.revokeObjectURL(formData.profilePicturePreview);
      }
    };
  }, [ formData.profilePicturePreview ]);

  // Combined loading state
  const isLoading = isSaving || isUpdating;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop with blur */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden border border-white/20">
        {/* Header with Gradient */}
        <div className="relative bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 text-white p-8">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-3">
                <User className="w-7 h-7" />
              </div>
              <div>
                <h2 className="text-3xl font-bold">Edit Profile</h2>
                <p className="text-purple-100 text-sm mt-1">
                  Update your personal information
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              disabled={isLoading}
              className="bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-2xl p-3 transition-all duration-300 hover:rotate-90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Error Banner */}
        {reduxError && submitAttempted && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mx-8 mt-4 rounded-lg">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <AlertCircle className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{reduxError}</p>
              </div>
            </div>
          </div>
        )}

        {/* Form Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-280px)] bg-gradient-to-br from-gray-50 to-white">
          <div className="p-8 space-y-10">
            {/* Profile Picture */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/50">
              <h3 className="text-xl font-bold text-gray-900 flex items-center mb-6">
                <div className="bg-gradient-to-r from-pink-500 to-rose-500 rounded-xl p-2 mr-3">
                  <Camera className="w-5 h-5 text-white" />
                </div>
                Profile Picture
              </h3>

              <div className="flex flex-col items-center space-y-4">
                {/* Profile Picture Preview */}
                <div className="relative">
                  <div className="w-32 h-32 rounded-full overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 border-4 border-white shadow-lg">
                    {formData.profilePicturePreview ? (
                      <img
                        src={formData.profilePicturePreview}
                        alt="Profile preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <User className="w-12 h-12 text-gray-400" />
                      </div>
                    )}
                  </div>

                  {formData.profilePicturePreview && (
                    <button
                      type="button"
                      onClick={handleRemoveProfilePicture}
                      disabled={isLoading}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Upload Button */}
                <div className="flex flex-col items-center space-y-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/gif,image/webp"
                    onChange={handleProfilePictureChange}
                    disabled={isLoading}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isLoading}
                    className="bg-gradient-to-r from-pink-500 to-rose-500 text-white px-6 py-3 rounded-xl font-semibold flex items-center hover:shadow-lg transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    <Upload className="w-5 h-5 mr-2" />
                    {formData.profilePicturePreview
                      ? "Change Picture"
                      : "Upload Picture"}
                  </button>
                  <p className="text-sm text-gray-500 text-center">
                    Supported formats: JPEG, PNG, GIF, WebP
                    <br />
                    Maximum size: 5MB
                  </p>
                </div>

                {errors.profilePicture && (
                  <p className="text-red-500 text-sm flex items-center">
                    <div className="w-1 h-1 bg-red-500 rounded-full mr-2"></div>
                    {errors.profilePicture}
                  </p>
                )}
              </div>
            </div>

            {/* Basic Information */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/50">
              <h3 className="text-xl font-bold text-gray-900 flex items-center mb-6">
                <div className="bg-gradient-to-r from-purple-500 to-indigo-500 rounded-xl p-2 mr-3">
                  <User className="w-5 h-5 text-white" />
                </div>
                Basic Information
              </h3>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) =>
                      handleInputChange("fullName", e.target.value)
                    }
                    disabled={isLoading}
                    className={`w-full px-4 py-3 bg-white/80 backdrop-blur-sm border-2 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${
                      errors.fullName
                        ? "border-red-400 bg-red-50/50"
                        : "border-gray-200 hover:border-purple-300"
                    }`}
                    placeholder="Enter your full name"
                    maxLength={50}
                  />
                  {errors.fullName && (
                    <p className="text-red-500 text-sm mt-2 flex items-center">
                      <div className="w-1 h-1 bg-red-500 rounded-full mr-2"></div>
                      {errors.fullName}
                    </p>
                  )}
                </div>

                <div>
                  <label className=" text-sm font-semibold text-gray-700 mb-3 flex items-center">
                    <Phone className="w-4 h-4 mr-2 text-green-600" />
                    Mobile Number
                  </label>
                  <input
                    type="tel"
                    value={formData.mobile}
                    onChange={(e) =>
                      handleInputChange("mobile", e.target.value)
                    }
                    disabled={isLoading}
                    className={`w-full px-4 py-3 bg-white/80 backdrop-blur-sm border-2 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${
                      errors.mobile
                        ? "border-red-400 bg-red-50/50"
                        : "border-gray-200 hover:border-purple-300"
                    }`}
                    placeholder="+1 234 567 8900"
                  />
                  {errors.mobile && (
                    <p className="text-red-500 text-sm mt-2 flex items-center">
                      <div className="w-1 h-1 bg-red-500 rounded-full mr-2"></div>
                      {errors.mobile}
                    </p>
                  )}
                </div>

                <div>
                  <label className=" text-sm font-semibold text-gray-700 mb-3 flex items-center">
                    <Calendar className="w-4 h-4 mr-2 text-blue-600" />
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) =>
                      handleInputChange("dateOfBirth", e.target.value)
                    }
                    disabled={isLoading}
                    className={`w-full px-4 py-3 bg-white/80 backdrop-blur-sm border-2 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 hover:border-purple-300 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${
                      errors.dateOfBirth
                        ? "border-red-400 bg-red-50/50"
                        : "border-gray-200"
                    }`}
                  />
                  {errors.dateOfBirth && (
                    <p className="text-red-500 text-sm mt-2 flex items-center">
                      <div className="w-1 h-1 bg-red-500 rounded-full mr-2"></div>
                      {errors.dateOfBirth}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Gender
                  </label>
                  <select
                    value={formData.gender}
                    onChange={(e) =>
                      handleInputChange("gender", e.target.value)
                    }
                    disabled={isLoading}
                    className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 hover:border-purple-300 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="non-binary">Non-binary</option>
                    <option value="prefer-not-to-say">Prefer not to say</option>
                  </select>
                </div>
              </div>

              <div className="mt-6">
                <label className=" text-sm font-semibold text-gray-700 mb-3 flex items-center">
                  <FileText className="w-4 h-4 mr-2 text-indigo-600" />
                  Bio
                </label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => handleInputChange("bio", e.target.value)}
                  disabled={isLoading}
                  className={`w-full px-4 py-3 bg-white/80 backdrop-blur-sm border-2 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300 resize-none disabled:opacity-50 disabled:cursor-not-allowed ${
                    errors.bio
                      ? "border-red-400 bg-red-50/50"
                      : "border-gray-200 hover:border-purple-300"
                  }`}
                  placeholder="Tell us about yourself..."
                  rows={4}
                  maxLength={500}
                />
                <div className="flex justify-between items-center mt-2">
                  {errors.bio && (
                    <p className="text-red-500 text-sm flex items-center">
                      <div className="w-1 h-1 bg-red-500 rounded-full mr-2"></div>
                      {errors.bio}
                    </p>
                  )}
                  <p className="text-gray-500 text-sm ml-auto">
                    {formData.bio.length}/500 characters
                  </p>
                </div>
              </div>
            </div>

            {/* Languages */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/50 relative z-10">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900 flex items-center">
                  <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl p-2 mr-3">
                    <Languages className="w-5 h-5 text-white" />
                  </div>
                  Languages
                </h3>
                <button
                  type="button"
                  onClick={addLanguage}
                  disabled={isLoading}
                  className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-xl text-sm font-semibold flex items-center hover:shadow-lg transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Language
                </button>
              </div>

              <div className="space-y-4">
                {formData.languages.map((lang, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl relative z-20"
                  >
                    <div className="flex-1">
                      <LanguageAutocomplete
                        value={lang.language}
                        onChange={(value) => updateLanguage(index, "language", value)}
                        disabled={isLoading}
                        error={errors[`language_${index}`]}
                        placeholder="Search for a language..."
                        index={index}
                      />
                      {errors[`language_${index}`] && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors[`language_${index}`]}
                        </p>
                      )}
                    </div>
                    <div className="w-40">
                      <select
                        value={lang.proficiency}
                        onChange={(e) =>
                          updateLanguage(index, "proficiency", e.target.value)
                        }
                        disabled={isLoading}
                        className="w-full px-4 py-2 bg-white/80 backdrop-blur-sm border-2 border-gray-200 rounded-lg focus:ring-4 focus:ring-green-500/20 focus:border-green-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <option value="beginner">Beginner</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="advanced">Advanced</option>
                        <option value="native">Native</option>
                      </select>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeLanguage(index)}
                      disabled={isLoading}
                      className="text-red-500 hover:text-red-700 hover:bg-red-100 p-2 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Minus className="w-5 h-5" />
                    </button>
                  </div>
                ))}

                {formData.languages.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Languages className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p>No languages added yet</p>
                    <p className="text-sm">
                      Click "Add Language" to get started
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Social Links */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/50">
              <h3 className="text-xl font-bold text-gray-900 flex items-center mb-6">
                <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl p-2 mr-3">
                  <Globe className="w-5 h-5 text-white" />
                </div>
                Social Links
              </h3>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {Object.entries(formData.socialLinks).map(([platform, url]) => (
                  <div key={platform}>
                    <label className="block text-sm font-semibold text-gray-700 mb-3 capitalize">
                      {platform}
                    </label>
                    <input
                      type="url"
                      value={url}
                      onChange={(e) =>
                        handleSocialLinkChange(platform, e.target.value)
                      }
                      disabled={isLoading}
                      className={`w-full px-4 py-3 bg-white/80 backdrop-blur-sm border-2 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 hover:border-blue-300 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${
                        errors[`socialLink_${platform}`]
                          ? "border-red-400 bg-red-50/50"
                          : "border-gray-200"
                      }`}
                      placeholder={`https://${platform}.com/username`}
                    />
                    {errors[`socialLink_${platform}`] && (
                      <p className="text-red-500 text-sm mt-2 flex items-center">
                        <div className="w-1 h-1 bg-red-500 rounded-full mr-2"></div>
                        {errors[`socialLink_${platform}`]}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Future Destinations */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/50">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900 flex items-center">
                  <div className="bg-gradient-to-r from-purple-500 to-indigo-500 rounded-xl p-2 mr-3">
                    <MapPin className="w-5 h-5 text-white" />
                  </div>
                  Future Destinations
                </h3>
                <button
                  type="button"
                  onClick={addDestination}
                  disabled={isLoading}
                  className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-4 py-2 rounded-xl text-sm font-semibold flex items-center hover:shadow-lg transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Destination
                </button>
              </div>

              <div className="space-y-6">
                {formData.futureDestinations.map((dest, index) => (
                  <div
                    key={index}
                    className="p-6 bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-xl"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-bold text-gray-900 text-lg">
                        Destination {index + 1}
                      </h4>
                      <button
                        type="button"
                        onClick={() => removeDestination(index)}
                        disabled={isLoading}
                        className="text-red-500 hover:text-red-700 hover:bg-red-100 p-2 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Minus className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <div className="lg:col-span-2">
                        <input
                          type="text"
                          value={dest.destination}
                          onChange={(e) =>
                            updateDestination(
                              index,
                              "destination",
                              e.target.value
                            )
                          }
                          disabled={isLoading}
                          className={`w-full px-4 py-3 bg-white/80 backdrop-blur-sm border-2 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${
                            errors[`destination_${index}`]
                              ? "border-red-400"
                              : "border-gray-200"
                          }`}
                          placeholder="Destination name"
                          maxLength={100}
                        />
                        {errors[`destination_${index}`] && (
                          <p className="text-red-500 text-sm mt-2">
                            {errors[`destination_${index}`]}
                          </p>
                        )}
                      </div>

                      <div>
                        <input
                          type="date"
                          value={dest.plannedDate}
                          onChange={(e) =>
                            updateDestination(
                              index,
                              "plannedDate",
                              e.target.value
                            )
                          }
                          disabled={isLoading}
                          className={`w-full px-4 py-3 bg-white/80 backdrop-blur-sm border-2 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${
                            errors[`plannedDate_${index}`]
                              ? "border-red-400"
                              : "border-gray-200"
                          }`}
                          placeholder="Planned date"
                        />
                        {errors[`plannedDate_${index}`] && (
                          <p className="text-red-500 text-sm mt-2">
                            {errors[`plannedDate_${index}`]}
                          </p>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <input
                            type="number"
                            step="any"
                            value={dest.lat}
                            onChange={(e) =>
                              updateDestination(index, "lat", e.target.value)
                            }
                            disabled={isLoading}
                            className={`w-full px-4 py-3 bg-white/80 backdrop-blur-sm border-2 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${
                              errors[`lat_${index}`]
                                ? "border-red-400"
                                : "border-gray-200"
                            }`}
                            placeholder="Latitude"
                            min="-90"
                            max="90"
                          />
                          {errors[`lat_${index}`] && (
                            <p className="text-red-500 text-sm mt-1">
                              {errors[`lat_${index}`]}
                            </p>
                          )}
                        </div>
                        <div>
                          <input
                            type="number"
                            step="any"
                            value={dest.lng}
                            onChange={(e) =>
                              updateDestination(index, "lng", e.target.value)
                            }
                            disabled={isLoading}
                            className={`w-full px-4 py-3 bg-white/80 backdrop-blur-sm border-2 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${
                              errors[`lng_${index}`]
                                ? "border-red-400"
                                : "border-gray-200"
                            }`}
                            placeholder="Longitude"
                            min="-180"
                            max="180"
                          />
                          {errors[`lng_${index}`] && (
                            <p className="text-red-500 text-sm mt-1">
                              {errors[`lng_${index}`]}
                            </p>
                          )}
                        </div>
                      </div>
                      {errors[`coordinates_${index}`] && (
                        <p className="text-red-500 text-sm lg:col-span-2">
                          {errors[`coordinates_${index}`]}
                        </p>
                      )}
                    </div>
                  </div>
                ))}

                {formData.futureDestinations.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <MapPin className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p>No destinations added yet</p>
                    <p className="text-sm">
                      Click "Add Destination" to plan your next adventure
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Footer */}
        <div className="bg-gradient-to-r from-gray-50 to-white backdrop-blur-sm px-8 py-6 border-t border-gray-200/50">
          <div className="flex items-center justify-end">
            <div className="flex space-x-4">
              <button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                className="px-6 py-3 text-gray-700 bg-white/80 backdrop-blur-sm border-2 border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className="px-8 py-3 bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 text-white rounded-xl font-semibold hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                    Saving Changes...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5 mr-3" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfileModal;