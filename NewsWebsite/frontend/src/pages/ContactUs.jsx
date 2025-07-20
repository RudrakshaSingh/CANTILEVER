import React, { useEffect } from 'react';
import { 
  Mail, 
  Phone, 
  MapPin, 
  MessageCircle, 
  Clock,
  Star,
  Globe,
  Newspaper
} from 'lucide-react';
import Header from '../components/Header';

function ContactUs() {
  const stats = [
    { icon: MessageCircle, label: 'Messages Answered', value: '10,000+' },
    { icon: Clock, label: 'Average Response', value: '2 Hours' },
    { icon: Star, label: 'Satisfaction Rate', value: '99%' },
    { icon: Globe, label: 'Countries Served', value: '50+' }
  ];
  // Scroll to top when component mounts or id changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto space-y-12">
          {/* Hero Section */}
          <div className="text-center relative z-10">
            <div className="mx-auto w-24 h-24 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full flex items-center justify-center mb-8 shadow-xl transform hover:scale-105 transition-transform duration-300">
              <Newspaper className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4">
              Contact Us
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8">
              Have a story tip, question, or feedback? We'd love to hear from you. Our team is here to help 24/7.
            </p>

            {/* Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg p-4 shadow-lg hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="flex items-center justify-center mb-2">
                    <stat.icon className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="text-2xl font-bold text-gray-800">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-600">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white rounded-2xl shadow-2xl p-12 relative overflow-hidden border border-gray-100">
            {/* Animated Background Elements */}
            <div className="absolute -top-6 -left-6 w-32 h-32 bg-gradient-to-br from-purple-200 to-indigo-300 rounded-full opacity-20 blur-xl animate-pulse"></div>
            <div className="absolute -bottom-8 -right-8 w-40 h-40 bg-gradient-to-br from-indigo-200 to-purple-300 rounded-full opacity-30 blur-lg animate-pulse delay-1000"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-purple-50 to-indigo-100 rounded-full opacity-40 blur-2xl"></div>

            <div className="relative z-10">
              <div className="text-center mb-16">
                <h2 className="text-5xl font-bold bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 bg-clip-text text-transparent mb-4">
                  Get in Touch
                </h2>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                  We're here to help and answer any questions you might have. We look forward to hearing from you!
                </p>
              </div>

              <div className="space-y-8">
                {/* Email Card */}
                <div className="group relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-2xl blur-sm opacity-25 group-hover:opacity-40 transition-opacity duration-300"></div>
                  <div className="relative bg-white rounded-2xl p-8 border border-purple-100 hover:border-purple-200 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
                    <div className="flex items-center space-x-6">
                      <div className="relative">
                        <div className="w-20 h-20 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                          <Mail className="w-10 h-10 text-white" />
                        </div>
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-gray-800 mb-2">Email Us</h3>
                        <p className="text-gray-700 font-medium hover:text-purple-600 transition-colors cursor-pointer">
                          contact@newshub.com
                        </p>
                        <p className="text-gray-600 hover:text-purple-600 transition-colors cursor-pointer">
                          newsroom@newshub.com
                        </p>
                        <div className="mt-3 inline-block px-3 py-1 bg-purple-50 rounded-full">
                          <span className="text-sm text-purple-700 font-medium">Response within 24 hours</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Phone Card */}
                <div className="group relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl blur-sm opacity-25 group-hover:opacity-40 transition-opacity duration-300"></div>
                  <div className="relative bg-white rounded-2xl p-8 border border-indigo-100 hover:border-indigo-200 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
                    <div className="flex items-center space-x-6">
                      <div className="relative">
                        <div className="w-20 h-20 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                          <Phone className="w-10 h-10 text-white" />
                        </div>
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-gray-800 mb-2">Call Us</h3>
                        <p className="text-gray-700 font-medium hover:text-indigo-600 transition-colors cursor-pointer text-lg">
                          +91 7953673456
                        </p>
                        <p className="text-gray-600">24/7 Newsroom Hotline</p>
                        <div className="mt-3 inline-block px-3 py-1 bg-indigo-50 rounded-full">
                          <span className="text-sm text-indigo-700 font-medium">Always Available</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Location Card */}
                <div className="group relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl blur-sm opacity-25 group-hover:opacity-40 transition-opacity duration-300"></div>
                  <div className="relative bg-white rounded-2xl p-8 border border-purple-100 hover:border-purple-200 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
                    <div className="flex items-center space-x-6">
                      <div className="relative">
                        <div className="w-20 h-20 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg">
                          <MapPin className="w-10 h-10 text-white" />
                        </div>
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-gray-800 mb-2">Visit Us</h3>
                        <p className="text-gray-700 font-medium">NewsHub Headquarters</p>
                        <p className="text-gray-600">Road No-12, Tronika City</p>
                        <p className="text-gray-600">Uttar Pradesh, India 251152</p>
                        <div className="mt-3 inline-block px-3 py-1 bg-purple-50 rounded-full">
                          <span className="text-sm text-purple-700 font-medium">Open 9 AM - 6 PM</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContactUs;