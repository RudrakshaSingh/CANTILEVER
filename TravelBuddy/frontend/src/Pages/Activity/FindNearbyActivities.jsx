import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import {
  GoogleMap,
  useJsApiLoader,
  Marker,
  Autocomplete,
} from "@react-google-maps/api";
import {
  Calendar,
  MapPin,
  Users,
  AlertCircle,
  Search,
  Navigation,
  Plus,
  Loader2,
} from "lucide-react";
import {
  findNearbyActivities,
  joinActivity,
  clearError,
} from "../../Redux/Slices/ActivitySlice";

const containerStyle = {
  width: "100%",
  height: "100%",
};

const libraries = ["places"];

const FindNearbyActivities = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const { nearbyActivities, loading, error } = useSelector(
    (state) => state.activity
  );

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  const [searchType, setSearchType] = useState("userLocation");
  const [formData, setFormData] = useState({
    lat: "",
    lng: "",
    radius: "", // Now in kilometers
    name: "",
  });
  const [errors, setErrors] = useState({});
  const [fetchAttempted, setFetchAttempted] = useState(false);
  const [center, setCenter] = useState({ lat: 28.6139, lng: 77.209 }); // Default: Delhi
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [showList, setShowList] = useState(false);
  const autocompleteRef = useRef(null);

  // Clear Redux error when form data changes
  useEffect(() => {
    if (
      error &&
      (formData.lat || formData.lng || formData.radius || formData.name)
    ) {
      dispatch(clearError());
    }
  }, [formData, error, dispatch]);

  // Get user location for userLocation search
  const handleGetUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setFormData((prev) => ({
          ...prev,
          lat: position.coords.latitude.toString(),
          lng: position.coords.longitude.toString(),
          radius: formData.radius || "5", // Default to 5 km
        }));
        setCenter({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setErrors((prev) => ({ ...prev, lat: "", lng: "" }));
      });
    } else {
      toast.error("Geolocation is not supported by your browser.");
    }
  };

  // Handle place selection from Autocomplete
  const handlePlaceSelect = () => {
    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace();
      if (place.geometry) {
        const latitude = place.geometry.location.lat();
        const longitude = place.geometry.location.lng();
        setFormData((prev) => ({
          ...prev,
          lat: latitude.toString(),
          lng: longitude.toString(),
        }));
        setCenter({ lat: latitude, lng: longitude });
        setErrors((prev) => ({ ...prev, lat: "", lng: "" }));
      } else {
        toast.error("Please select a valid address from the suggestions.");
      }
    }
  };

  // Reset search when switching search type
  const handleSearchTypeChange = (type) => {
    setSearchType(type);
    setFormData({ lat: "", lng: "", radius: "", name: "" });
    setErrors({});
    setSelectedActivity(null);
    setCenter({ lat: 28.6139, lng: 77.209 });
    setShowList(true);
  };

  // Validate form inputs
  const validateForm = () => {
    const newErrors = {};

    if (searchType !== "activityName") {
      if (!formData.lat || isNaN(formData.lat)) {
        newErrors.lat = "Valid latitude is required";
      } else if (
        parseFloat(formData.lat) < -90 ||
        parseFloat(formData.lat) > 90
      ) {
        newErrors.lat = "Latitude must be between -90 and 90";
      }

      if (!formData.lng || isNaN(formData.lng)) {
        newErrors.lng = "Valid longitude is required";
      } else if (
        parseFloat(formData.lng) < -180 ||
        parseFloat(formData.lng) > 180
      ) {
        newErrors.lng = "Longitude must be between -180 and 180";
      }

      if (
        !formData.radius ||
        isNaN(formData.radius) ||
        parseFloat(formData.radius) <= 0
      ) {
        newErrors.radius = "Radius must be greater than 0 km";
      } else if (parseFloat(formData.radius) > 20000) {
        newErrors.radius = "Radius cannot exceed 20,000 km";
      }
    } else {
      if (!formData.name.trim()) {
        newErrors.name = "Activity name is required";
      } else if (formData.name.trim().length < 3) {
        newErrors.name = "Activity name must be at least 3 characters";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle input changes
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  // Handle search submission
  const handleSearch = async (e) => {
    e.preventDefault();
    setFetchAttempted(true);

    if (!user) {
      toast.error("You must be logged in to search for activities");
      return;
    }

    if (!validateForm()) {
      toast.error("Please fix the errors before searching");
      return;
    }

    const payload = {
      firebaseUid: user.firebaseUid,
      searchType,
      ...(searchType !== "activityName" && {
        lat: parseFloat(formData.lat),
        lng: parseFloat(formData.lng),
        radius: parseFloat(formData.radius) * 1000, // Convert km to meters
      }),
      ...(searchType === "activityName" && { name: formData.name.trim() }),
    };

    await dispatch(findNearbyActivities(payload)).unwrap();
    setSelectedActivity(null);
    setShowList(true);
  };

  // Handle joining an activity
  const handleJoinActivity = async (activityId) => {
    await dispatch(joinActivity({ activityId })).unwrap();
    toast.success("Successfully joined the activity!", { duration: 3000 });
  };

  // Format date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Loading state
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white/80 backdrop-blur-md rounded-2xl p-10 shadow-2xl text-center max-w-md">
          <Loader2 className="h-12 w-12 animate-spin text-purple-600 mx-auto mb-4" />
          <p className="text-xl font-semibold text-gray-800">Loading Map...</p>
          <p className="text-sm text-gray-500 mt-2">
            Please wait while we prepare the activities map
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-blue-100 to-indigo-100 font-sans">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-700 via-indigo-600 to-blue-600 text-white rounded-2xl p-6 sm:p-8 mb-8 shadow-xl sticky top-0 z-20 max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="bg-white/10 backdrop-blur-md rounded-full p-3">
              <Search className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
                Find Nearby Activities
              </h1>
              <p className="text-indigo-100 text-base sm:text-lg mt-1">
                Discover activities near you ({nearbyActivities?.length || 0}{" "}
                found)
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowList(!showList)}
            className="sm:hidden bg-indigo-500 text-white p-2 rounded-full hover:bg-indigo-600 transition-all duration-200"
            aria-label={showList ? "Hide activity list" : "Show activity list"}
          >
            <Users className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Search Bar */}
        <div className="bg-white/90 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-gray-100 mb-8">
          <form
            onSubmit={handleSearch}
            className="flex flex-col sm:flex-row gap-4"
          >
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => handleSearchTypeChange("userLocation")}
                className={`px-4 py-2 rounded-lg font-medium text-sm sm:text-base transition-all duration-300 ${
                  searchType === "userLocation"
                    ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md"
                    : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                }`}
                aria-label="Search by my location"
              >
                My Location
              </button>
              <button
                type="button"
                onClick={() => handleSearchTypeChange("placeLocation")}
                className={`px-4 py-2 rounded-lg font-medium text-sm sm:text-base transition-all duration-300 ${
                  searchType === "placeLocation"
                    ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md"
                    : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                }`}
                aria-label="Search by place"
              >
                Place
              </button>
              <button
                type="button"
                onClick={() => handleSearchTypeChange("activityName")}
                className={`px-4 py-2 rounded-lg font-medium text-sm sm:text-base transition-all duration-300 ${
                  searchType === "activityName"
                    ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md"
                    : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                }`}
                aria-label="Search by activity name"
              >
                Activity Name
              </button>
            </div>
            <div className="flex-1 relative">
              {searchType === "activityName" ? (
                <div className="relative">
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="Enter activity name (e.g., 'Yoga Session')"
                    className={`w-full pl-10 pr-4 py-3 bg-white border-2 rounded-lg focus:ring-2 focus:ring-purple-300 focus:border-purple-500 transition-all duration-300 text-gray-800 placeholder-gray-400 ${
                      errors.name
                        ? "border-red-400 bg-red-50"
                        : "border-gray-200 hover:border-purple-300"
                    }`}
                    aria-label="Activity name"
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                </div>
              ) : searchType === "placeLocation" ? (
                <div className="relative">
                  <Autocomplete
                    onLoad={(autocomplete) => {
                      autocompleteRef.current = autocomplete;
                    }}
                    onPlaceChanged={handlePlaceSelect}
                  >
                    <input
                      type="text"
                      onChange={(e) => {
                        const [lat, lng] = e.target.value
                          .split(",")
                          .map((v) => v.trim());
                        handleInputChange("lat", lat || "");
                        handleInputChange("lng", lng || "");
                      }}
                      placeholder="Enter place address"
                      className={`w-full pl-10 pr-4 py-3 bg-white border-2 rounded-lg focus:ring-2 focus:ring-purple-300 focus:border-purple-500 transition-all duration-300 text-gray-800 placeholder-gray-400 ${
                        errors.lat || errors.lng
                          ? "border-red-400 bg-red-50"
                          : "border-gray-200 hover:border-purple-300"
                      }`}
                      aria-label="Place address"
                    />
                  </Autocomplete>
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <div className="relative flex-1">
                    <input
                      type="number"
                      value={formData.lat}
                      onChange={(e) => handleInputChange("lat", e.target.value)}
                      placeholder="Latitude (e.g., 28.6139)"
                      className={`w-full pl-10 pr-4 py-3 bg-white border-2 rounded-lg focus:ring-2 focus:ring-purple-300 focus:border-purple-500 transition-all duration-300 text-gray-800 placeholder-gray-400 ${
                        errors.lat
                          ? "border-red-400 bg-red-50"
                          : "border-gray-200 hover:border-purple-300"
                      }`}
                      step="any"
                      aria-label="Latitude"
                    />
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  </div>
                  <div className="relative flex-1">
                    <input
                      type="number"
                      value={formData.lng}
                      onChange={(e) => handleInputChange("lng", e.target.value)}
                      placeholder="Longitude (e.g., 77.2090)"
                      className={`w-full pl-10 pr-4 py-3 bg-white border-2 rounded-lg focus:ring-2 focus:ring-purple-300 focus:border-purple-500 transition-all duration-300 text-gray-800 placeholder-gray-400 ${
                        errors.lng
                          ? "border-red-400 bg-red-50"
                          : "border-gray-200 hover:border-purple-300"
                      }`}
                      step="any"
                      aria-label="Longitude"
                    />
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  </div>
                  <button
                    type="button"
                    onClick={handleGetUserLocation}
                    className="px-4 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-all duration-300 flex items-center"
                    aria-label="Use current location"
                  >
                    <Navigation className="h-5 w-5 mr-2" />
                    Current Location
                  </button>
                </div>
              )}
            </div>
            {searchType !== "activityName" && (
              <div className="relative w-40">
                <input
                  type="number"
                  value={formData.radius}
                  onChange={(e) => handleInputChange("radius", e.target.value)}
                  placeholder="Radius (km)"
                  min="0.1"
                  step="0.1"
                  className={`w-full pl-10 pr-4 py-3 bg-white border-2 rounded-lg focus:ring-2 focus:ring-purple-300 focus:border-purple-500 transition-all duration-300 text-gray-800 placeholder-gray-400 ${
                    errors.radius
                      ? "border-red-400 bg-red-50"
                      : "border-gray-200 hover:border-purple-300"
                  }`}
                  aria-label="Radius in kilometers"
                />
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
            )}
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg font-medium hover:bg-purple-700 transform hover:scale-105 transition-all duration-300 flex items-center disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
              aria-label="Search activities"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin mr-2" />
                  Searching...
                </>
              ) : (
                <>
                  <Search className="h-5 w-5 mr-2" />
                  Search
                </>
              )}
            </button>
          </form>
          {Object.values(errors).some((error) => error) && (
            <div className="mt-4 space-y-2">
              {Object.entries(errors).map(
                ([key, value]) =>
                  value && (
                    <p
                      key={key}
                      className="text-red-600 text-sm flex items-center"
                    >
                      <AlertCircle className="h-4 w-4 mr-2" />
                      {value}
                    </p>
                  )
              )}
            </div>
          )}
        </div>

        {/* Error Display */}
        {error && fetchAttempted && (
          <div className="bg-red-50/80 backdrop-blur-sm border-l-4 border-red-500 p-4 rounded-lg mb-8 shadow-md">
            <div className="flex items-center">
              <AlertCircle className="h-6 w-6 text-red-500" />
              <p className="ml-3 text-base text-red-700">{error}</p>
            </div>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-6 min-h-[500px]">
          {/* Activities List */}
          <div
            className={`${
              showList ? "block" : "hidden"
            } lg:block lg:w-96 bg-white/90 backdrop-blur-md rounded-2xl shadow-lg border border-gray-100 overflow-y-auto max-h-[600px]`}
          >
            <div className="p-6 space-y-4">
              <h2 className="text-2xl font-semibold text-gray-800 flex items-center mb-4">
                <div className="bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full p-2 mr-3">
                  <Users className="w-6 h-6 text-white" />
                </div>
                Activities
              </h2>
              {loading && fetchAttempted ? (
                <div className="text-center py-8">
                  <Loader2 className="h-10 w-10 animate-spin text-purple-600 mx-auto mb-3" />
                  <p className="text-gray-600">Loading activities...</p>
                </div>
              ) : nearbyActivities?.length > 0 ? (
                nearbyActivities.map((activity) => (
                  <div
                    key={activity._id}
                    onClick={() => {
                      setSelectedActivity(activity);
                      setCenter({
                        lat: activity.location.coordinates[1],
                        lng: activity.location.coordinates[0],
                      });
                    }}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-300 ${
                      selectedActivity?._id === activity._id
                        ? "border-purple-500 bg-purple-50 shadow-md"
                        : "border-gray-100 hover:border-purple-400 hover:bg-purple-50/50"
                    }`}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        setSelectedActivity(activity);
                        setCenter({
                          lat: activity.location.coordinates[1],
                          lng: activity.location.coordinates[0],
                        });
                      }
                    }}
                  >
                    <div className="space-y-3">
                      <p className="font-semibold text-gray-800 truncate">
                        {activity.title}
                      </p>
                      <div className="flex items-center space-x-2 text-gray-600">
                        <MapPin className="h-4 w-4 text-red-500" />
                        <p className="text-sm truncate">
                          {activity.location.address}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-600">
                        <Calendar className="h-4 w-4 text-blue-500" />
                        <p className="text-sm">
                          {formatDate(activity.startDate)}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-600">
                        <Users className="h-4 w-4 text-green-500" />
                        <p className="text-sm">
                          {activity.participantsList.length}/
                          {activity.maxParticipants} participants
                        </p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleJoinActivity(activity._id);
                        }}
                        className="w-full px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg font-medium hover:bg-green-600 transform hover:scale-105 transition-all duration-300 flex items-center justify-center"
                        disabled={loading}
                        aria-label={`Join ${activity.title}`}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Join Activity
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-10">
                  <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-lg font-medium text-gray-600">
                    No activities found
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    Try adjusting your search criteria
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Map Container */}
          <div className="flex-1">
            <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-lg overflow-hidden h-[600px]">
              <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Navigation className="h-5 w-5" />
                    <span className="font-medium text-lg">
                      Activity Locations
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 text-indigo-100">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-sm">Real-time Updates</span>
                  </div>
                </div>
              </div>
              <div className="h-[548px]">
                <GoogleMap
                  mapContainerStyle={containerStyle}
                  center={center}
                  zoom={searchType === "activityName" ? 5 : 10}
                  options={{
                    zoomControl: true,
                    streetViewControl: false,
                    mapTypeControl: false,
                    fullscreenControl: true,
                    styles: [
                      {
                        featureType: "poi",
                        elementType: "labels",
                        stylers: [{ visibility: "simplified" }],
                      },
                    ],
                  }}
                >
                  {nearbyActivities?.map((activity) => (
                    <Marker
                      key={activity._id}
                      position={{
                        lat: activity.location.coordinates[1],
                        lng: activity.location.coordinates[0],
                      }}
                      title={activity.title}
                      icon={{
                        path: window.google.maps.SymbolPath.CIRCLE,
                        fillColor:
                          selectedActivity?._id === activity._id
                            ? "#4B0082"
                            : "#FF4400",
                        fillOpacity: 1,
                        strokeWeight: 2,
                        strokeColor: "#FFFFFF",
                        scale: 10,
                      }}
                      onClick={() => {
                        setSelectedActivity(activity);
                        setCenter({
                          lat: activity.location.coordinates[1],
                          lng: activity.location.coordinates[0],
                        });
                        setShowList(true);
                      }}
                    />
                  ))}
                </GoogleMap>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FindNearbyActivities;
