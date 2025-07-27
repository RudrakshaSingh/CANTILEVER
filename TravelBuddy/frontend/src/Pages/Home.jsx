import React, { useState } from "react";
import {
  MapPin,
  Users,
  Calendar,
  MessageCircle,
  Search,
  Star,
  ArrowRight,
  Globe,
  Camera,
  Coffee,
  Mountain,
  Utensils,
  Navigation,
} from "lucide-react";
import { useDispatch } from "react-redux";
import { refreshUserData } from "../Redux/Slices/UserSlice";
import CurrentLocationGoogleMap from "../components/CurrentLocationGoogleMap";

function Home() {
  const [activeTab, setActiveTab] = useState("discover");
  const [searchQuery, setSearchQuery] = useState("");
  // Redux state and dispatch
  const dispatch = useDispatch();
  const handleStartExploring = async () => {
    await dispatch(refreshUserData()).unwrap();
  };

  // Mock data for demonstrations
  const featuredTravelers = [
    {
      id: 1,
      name: "Sarah Chen",
      age: 28,
      location: "Tokyo, Japan",
      interests: ["Photography", "Food", "Culture"],
      avatar:
        "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
      rating: 4.9,
      bio: "Digital nomad exploring Asia",
      online: true,
    },
    {
      id: 2,
      name: "Alex Rodriguez",
      age: 32,
      location: "Barcelona, Spain",
      interests: ["Art", "Nightlife", "Architecture"],
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      rating: 4.8,
      bio: "Travel photographer and guide",
      online: false,
    },
    {
      id: 3,
      name: "Emma Thompson",
      age: 26,
      location: "London, UK",
      interests: ["Museums", "Coffee", "Walking"],
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      rating: 4.7,
      bio: "Art student and coffee enthusiast",
      online: true,
    },
  ];

  const upcomingActivities = [
    {
      id: 1,
      title: "Sunset Photography Walk",
      location: "Golden Gate Bridge",
      date: "Today, 6:00 PM",
      participants: 8,
      maxParticipants: 12,
      type: "Photography",
      image:
        "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=300&h=200&fit=crop",
    },
    {
      id: 2,
      title: "Local Food Tour",
      location: "Chinatown",
      date: "Tomorrow, 12:00 PM",
      participants: 6,
      maxParticipants: 8,
      type: "Food",
      image:
        "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=300&h=200&fit=crop",
    },
    {
      id: 3,
      title: "Hiking & Coffee",
      location: "Marin Headlands",
      date: "Weekend, 8:00 AM",
      participants: 4,
      maxParticipants: 10,
      type: "Adventure",
      image:
        "https://images.unsplash.com/photo-1551632811-561732d1e306?w=300&h=200&fit=crop",
    },
  ];

  const stats = [
    {
      label: "Active Travelers",
      value: "12.5K",
      icon: Users,
      color: "text-blue-600",
    },
    {
      label: "Cities Covered",
      value: "150+",
      icon: Globe,
      color: "text-green-600",
    },
    {
      label: "Activities Daily",
      value: "200+",
      icon: Calendar,
      color: "text-purple-600",
    },
    {
      label: "Connections Made",
      value: "50K+",
      icon: MessageCircle,
      color: "text-orange-600",
    },
  ];

  const quickActions = [
    {
      title: "Find Travelers",
      description: "Connect with like-minded travelers nearby",
      icon: Users,
      color: "bg-gradient-to-r from-blue-500 to-blue-600",
      action: "discover",
    },
    {
      title: "Join Activities",
      description: "Participate in local experiences",
      icon: Calendar,
      color: "bg-gradient-to-r from-purple-500 to-purple-600",
      action: "activities",
    },
    {
      title: "Plan Your Trip",
      description: "Create and share your travel plans",
      icon: MapPin,
      color: "bg-gradient-to-r from-green-500 to-green-600",
      action: "trips",
    },
    {
      title: "Start Chatting",
      description: "Message travelers and activity groups",
      icon: MessageCircle,
      color: "bg-gradient-to-r from-orange-500 to-orange-600",
      action: "messages",
    },
  ];

  const getInterestIcon = (interest) => {
    const iconMap = {
      Photography: Camera,
      Food: Utensils,
      Culture: Globe,
      Art: Star,
      Nightlife: MessageCircle,
      Architecture: MapPin,
      Museums: Star,
      Coffee: Coffee,
      Walking: Mountain,
    };
    return iconMap[interest] || Globe;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section with Left Text, Right Photo Layout */}
      <section className="relative px-6 py-16 sm:py-24 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-20 h-20 bg-orange-200 rounded-full opacity-20 animate-pulse"></div>
          <div
            className="absolute top-40 right-20 w-32 h-32 bg-blue-200 rounded-full opacity-20 animate-pulse"
            style={{ animationDelay: "1s" }}
          ></div>
          <div
            className="absolute bottom-20 left-1/4 w-16 h-16 bg-purple-200 rounded-full opacity-20 animate-pulse"
            style={{ animationDelay: "2s" }}
          ></div>
        </div>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8 order-2 lg:order-1">
              <div className="inline-flex items-center px-4 py-2 bg-blue-100 rounded-full text-blue-700 text-sm font-medium shadow-lg">
                <Globe className="w-4 h-4 mr-2" />
                Connect • Explore • Experience
              </div>

              <div className="space-y-6">
                <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 leading-tight">
                  Find Your Perfect
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                    Travel Companion
                  </span>
                </h1>

                <p className="text-xl text-gray-700 leading-relaxed">
                  Connect with travelers, join local activities, and create
                  unforgettable memories with people who share your passion for
                  exploration.
                </p>
              </div>

              {/* Search Bar */}
              <div className="relative max-w-md">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Where are you traveling?"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none text-lg shadow-lg bg-white"
                />
              </div>

              <button
                onClick={handleStartExploring}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 shadow-xl group"
              >
                Start Exploring
                <ArrowRight className="inline-block ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </button>
            </div>

            {/* Right Photo with Tilt Animation - Fixed Version */}
            <div className="order-1 lg:order-2 ">
              <div className="relative group transform rotate-2 hover:rotate-0 transition-all duration-700">
                {/* Background shadow/blur */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>

                {/* Main image container */}
                <div className="relative">
                  <img
                    src="https://statics.vinpearl.com/international-travel-0_1684821084.jpg"
                    alt="Travel companions exploring together"
                    className="w-full h-[500px] object-cover rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-700"
                  />

                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent rounded-3xl"></div>

                  {/* Floating Elements */}
                  <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg group-hover:scale-110 transition-all duration-300">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-sm font-medium text-gray-700">
                        Live Connections
                      </span>
                    </div>
                  </div>

                  <div className="absolute bottom-6 right-6 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg group-hover:scale-110 transition-all duration-300">
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium text-gray-700">
                        12.5K+ Active
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Location Map Section */}
      <section className="px-6 py-16 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-6">
              <div className="inline-flex items-center px-4 py-2 bg-green-100 rounded-full text-green-700 text-sm font-medium">
                <Navigation className="w-4 h-4 mr-2" />
                Discover Your Area
              </div>

              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
                Explore What's Around You
              </h2>

              <p className="text-lg text-gray-700 leading-relaxed">
                Find travelers, activities, and hidden gems in your current
                location. Our interactive map shows real-time data of fellow
                explorers and exciting experiences waiting to be discovered.
              </p>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Users className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="text-gray-700">
                    See nearby travelers in real-time
                  </span>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <Calendar className="w-4 h-4 text-purple-600" />
                  </div>
                  <span className="text-gray-700">
                    Discover local activities and events
                  </span>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <MapPin className="w-4 h-4 text-green-600" />
                  </div>
                  <span className="text-gray-700">
                    Find popular meetup spots
                  </span>
                </div>
              </div>
            </div>

            {/* Right Map */}
            <div className="relative group ">
              <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
              <div className="relative bg-white p-8  rounded-3xl shadow-2xl overflow-hidden group-hover:shadow-3xl transition-all duration-500 group-hover:scale-[1.02]">
                <div className="h-[400px] w-full rounded-3xl">
                  <CurrentLocationGoogleMap />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="px-6 py-12 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group cursor-pointer">
                <div
                  className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl ${stat.color} bg-opacity-10 mb-4 group-hover:scale-110 group-hover:bg-opacity-20 transition-all duration-300`}
                >
                  <stat.icon className={`w-8 h-8 ${stat.color}`} />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1 group-hover:scale-105 transition-transform duration-300">
                  {stat.value}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="px-6 py-16 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              What would you like to do?
            </h2>
            <p className="text-gray-600 text-lg">
              Jump into your next adventure with these quick actions
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action, index) => (
              <div
                key={index}
                className="group cursor-pointer transform hover:-translate-y-3 transition-all duration-300"
                onClick={() => setActiveTab(action.action)}
              >
                <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl group-hover:bg-gradient-to-br group-hover:from-white group-hover:to-gray-50 transition-all duration-300">
                  <div
                    className={`${action.color} w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}
                  >
                    <action.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-300">
                    {action.title}
                  </h3>
                  <p className="text-gray-600 group-hover:text-gray-700 transition-colors duration-300">
                    {action.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Content Tabs */}
      <section className="px-6 py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          {/* Tab Navigation */}
          <div className="flex justify-center mb-8">
            <div className="bg-white p-1 rounded-2xl shadow-lg">
              {["discover", "activities"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                    activeTab === tab
                      ? "bg-blue-600 text-white shadow-lg transform scale-105"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  {tab === "discover"
                    ? "Featured Travelers"
                    : "Popular Activities"}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === "discover" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredTravelers.map((traveler) => (
                <div
                  key={traveler.id}
                  className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 group cursor-pointer"
                >
                  <div className="flex items-start space-x-4">
                    <div className="relative">
                      <img
                        src={traveler.avatar}
                        alt={traveler.name}
                        className="w-16 h-16 rounded-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div
                        className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white ${
                          traveler.online ? "bg-green-500" : "bg-gray-400"
                        } ${traveler.online ? "animate-pulse" : ""}`}
                      ></div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                          {traveler.name}, {traveler.age}
                        </h3>
                        <div className="flex items-center">
                          <Star className="w-4 h-4 text-yellow-400 fill-current group-hover:scale-110 transition-transform duration-300" />
                          <span className="text-sm text-gray-600 ml-1">
                            {traveler.rating}
                          </span>
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm mb-2 flex items-center">
                        <MapPin className="w-3 h-3 mr-1" />
                        {traveler.location}
                      </p>
                      <p className="text-gray-700 text-sm mb-3">
                        {traveler.bio}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {traveler.interests.slice(0, 3).map((interest, idx) => {
                          const IconComponent = getInterestIcon(interest);
                          return (
                            <span
                              key={idx}
                              className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-lg group-hover:bg-blue-200 transition-colors duration-300"
                            >
                              <IconComponent className="w-3 h-3 mr-1" />
                              {interest}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "activities" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 group cursor-pointer"
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={activity.image}
                      alt={activity.title}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="absolute top-4 right-4 bg-white px-2 py-1 rounded-lg text-sm font-medium group-hover:scale-105 transition-transform duration-300">
                      {activity.type}
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-300">
                      {activity.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-2 flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      {activity.location}
                    </p>
                    <p className="text-gray-600 text-sm mb-3 flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {activity.date}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm text-gray-600">
                        <Users className="w-4 h-4 mr-1" />
                        {activity.participants}/{activity.maxParticipants}{" "}
                        joined
                      </div>
                      <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 hover:scale-105 transition-all duration-300">
                        Join Activity
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-8 text-white relative overflow-hidden group hover:shadow-2xl transition-all duration-500">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10">
              <h2 className="text-3xl font-bold mb-4 group-hover:scale-105 transition-transform duration-300">
                Ready to Start Your Adventure?
              </h2>
              <p className="text-xl mb-6 opacity-90">
                Join thousands of travelers who have found their perfect travel
                companions
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-white text-blue-600 px-8 py-3 rounded-xl font-semibold hover:bg-gray-100 hover:scale-105 transition-all duration-300">
                  Sign Up Free
                </button>
                <button className="border-2 border-white text-white px-8 py-3 rounded-xl font-semibold hover:bg-white hover:text-blue-600 hover:scale-105 transition-all duration-300">
                  Learn More
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
