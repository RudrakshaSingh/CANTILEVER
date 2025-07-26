import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  User,
  Mail,
  Globe,
  MapPin,
  Calendar,
  Edit3,
  Camera,
  Settings,
  Star,
  MessageCircle,
  Users,
  Plane,
  Languages,
  Shield,
  Clock,
  Phone,
  Heart,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
} from "lucide-react";
import { deleteUserAccount } from "../../Redux/Slices/UserSlice";
import DeleteAccountModal from "../../components/DeleteAccountModal";
import EditProfileModal from "../../components/EditProfileModal ";

function UserProfile() {
  // Get user from Redux store
  // Redux state and dispatch
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const [activeTab, setActiveTab] = useState("overview");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);

  const handleDeleteAccount = () => {
    setIsDeleteModalOpen(true);
  };

  const handleEditProfile = () => {
    setIsEditProfileOpen(true);
  };

  const confirmDeleteAccount = async () => {
    try {
      setIsDeleting(true);
      await dispatch(deleteUserAccount()).unwrap();
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error("Failed to delete account:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
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

  const getTimeSinceJoined = (dateString) => {
    const joinDate = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - joinDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 30) {
      return `${diffDays} days ago`;
    } else if (diffDays < 365) {
      const months = Math.floor(diffDays / 30);
      return `${months} month${months > 1 ? "s" : ""} ago`;
    } else {
      const years = Math.floor(diffDays / 365);
      return `${years} year${years > 1 ? "s" : ""} ago`;
    }
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

  // Helper function to check if mobile is valid
  const isValidMobile = (mobile) => {
    return mobile && mobile.trim() && mobile.trim().length > 0;
  };

  // Helper function to check if bio exists and is meaningful
  const hasValidBio = (bio) => {
    return bio && bio.trim() && bio.trim().length > 0;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Profile Header Card */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden mb-8 relative">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600 opacity-10"></div>
          <div className="absolute -top-12 -right-12 w-44 h-44 bg-gradient-to-br from-purple-100 to-indigo-200 rounded-full opacity-40 blur-sm"></div>
          <div className="absolute -top-8 -left-8 w-32 h-32 bg-gradient-to-br from-blue-100 to-purple-200 rounded-full opacity-30 blur-sm"></div>

          <div className="relative z-10 p-8">
            <div className="flex flex-col md:flex-row items-start md:items-center space-y-6 md:space-y-0 md:space-x-8">
              {/* Profile Picture */}
              <div className="relative group">
                <div className="w-32 h-32 rounded-full overflow-hidden shadow-xl ring-4 ring-white">
                  <img
                    src={user.profilePicture}
                    alt={user.fullName || "User"}
                    className="w-full h-full object-cover"
                  />
                </div>
                <button className="absolute bottom-2 right-2 bg-purple-600 text-white p-2 rounded-full shadow-lg hover:bg-purple-700 transition-colors opacity-0 group-hover:opacity-100">
                  <Camera className="w-4 h-4" />
                </button>
              </div>

              {/* Profile Info */}
              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                      {user.fullName || "Anonymous User"}
                    </h1>
                    <div className="flex items-center text-gray-600 mb-2">
                      <Mail className="w-4 h-4 mr-2" />
                      <span>{user.email}</span>
                    </div>
                    {isValidMobile(user.mobile) && (
                      <div className="flex items-center text-gray-600 mb-2">
                        <Phone className="w-4 h-4 mr-2" />
                        <span>{user.mobile}</span>
                      </div>
                    )}
                    <div className="flex items-center text-gray-600">
                      <Shield className="w-4 h-4 mr-2" />
                      <span className="capitalize font-medium text-purple-600">
                        {user.role}
                      </span>
                    </div>
                  </div>
                  <button 
                    onClick={handleEditProfile}
                    className="mt-4 md:mt-0 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5 flex items-center"
                  >
                    <Edit3 className="w-4 h-4 mr-2" />
                    Edit Profile
                  </button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {user.futureDestinations?.length || 0}
                    </div>
                    <div className="text-sm text-gray-600">Travel Plans</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">0</div>
                    <div className="text-sm text-gray-600">Connections</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {user.languages?.length || 0}
                    </div>
                    <div className="text-sm text-gray-600">Languages</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation - Overview Travel Plans Settings */}
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
            <button
              onClick={() => setActiveTab("settings")}
              className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                activeTab === "settings"
                  ? "bg-purple-600 text-white shadow-lg"
                  : "text-gray-600 hover:text-purple-600"
              }`}
            >
              Settings
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
                    About Me
                  </h3>
                  <div className="text-gray-600">
                    {hasValidBio(user.bio) ? (
                      <p className="mb-4">{user.bio}</p>
                    ) : (
                      <div className="text-center py-6">
                        <User className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500 mb-2">No bio added yet</p>
                        <button className="text-purple-600 hover:text-purple-700 font-medium text-sm">
                          + Add Bio
                        </button>
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                      <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                        <Calendar className="w-5 h-5 text-purple-600 mr-3" />
                        <div>
                          <div className="text-sm text-gray-600">
                            Member since
                          </div>
                          <div className="font-medium">
                            {formatDate(user.createdAt)}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                        <Clock className="w-5 h-5 text-blue-600 mr-3" />
                        <div>
                          <div className="text-sm text-gray-600">Joined</div>
                          <div className="font-medium">
                            {getTimeSinceJoined(user.createdAt)}
                          </div>
                        </div>
                      </div>
                      {user.dateOfBirth && (
                        <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                          <Heart className="w-5 h-5 text-red-600 mr-3" />
                          <div>
                            <div className="text-sm text-gray-600">
                              Birthday
                            </div>
                            <div className="font-medium">
                              {formatDate(user.dateOfBirth)}
                            </div>
                          </div>
                        </div>
                      )}
                      {user.gender && user.gender !== "prefer-not-to-say" && (
                        <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                          <User className="w-5 h-5 text-pink-600 mr-3" />
                          <div>
                            <div className="text-sm text-gray-600">Gender</div>
                            <div className="font-medium capitalize">
                              {user.gender}
                            </div>
                          </div>
                        </div>
                      )}
                      {!isValidMobile(user.mobile) && (
                        <div className="flex items-center p-3 bg-orange-50 rounded-lg border border-orange-200">
                          <Phone className="w-5 h-5 text-orange-600 mr-3" />
                          <div className="flex-1">
                            <div className="text-sm text-orange-600">
                              Mobile Number
                            </div>
                            <button className="text-orange-700 hover:text-orange-800 font-medium text-sm">
                              + Add Phone Number
                            </button>
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
                  {user.languages && user.languages.length > 0 ? (
                    <div className="space-y-3">
                      {user.languages.map((lang, index) => (
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
                      <p className="text-gray-500 mb-4">
                        No languages added yet
                      </p>
                      <button className="text-purple-600 hover:text-purple-700 font-medium">
                        + Add Languages
                      </button>
                    </div>
                  )}
                </div>

                {/* Social Links Section */}
                {user.socialLinks &&
                Object.values(user.socialLinks).some((link) => link) ? (
                  <div className="bg-white rounded-2xl shadow-lg p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                      <Globe className="w-5 h-5 mr-2 text-blue-600" />
                      Social Links
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {Object.entries(user.socialLinks).map(
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
                      <p className="text-gray-500 mb-4">
                        No social links added yet
                      </p>
                      <button className="text-purple-600 hover:text-purple-700 font-medium">
                        + Add Social Links
                      </button>
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
                    <p className="text-gray-500 mb-4">No recent activity</p>
                    <p className="text-sm text-gray-400">
                      Start connecting with travelers to see your activity here
                    </p>
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
                {user.futureDestinations &&
                user.futureDestinations.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {user.futureDestinations.map((dest, index) => (
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
                    <p className="text-gray-500 mb-4">No travel plans yet</p>
                    <p className="text-sm text-gray-400 mb-6">
                      Add your future destinations to connect with travelers
                      going to the same places
                    </p>
                    <button className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-200">
                      + Add Destination
                    </button>
                  </div>
                )}
              </div>
            )}

            {activeTab === "settings" && (
              <div className="space-y-6">
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                    <Settings className="w-5 h-5 mr-2 text-gray-600" />
                    Account Settings
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div>
                        <div className="font-medium text-gray-900">
                          Email Notifications
                        </div>
                        <div className="text-sm text-gray-600">
                          Receive updates about your travels
                        </div>
                      </div>
                      <button className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm">
                        Manage
                      </button>
                    </div>
                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div>
                        <div className="font-medium text-gray-900">
                          Privacy Settings
                        </div>
                        <div className="text-sm text-gray-600">
                          Control who can see your profile
                        </div>
                      </div>
                      <button className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm">
                        Configure
                      </button>
                    </div>
                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div>
                        <div className="font-medium text-gray-900">
                          Delete Account
                        </div>
                        <div className="text-sm text-gray-600">
                          Permanently delete your account
                        </div>
                      </div>
                      <button
                        onClick={handleDeleteAccount}
                        className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-700 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Profile Completion */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Profile Completion
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Basic Info</span>
                  <span className="font-semibold text-green-600">✓</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Profile Picture</span>
                  <span className="font-semibold text-green-600">✓</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Bio</span>
                  <span
                    className={`font-semibold ${
                      hasValidBio(user.bio)
                        ? "text-green-600"
                        : "text-orange-600"
                    }`}
                  >
                    {hasValidBio(user.bio) ? "✓" : "○"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Phone Number</span>
                  <span
                    className={`font-semibold ${
                      isValidMobile(user.mobile)
                        ? "text-green-600"
                        : "text-orange-600"
                    }`}
                  >
                    {isValidMobile(user.mobile) ? "✓" : "○"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Languages</span>
                  <span
                    className={`font-semibold ${
                      user.languages?.length > 0
                        ? "text-green-600"
                        : "text-orange-600"
                    }`}
                  >
                    {user.languages?.length > 0 ? "✓" : "○"}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Quick Stats
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Profile Views</span>
                  <span className="font-semibold text-purple-600">0</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Activities Joined</span>
                  <span className="font-semibold text-green-600">0</span>
                </div>
                {user.currentLocation &&
                  (user.currentLocation.lat || user.currentLocation.lng) && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Location Set</span>
                      <span className="font-semibold text-blue-600">✓</span>
                    </div>
                  )}
              </div>
            </div>

            {/* Account Info */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Account Info
              </h3>
              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-gray-600">User ID:</span>
                  <div className="font-mono text-xs text-gray-800 mt-1 break-all">
                    {user._id}
                  </div>
                </div>
                <div>
                  <span className="text-gray-600">Firebase UID:</span>
                  <div className="font-mono text-xs text-gray-800 mt-1 break-all">
                    {user.firebaseUid}
                  </div>
                </div>
                <div>
                  <span className="text-gray-600">Last Updated:</span>
                  <div className="text-gray-800 mt-1">
                    {formatDate(user.updatedAt)}
                  </div>
                </div>
                {user.socketId && (
                  <div>
                    <span className="text-gray-600">Online Status:</span>
                    <div className="flex items-center mt-1">
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
              <button className="w-full bg-white text-purple-600 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                Find Travelers
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Account Modal */}
      <DeleteAccountModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDeleteAccount}
        isDeleting={isDeleting}
      />

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
        user={user}
      />
    </div>
  );
}

export default UserProfile;