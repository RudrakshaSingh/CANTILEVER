import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  User,
  Globe,
  MapPin,
  Calendar,
  Star,
  MessageCircle,
  Languages,
  Heart,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Users,
  Plane,
  Shield,
} from "lucide-react";
import { getFriendProfile } from "../../Redux/Slices/UserSlice";

function FriendProfile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { friendId } = useParams();
  const { user, friendProfile, loading, error } = useSelector(
    (state) => state.user
  );
  const [activeTab, setActiveTab] = useState("overview");

  // Fetch friend profile on mount
  useEffect(() => {
    if (!user) {
      navigate("/user/login");
      return;
    }

    dispatch(getFriendProfile({ friendId }));
  }, [dispatch, friendId, user, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading friend profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="text-center">
          <p className="text-red-600">{error}</p>
          <button
            onClick={() => navigate("/discover")}
            className="mt-4 bg-purple-600 text-white px-6 py-3 rounded-xl"
          >
            Back to Discover
          </button>
        </div>
      </div>
    );
  }

  if (!friendProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="text-center">
          <p className="text-gray-600">No friend profile found</p>
          <button
            onClick={() => navigate("/discover")}
            className="mt-4 bg-purple-600 text-white px-6 py-3 rounded-xl"
          >
            Back to Discover
          </button>
        </div>
      </div>
    );
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getProficiencyColor = (level) => {
    switch (level) {
      case "beginner":
        return "bg-red-100 text-red-700";
      case "intermediate":
        return "bg-yellow-100 text-yellow-700";
      case "advanced":
        return "bg-blue-100 text-blue-700";
      case "native":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getSocialIcon = (platform) => {
    switch (platform) {
      case "facebook":
        return Facebook;
      case "twitter":
        return Twitter;
      case "instagram":
        return Instagram;
      case "linkedin":
        return Linkedin;
      default:
        return Globe;
    }
  };

  const hasValidBio = (bio) => {
    return bio && bio.trim() && bio.trim().length > 0;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Profile Header Card */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden mb-8 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600 opacity-10"></div>
          <div className="absolute -top-12 -right-12 w-44 h-44 bg-gradient-to-br from-purple-100 to-indigo-200 rounded-full opacity-40 blur-sm"></div>
          <div className="absolute -top-8 -left-8 w-32 h-32 bg-gradient-to-br from-blue-100 to-purple-200 rounded-full opacity-30 blur-sm"></div>

          <div className="relative z-10 p-8">
            <div className="flex flex-col md:flex-row items-start md:items-center space-y-6 md:space-y-0 md:space-x-8">
              {/* Profile Picture */}
              <div className="w-32 h-32 rounded-full overflow-hidden shadow-xl ring-4 ring-white">
                <img
                  src={friendProfile.profilePicture}
                  alt={friendProfile.fullName || "Friend"}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Profile Info */}
              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                      {friendProfile.fullName || "Anonymous Friend"}
                    </h1>
                    <div className="flex items-center text-gray-600">
                      <Shield className="w-4 h-4 mr-2" />
                      <span className="capitalize font-medium text-purple-600">
                        {friendProfile.role}
                      </span>
                    </div>
                  </div>
                  <div className="flex space-x-4 mt-4 md:mt-0">
                    <button
                      className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 transform hover:-translate-y-0.5 ${
                        friendProfile.isFriend
                          ? "bg-red-600 text-white hover:bg-red-700"
                          : "bg-green-600 text-white hover:bg-green-700"
                      }`}
                    >
                      {friendProfile.isFriend ? "Remove Friend" : "Add Friend"}
                    </button>
                    <button className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-all duration-200 transform hover:-translate-y-0.5">
                      <MessageCircle className="w-4 h-4 inline mr-2" />
                      Message
                    </button>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {friendProfile.futureDestinations?.length || 0}
                    </div>
                    <div className="text-sm text-gray-600">Travel Plans</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">0</div>
                    <div className="text-sm text-gray-600">Connections</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {friendProfile.languages?.length || 0}
                    </div>
                    <div className="text-sm text-gray-600">Languages</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation - Overview and Travel Plans */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center space-x-8 text-lg font-semibold text-gray-800">
            <button
              onClick={() => setActiveTab("overview")}
              className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                activeTab === "overview"
                  ? "bg-purple-600 text-white shadow-lg"
                  : "text-gray-600 hover:text-purple-600"
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab("destinations")}
              className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                activeTab === "destinations"
                  ? "bg-purple-600 text-white shadow-lg"
                  : "text-gray-600 hover:text-purple-600"
              }`}
            >
              Travel Plans
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {activeTab === "overview" && (
              <div className="space-y-6">
                {/* About Section */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                    <User className="w-5 h-5 mr-2 text-purple-600" />
                    About
                  </h3>
                  <div className="text-gray-600">
                    {hasValidBio(friendProfile.bio) ? (
                      <p className="mb-4">{friendProfile.bio}</p>
                    ) : (
                      <div className="text-center py-6">
                        <User className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500">No bio added yet</p>
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                      {friendProfile.dateOfBirth && (
                        <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                          <Heart className="w-5 h-5 text-red-600 mr-3" />
                          <div>
                            <div className="text-sm text-gray-600">
                              Birthday
                            </div>
                            <div className="font-medium">
                              {formatDate(friendProfile.dateOfBirth)}
                            </div>
                          </div>
                        </div>
                      )}
                      {friendProfile.gender &&
                        friendProfile.gender !== "prefer-not-to-say" && (
                          <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                            <User className="w-5 h-5 text-pink-600 mr-3" />
                            <div>
                              <div className="text-sm text-gray-600">
                                Gender
                              </div>
                              <div className="font-medium capitalize">
                                {friendProfile.gender}
                              </div>
                            </div>
                          </div>
                        )}
                    </div>
                  </div>
                </div>

                {/* Languages Section */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                    <Languages className="w-5 h-5 mr-2 text-green-600" />
                    Languages
                  </h3>
                  {friendProfile.languages &&
                  friendProfile.languages.length > 0 ? (
                    <div className="space-y-3">
                      {friendProfile.languages.map((lang, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
                        >
                          <span className="font-medium text-gray-800">
                            {lang.language || "Unknown Language"}
                          </span>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${getProficiencyColor(
                              lang.proficiency
                            )}`}
                          >
                            {lang.proficiency || "beginner"}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Languages className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500">No languages added yet</p>
                    </div>
                  )}
                </div>

                {/* Social Links Section */}
                {friendProfile.socialLinks &&
                Object.values(friendProfile.socialLinks).some(
                  (link) => link
                ) ? (
                  <div className="bg-white rounded-2xl shadow-lg p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                      <Globe className="w-5 h-5 mr-2 text-blue-600" />
                      Social Links
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {Object.entries(friendProfile.socialLinks).map(
                        ([platform, url]) => {
                          if (!url) return null;
                          const IconComponent = getSocialIcon(platform);
                          return (
                            <a
                              key={platform}
                              href={url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center p-3 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-colors"
                            >
                              <IconComponent className="w-5 h-5 mr-2 text-purple-600" />
                              <span className="capitalize text-sm font-medium">
                                {platform}
                              </span>
                            </a>
                          );
                        }
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="bg-white rounded-2xl shadow-lg p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                      <Globe className="w-5 h-5 mr-2 text-blue-600" />
                      Social Links
                    </h3>
                    <div className="text-center py-8">
                      <Globe className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500">No social links added yet</p>
                    </div>
                  </div>
                )}

                {/* Recent Activity */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                    <Star className="w-5 h-5 mr-2 text-yellow-600" />
                    Recent Activity
                  </h3>
                  <div className="text-center py-8">
                    <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No recent activity</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "destinations" && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <MapPin className="w-5 h-5 mr-2 text-red-600" />
                  Future Destinations
                </h3>
                {friendProfile.futureDestinations &&
                friendProfile.futureDestinations.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {friendProfile.futureDestinations.map((dest, index) => (
                      <div
                        key={index}
                        className="p-4 border border-gray-200 rounded-lg hover:border-purple-300 transition-colors"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-center">
                            <Plane className="w-5 h-5 text-purple-600 mr-2 flex-shrink-0" />
                            <div>
                              <span className="font-medium text-gray-800">
                                {dest.destination || "Unknown Destination"}
                              </span>
                              {dest.plannedDate && (
                                <div className="text-sm text-gray-600 mt-1">
                                  {formatDate(dest.plannedDate)}
                                </div>
                              )}
                            </div>
                          </div>
                          {dest.lat && dest.lng && (
                            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                              View Map
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Plane className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No travel plans yet</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Quick Stats
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Activities Joined</span>
                  <span className="font-semibold text-green-600">
                    {friendProfile.activitiesJoined?.length || 0}
                  </span>
                </div>
                {friendProfile.currentLocation &&
                  (friendProfile.currentLocation.coordinates[0] ||
                    friendProfile.currentLocation.coordinates[1]) && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Location Set</span>
                      <span className="font-semibold text-blue-600">✓</span>
                    </div>
                  )}
                {friendProfile.online && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Online Status</span>
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                      <span className="text-green-600 text-xs">Online</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Connect with Travelers */}
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-6 text-white">
              <h3 className="text-lg font-semibold mb-2">
                Connect with Travelers
              </h3>
              <p className="text-purple-100 text-sm mb-4">
                Start building your travel network today
              </p>
              <button
                onClick={() => navigate("/discover")}
                className="w-full bg-white text-purple-600 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Find Travelers
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FriendProfile;
