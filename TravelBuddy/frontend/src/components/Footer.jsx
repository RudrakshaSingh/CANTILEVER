import React from 'react';
import { 
  Globe, 
  Instagram, 
  Twitter, 
  Facebook, 
  Mail, 
  Phone, 
  Shield, 
  HelpCircle,
  Users,
  Calendar,
  Heart,
  Award
} from "lucide-react";

function Footer() {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { label: 'Find Travelers', href: '/discover', icon: Users },
    { label: 'Activities', href: '/activities', icon: Calendar },
    { label: 'Help Center', href: '/help', icon: HelpCircle },
    { label: 'Safety', href: '/safety', icon: Shield }
  ];

  const socialLinks = [
    { 
      icon: Instagram, 
      href: 'https://instagram.com/travelbuddy', 
      label: 'Instagram',
      color: 'hover:bg-pink-500'
    },
    { 
      icon: Twitter, 
      href: 'https://twitter.com/travelbuddy', 
      label: 'Twitter',
      color: 'hover:bg-blue-400'
    },
    { 
      icon: Facebook, 
      href: 'https://facebook.com/travelbuddy', 
      label: 'Facebook',
      color: 'hover:bg-blue-600'
    }
  ];

  return (
    <footer className="bg-gradient-to-r from-gray-900 to-gray-800 text-white">
      {/* Main Footer Content */}
      <div className="py-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Brand Section */}
            <div className="sm:col-span-2 lg:col-span-1">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Globe className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">TravelBuddy</span>
              </div>
              
              <p className="text-gray-400 text-sm mb-4 leading-relaxed">
                Connect with travelers, join activities, and create unforgettable memories worldwide.
              </p>
              
              {/* Compact Stats - Better mobile layout */}
              <div className="grid grid-cols-3 gap-4 mb-4 text-xs">
                <div className="text-center">
                  <div className="font-bold text-blue-400">500K+</div>
                  <div className="text-gray-500">Users</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-purple-400">150+</div>
                  <div className="text-gray-500">Cities</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-pink-400">1M+</div>
                  <div className="text-gray-500">Connections</div>
                </div>
              </div>
              
              {/* Social Links */}
              <div className="flex space-x-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    className={`w-8 h-8 bg-gray-700 rounded-lg flex items-center justify-center ${social.color} transition-colors duration-300`}
                    aria-label={social.label}
                  >
                    <social.icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div className="sm:col-span-1">
              <h4 className="font-semibold mb-4 text-white">Quick Links</h4>
              <ul className="space-y-2">
                {quickLinks.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-gray-400 hover:text-white transition-colors text-sm flex items-center space-x-2 group"
                    >
                      <link.icon className="w-3 h-3 text-gray-500 group-hover:text-blue-400 transition-colors" />
                      <span>{link.label}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div className="sm:col-span-1">
              <h4 className="font-semibold mb-4 text-white">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="/about" className="text-gray-400 hover:text-white transition-colors">About Us</a></li>
                <li><a href="/careers" className="text-gray-400 hover:text-white transition-colors">Careers</a></li>
                <li><a href="/blog" className="text-gray-400 hover:text-white transition-colors">Blog</a></li>
                <li><a href="/press" className="text-gray-400 hover:text-white transition-colors">Press</a></li>
              </ul>
            </div>

            {/* Contact & Support */}
            <div className="sm:col-span-2 lg:col-span-1">
              <h4 className="font-semibold mb-4 text-white">Support</h4>
              <div className="space-y-3 text-sm">
                <div className="flex items-center text-gray-400">
                  <Mail className="w-3 h-3 mr-2 flex-shrink-0" />
                  <span className="break-all">support@travelbuddy.com</span>
                </div>
                <div className="flex items-center text-gray-400">
                  <Phone className="w-3 h-3 mr-2 flex-shrink-0" />
                  <span>24/7 Support</span>
                </div>
                <div className="pt-2 space-y-1">
                  <div className="flex items-center text-xs text-green-400">
                    <Award className="w-3 h-3 mr-1 flex-shrink-0" />
                    <span>Best Travel App 2024</span>
                  </div>
                  <div className="flex items-center text-xs text-gray-500">
                    <Shield className="w-3 h-3 mr-1 flex-shrink-0" />
                    <span>ISO 27001 Certified</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-8 pt-6 border-t border-gray-700">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-gray-400">
              <div className="flex items-center space-x-1 text-center sm:text-left">
                <Heart className="w-3 h-3 text-red-400 flex-shrink-0" />
                <span>© {currentYear} TravelBuddy. Made for travelers worldwide.</span>
              </div>
              
              <div className="flex flex-wrap justify-center sm:justify-end gap-4">
                <a href="/privacy" className="hover:text-white transition-colors">Privacy</a>
                <a href="/terms" className="hover:text-white transition-colors">Terms</a>
                <a href="/cookies" className="hover:text-white transition-colors">Cookies</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;