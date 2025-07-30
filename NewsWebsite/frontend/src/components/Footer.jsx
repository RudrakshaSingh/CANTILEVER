import React from 'react';
import { Link } from 'react-router-dom';
import {
  Mail,
  Info,
  Home,
  Newspaper,
  Twitter,
  Facebook,
  Instagram,
  Linkedin
} from 'lucide-react';

function Footer() {
  const navigationItems = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Contact', href: '/contact', icon: Mail },
    { name: 'About', href: '/about', icon: Info },
    { name: 'News', href: '/news/TopHeadlines', icon: Newspaper },
  ];

  const socialLinks = [
    { name: 'Twitter', href: 'https://twitter.com', icon: Twitter },
    { name: 'Facebook', href: 'https://facebook.com', icon: Facebook },
    { name: 'Instagram', href: 'https://instagram.com', icon: Instagram },
    { name: 'LinkedIn', href: 'https://linkedin.com', icon: Linkedin },
  ];

  return (
    <footer className="bg-gradient-to-r from-gray-900 to-indigo-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <Newspaper className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                NewsHub
              </h2>
            </div>
            <p className="text-gray-300 text-sm">
              Your trusted source for breaking news and in-depth stories from
              around the world.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-purple-400 transition-colors duration-200"
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {navigationItems.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className="flex items-center space-x-2 text-gray-300 hover:text-purple-400 transition-colors duration-200"
                  >
                    <item.icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter Signup */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Stay Updated</h3>
            <p className="text-gray-300 text-sm mb-4">
              Subscribe to our newsletter for daily news updates.
            </p>
           
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li className="flex items-center space-x-2">
                <Mail className="w-4 h-4" />
                <span>support@newshub.com</span>
              </li>
              <li className="flex items-center space-x-2">
                <span>123 News Street, Media City</span>
              </li>
              <li className="flex items-center space-x-2">
                <span>+1 (555) 123-4567</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
          <p>
            &copy; {new Date().getFullYear()} NewsHub. All rights reserved.{' '}
            <Link
              to="/privacy"
              className="hover:text-purple-400 transition-colors duration-200"
            >
              Privacy Policy
            </Link>{' '}
            |{' '}
            <Link
              to="/terms"
              className="hover:text-purple-400 transition-colors duration-200"
            >
              Terms of Service
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;