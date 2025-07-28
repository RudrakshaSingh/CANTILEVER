import { useState } from 'react';
import { 
  MapPin, 
  Users, 
  Calendar, 
  MessageCircle, 
  User, 
  Menu, 
  X, 
  Globe,
  Plus,
  Star,
  Settings,
  LogIn,
  UserPlus,
  LogOut,
} from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from "../Redux/Slices/UserSlice"
import { useNavigate } from 'react-router-dom';
import LogoutConfirmationModal from './LogoutConfirmationModel';


// Header Component
function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  
  // Get user from Redux store
  const { user } = useSelector((state) => state.user);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const navigationItems = [
    { label: 'Discover Travelers', href: '/discover', icon: Users },
    { label: 'Find Activities', href: '/activities', icon: Calendar },
    { label: 'Destinations', href: '/destinations', icon: MapPin },
    ...(user ? [{ label: 'Messages', href: '/messages', icon: MessageCircle, badge: 2 }] : [])
  ];

  const profileMenuItems = [
    { label: 'My Profile', href: '/user/profile', icon: User },
    { label: 'My Adventures', href: '/trips', icon: Calendar },
    { label: 'Saved Places', href: '/saved', icon: Star },
    { label: 'Settings', href: '/user/profile?tab=settings', icon: Settings },
    { label: 'Help & Support', href: '/help', icon: null },
  ];

  // Handle logout confirmation
  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await dispatch(logoutUser()).unwrap();
      setIsLogoutModalOpen(false);
      setIsProfileDropdownOpen(false);
      // Redirect will be handled by the Redux action
    } catch {
      // Error handling is done in the Redux action with toast
      setIsLogoutModalOpen(false);
    } finally {
      setIsLoggingOut(false);
    }
  };

  // Handle logout click
  const handleLogoutClick = (e) => {
    e.preventDefault();
    setIsProfileDropdownOpen(false);
    setIsLogoutModalOpen(true);
  };

  return (
    <>
      <header className="bg-white/95 backdrop-blur-md shadow-lg sticky top-0 z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div onClick={() => navigate('/')} className="flex-shrink-0 flex items-center cursor-pointer">
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
              {user ? (
                // Authenticated user UI
                <>
                  {/* Create Activity Button */}
                  <div className="relative hidden lg:block">
                    <a
                      href="/activity/create"
                      className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                      <Plus className="w-4 h-4" />
                      <span className="font-semibold text-sm">Create Activity</span>
                    </a>
                  </div>

                  {/* Profile Dropdown */}
                  <div className="relative">
                    <button
                      onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                      className="flex items-center space-x-3 p-2 rounded-xl hover:bg-gray-100 transition-all duration-200 group"
                    >
                      <div className="relative">
                        <img
                          src={user.profilePicture || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face"}
                          alt="Profile"
                          className="w-9 h-9 rounded-xl object-cover ring-2 ring-gray-200 group-hover:ring-blue-300 transition-all"
                        />
                        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
                      </div>
                      <div className="hidden sm:block text-left">
                        <div className="text-sm font-semibold text-gray-900">{user.fullName}</div>
                      </div>
                    </button>

                    {/* Profile Dropdown Menu */}
                    {isProfileDropdownOpen && (
                      <div onMouseLeave={() => setIsProfileDropdownOpen(false)} className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-10 overflow-hidden">
                        <div className="px-4 py-3 border-b border-gray-100">
                          <div className="flex items-center space-x-3">
                            <img
                              src={user.profilePicture || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face"}
                              alt="Profile"
                              className="w-10 h-10 rounded-xl object-cover"
                            />
                            <div>
                              <div className="font-semibold text-gray-900">{user.fullName}</div>
                              <div className="text-sm text-gray-500">{user.email}</div>
                            </div>
                          </div>
                        </div>
                        
                        {profileMenuItems.map((item) => (
                          <a
                            key={item.label}
                            href={item.href}
                            className="flex items-center space-x-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors"
                            onClick={() => setIsProfileDropdownOpen(false)}
                          >
                            {item.icon && <item.icon className="w-4 h-4" />}
                            <span className="font-medium text-sm">{item.label}</span>
                          </a>
                        ))}
                        
                        {/* Logout Button */}
                        <div className="border-t border-gray-100 mt-1 pt-1">
                          <button
                            onClick={handleLogoutClick}
                            className="w-full flex items-center space-x-3 px-4 py-2.5 text-red-600 hover:bg-red-50 transition-colors"
                          >
                            <LogOut className="w-4 h-4" />
                            <span className="font-medium text-sm">Sign Out</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                // Unauthenticated user UI - Login/Signup buttons
                <div className="hidden lg:flex items-center space-x-3">
                  <a
                    href="/user/login"
                    className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200 group font-medium"
                  >
                    <LogIn className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    <span className="text-sm">Login</span>
                  </a>
                  <a
                    href="/user/register"
                    className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span className="text-sm">Sign Up</span>
                  </a>
                </div>
              )}

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
              {user ? (
                // Mobile Create Button for authenticated users
                <div className="px-4 mb-4">
                  <a
                    href="/create/activity"
                    className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold shadow-lg"
                  >
                    <Plus className="w-5 h-5" />
                    <span>Create Activity</span>
                  </a>
                </div>
              ) : (
                // Mobile Login/Signup buttons for unauthenticated users
                <div className="px-4 mb-4 space-y-3">
                  <a
                    href="/user/login"
                    className="w-full flex items-center justify-center space-x-2 px-4 py-3 border-2 border-blue-600 text-blue-600 rounded-xl font-semibold hover:bg-blue-50 transition-colors"
                  >
                    <LogIn className="w-5 h-5" />
                    <span>Login</span>
                  </a>
                  <a
                    href="/user/register"
                    className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold shadow-lg"
                  >
                    <UserPlus className="w-5 h-5" />
                    <span>Sign Up</span>
                  </a>
                </div>
              )}

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
                
                {/* Mobile Logout Button for authenticated users */}
                {user && (
                  <button
                    onClick={(e) => {
                      setIsMenuOpen(false);
                      handleLogoutClick(e);
                    }}
                    className="w-full flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                  >
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium">Sign Out</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Logout Confirmation Modal */}
      <LogoutConfirmationModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleLogout}
        isLoggingOut={isLoggingOut}
      />
    </>
  );
}

export default Header;