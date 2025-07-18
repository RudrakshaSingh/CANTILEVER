import React, { useState, useEffect } from "react";
import {
  Menu,
  Search,
  Bell,
  User,
  Clock,
  Share2,
  TrendingUp,
  Globe,
  Zap,
  Briefcase,
  Heart,
  Gamepad2,
  ChevronRight,
  Play,
  Star,
  ArrowRight,
  Calendar,
  Filter,
  BookOpen,
  Users,
  Award,
  Monitor,
  Building,
  Microscope,
  Trophy,
  Loader,
  RefreshCw, 
} from "lucide-react";
import Header from "../components/Header";
import axios from "axios";
import toast from "react-hot-toast";

function Home() {
  const [newsCategories, setNewsCategories] = useState({
    topHeadlines: [],
    sports: [],
    entertainment: [],
    technology: [],
    politics: [],
    business: [],
    health: [],
    science: [],
    world: [],
    gaming: [],
  });

  const [loading, setLoading] = useState(true);

  const NEWS_API_BASE_URL =
    import.meta.env.VITE_NEWS_API_BASE_URL || "https://newsapi.org/v2";
  const NEWS_API_KEY = import.meta.env.VITE_NEWS_API_KEY;

  const fetchGivenNews = async (endpoint, category) => {
    try {
      const response = await axios.get(
        `${NEWS_API_BASE_URL}/${endpoint}?apiKey=${NEWS_API_KEY}${category}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status !== 200) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = response.data;
      return data.articles || [];
    } catch {
      toast.error(`Failed to fetch ${endpoint} news. Please try again later.`);
      return [];
    }
  };

  const processArticles = (articles, categoryName = "") => {
    return articles
      .filter(article => 
        article &&
        article.title &&
        article.title !== '[Removed]' &&
        article.description &&
        article.urlToImage &&
        article.urlToImage !== null &&
        !article.title.includes('removed') &&
        article.source.name
      )
      .map((article, index) => {
        return {
          id: article.url || `article-${Date.now()}-${index}`,
          title: article.title || "No title available",
          category: categoryName || article.source?.name || "News",
          image: article.urlToImage || "no image available",
          summary: article.description || "No summary available",
          author: article.author || "Unknown Author",
          publishedAt: article.publishedAt || new Date().toISOString(),
          readTime: `${Math.max(
            1,
            Math.ceil(
              (article.content || article.description || "").length / 200
            )
          )} min read`,
          isBreaking: index === 0 && Math.random() > 0.8,
          source: article.source || { name: "News Source" },
          url: article.url || "#",
          content: article.content || null,
        };
      })
      .slice(0, 5); // Limit to 5 articles per category
  };

  const fetchNews = async () => {
    try {
      setLoading(true);

      // Fetch different categories of news
      const newsPromises = [
        fetchGivenNews("top-headlines", "&country=us&pageSize=3"),
        fetchGivenNews(
          "everything",
          "&q=sports&sortBy=publishedAt&pageSize=3&language=en"
        ),
        fetchGivenNews(
          "everything",
          "&q=business&sortBy=publishedAt&pageSize=3&language=en"
        ),
        fetchGivenNews(
          "everything",
          "&q=entertainment&sortBy=publishedAt&pageSize=3&language=en"
        ),
        fetchGivenNews(
          "everything",
          "&q=technology&sortBy=publishedAt&pageSize=3&language=en"
        ),
        fetchGivenNews(
          "everything",
          "&q=health&sortBy=publishedAt&pageSize=3&language=en"
        ),
        fetchGivenNews(
          "everything",
          "&q=science&sortBy=publishedAt&pageSize=3&language=en"
        ),
        fetchGivenNews(
          "everything",
          "&q=world&sortBy=publishedAt&pageSize=3&language=en"
        ),
        fetchGivenNews(
          "everything",
          "&q=politics&sortBy=publishedAt&pageSize=3&language=en"
        ),
        fetchGivenNews(
          "everything",
          "&q=gaming&sortBy=publishedAt&pageSize=3&language=en"
        ),
      ];

      const [
        topHeadlines,
        sports,
        business,
        entertainment,
        technology,
        health,
        science,
        world,
        politics,
        gaming,
      ] = await Promise.all(newsPromises);

      console.log("Fetched news data:", {
        topHeadlines,
        sports,
        business,
        entertainment,
        technology,
        health,
        science,
        world,
        politics,
        gaming,
      });

      // Process and set news data
      setNewsCategories({
        topHeadlines: processArticles(topHeadlines || [], "Breaking"),
        sports: processArticles(sports || [], "Sports"),
        business: processArticles(business || [], "Business"),
        entertainment: processArticles(entertainment || [], "Entertainment"),
        technology: processArticles(technology || [], "Technology"),
        health: processArticles(health || [], "Health"),
        science: processArticles(science || [], "Science"),
        world: processArticles(world || [], "World"),
        politics: processArticles(politics || [], "Politics"),
        gaming: processArticles(gaming || [], "Gaming"),
      });

      // Only show success toast after everything is loaded
      toast.success("Latest news loaded successfully!");
    } catch (error) {
      console.error("Error fetching news:", error);
      toast.error("Failed to load news. Please try again later.");
    } finally {
      setLoading(false); // Always set loading to false, whether success or error
    }
  };

  useEffect(() => {
    fetchNews();
    console.log("Fetching news from NewsAPI...", newsCategories);
  }, []);

  const formatTimeAgo = (dateString) => {
    const now = new Date();
    const published = new Date(dateString);
    const diffInHours = Math.floor((now - published) / (1000 * 60 * 60));

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  if (loading) {
    return (
      <div>
        <Header />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <RefreshCw className="h-20 w-20 animate-spin text-purple-600 mx-auto mb-4" />
            <p className="text-gray-800 text-lg">Loading latest news...</p>
            <p className="text-gray-700 text-sm mt-2">
              Fetching real-time updates from NewsAPI
            </p>
          </div>
        </div>
      </div>
    );
  }

  const breakingNews = newsCategories.topHeadlines.find(article => article.isBreaking);
  const otherTopNews = newsCategories.topHeadlines.filter(article => !article.isBreaking);

  const categoryIcons = {
    Breaking: Zap,
    Sports: Trophy,
    Business: Briefcase,
    Technology: Monitor,
    Entertainment: Star,
    World: Globe,
    Politics: Building,
    Health: Heart,
    Science: Microscope,
    Gaming: Gamepad2
  };

  return (
    <div>
      <Header />
      <div className="min-h-screen bg-gray-50">
        {/* Breaking News Banner */}
        {breakingNews && (
          <div className="bg-red-600 text-white py-2 px-4 shadow-lg">
            <div className="max-w-7xl mx-auto flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Zap className="h-5 w-5 text-yellow-300" />
                <span className="font-bold text-sm uppercase tracking-wide">
                  Breaking News
                </span>
              </div>
              <div className="h-4 w-px bg-white/30"></div>
              <div className="flex-1">
                <span className="text-sm font-medium">
                  {breakingNews.title}
                </span>
              </div>
              <div className="text-xs opacity-75">
                {formatTimeAgo(breakingNews.publishedAt)}
              </div>
            </div>
          </div>
        )}

        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Hero Section with Breaking News */}
          {breakingNews && (
            <div className="mb-12">
              <div className="relative">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                  <div className="space-y-6">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                      <span className="text-red-600 font-bold text-sm uppercase tracking-wide">
                        Breaking News
                      </span>
                    </div>
                    <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                      {breakingNews.title}
                    </h1>
                    <p className="text-xl text-gray-600 leading-relaxed">
                      {breakingNews.summary}
                    </p>
                    <div className="flex items-center space-x-6 text-gray-500">
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4" />
                        <span className="text-sm">
                          {formatTimeAgo(breakingNews.publishedAt)}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm">
                          By {breakingNews.author}
                        </span>
                      </div>
                    </div>
                    <div className="flex space-x-4">
                      <button className="bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors">
                        Read Full Story
                      </button>
                      <button className="border border-gray-300 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors flex items-center space-x-2">
                        <Share2 className="h-4 w-4" />
                        <span>Share</span>
                      </button>
                    </div>
                  </div>
                  <div className="relative">
                    <img
                      src={breakingNews.image}
                      alt={breakingNews.title}
                      className="w-full h-96 object-cover rounded-xl shadow-2xl"
                    />
                    <div className="absolute top-4 right-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      LIVE
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Top Headlines Section */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Top Headlines
              </h2>
              <button className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 font-semibold">
                <span>View All</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {otherTopNews.map((article) => (
                <div
                  key={article.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="relative">
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-3 left-3 bg-blue-600 text-white px-2 py-1 rounded text-xs font-semibold">
                      {article.category}
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-lg mb-2 text-gray-900 line-clamp-2">
                      {article.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {article.summary}
                    </p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center space-x-2">
                        <span>{article.author}</span>
                        <span>•</span>
                        <span>{formatTimeAgo(article.publishedAt)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <span>{article.readTime}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Categories Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {Object.entries(newsCategories).map(([categoryKey, articles]) => {
              if (categoryKey === "topHeadlines" || articles.length === 0)
                return null;

              const categoryName =
                categoryKey.charAt(0).toUpperCase() + categoryKey.slice(1);
              const IconComponent = categoryIcons[categoryName] || Globe;

              return (
                <div
                  key={categoryKey}
                  className="bg-white rounded-lg shadow-md overflow-hidden"
                >
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4">
                    <div className="flex items-center space-x-2">
                      <IconComponent className="h-5 w-5" />
                      <h3 className="font-bold text-lg">{categoryName}</h3>
                    </div>
                  </div>
                  <div className="p-4 space-y-4">
                    {articles.slice(0, 3).map((article, index) => (
                      <div
                        key={article.id}
                        className="flex space-x-3 hover:bg-gray-50 p-2 rounded-lg cursor-pointer"
                      >
                        <img
                          src={article.image}
                          alt={article.title}
                          className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-sm text-gray-900 mb-1 line-clamp-2">
                            {article.title}
                          </h4>
                          <div className="flex items-center space-x-2 text-xs text-gray-500">
                            <span>{formatTimeAgo(article.publishedAt)}</span>
                            <span>•</span>
                            <span>{article.readTime}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="border-t p-4">
                    <button className="w-full text-blue-600 hover:text-blue-800 font-semibold text-sm flex items-center justify-center space-x-2">
                      <span>View More {categoryName}</span>
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Trending Section */}
          <div className="mt-12 bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center space-x-2 mb-6">
              <TrendingUp className="h-6 w-6 text-red-600" />
              <h2 className="text-2xl font-bold text-gray-900">Trending Now</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.values(newsCategories)
                .flat()
                .slice(0, 6)
                .map((article, index) => (
                  <div
                    key={article.id}
                    className="flex items-center space-x-4 p-3 hover:bg-gray-50 rounded-lg cursor-pointer"
                  >
                    <div className="text-2xl font-bold text-gray-300 w-8">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 line-clamp-1">
                        {article.title}
                      </h4>
                      <div className="flex items-center space-x-2 text-sm text-gray-500 mt-1">
                        <span>{article.category}</span>
                        <span>•</span>
                        <span>{formatTimeAgo(article.publishedAt)}</span>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;