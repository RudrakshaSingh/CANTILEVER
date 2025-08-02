import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { GoogleMap, Marker } from "@react-google-maps/api";
import {
  MapPin,
  Users,
  AlertCircle,
  Search,
  Navigation,
  Loader2,
  UserPlus,
  User,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { findNearbyPeople, clearError } from "../../Redux/Slices/UserSlice";

const containerStyle = {
  width: "100%",
  height: "100%",
};

const DiscoverOtherTravellerNearYou = () => {
  const dispatch = useDispatch();
  const { user, nearbyUsers, loading, error } = useSelector(
    (state) => state.user
  );
  const location = useLocation();

  const [searchType, setSearchType] = useState("userLocation");
  const [formData, setFormData] = useState({
    lat: "",
    lng: "",
    radius: "", // In kilometers
    name: "",
  });
  const [errors, setErrors] = useState({});
  const [fetchAttempted, setFetchAttempted] = useState(false);
  const [center, setCenter] = useState({ lat: 28.6139, lng: 77.209 }); // Default: Delhi
  const [selectedUser, setSelectedUser] = useState(null);
  const [showList, setShowList] = useState(false);
  const placeAutocompleteRef = useRef(null);

  // Scroll to top on component mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Clear Redux error when form data changes
  useEffect(() => {
    if (
      error &&
      (formData.lat || formData.lng || formData.radius || formData.name)
    ) {
      dispatch(clearError());
    }
  }, [formData, error, dispatch]);

  // Handle Google Maps PlaceAutocompleteElement
  useEffect(() => {
    if (placeAutocompleteRef.current) {
      placeAutocompleteRef.current.addEventListener("gmp-placeselect", () => {
        const place = placeAutocompleteRef.current.place;
        if (place && place.geometry) {
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
      });
    }
  }, [placeAutocompleteRef]);

  // Get user location for userLocation search
  const handleGetUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
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
        },
      );
    } else {
      toast.error("Geolocation is not supported by your browser.");
    }
  };

  // Reset search when switching search type
  const handleSearchTypeChange = (type) => {
    setSearchType(type);
    setFormData({ lat: "", lng: "", radius: "", name: "" });
    setErrors({});
    setSelectedUser(null);
    setCenter({ lat: 28.6139, lng: 77.209 });
    setShowList(true);
  };

  // Validate form inputs
  const validateForm = () => {
    const newErrors = {};

    if (searchType !== "userName") {
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
        newErrors.name = "User name is required";
      } else if (formData.name.trim().length < 3) {
        newErrors.name = "User name must be at least 3 characters";
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
      toast.error("You must be logged in to search for travelers");
      return;
    }

    if (!validateForm()) {
      toast.error("Please fix the errors before searching");
      return;
    }

    const payload = {
      firebaseUid: user.firebaseUid,
      searchType,
      ...(searchType !== "userName" && {
        lat: parseFloat(formData.lat),
        lng: parseFloat(formData.lng),
        radius: parseFloat(formData.radius) * 1000, // Convert km to meters
      }),
      ...(searchType === "userName" && { name: formData.name.trim() }),
    };

    // Log payload for debugging
    console.log("findNearbyPeople payload:", payload);

    try {
      await dispatch(findNearbyPeople(payload)).unwrap();
      setSelectedUser(null);
      setShowList(true);
    } catch (err) {
      toast.error(err.message || "Failed to search travelers");
    }
  };

  // Handle Add Friend
  const handleAddFriend = async (friendFirebaseUid) => {
    console.log(
      "handleAddFriend called with friendFirebaseUid:",
      friendFirebaseUid
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-blue-100 to-indigo-100 font-sans">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-700 via-indigo-600 to-blue-600 text-white rounded-2xl p-6 sm:p-8 mb-8 shadow-xl sticky top-0 z-20 max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="bg-white/10 backdrop-blur-md rounded-full p-3">
              <Users className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
                Discover Nearby Travelers
              </h1>
              <p className="text-indigo-100 text-base sm:text-lg mt-1">
                Find travelers near you ({nearbyUsers?.length || 0} found)
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowList(!showList)}
            className="sm:hidden bg-indigo-500 text-white p-2 rounded-full hover:bg-indigo-600 transition-all duration-200"
            aria-label={showList ? "Hide traveler list" : "Show traveler list"}
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
                onClick={() => handleSearchTypeChange("userName")}
                className={`px-4 py-2 rounded-lg font-medium text-sm sm:text-base transition-all duration-300 ${
                  searchType === "userName"
                    ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md"
                    : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                }`}
                aria-label="Search by user name"
              >
                User Name
              </button>
            </div>
            <div className="flex-1 relative">
              {searchType === "userName" ? (
                <div className="relative">
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="Enter user name (e.g., John Doe)"
                    className={`w-full pl-10 pr-4 py-3 bg-white border-2 rounded-lg focus:ring-2 focus:ring-purple-300 focus:border-purple-500 transition-all duration-300 text-gray-800 placeholder-gray-400 ${
                      errors.name
                        ? "border-red-400 bg-red-50"
                        : "border-gray-200 hover:border-purple-300"
                    }`}
                    aria-label="User name"
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                </div>
              ) : searchType === "placeLocation" ? (
                <div className="relative">
                  <google-maps-place-autocomplete-element
                    ref={placeAutocompleteRef}
                    value={
                      formData.lat && formData.lng
                        ? `${formData.lat}, ${formData.lng}`
                        : ""
                    }
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
                  ></google-maps-place-autocomplete-element>
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
            {searchType !== "userName" && (
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
              aria-label="Search travelers"
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
          {/* Travelers List */}
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
                Nearby Travelers
              </h2>
              {loading && fetchAttempted ? (
                <div className="text-center py-10">
                  <Loader2 className="h-10 w-10 animate-spin text-purple-600 mx-auto mb-4" />
                  <p className="text-gray-600">Loading travelers...</p>
                </div>
              ) : nearbyUsers?.length > 0 ? (
                nearbyUsers.map((traveler) => (
                  <div
                    key={traveler._id}
                    onClick={() => {
                      setSelectedUser(traveler);
                      setCenter({
                        lat:
                          traveler.currentLocation?.coordinates?.[1] || 28.6139,
                        lng:
                          traveler.currentLocation?.coordinates?.[0] || 77.209,
                      });
                    }}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-300 ${
                      selectedUser?._id === traveler._id
                        ? "border-purple-500 bg-purple-50 shadow-md"
                        : "border-gray-100 hover:border-purple-400 hover:bg-purple-50/50"
                    }`}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        setSelectedUser(traveler);
                        setCenter({
                          lat:
                            traveler.currentLocation?.coordinates?.[1] ||
                            28.6139,
                          lng:
                            traveler.currentLocation?.coordinates?.[0] ||
                            77.209,
                        });
                      }
                    }}
                  >
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <img
                          src={traveler?.profilePicture}
                          alt={traveler.fullName || "Traveler"}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div className="flex-1">
                          <p className="font-semibold text-gray-800 truncate">
                            {traveler.fullName}
                          </p>
                          <div className="flex items-center space-x-2 text-gray-600">
                            <MapPin className="h-4 w-4 text-red-500" />
                            <p className="text-sm truncate">
                              {traveler.currentLocation?.coordinates
                                ? `${traveler.currentLocation.coordinates[1].toFixed(
                                    4
                                  )}, ${traveler.currentLocation.coordinates[0].toFixed(
                                    4
                                  )}`
                                : "Location not set"}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        {traveler.isFriend ? (
                          <Link
                            to={`/profile/${traveler.firebaseUid}`}
                            className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg font-medium hover:bg-blue-600 transform hover:scale-105 transition-all duration-300 flex items-center justify-center"
                            aria-label={`View profile of ${traveler.fullName}`}
                          >
                            <User className="w-4 h-4 mr-2" />
                            View Profile
                          </Link>
                        ) : (
                          <button
                            onClick={(e) => {
                              e.stopPropagation(); // Prevent list item click
                              handleAddFriend(traveler.firebaseUid);
                            }}
                            className="flex-1 px-4 py-2 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-lg font-medium hover:bg-green-600 transform hover:scale-105 transition-all duration-300 flex items-center justify-center"
                            aria-label={`Add ${traveler.fullName} as friend`}
                          >
                            <UserPlus className="w-4 h-4 mr-2" />
                            Add Friend
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-10">
                  <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-lg font-medium text-gray-600">
                    No travelers found
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
                      Traveler Locations
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
                  zoom={searchType === "userName" ? 5 : 10}
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
                  {user?.currentLocation?.coordinates && (
                    <Marker
                      position={{
                        lat: user.currentLocation.coordinates[1],
                        lng: user.currentLocation.coordinates[0],
                      }}
                      title={`${user.fullName} (You)`}
                      icon={{
                        path: window.google.maps.SymbolPath
                          .BACKWARD_CLOSED_ARROW,
                        fillColor: "#FFD700",
                        fillOpacity: 1,
                        strokeWeight: 1,
                        strokeColor: "#000000",
                        scale: 6,
                      }}
                      onClick={() => {
                        setSelectedUser(user);
                        setCenter({
                          lat: user.currentLocation.coordinates[1],
                          lng: user.currentLocation.coordinates[0],
                        });
                        setShowList(true);
                      }}
                    />
                  )}
                  {nearbyUsers?.map((traveler) => (
                    <Marker
                      key={traveler._id}
                      position={{
                        lat:
                          traveler.currentLocation?.coordinates?.[1] || 28.6139,
                        lng:
                          traveler.currentLocation?.coordinates?.[0] || 77.209,
                      }}
                      title={traveler.fullName}
                      icon={{
                        path: window.google.maps.SymbolPath.CIRCLE,
                        fillColor:
                          selectedUser?._id === traveler._id
                            ? "#4B0082"
                            : "#FF4400",
                        fillOpacity: 1,
                        strokeWeight: 2,
                        strokeColor: "#FFFFFF",
                        scale: 10,
                      }}
                      onClick={() => {
                        setSelectedUser(traveler);
                        setCenter({
                          lat:
                            traveler.currentLocation?.coordinates?.[1] ||
                            28.6139,
                          lng:
                            traveler.currentLocation?.coordinates?.[0] ||
                            77.209,
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

export default DiscoverOtherTravellerNearYou;
