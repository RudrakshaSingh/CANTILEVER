import React, { useState } from 'react';
import { MapPin, Users, Calendar, MessageCircle, Search, Star, ArrowRight, Globe, Camera, Coffee, Mountain, Utensils } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { refreshUserData } from '../Redux/Slices/UserSlice';


function Home() {
  const [activeTab, setActiveTab] = useState('discover');
  const [searchQuery, setSearchQuery] = useState('');
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
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
      rating: 4.9,
      bio: "Digital nomad exploring Asia",
      online: true
    },
    {
      id: 2,
      name: "Alex Rodriguez",
      age: 32,
      location: "Barcelona, Spain",
      interests: ["Art", "Nightlife", "Architecture"],
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      rating: 4.8,
      bio: "Travel photographer and guide",
      online: false
    },
    {
      id: 3,
      name: "Emma Thompson",
      age: 26,
      location: "London, UK",
      interests: ["Museums", "Coffee", "Walking"],
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      rating: 4.7,
      bio: "Art student and coffee enthusiast",
      online: true
    }
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
      image: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=300&h=200&fit=crop"
    },
    {
      id: 2,
      title: "Local Food Tour",
      location: "Chinatown",
      date: "Tomorrow, 12:00 PM",
      participants: 6,
      maxParticipants: 8,
      type: "Food",
      image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=300&h=200&fit=crop"
    },
    {
      id: 3,
      title: "Hiking & Coffee",
      location: "Marin Headlands",
      date: "Weekend, 8:00 AM",
      participants: 4,
      maxParticipants: 10,
      type: "Adventure",
      image: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=300&h=200&fit=crop"
    }
  ];

  const stats = [
    { label: "Active Travelers", value: "12.5K", icon: Users, color: "text-blue-600" },
    { label: "Cities Covered", value: "150+", icon: Globe, color: "text-green-600" },
    { label: "Activities Daily", value: "200+", icon: Calendar, color: "text-purple-600" },
    { label: "Connections Made", value: "50K+", icon: MessageCircle, color: "text-orange-600" }
  ];

  const quickActions = [
    { 
      title: "Find Travelers", 
      description: "Connect with like-minded travelers nearby",
      icon: Users,
      color: "bg-gradient-to-r from-blue-500 to-blue-600",
      action: "discover"
    },
    { 
      title: "Join Activities", 
      description: "Participate in local experiences",
      icon: Calendar,
      color: "bg-gradient-to-r from-purple-500 to-purple-600",
      action: "activities"
    },
    { 
      title: "Plan Your Trip", 
      description: "Create and share your travel plans",
      icon: MapPin,
      color: "bg-gradient-to-r from-green-500 to-green-600",
      action: "trips"
    },
    { 
      title: "Start Chatting", 
      description: "Message travelers and activity groups",
      icon: MessageCircle,
      color: "bg-gradient-to-r from-orange-500 to-orange-600",
      action: "messages"
    }
  ];

  const getInterestIcon = (interest) => {
    const iconMap = {
      'Photography': Camera,
      'Food': Utensils,
      'Culture': Globe,
      'Art': Star,
      'Nightlife': MessageCircle,
      'Architecture': MapPin,
      'Museums': Star,
      'Coffee': Coffee,
      'Walking': Mountain
    };
    return iconMap[interest] || Globe;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <section className="relative px-6 py-16 sm:py-24 overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <img
            src="https://statics.vinpearl.com/international-travel-0_1684821084.jpg"
            alt="background"
            className="w-full h-full object-cover"
          />
          {/* Dark overlay for better text contrast */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/30"></div>
        </div>
        
        {/* Content with better z-index and contrast */}
        <div className="relative z-10 max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center px-4 py-2 bg-white/90 backdrop-blur-sm rounded-full text-blue-700 text-sm font-medium mb-6 shadow-lg">
            <Globe className="w-4 h-4 mr-2" />
            Connect • Explore • Experience
          </div>
          
          <h1 className="text-4xl sm:text-6xl font-bold text-white mb-6 drop-shadow-lg">
            Find Your Perfect
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 drop-shadow-none">
              Travel Companion
            </span>
          </h1>
          
          <p className="text-xl text-white/95 mb-8 max-w-2xl mx-auto drop-shadow-md">
            Connect with travelers, join local activities, and create unforgettable memories with people who share your passion for exploration.
          </p>
          
          {/* Search Bar */}
          <div className="relative max-w-md mx-auto mb-8">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Where are you traveling?"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none text-lg shadow-xl bg-white/95 backdrop-blur-sm"
            />
          </div>
          
          <button onClick={handleStartExploring} className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-2xl font-semibold text-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 shadow-xl">
            Start Exploring
            <ArrowRight className="inline-block ml-2 w-5 h-5" />
          </button>
        </div>
      </section>

      {/* Stats Section */}
      <section className="px-6 py-12 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${stat.color} bg-opacity-10 mb-4`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="px-6 py-16">
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
                className="group cursor-pointer transform hover:-translate-y-2 transition-all duration-300"
                onClick={() => setActiveTab(action.action)}
              >
                <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl">
                  <div className={`${action.color} w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <action.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {action.title}
                  </h3>
                  <p className="text-gray-600">
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
              {['discover', 'activities'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                    activeTab === tab
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {tab === 'discover' ? 'Featured Travelers' : 'Popular Activities'}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === 'discover' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredTravelers.map((traveler) => (
                <div key={traveler.id} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                  <div className="flex items-start space-x-4">
                    <div className="relative">
                      <img
                        src={traveler.avatar}
                        alt={traveler.name}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                      <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white ${
                        traveler.online ? 'bg-green-500' : 'bg-gray-400'
                      }`}></div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold text-gray-900">{traveler.name}, {traveler.age}</h3>
                        <div className="flex items-center">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-sm text-gray-600 ml-1">{traveler.rating}</span>
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm mb-2 flex items-center">
                        <MapPin className="w-3 h-3 mr-1" />
                        {traveler.location}
                      </p>
                      <p className="text-gray-700 text-sm mb-3">{traveler.bio}</p>
                      <div className="flex flex-wrap gap-2">
                        {traveler.interests.slice(0, 3).map((interest, idx) => {
                          const IconComponent = getInterestIcon(interest);
                          return (
                            <span key={idx} className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-lg">
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

          {activeTab === 'activities' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingActivities.map((activity) => (
                <div key={activity.id} className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                  <div className="relative">
                    <img
                      src={activity.image}
                      alt={activity.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-4 right-4 bg-white px-2 py-1 rounded-lg text-sm font-medium">
                      {activity.type}
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="font-semibold text-gray-900 mb-2">{activity.title}</h3>
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
                        {activity.participants}/{activity.maxParticipants} joined
                      </div>
                      <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
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
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-8 text-white">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Start Your Adventure?
            </h2>
            <p className="text-xl mb-6 opacity-90">
              Join thousands of travelers who have found their perfect travel companions
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-blue-600 px-8 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors">
                Sign Up Free
              </button>
              <button className="border-2 border-white text-white px-8 py-3 rounded-xl font-semibold hover:bg-white hover:text-blue-600 transition-all">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;