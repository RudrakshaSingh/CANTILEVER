import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import {
  Calendar,
  MapPin,
  Users,
  Clock,
  FileText,
  AlertCircle,
  Trash2,
  LogOut,
  Eye,
  EyeOff,
  Plus,
  Edit3,
} from "lucide-react";
import {
  getMyActivities,
  deleteActivity,
  leaveActivity,
  clearError,
} from "../../Redux/Slices/ActivitySlice";
import { Link } from "react-router-dom";
import UpdateActivityModal from "../../components/UpdateActivityModal";

const MyActivities = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const { activities, loading, error } = useSelector((state) => state.activity);

  const [fetchAttempted, setFetchAttempted] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);

  // Fetch activities when component mounts
  useEffect(() => {
    if (user) {
      dispatch(getMyActivities())
        .unwrap()
        .then(() => setFetchAttempted(true))
        .catch(() => setFetchAttempted(true));
    } else {
      toast.error("Please log in to view your activities");
      setFetchAttempted(true);
    }

    return () => {
      dispatch(clearError());
    };
  }, [dispatch, user]);

  // Handle Delete Activity
  const handleDeleteActivity = async (activityId) => {
    await dispatch(deleteActivity({ activityId })).unwrap();
  };

  // Handle Leave Activity
  const handleLeaveActivity = async (activityId) => {
    await dispatch(leaveActivity({ activityId })).unwrap();
    // Re-fetch activities to update the state
    await dispatch(getMyActivities()).unwrap();
  };

  // Handle Edit Activity
  const handleEditActivity = (activity) => {
    setSelectedActivity(activity);
    setIsEditModalOpen(true);
  };

  // Format date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Separate activities into created and joined
  const createdActivities =
    activities?.filter((activity) => activity.creator?._id === user?._id) || [];
  const joinedActivities =
    activities?.filter(
      (activity) =>
        activity.creator?._id !== user?._id &&
        activity.participantsList.some((p) =>
          typeof p.user === "string"
            ? p.user === user?._id
            : p.user._id === user?._id
        )
    ) || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header Card */}
        <div className="bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 text-white rounded-3xl p-8 mb-8 shadow-2xl">
          <div className="flex items-center space-x-4">
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4">
              <Users className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-4xl font-bold">My Activities</h1>
              <p className="text-purple-100 text-lg mt-2">
                View activities you've created or joined
              </p>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && fetchAttempted && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-lg mb-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <AlertCircle className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && !fetchAttempted && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your activities...</p>
          </div>
        )}

        {/* Activities Sections */}
        {fetchAttempted && (
          <div className="space-y-12">
            {/* Created Activities Section */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 flex items-center mb-6">
                <div className="bg-gradient-to-r from-purple-500 to-indigo-500 rounded-xl p-3 mr-4">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                Activities You Created
              </h2>
              {createdActivities.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {createdActivities.map((activity) => (
                    <div
                      key={activity._id}
                      className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/50 hover:shadow-xl transition-all duration-300"
                    >
                      {/* Activity Header */}
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-bold text-gray-900 truncate">
                          {activity.title}
                        </h3>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            activity.visibility === "Public"
                              ? "bg-green-100 text-green-700"
                              : "bg-purple-100 text-purple-700"
                          }`}
                        >
                          {activity.visibility}
                          {activity.visibility === "Public" ? (
                            <Eye className="w-3 h-3 ml-1 inline" />
                          ) : (
                            <EyeOff className="w-3 h-3 ml-1 inline" />
                          )}
                        </span>
                      </div>

                      {/* Activity Details */}
                      <div className="space-y-3">
                        <div className="flex items-center text-gray-600">
                          <FileText className="w-4 h-4 mr-2 text-purple-600" />
                          <p className="text-sm line-clamp-2">
                            {activity.description}
                          </p>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <Calendar className="w-4 h-4 mr-2 text-blue-600" />
                          <span className="text-sm">
                            {formatDate(activity.startDate)}
                          </span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <Clock className="w-4 h-4 mr-2 text-orange-600" />
                          <span className="text-sm">{activity.time}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <MapPin className="w-4 h-4 mr-2 text-red-600" />
                          <span className="text-sm truncate">
                            {activity.location.address}
                          </span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <Users className="w-4 h-4 mr-2 text-green-600" />
                          <span className="text-sm">
                            {activity.participantsList.length} /{" "}
                            {activity.maxParticipants} participants
                          </span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex justify-end space-x-3 mt-4">
                        <button
                          onClick={() => handleEditActivity(activity)}
                          className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-200 flex items-center"
                          disabled={loading}
                        >
                          <Edit3 className="w-4 h-4 mr-2" />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteActivity(activity._id)}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-all duration-200 flex items-center"
                          disabled={loading}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-gray-200/50 text-center">
                  <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    No Activities Created
                  </h3>
                  <p className="text-gray-600 mb-6">
                    You haven't created any activities yet.
                  </p>
                  <Link
                    to="/activity/create"
                    className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-200 inline-flex items-center"
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    Create an Activity
                  </Link>
                </div>
              )}
            </div>

            {/* Joined Activities Section */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 flex items-center mb-6">
                <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl p-3 mr-4">
                  <Users className="w-6 h-6 text-white" />
                </div>
                Activities You Joined
              </h2>
              {joinedActivities.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {joinedActivities.map((activity) => (
                    <div
                      key={activity._id}
                      className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/50 hover:shadow-xl transition-all duration-300"
                    >
                      {/* Activity Header */}
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-bold text-gray-900 truncate">
                          {activity.title}
                        </h3>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            activity.visibility === "Public"
                              ? "bg-green-100 text-green-700"
                              : "bg-purple-100 text-purple-700"
                          }`}
                        >
                          {activity.visibility}
                          {activity.visibility === "Public" ? (
                            <Eye className="w-3 h-3 ml-1 inline" />
                          ) : (
                            <EyeOff className="w-3 h-3 ml-1 inline" />
                          )}
                        </span>
                      </div>

                      {/* Activity Details */}
                      <div className="space-y-3">
                        <div className="flex items-center text-gray-600">
                          <FileText className="w-4 h-4 mr-2 text-purple-600" />
                          <p className="text-sm line-clamp-2">
                            {activity.description}
                          </p>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <Calendar className="w-4 h-4 mr-2 text-blue-600" />
                          <span className="text-sm">
                            {formatDate(activity.startDate)}
                          </span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <Clock className="w-4 h-4 mr-2 text-orange-600" />
                          <span className="text-sm">{activity.time}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <MapPin className="w-4 h-4 mr-2 text-red-600" />
                          <span className="text-sm truncate">
                            {activity.location.address}
                          </span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <Users className="w-4 h-4 mr-2 text-green-600" />
                          <span className="text-sm">
                            {activity.participantsList.length} /{" "}
                            {activity.maxParticipants} participants
                          </span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <Users className="w-4 h-4 mr-2 text-indigo-600" />
                          <span className="text-sm">
                            Created by {activity.creator?.fullName || "Unknown"}
                          </span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex justify-end space-x-3 mt-4">
                        <button
                          onClick={() => handleLeaveActivity(activity._id)}
                          className="px-4 py-2 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700 transition-all duration-200 flex items-center"
                          disabled={loading}
                        >
                          <LogOut className="w-4 h-4 mr-2" />
                          Leave
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-gray-200/50 text-center">
                  <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    No Activities Joined
                  </h3>
                  <p className="text-gray-600 mb-6">
                    You haven't joined any activities yet.
                  </p>
                  <Link
                    to="/activity/nearby"
                    className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-200 inline-flex items-center"
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    Find Activities
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Update Activity Modal */}
      <UpdateActivityModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        activity={selectedActivity}
      />
    </div>
  );
};

export default MyActivities;
