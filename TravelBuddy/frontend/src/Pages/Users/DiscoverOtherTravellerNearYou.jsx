import React, { useState, useRef } from "react";
import { GoogleMap, Marker } from "@react-google-maps/api";
import { Autocomplete } from "@react-google-maps/api";
import {
  MapPin,
  Users,
  Search,
  Filter,
  Navigation,
  Loader2,
  Star,
} from "lucide-react";
import toast from "react-hot-toast";

// Dummy travelers data including current user
const travelers = [
  {
    id: 1,
    name: "Amit",
    location: { lat: 28.6139, lng: 77.209 },
    city: "Delhi",
    avatar: "👨‍💼",
  },
  {
    id: 2,
    name: "Raj",
    location: { lat: 19.076, lng: 72.8777 },
    city: "Mumbai",
    avatar: "👨‍🎨",
  },
  {
    id: 3,
    name: "Priya",
    location: { lat: 12.9716, lng: 77.5946 },
    city: "Bangalore",
    avatar: "👩‍💻",
  },
  {
    id: 4,
    name: "Sara",
    location: { lat: 22.5726, lng: 88.3639 },
    city: "Kolkata",
    avatar: "👩‍🎓",
  },
  {
    id: 5,
    name: "John",
    location: { lat: 18.5204, lng: 73.8567 },
    city: "Pune",
    avatar: "👨‍🚀",
  },
  {
    id: 6,
    name: "Emily",
    location: { lat: 13.0827, lng: 80.2707 },
    city: "Chennai",
    avatar: "👩‍🎤",
  },
  {
    id: 7,
    name: "Michael",
    location: { lat: 28.7041, lng: 77.1025 },
    city: "Gurugram",
    avatar: "👨‍🏫",
  },
];

// Current user (dummy)
const currentUser = {
  id: 0,
  name: "You",
  location: { lat: 28.4595, lng: 77.0266 }, // Gurgaon
  city: "Gurgaon",
  avatar: "🌟",
};

const containerStyle = {
  width: "100%",
  height: "100%",
};

function DiscoverOtherTravellerNearYou() {
  const [searchType, setSearchType] = useState("username"); // username, location, radius
  const [searchQuery, setSearchQuery] = useState("");
  const [radius, setRadius] = useState("");
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedTraveler, setSelectedTraveler] = useState(null);
  const [showList, setShowList] = useState(false);
  const [center, setCenter] = useState(currentUser.location);
  const autocompleteRef = useRef(null);

  // Haversine formula to calculate distance between two coordinates (in km)
  const haversineDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth's radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // Filter travelers based on search type
  const filteredTravelers = travelers.filter((traveler) => {
    if (searchType === "username") {
      return (
        traveler.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        traveler.city.toLowerCase().includes(searchQuery.toLowerCase())
      );
    } else if (searchType === "location" && selectedLocation) {
      const distance = haversineDistance(
        selectedLocation.lat,
        selectedLocation.lng,
        traveler.location.lat,
        traveler.location.lng
      );
      return distance <= 100; // Arbitrary 100km limit for location search
    } else if (searchType === "radius" && radius) {
      const distance = haversineDistance(
        currentUser.location.lat,
        currentUser.location.lng,
        traveler.location.lat,
        traveler.location.lng
      );
      return distance <= parseFloat(radius);
    }
    return true;
  });

  // Handle location selection from Autocomplete
  const handlePlaceSelect = () => {
    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace();
      if (place.geometry) {
        setSelectedLocation({
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
          address: place.formatted_address,
        });
        setCenter({
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        });
        setSearchQuery(place.formatted_address);
      } else {
        toast.error("Please select a valid address from the suggestions");
      }
    }
  };

  // Reset search when switching search type
  const handleSearchTypeChange = (type) => {
    setSearchType(type);
    setSearchQuery("");
    setRadius("");
    setSelectedLocation(null);
    setCenter(currentUser.location);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 overflow-x-hidden">
      {/* Header */}
      <div className="bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 text-white rounded-3xl p-8 mb-8 shadow-2xl sticky top-0 z-20 max-w-6xl mx-auto">
        <div className="flex items-center justify-between space-x-4">
          <div className="flex items-center space-x-4">
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4">
              <Users className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-4xl font-bold">Discover Nearby Travelers</h1>
              <p className="text-purple-100 text-lg mt-2">
                Find other travelers near you ({filteredTravelers.length} found)
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowList(!showList)}
            className="sm:hidden bg-purple-600 text-white p-2 rounded-xl hover:bg-purple-700 transition-colors"
          >
            <Filter className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto">
        {/* Search Bar */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/50 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleSearchTypeChange("username")}
                className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
                  searchType === "username"
                    ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Username
              </button>
              <button
                onClick={() => handleSearchTypeChange("location")}
                className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
                  searchType === "location"
                    ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Location
              </button>
              <button
                onClick={() => handleSearchTypeChange("radius")}
                className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
                  searchType === "radius"
                    ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Radius
              </button>
            </div>
            <div className="flex-1 relative">
              {searchType === "location" ? (
                <Autocomplete
                  onLoad={(autocomplete) => {
                    autocompleteRef.current = autocomplete;
                  }}
                  onPlaceChanged={handlePlaceSelect}
                >
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Enter city or address..."
                    className="w-full pl-10 pr-4 py-3 bg-white/80 backdrop-blur-sm border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300"
                  />
                </Autocomplete>
              ) : searchType === "radius" ? (
                <input
                  type="number"
                  value={radius}
                  onChange={(e) => setRadius(e.target.value)}
                  placeholder="Enter radius in km (e.g., 10)"
                  min="1"
                  max="1000"
                  className="w-full pl-10 pr-4 py-3 bg-white/80 backdrop-blur-sm border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300"
                />
              ) : (
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by username or city..."
                  className="w-full pl-10 pr-4 py-3 bg-white/80 backdrop-blur-sm border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300"
                />
              )}
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row min-h-[calc(100vh-200px)]">
          {/* Travelers List */}
          <div
            className={`${
              showList ? "block" : "hidden"
            } sm:block sm:w-80 bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 overflow-y-auto max-h-[500px]`}
          >
            <div className="p-4 space-y-3">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center mb-4">
                <div className="bg-gradient-to-r from-purple-500 to-indigo-500 rounded-xl p-3 mr-4">
                  <Users className="w-6 h-6 text-white" />
                </div>
                Active Travelers
              </h2>
              {filteredTravelers.length > 0 ? (
                filteredTravelers.map((traveler) => (
                  <div
                    key={traveler.id}
                    onClick={() => {
                      setSelectedTraveler(traveler);
                      setCenter(traveler.location);
                    }}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                      selectedTraveler?.id === traveler.id
                        ? "border-purple-500 bg-purple-50/50 shadow-md"
                        : "border-gray-100 hover:border-purple-300 hover:bg-purple-25"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl">{traveler.avatar}</div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate">
                          {traveler.name}
                        </p>
                        <div className="flex items-center space-x-1 mt-1">
                          <MapPin className="h-3 w-3 text-purple-600" />
                          <p className="text-sm text-gray-600 truncate">
                            {traveler.city}
                          </p>
                        </div>
                      </div>
                      <div className="flex-shrink-0">
                        <div className="w-3 h-3 bg-green-500 rounded-full shadow-sm"></div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No travelers found</p>
                  <p className="text-sm text-gray-400 mt-1">
                    Try adjusting your search
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Map Container */}
          <div className="flex-1 p-3 sm:p-4">
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden h-[500px]">
              <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Navigation className="h-5 w-5" />
                    <span className="font-medium">Live Traveler Locations</span>
                  </div>
                  <div className="flex items-center space-x-2 text-purple-100">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-sm">Real-time</span>
                  </div>
                </div>
              </div>
              <div className="h-[452px]">
                <GoogleMap
                  mapContainerStyle={containerStyle}
                  center={center}
                  zoom={searchType === "radius" && radius ? 10 : 5}
                  options={{
                    zoomControl: true,
                    streetViewControl: false,
                    mapTypeControl: false,
                    fullscreenControl: true,
                  }}
                >
                  {/* Current User Marker */}
                  <Marker
                    position={currentUser.location}
                    title={`${currentUser.name} - ${currentUser.city}`}
                    icon={{
                      path: window.google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
                      fillColor: "#FFD700",
                      fillOpacity: 1,
                      strokeWeight: 1,
                      strokeColor: "#000000",
                      scale: 6,
                    }}
                    onClick={() => {
                      setSelectedTraveler(currentUser);
                      setCenter(currentUser.location);
                    }}
                  />
                  {/* Other Travelers Markers */}
                  {filteredTravelers.map((traveler) => (
                    <Marker
                      key={traveler.id}
                      position={traveler.location}
                      title={`${traveler.name} - ${traveler.city}`}
                      icon={{
                        path: window.google.maps.SymbolPath.CIRCLE,
                        fillColor: "#9333EA",
                        fillOpacity: 1,
                        strokeWeight: 1,
                        strokeColor: "#FFFFFF",
                        scale: 8,
                      }}
                      onClick={() => {
                        setSelectedTraveler(traveler);
                        setCenter(traveler.location);
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
}

export default DiscoverOtherTravellerNearYou;
