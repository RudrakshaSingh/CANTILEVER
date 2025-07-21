import { useEffect } from "react";
import {
  Newspaper,
  Users,
  Globe,
  Award,
  Heart,
  Shield,
  Clock,
  Star,
  TrendingUp,
  CheckCircle,
} from "lucide-react";
import Header from "../components/Header";

function AboutUs() {
  const values = [
    {
      icon: <Shield className="w-8 h-8 text-purple-600" />,
      title: "Trust & Integrity",
      description:
        "We maintain the highest standards of journalistic integrity and factual accuracy in every story we publish.",
    },
    {
      icon: <Globe className="w-8 h-8 text-indigo-600" />,
      title: "Global Perspective",
      description:
        "Bringing you stories from around the world with local relevance and meaningful context.",
    },
    {
      icon: <Users className="w-8 h-8 text-purple-600" />,
      title: "Community First",
      description:
        "Building an engaged community of informed readers who value quality journalism and meaningful discourse.",
    },
    {
      icon: <Award className="w-8 h-8 text-indigo-600" />,
      title: "Excellence",
      description:
        "Striving for excellence in every story, every headline, and every interaction with our readers.",
    },
  ];

  const achievements = [
    {
      icon: <Users className="w-6 h-6 text-purple-600" />,
      stat: "5M+",
      label: "Monthly Readers",
    },
    {
      icon: <Globe className="w-6 h-6 text-indigo-600" />,
      stat: "150+",
      label: "Countries Reached",
    },
    {
      icon: <Award className="w-6 h-6 text-purple-600" />,
      stat: "25+",
      label: "Awards Won",
    },
    {
      icon: <Clock className="w-6 h-6 text-indigo-600" />,
      stat: "24/7",
      label: "Live Coverage",
    },
  ];

  const features = [
    "Breaking news alerts within minutes",
    "Expert analysis from seasoned journalists",
    "Fact-checked and verified reporting",
    "Mobile-first reading experience",
    "Ad-free premium content",
    "Interactive multimedia stories",
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
              About NewsHub
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8">
              Connecting millions of readers worldwide with trusted, timely, and
              compelling news stories that matter most.
            </p>

            {/* Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
              {achievements.map((achievement, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg p-4 shadow-lg hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="flex items-center justify-center mb-2">
                    {achievement.icon}
                  </div>
                  <div className="text-2xl font-bold text-gray-800">
                    {achievement.stat}
                  </div>
                  <div className="text-sm text-gray-600">
                    {achievement.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mission Statement */}
          <div className="bg-white rounded-2xl shadow-2xl p-10 relative overflow-hidden border border-gray-100 hover:shadow-3xl transition-all duration-500">
            <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-gradient-to-br from-indigo-100 to-blue-200 rounded-full opacity-40 blur-sm"></div>
            <div className="absolute -top-8 -right-8 w-28 h-28 bg-gradient-to-br from-purple-100 to-pink-200 rounded-full opacity-30 blur-sm"></div>

            <div className="relative z-10">
              <div className="flex items-center justify-center mb-8">
                <Heart className="w-10 h-10 text-purple-600 mr-4" />
                <h2 className="text-4xl font-bold text-gray-800">
                  Our Mission
                </h2>
              </div>
              <p className="text-lg text-gray-600 text-center max-w-4xl mx-auto leading-relaxed mb-8">
                At NewsHub, we believe that informed citizens are the foundation
                of a healthy democracy. Our mission is to deliver accurate,
                unbiased, and comprehensive news coverage that empowers our
                readers to make informed decisions about their world. We strive
                to be your trusted source for breaking news, in-depth analysis,
                and thoughtful commentary on the stories that shape our lives.
              </p>

              {/* What We Offer */}
              <div className="grid md:grid-cols-2 gap-4 max-w-4xl mx-auto">
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-3 p-3 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg"
                  >
                    <CheckCircle className="w-5 h-5 text-purple-600 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Our Values */}
          <div className="bg-white rounded-2xl shadow-2xl p-10 relative overflow-hidden border border-gray-100">
            <div className="absolute -top-12 -right-12 w-40 h-40 bg-gradient-to-br from-purple-100 to-pink-200 rounded-full opacity-30 blur-sm"></div>

            <div className="relative z-10">
              <h2 className="text-4xl font-bold text-gray-800 text-center mb-12">
                Our Values
              </h2>
              <div className="grid md:grid-cols-2 gap-8">
                {values.map((value, index) => (
                  <div
                    key={index}
                    className="group p-8 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl border border-purple-100 hover:shadow-xl hover:scale-105 transition-all duration-300"
                  >
                    <div className="flex items-center mb-6">
                      <div className="p-3 bg-white rounded-full shadow-md group-hover:shadow-lg transition-shadow duration-300">
                        {value.icon}
                      </div>
                      <h3 className="text-xl font-semibold text-gray-800 ml-4">
                        {value.title}
                      </h3>
                    </div>
                    <p className="text-gray-600 leading-relaxed">
                      {value.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Our Story */}
          <div className="bg-white rounded-2xl shadow-2xl p-10 relative overflow-hidden border border-gray-100">
            <div className="absolute -bottom-12 -right-12 w-44 h-44 bg-gradient-to-br from-blue-100 to-purple-200 rounded-full opacity-40 blur-sm"></div>

            <div className="relative z-10">
              <h2 className="text-4xl font-bold text-gray-800 text-center mb-12">
                Our Story
              </h2>
              <div className="max-w-4xl mx-auto">
                <div className="space-y-8">
                  <div className="flex items-start space-x-6">
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full flex items-center justify-center">
                      <Star className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">
                        The Beginning (2018)
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        Founded in 2018, NewsHub emerged from a simple yet
                        powerful idea: news should be accessible, reliable, and
                        engaging for everyone. What started as a small team of
                        passionate journalists has grown into a global network
                        of correspondents, editors, and digital innovators.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-6">
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">
                        Growing Impact (Today)
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        Today, we serve millions of readers across six
                        continents, delivering breaking news, investigative
                        reports, and thought-provoking analysis 24/7. Our
                        commitment to journalistic excellence has earned us
                        recognition from industry peers and, more importantly,
                        the trust of our readers.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-6">
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full flex items-center justify-center">
                      <Globe className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">
                        The Future
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        As we continue to evolve in the digital age, we remain
                        dedicated to our core principles: accuracy, fairness,
                        and the belief that quality journalism can make a
                        difference in the world. We're constantly innovating to
                        bring you the news in new and engaging ways.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          

          {/* Call to Action */}
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl shadow-2xl p-12 text-center text-white relative overflow-hidden">
            <div className="absolute -top-8 -left-8 w-32 h-32 bg-white rounded-full opacity-10 blur-sm"></div>
            <div className="absolute -bottom-8 -right-8 w-40 h-40 bg-white rounded-full opacity-10 blur-sm"></div>
            <div className="absolute top-4 right-4 w-24 h-24 bg-white rounded-full opacity-5 blur-sm"></div>

            <div className="relative z-10">
              <h2 className="text-4xl font-bold mb-6">Join Our Community</h2>
              <p className="text-xl opacity-90 max-w-2xl mx-auto">
                Stay informed with breaking news, exclusive stories, and expert
                analysis delivered directly to your inbox.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AboutUs;
