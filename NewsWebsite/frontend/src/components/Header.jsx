import { useState, useEffect, useRef } from "react";
import {
  Newspaper,
  User,
  ChevronDown,
  Menu,
  X,
  Home,
  Mail,
  Info,
  LogOut,
  BookOpen,
  UserPen,
  Gamepad2,
  Trophy,
  Monitor,
  Building,
  Briefcase,
  Heart,
  Microscope,
  Globe,
  Zap,
} from "lucide-react";
import { Link } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth, logout } from "../utils/firebaseConfig";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function Header() {
  const [userLoggedIn, setUserLoggedIn] = useState(null);
  const [isNewsDropdownOpen, setIsNewsDropdownOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const newsDropdownRef = useRef(null);
  const profileDropdownRef = useRef(null);

  // Simulate auth state change - replace with your actual Firebase auth
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUserLoggedIn(user);
    });
    return () => unsubscribe();
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        newsDropdownRef.current &&
        !newsDropdownRef.current.contains(event.target)
      ) {
        setIsNewsDropdownOpen(false);
      }
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target)
      ) {
        setIsProfileDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const newsCategories = [
    {
      name: "Trending News",
      icon: Zap,
      href: "/news/breaking",
      color: "text-red-500",
    },
    {
      name: "Sports",
      icon: Trophy,
      href: "/news/sports",
      color: "text-green-500",
    },
    {
      name: "Entertainment",
      icon: Monitor,
      href: "/news/entertainment",
      color: "text-pink-500",
    },
    {
      name: "Technology",
      icon: Monitor,
      href: "/news/technology",
      color: "text-blue-500",
    },
    {
      name: "Politics",
      icon: Building,
      href: "/news/politics",
      color: "text-purple-500",
    },
    {
      name: "Business",
      icon: Briefcase,
      href: "/news/business",
      color: "text-yellow-500",
    },
    {
      name: "Health",
      icon: Heart,
      href: "/news/health",
      color: "text-red-400",
    },
    {
      name: "Science",
      icon: Microscope,
      href: "/news/science",
      color: "text-indigo-500",
    },
    { name: "World", icon: Globe, href: "/news/world", color: "text-teal-500" },
    {
      name: "Gaming",
      icon: Gamepad2,
      href: "/news/gaming",
      color: "text-orange-500",
    },
  ];

  const navigate = useNavigate();

  const handleLogout = async () => {
    const { error } = await logout();
    if (!error) {
      setIsProfileDropdownOpen(false);
      navigate("/"); // redirect to home page
      toast.success("Logged out successfully!");
      setUserLoggedIn(null); // clear user state
    } else {
      toast.error("Logout failed. Please try again.");
    }
  };

  const navigationItems = [
    { name: "Home", href: "/", icon: Home },
    { name: "Contact", href: "/contact", icon: Mail },
    { name: "About", href: "/about", icon: Info },
  ];

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <Newspaper className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="hidden md:block">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                NewsHub
              </h1>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-4">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="flex items-center space-x-1 text-gray-700 hover:text-purple-600 px-4 py-2 text-1xl font-semibold transition-colors duration-200"
              >
                <item.icon className="w-5 h-5" />
                <span>{item.name}</span>
              </Link>
            ))}

            {/* News Dropdown */}
            <div className="relative" ref={newsDropdownRef}>
              <button
                onClick={() => setIsNewsDropdownOpen(!isNewsDropdownOpen)}
                className="flex items-center space-x-1 text-gray-700 hover:text-purple-600 px-4 py-2 text-lg font-semibold transition-colors duration-200"
              >
                <BookOpen className="w-5 h-5" />
                <span>News</span>
                <ChevronDown
                  className={`w-5 h-5 transition-transform duration-200 ${
                    isNewsDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isNewsDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-100 py-2 z-50">
                  <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide border-b border-gray-100">
                    News Categories
                  </div>
                  <div className="py-1">
                    {newsCategories.map((category) => (
                      <Link
                        key={category.name}
                        to={category.href}
                        className="flex items-center space-x-3 px-4 py-2 text-1xl font-bold text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors duration-150"
                        onClick={() => setIsNewsDropdownOpen(false)}
                      >
                        <category.icon
                          className={`w-6 h-6 ${category.color}`}
                        />
                        <span>{category.name}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </nav>

          {/* Right Side - Profile/Auth */}
          <div className="flex items-center space-x-4">
            {userLoggedIn ? (
              /* Logged In User */
              <div className="relative" ref={profileDropdownRef}>
                <button
                  onClick={() =>
                    setIsProfileDropdownOpen(!isProfileDropdownOpen)
                  }
                  className="flex items-center space-x-2 text-gray-700 hover:text-purple-600 transition-colors duration-200"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full flex items-center justify-center">
                    {userLoggedIn.avatar ? (
                      <img
                        src={userLoggedIn.avatar}
                        alt="Profile"
                        className="w-8 h-8 rounded-full"
                      />
                    ) : (
                      <User className="w-4 h-4 text-white" />
                    )}
                  </div>
                  <span className="hidden md:block text-sm font-medium">
                    {userLoggedIn.name}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${
                      isProfileDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isProfileDropdownOpen && (
                  <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-100 py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">
                        {userLoggedIn.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {userLoggedIn.email}
                      </p>
                    </div>
                    <Link
                      to="/profile"
                      className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors duration-150"
                    >
                      <UserPen className="w-4 h-4" />
                      <span>Profile</span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors duration-150"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* Not Logged In */
              <div className="hidden md:flex items-center space-x-3">
                <Link
                  to="/login"
                  className="text-purple-600 hover:text-purple-700 px-3 py-2 text-sm font-medium transition-colors duration-200"
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  Register
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-gray-700 hover:text-purple-600 hover:bg-purple-50 transition-colors duration-200"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="space-y-2">
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="flex items-center space-x-2 px-3 py-2 text-gray-700 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors duration-200"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Link>
              ))}

              {/* Mobile News Categories */}
              <div className="px-3 py-2">
                <div className="text-sm font-semibold text-gray-500 mb-2">
                  News Categories
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {newsCategories.map((category) => (
                    <Link
                      key={category.name}
                      to={category.href}
                      className="flex items-center space-x-2 px-2 py-1 text-sm text-gray-700 hover:text-purple-600 hover:bg-purple-50 rounded-md transition-colors duration-150"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <category.icon className={`w-4 h-4 ${category.color}`} />
                      <span>{category.name}</span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Mobile Auth */}
              {!userLoggedIn && (
                <div className="px-3 py-2 border-t border-gray-200 mt-4 pt-4">
                  <div className="space-y-2">
                    <Link
                      to="/login"
                      className="block w-full text-left px-3 py-2 text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition-colors duration-200"
                    >
                      Login
                    </Link>

                    <Link
                      to="/register"
                      className="block w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:from-purple-700 hover:to-indigo-700 transition-all duration-200"
                    >
                      Register
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
