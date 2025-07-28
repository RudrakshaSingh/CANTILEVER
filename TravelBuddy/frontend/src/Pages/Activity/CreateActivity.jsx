import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { LoadScript, Autocomplete } from '@react-google-maps/api';
import {
  Calendar,
  MapPin,
  Users,
  Clock,
  FileText,
  Save,
  AlertCircle,
  Plus,
  Eye,
  EyeOff,
} from "lucide-react";
import { createActivity } from "../../Redux/Slices/ActivitySlice";

const libraries = ['places'];

const CreateActivity = () => {
  const dispatch = useDispatch();
  const { loading: isCreating, error: reduxError } = useSelector(
    (state) => state.activity
  );
  const { user } = useSelector((state) => state.user);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startDate: "",
    time: "",
    location: {
      address: "",
      coordinates: [0, 0],
    },
    maxParticipants: "",
    visibility: "Public",
  });

  const [errors, setErrors] = useState({});
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const autocompleteRef = useRef(null);

  useEffect(() => {
    if (
      reduxError &&
      Object.keys(formData).some((key) =>
        typeof formData[key] === "string" ? formData[key].trim() : true
      )
    ) {
      // Clear Redux error when user makes changes
    }
  }, [formData, reduxError]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Activity title is required";
    } else if (formData.title.trim().length < 3) {
      newErrors.title = "Title must be at least 3 characters";
    } else if (formData.title.length > 100) {
      newErrors.title = "Title must be 100 characters or less";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    } else if (formData.description.trim().length < 10) {
      newErrors.description = "Description must be at least 10 characters";
    } else if (formData.description.length > 1000) {
      newErrors.description = "Description must be 1000 characters or less";
    }

    if (!formData.startDate) {
      newErrors.startDate = "Start date is required";
    } else {
      const selectedDate = new Date(formData.startDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (selectedDate < today) {
        newErrors.startDate = "Start date cannot be in the past or today itself";
      }
    }

    if (!formData.time) {
      newErrors.time = "Time is required";
    }

    if (!formData.location.address.trim()) {
      newErrors.location = "Location address is required";
    } else if (formData.location.address.length > 200) {
      newErrors.location = "Location address must be 200 characters or less";
    }

    const [longitude, latitude] = formData.location.coordinates;
    if (longitude === 0 && latitude === 0) {
      newErrors.location = "Please select a valid address from suggestions";
    }

    if (!formData.maxParticipants) {
      newErrors.maxParticipants = "Maximum participants is required";
    } else {
      const maxPart = parseInt(formData.maxParticipants);
      if (isNaN(maxPart) || maxPart < 2) {
        newErrors.maxParticipants = "Must be at least 2 participants";
      } else if (maxPart > 1000) {
        newErrors.maxParticipants = "Cannot exceed 1000 participants";
      }
    }

    if (!["Public", "Private"].includes(formData.visibility)) {
      newErrors.visibility = "Please select a valid visibility option";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    if (field.includes(".")) {
      const [parent, child] = field.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    }

    const errorKey = field.includes(".") ? field.split(".")[0] : field;
    if (errors[errorKey]) {
      setErrors((prev) => ({
        ...prev,
        [errorKey]: "",
      }));
    }
  };

  const handlePlaceSelect = () => {
    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace();
      if (place.geometry) {
        const address = place.formatted_address;
        const latitude = place.geometry.location.lat();
        const longitude = place.geometry.location.lng();

        setFormData((prev) => ({
          ...prev,
          location: {
            address: address,
            coordinates: [longitude, latitude],
          },
        }));

        if (errors.location) {
          setErrors((prev) => ({
            ...prev,
            location: "",
          }));
        }
      } else {
        toast.error("Please select a valid address from the suggestions");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitAttempted(true);

    if (!validateForm()) {
      toast.error("Please fix the errors before submitting");
      return;
    }

    if (!user) {
      toast.error("You must be logged in to create an activity");
      return;
    }

    const activityData = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      startDate: formData.startDate,
      time: formData.time,
      location: {
        address: formData.location.address.trim(),
        coordinates: formData.location.coordinates,
      },
      maxParticipants: parseInt(formData.maxParticipants),
      visibility: formData.visibility,
    };

    const result = await dispatch(createActivity({ activityData }));

    if (createActivity.fulfilled.match(result)) {
      resetForm();
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      startDate: "",
      time: "",
      location: {
        address: "",
        coordinates: [0, 0],
      },
      maxParticipants: "",
      visibility: "Public",
    });
    setErrors({});
    setSubmitAttempted(false);
  };

  return (
    <LoadScript
      googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
      libraries={libraries}
    >
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 text-white rounded-3xl p-8 mb-8 shadow-2xl">
            <div className="flex items-center space-x-4">
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4">
                <Plus className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-4xl font-bold">Create New Activity</h1>
                <p className="text-purple-100 text-lg mt-2">
                  Plan and share your next adventure
                </p>
              </div>
            </div>
          </div>

          {reduxError && submitAttempted && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-lg mb-6">
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

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-gray-200/50">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center mb-6">
                <div className="bg-gradient-to-r from-purple-500 to-indigo-500 rounded-xl p-3 mr-4">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                Activity Details
              </h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Activity Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    disabled={isCreating}
                    className={`w-full px-4 py-4 bg-white/80 backdrop-blur-sm border-2 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${
                      errors.title
                        ? "border-red-400 bg-red-50/50"
                        : "border-gray-200 hover:border-purple-300"
                    }`}
                    placeholder="Enter activity title (e.g., 'Beach Volleyball Game')"
                    maxLength={100}
                  />
                  {errors.title && (
                    <p className="text-red-500 text-sm mt-2 flex items-center">
                      <div className="w-1 h-1 bg-red-500 rounded-full mr-2"></div>
                      {errors.title}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Description *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      handleInputChange("description", e.target.value)
                    }
                    disabled={isCreating}
                    className={`w-full px-4 py-4 bg-white/80 backdrop-blur-sm border-2 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300 resize-none disabled:opacity-50 disabled:cursor-not-allowed ${
                      errors.description
                        ? "border-red-400 bg-red-50/50"
                        : "border-gray-200 hover:border-purple-300"
                    }`}
                    placeholder="Describe your activity, what participants should expect, what to bring, etc..."
                    rows={5}
                    maxLength={1000}
                  />
                  <div className="flex justify-between items-center mt-2">
                    {errors.description && (
                      <p className="text-red-500 text-sm flex items-center">
                        <div className="w-1 h-1 bg-red-500 rounded-full mr-2"></div>
                        {errors.description}
                      </p>
                    )}
                    <p className="text-gray-500 text-sm ml-auto">
                      {formData.description.length}/1000 characters
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-gray-200/50">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center mb-6">
                <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl p-3 mr-4">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                Schedule & Capacity
              </h2>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div>
                  <label className=" text-sm font-semibold text-gray-700 mb-3 flex items-center">
                    <Calendar className="w-4 h-4 mr-2 text-blue-600" />
                    Start Date *
                  </label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) =>
                      handleInputChange("startDate", e.target.value)
                    }
                    disabled={isCreating}
                    className={`w-full px-4 py-4 bg-white/80 backdrop-blur-sm border-2 rounded-xl focus:ring-4 focus:ring-green-500/20 focus:border-green-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${
                      errors.startDate
                        ? "border-red-400 bg-red-50/50"
                        : "border-gray-200 hover:border-green-300"
                    }`}
                  />
                  {errors.startDate && (
                    <p className="text-red-500 text-sm mt-2 flex items-center">
                      <div className="w-1 h-1 bg-red-500 rounded-full mr-2"></div>
                      {errors.startDate}
                    </p>
                  )}
                </div>

                <div>
                  <label className=" text-sm font-semibold text-gray-700 mb-3 flex items-center">
                    <Clock className="w-4 h-4 mr-2 text-orange-600" />
                    Time *
                  </label>
                  <input
                    type="time"
                    value={formData.time}
                    onChange={(e) => handleInputChange("time", e.target.value)}
                    disabled={isCreating}
                    className={`w-full px-4 py-4 bg-white/80 backdrop-blur-sm border-2 rounded-xl focus:ring-4 focus:ring-green-500/20 focus:border-green-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${
                      errors.time
                        ? "border-red-400 bg-red-50/50"
                        : "border-gray-200 hover:border-green-300"
                    }`}
                  />
                  {errors.time && (
                    <p className="text-red-500 text-sm mt-2 flex items-center">
                      <div className="w-1 h-1 bg-red-500 rounded-full mr-2"></div>
                      {errors.time}
                    </p>
                  )}
                </div>

                <div>
                  <label className=" text-sm font-semibold text-gray-700 mb-3 flex items-center">
                    <Users className="w-4 h-4 mr-2 text-purple-600" />
                    Max Participants *
                  </label>
                  <input
                    type="number"
                    value={formData.maxParticipants}
                    onChange={(e) =>
                      handleInputChange("maxParticipants", e.target.value)
                    }
                    disabled={isCreating}
                    min="2"
                    max="1000"
                    className={`w-full px-4 py-4 bg-white/80 backdrop-blur-sm border-2 rounded-xl focus:ring-4 focus:ring-green-500/20 focus:border-green-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${
                      errors.maxParticipants
                        ? "border-red-400 bg-red-50/50"
                        : "border-gray-200 hover:border-green-300"
                    }`}
                    placeholder="e.g., 10"
                  />
                  {errors.maxParticipants && (
                    <p className="text-red-500 text-sm mt-2 flex items-center">
                      <div className="w-1 h-1 bg-red-500 rounded-full mr-2"></div>
                      {errors.maxParticipants}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-gray-200/50">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center mb-6">
                <div className="bg-gradient-to-r from-red-500 to-pink-500 rounded-xl p-3 mr-4">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                Location Details
              </h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Address *
                  </label>
                  <Autocomplete
                    onLoad={(autocomplete) => {
                      autocompleteRef.current = autocomplete;
                    }}
                    onPlaceChanged={handlePlaceSelect}
                  >
                    <input
                      type="text"
                      value={formData.location.address}
                      onChange={(e) =>
                        handleInputChange("location.address", e.target.value)
                      }
                      disabled={isCreating}
                      className={`w-full px-4 py-4 bg-white/80 backdrop-blur-sm border-2 rounded-xl focus:ring-4 focus:ring-red-500/20 focus:border-red-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${
                        errors.location
                          ? "border-red-400 bg-red-50/50"
                          : "border-gray-200 hover:border-red-300"
                      }`}
                      placeholder="Enter the full address (e.g., '123 Beach Road, Santa Monica, CA 90401')"
                      maxLength={200}
                    />
                  </Autocomplete>
                  {errors.location && (
                    <p className="text-red-500 text-sm mt-2 flex items-center">
                      <div className="w-1 h-1 bg-red-500 rounded-full mr-2"></div>
                      {errors.location}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-gray-200/50">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center mb-6">
                <div className="bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl p-3 mr-4">
                  {formData.visibility === "Public" ? (
                    <Eye className="w-6 h-6 text-white" />
                  ) : (
                    <EyeOff className="w-6 h-6 text-white" />
                  )}
                </div>
                Privacy Settings
              </h2>

              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="visibility"
                      value="Public"
                      checked={formData.visibility === "Public"}
                      onChange={(e) =>
                        handleInputChange("visibility", e.target.value)
                      }
                      disabled={isCreating}
                      className="w-5 h-5 text-green-600 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    <div className="ml-3">
                      <div className="flex items-center space-x-2">
                        <Eye className="w-5 h-5 text-green-600" />
                        <span className="text-lg font-semibold text-gray-900">
                          Public
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm">
                        Anyone can discover and join this activity
                      </p>
                    </div>
                  </label>
                </div>

                <div className="flex items-center space-x-4">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="visibility"
                      value="Private"
                      checked={formData.visibility === "Private"}
                      onChange={(e) =>
                        handleInputChange("visibility", e.target.value)
                      }
                      disabled={isCreating}
                      className="w-5 h-5 text-purple-600 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    <div className="ml-3">
                      <div className="flex items-center space-x-2">
                        <EyeOff className="w-5 h-5 text-purple-600" />
                        <span className="text-lg font-semibold text-gray-900">
                          Private
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm">
                        Only people you invite can join this activity
                      </p>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-gray-50 to-white backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-gray-200/50">
              <div className="flex flex-col sm:flex-row gap-4 justify-end">
                <button
                  type="button"
                  onClick={resetForm}
                  disabled={isCreating}
                  className="px-8 py-4 text-gray-700 bg-white/80 backdrop-blur-sm border-2 border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Reset Form
                </button>
                <button
                  type="submit"
                  disabled={isCreating}
                  className="px-12 py-4 bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 text-white rounded-xl font-semibold hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isCreating ? (
                    <>
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                      Creating Activity...
                    </>
                  ) : (
                    <>
                      <Save className="w-6 h-6 mr-3" />
                      Create Activity
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </LoadScript>
  );
};

export default CreateActivity;