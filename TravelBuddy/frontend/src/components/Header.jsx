import React, { useState } from 'react';
import { 
  MapPin, 
  Users, 
  Calendar, 
  MessageCircle, 
  Bell, 
  User, 
  Menu, 
  X, 
  Globe,
  Plus,
  Star,
  Settings
} from 'lucide-react';

// Header Component
function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const navigationItems = [
    { label: 'Discover Travelers', href: '/discover', icon: Users },
    { label: 'Find Activities', href: '/activities', icon: Calendar },
    { label: 'Destinations', href: '/destinations', icon: MapPin },
    { label: 'Messages', href: '/messages', icon: MessageCircle, badge: 2 }
  ];

  const profileMenuItems = [
    { label: 'My Profile', href: '/profile/me', icon: User },
    { label: 'My Adventures', href: '/trips', icon: Calendar },
    { label: 'Saved Places', href: '/saved', icon: Star },
    { label: 'Settings', href: '/settings', icon: Settings },
    { label: 'Help & Support', href: '/help', icon: null },
    { label: 'Sign Out', href: '/logout', icon: null, danger: true }
  ];

  return (
    <header className="bg-white/95 backdrop-blur-md shadow-lg sticky top-0 z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                <Globe className="w-6 h-6 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  TravelBuddy
                </span>
                <span className="text-xs text-gray-500 -mt-1">Find Your Adventure</span>
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navigationItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="relative flex items-center space-x-2 px-4 py-2 rounded-xl text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 group"
              >
                <item.icon className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span className="font-medium text-sm">{item.label}</span>
                {item.badge && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full flex items-center justify-center font-semibold shadow-lg">
                    {item.badge}
                  </span>
                )}
              </a>
            ))}
          </div>

          {/* Right side actions */}
          <div className="flex items-center space-x-3">
            {/* Create Activity Button */}
            <div className="relative hidden lg:block">
              <a
                href="/create/activity"
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <Plus className="w-4 h-4" />
                <span className="font-semibold text-sm">Create Activity</span>
              </a>
            </div>

            {/* Notifications */}
            <button className="relative p-2.5 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200 group">
              <Bell className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full flex items-center justify-center font-semibold shadow-lg animate-pulse">
                3
              </span>
            </button>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                className="flex items-center space-x-3 p-2 rounded-xl hover:bg-gray-100 transition-all duration-200 group"
              >
                <div className="relative">
                  <img
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face"
                    alt="Profile"
                    className="w-9 h-9 rounded-xl object-cover ring-2 ring-gray-200 group-hover:ring-blue-300 transition-all"
                  />
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
                </div>
                <div className="hidden sm:block text-left">
                  <div className="text-sm font-semibold text-gray-900">John Doe</div>
                  <div className="text-xs text-gray-500">Adventure Seeker</div>
                </div>
              </button>

              {/* Profile Dropdown Menu */}
              {isProfileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-10">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <div className="flex items-center space-x-3">
                      <img
                        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face"
                        alt="Profile"
                        className="w-10 h-10 rounded-xl object-cover"
                      />
                      <div>
                        <div className="font-semibold text-gray-900">John Doe</div>
                        <div className="text-sm text-gray-500">john@example.com</div>
                      </div>
                    </div>
                  </div>
                  
                  {profileMenuItems.map((item, index) => (
                    <a
                      key={item.label}
                      href={item.href}
                      className={`flex items-center space-x-3 px-4 py-2.5 transition-colors ${
                        item.danger 
                          ? 'text-red-600 hover:bg-red-50' 
                          : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'
                      } ${index === profileMenuItems.length - 2 ? 'border-t border-gray-100 mt-1 pt-3' : ''}`}
                      onClick={() => setIsProfileDropdownOpen(false)}
                    >
                      {item.icon && <item.icon className="w-4 h-4" />}
                      <span className="font-medium text-sm">{item.label}</span>
                    </a>
                  ))}
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2.5 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-gray-100 py-4 bg-white/95 backdrop-blur-md">
            {/* Mobile Create Button */}
            <div className="px-4 mb-4 lg:hidden">
              <a
                href="/create/activity"
                className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold shadow-lg"
              >
                <Plus className="w-5 h-5" />
                <span>Create Activity</span>
              </a>
            </div>

            {/* Mobile Navigation Items */}
            <div className="space-y-1 px-2">
              {navigationItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="relative flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-blue-600 rounded-xl transition-colors group"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                  {item.badge && (
                    <span className="ml-auto w-6 h-6 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full flex items-center justify-center font-semibold">
                      {item.badge}
                    </span>
                  )}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;