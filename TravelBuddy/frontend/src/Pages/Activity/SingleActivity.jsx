import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  getSingleActivity,
  joinActivity,
  deleteActivity,
  leaveActivity,
  clearError,
} from "../../Redux/Slices/ActivitySlice";
import {
  Calendar,
  MapPin,
  Users,
  AlertCircle,
  Loader2,
  Plus,
  Edit3,
  Trash2,
  LogOut,
  User,
  Star,
  FileText,
} from "lucide-react";
import UpdateActivityModal from "../../components/UpdateActivityModal";

const SingleActivity = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { activityId } = useParams();
  const location = useLocation(); // For scroll-to-top
  const { user } = useSelector((state) => state.user);
  const { singleActivity, loading, error } = useSelector(
    (state) => state.activity
  );
  const [fetchAttempted, setFetchAttempted] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Fetch activity on mount
  useEffect(() => {
    if (user && activityId) {
      setFetchAttempted(true);
      dispatch(
        getSingleActivity({ firebaseUid: user.firebaseUid, activityId })
      ).unwrap();
    }
    return () => {
      dispatch(clearError());
    };
  }, [dispatch, user, activityId]);

  // Handle join activity
  const handleJoinActivity = async () => {
    if (!user) {
      toast.error("You must be logged in to join activities", {
        duration: 4000,
      });
      return;
    }
    await dispatch(joinActivity({ activityId })).unwrap();
  };

  // Handle edit activity
  const handleEditActivity = () => {
    setIsEditModalOpen(true);
    setIsEditing(true);
  };

  // Handle successful edit
  const handleEditSuccess = async () => {
    setIsEditing(false);
    setIsEditModalOpen(false);

    await dispatch(
      getSingleActivity({ firebaseUid: user.firebaseUid, activityId })
    ).unwrap();
  };

  // Handle delete activity
  const handleDeleteActivity = async () => {
    await dispatch(deleteActivity({ activityId })).unwrap();
    navigate("/activity/my");
  };

  // Handle leave activity
  const handleLeaveActivity = async () => {
    await dispatch(leaveActivity({ activityId })).unwrap();
  };

  // Format date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Format timestamp for createdAt/updatedAt
  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Open user details popup
  const openUserPopup = (userData) => {
    setSelectedUser(userData);
  };

  // Close user details popup
  const closeUserPopup = () => {
    setSelectedUser(null);
  };

  // Loading state
  if ((loading || isEditing) && !singleActivity) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-100 via-blue-100 to-indigo-100 flex items-center justify-center">
        <div className="bg-white/80 backdrop-blur-md rounded-2xl p-10 shadow-2xl text-center max-w-md">
          <Loader2 className="h-12 w-12 animate-spin text-purple-600 mx-auto mb-4" />
          <p className="text-xl font-semibold text-gray-800">
            {isEditing ? "Updating Activity..." : "Loading Activity..."}
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Please wait while we {isEditing ? "update" : "fetch"} the activity
            details
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (error && fetchAttempted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-100 via-blue-100 to-indigo-100 flex items-center justify-center">
        <div className="bg-red-50/80 backdrop-blur-sm border-l-4 border-red-500 p-6 rounded-lg shadow-md max-w-md">
          <div className="flex items-center">
            <AlertCircle className="h-6 w-6 text-red-500" />
            <p className="ml-3 text-base text-red-700">{error}</p>
          </div>
          <p className="mt-2 text-sm text-gray-600">
            Please try again or contact support if the issue persists.
          </p>
        </div>
      </div>
    );
  }

  // No activity found
  if (!singleActivity && fetchAttempted && !loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-100 via-blue-100 to-indigo-100 flex items-center justify-center">
        <div className="bg-white/80 backdrop-blur-md rounded-2xl p-10 shadow-2xl text-center max-w-md">
          <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-lg font-medium text-gray-600">No Activity Found</p>
          <p className="text-sm text-gray-500 mt-2">
            The activity may not exist or you may not have access to it.
          </p>
        </div>
      </div>
    );
  }

  const isCreator = singleActivity?.creator?._id === user?._id;
  const isParticipant = singleActivity?.participantsList?.some(
    (p) => (p.user?._id || p.user) === user?._id
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-blue-100 to-indigo-100 font-sans py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-700 via-indigo-600 to-blue-600 text-white rounded-3xl p-8 mb-8 shadow-2xl">
          <div className="flex items-center space-x-4">
            <div className="bg-white/10 backdrop-blur-md rounded-full p-3">
              <Users className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-4xl font-bold tracking-tight">
                {singleActivity?.title}
              </h1>
              <div
                className="flex items-center space-x-2 mt-2 cursor-pointer hover:text-indigo-200 transition-colors"
                onClick={() => openUserPopup(singleActivity?.creator)}
              >
                <img
                  src={singleActivity?.creator?.profilePicture}
                  onError={(e) => {
                    console.error(
                      "Creator image failed to load:",
                      e.target.src
                    );
                    e.target.src = "https://via.placeholder.com/32";
                  }}
                  alt={singleActivity?.creator?.fullName || "Creator"}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <p className="text-indigo-100 text-lg">
                  Created by {singleActivity?.creator?.fullName || "Unknown"}{" "}
                  <Star className="inline w-4 h-4 text-yellow-400" />
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Activity Details */}
        <div className="bg-white/90 backdrop-blur-md rounded-3xl p-8 shadow-lg border border-gray-100">
          <div className="space-y-8">
            {/* Description */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-3 flex items-center">
                <FileText className="w-6 h-6 text-purple-600 mr-2" />
                Description
              </h2>
              <p className="text-gray-600 leading-relaxed">
                {singleActivity?.description}
              </p>
            </div>

            {/* Date and Time */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-blue-500" />
                <p className="text-gray-600">
                  <span className="font-medium">Date:</span>{" "}
                  {formatDate(singleActivity?.startDate)}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-blue-500" />
                <p className="text-gray-600">
                  <span className="font-medium">Time:</span>{" "}
                  {singleActivity?.time}
                </p>
              </div>
            </div>

            {/* Location */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <MapPin className="h-5 w-5 text-red-500" />
                <p className="text-gray-600">
                  <span className="font-medium">Address:</span>{" "}
                  {singleActivity?.location?.address}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-5 w-5 text-red-500" />
                <p className="text-gray-600">
                  <span className="font-medium">Coordinates:</span> Lat:{" "}
                  {singleActivity?.location?.coordinates[1]?.toFixed(4)}, Lng:{" "}
                  {singleActivity?.location?.coordinates[0]?.toFixed(4)}
                </p>
              </div>
            </div>

            {/* Participants */}
            <div>
              <div className="flex items-center space-x-2 mb-3">
                <Users className="h-5 w-5 text-green-500" />
                <p className="text-gray-600 text-lg font-medium">
                  Participants: {singleActivity?.participantsList?.length}/
                  {singleActivity?.maxParticipants}
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {singleActivity?.participantsList?.map((participant) => (
                  <div
                    key={participant.user?._id || participant.user}
                    className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-all duration-200"
                    onClick={() => openUserPopup(participant.user)}
                  >
                    <img
                      src={participant.user?.profilePicture}
                      onError={(e) => {
                        console.error(
                          "Participant image failed to load:",
                          e.target.src
                        );
                        e.target.src = "https://via.placeholder.com/40";
                      }}
                      alt={participant.user?.fullName || "Participant"}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <span className="text-gray-700 font-medium">
                        {participant.user?.fullName || "Unknown"}
                      </span>
                      <p className="text-sm text-gray-500">
                        {participant.status}
                        {(participant.user?._id || participant.user) ===
                          singleActivity?.creator?._id && (
                          <span className="ml-2 text-yellow-600">
                            {" "}
                            (Creator)
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Visibility */}
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-purple-500" />
              <p className="text-gray-600">
                <span className="font-medium">Visibility:</span>{" "}
                {singleActivity?.visibility}
              </p>
            </div>

            {/* Timestamps */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-gray-500" />
                <p className="text-gray-600">
                  <span className="font-medium">Created:</span>{" "}
                  {formatTimestamp(singleActivity?.createdAt)}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-gray-500" />
                <p className="text-gray-600">
                  <span className="font-medium">Last Updated:</span>{" "}
                  {formatTimestamp(singleActivity?.updatedAt)}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-3 sm:space-y-0">
              {!isParticipant &&
                !isCreator &&
                singleActivity?.visibility === "Public" &&
                singleActivity?.participantsList?.length <
                  singleActivity?.maxParticipants && (
                  <button
                    onClick={handleJoinActivity}
                    disabled={loading || isEditing}
                    className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg font-medium hover:bg-green-600 transform hover:scale-105 transition-all duration-300 flex items-center justify-center disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
                    aria-label={`Join ${singleActivity?.title}`}
                  >
                    {loading || isEditing ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin mr-2" />
                        Joining...
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4 mr-2" />
                        Join Activity
                      </>
                    )}
                  </button>
                )}
              {isCreator && (
                <>
                  <button
                    onClick={handleEditActivity}
                    disabled={loading || isEditing}
                    className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg font-medium hover:bg-purple-700 transform hover:scale-105 transition-all duration-300 flex items-center justify-center disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
                    aria-label={`Edit ${singleActivity?.title}`}
                  >
                    <Edit3 className="w-4 h-4 mr-2" />
                    Edit Activity
                  </button>
                  <button
                    onClick={handleDeleteActivity}
                    disabled={loading || isEditing}
                    className="w-full sm:w-auto px-6 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transform hover:scale-105 transition-all duration-300 flex items-center justify-center disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
                    aria-label={`Delete ${singleActivity?.title}`}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Activity
                  </button>
                </>
              )}
              {isParticipant && !isCreator && (
                <button
                  onClick={handleLeaveActivity}
                  disabled={loading || isEditing}
                  className="w-full sm:w-auto px-6 py-3 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 transform hover:scale-105 transition-all duration-300 flex items-center justify-center disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
                  aria-label={`Leave ${singleActivity?.title}`}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Leave Activity
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* User Details Popup */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white/90 backdrop-blur-md rounded-2xl p-8 max-w-md w-full mx-4 shadow-xl border border-gray-100">
            <div className="flex items-center space-x-3 mb-4">
              <img
                src={selectedUser.profilePicture}
                onError={(e) => {
                  console.error(
                    "User popup image failed to load:",
                    e.target.src
                  );
                  e.target.src = "https://via.placeholder.com/40";
                }}
                alt={selectedUser.fullName || "User"}
                className="w-12 h-12 rounded-full object-cover"
              />
              <h2 className="text-xl font-semibold text-gray-800">
                {selectedUser.fullName || "Unknown"}
              </h2>
            </div>
            <div className="space-y-3">
              <p className="text-gray-600">
                <span className="font-medium">Email:</span>{" "}
                {selectedUser.email || "N/A"}
              </p>
              <p className="text-gray-600">
                <span className="font-medium">User ID:</span>{" "}
                {selectedUser._id || "N/A"}
              </p>
              <p className="text-gray-600">
                <span className="font-medium">Firebase UID:</span>{" "}
                {selectedUser.firebaseUid || "N/A"}
              </p>
              {selectedUser.bio && (
                <p className="text-gray-600">
                  <span className="font-medium">Bio:</span> {selectedUser.bio}
                </p>
              )}
              {selectedUser.languages?.length > 0 && (
                <p className="text-gray-600">
                  <span className="font-medium">Languages:</span>{" "}
                  {selectedUser.languages
                    .map((lang) => `${lang.language} (${lang.proficiency})`)
                    .join(", ")}
                </p>
              )}
            </div>
            <button
              onClick={closeUserPopup}
              className="mt-6 w-full px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-all duration-200"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Update Activity Modal */}
      <UpdateActivityModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setIsEditing(false);
        }}
        activity={singleActivity}
        onSuccess={handleEditSuccess}
      />
    </div>
  );
};

export default SingleActivity;
