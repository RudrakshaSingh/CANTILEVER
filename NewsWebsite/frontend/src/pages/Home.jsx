
import React, { useState, useEffect , useCallback } from "react";
import {
  Clock,
  Globe,
  Zap,
  Briefcase,
  Heart,
  Gamepad2,
  ChevronRight,
  Star,
  Monitor,
  Building,
  Microscope,
  Trophy,
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
  const [errorCount, setErrorCount] = useState(0);

  const NEWS_API_BASE_URL =
    import.meta.env.VITE_NEWS_API_BASE_URL || "https://newsapi.org/v2";
  const NEWS_API_KEY = import.meta.env.VITE_NEWS_API_KEY;

  const fetchGivenNews = useCallback(async (endpoint, category) => {
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
  }, [NEWS_API_BASE_URL, NEWS_API_KEY]);

  const processArticles = useCallback((articles, categoryName = "") => {
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
          isBreaking: index === 0 || index === 1,
          source: article.source || { name: "News Source" },
          url: article.url || "#",
          content: article.content || null,
        };
      })
      .slice(0, 5);
  }, []);


  const fetchNews = useCallback(async () => {
    try {
      setLoading(true);
      setErrorCount(0);

      // Fetch different categories of news
      const newsPromises = [
        fetchGivenNews("top-headlines", "&country=us&pageSize=10"),
        fetchGivenNews(
          "everything",
          "&q=sports&sortBy=publishedAt&pageSize=5&language=en"
        ),
        fetchGivenNews(
          "everything",
          "&q=business&sortBy=publishedAt&pageSize=5&language=en"
        ),
        fetchGivenNews(
          "everything",
          "&q=entertainment&sortBy=publishedAt&pageSize=5&language=en"
        ),
        fetchGivenNews(
          "everything",
          "&q=technology&sortBy=publishedAt&pageSize=5&language=en"
        ),
        fetchGivenNews(
          "everything",
          "&q=health&sortBy=publishedAt&pageSize=5&language=en"
        ),
        fetchGivenNews(
          "everything",
          "&q=science&sortBy=publishedAt&pageSize=5&language=en"
        ),
        fetchGivenNews(
          "everything",
          "&q=world&sortBy=publishedAt&pageSize=5&language=en"
        ),
        fetchGivenNews(
          "everything",
          "&q=politics&sortBy=publishedAt&pageSize=5&language=en"
        ),
        fetchGivenNews(
          "everything",
          "&q=gaming&sortBy=publishedAt&pageSize=5&language=en"
        ),
      ];

      // Use Promise.allSettled to handle partial failures gracefully
      const results = await Promise.allSettled(newsPromises);
      
      let failedCount = 0;
      const [
        topHeadlinesResult,
        sportsResult,
        businessResult,
        entertainmentResult,
        technologyResult,
        healthResult,
        scienceResult,
        worldResult,
        politicsResult,
        gamingResult,
      ] = results;

      // Extract successful results and count failures
      const extractResult = (result) => {
        if (result.status === 'fulfilled') {
          return result.value;
        } else {
          failedCount++;
          return [];
        }
      };

      const topHeadlines = extractResult(topHeadlinesResult);
      const sports = extractResult(sportsResult);
      const business = extractResult(businessResult);
      const entertainment = extractResult(entertainmentResult);
      const technology = extractResult(technologyResult);
      const health = extractResult(healthResult);
      const science = extractResult(scienceResult);
      const world = extractResult(worldResult);
      const politics = extractResult(politicsResult);
      const gaming = extractResult(gamingResult);

      setErrorCount(failedCount);

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

      // Show appropriate toast based on results
      if (failedCount === 0) {
        toast.success("Latest news loaded successfully!");
      } else if (failedCount === results.length) {
        toast.error("Unable to load news. Please check your connection and try again.");
      } else {
        toast.success(`News loaded! (${results.length - failedCount}/${results.length} categories successful)`);
      }

    } catch (error) {
      console.error("Error fetching news:", error);
      toast.error("Failed to load news. Please try again later.");
      setErrorCount(10); // Set high error count to indicate complete failure
    } finally {
      setLoading(false);
    }
  }, [fetchGivenNews, processArticles]);

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

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

  const breakingNews = newsCategories.topHeadlines[0]; // First article as breaking news
  const otherTopNews = newsCategories.topHeadlines.slice(1); // All other articles starting from 2nd

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

  // Show error state if all requests failed
  if (errorCount >= 10) {
    return (
      <div>
        <Header />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center max-w-md">
            <div className="bg-red-100 rounded-full p-4 mx-auto mb-4 w-fit">
              <svg className="h-12 w-12 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Unable to Load News</h2>
            <p className="text-gray-600 mb-6">
              We're having trouble connecting to our news service. Please check your internet connection and try again.
            </p>
            <button 
              onClick={fetchNews}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center space-x-2 mx-auto"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Try Again</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header />
      <div className="min-h-screen bg-gray-50">
        {/* Show partial error banner if some requests failed */}
        {errorCount > 0 && errorCount < 10 && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  Some news categories couldn't be loaded. Showing available content.
                </p>
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
                    </div>
                  </div>
                  <div className="relative group cursor-pointer">
                    <div className="overflow-hidden rounded-xl shadow-2xl">
                      <img
                        src={breakingNews.image}
                        alt={breakingNews.title}
                        className="w-full h-96 object-cover transition-transform duration-300 ease-in-out group-hover:scale-110"
                      />
                    </div>
                    <div className="absolute top-4 right-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      BREAKING
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Top Headlines Section with Scrollable Cards and Numbered List */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Top Headlines
              </h2>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Scrollable Cards Section - 2/3 width */}
              <div className="lg:col-span-2">
                <div className="flex overflow-x-auto space-x-6 pb-4 scrollbar-none">
                  {otherTopNews.map((article) => (
                    <div
                      key={article.id}
                      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow flex-shrink-0 w-80 group cursor-pointer"
                    >
                      <div className="relative overflow-hidden">
                        <img
                          src={article.image}
                          alt={article.title}
                          className="w-full h-48 object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
                        />
                        <div className="absolute top-3 left-3 bg-blue-600 text-white px-2 py-1 rounded text-xs font-semibold">
                          Top Headlines
                        </div>
                      </div>
                      <div className="p-4">
                          <h3 className="font-bold text-lg mb-2 text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors duration-300">
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

              {/* Numbered Headlines List - 1/3 width */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg shadow-md p-6 h-fit">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
                    <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      #
                    </span>
                    <span>Top Stories</span>
                  </h3>
                  <div className="space-y-4">
                    {newsCategories.topHeadlines.slice(0, 5).map((article, index) => (
                      <div
                        key={article.id}
                        className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
                      >
                        <div className="text-lg font-bold text-blue-600 w-6 flex-shrink-0">
                          {index + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-sm text-gray-900 line-clamp-2 leading-snug">
                            {article.title}
                          </h4>
                          <div className="flex items-center space-x-2 text-xs text-gray-500 mt-2">
                            <span>{formatTimeAgo(article.publishedAt)}</span>
                            <span>•</span>
                            <span>{article.readTime}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
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
                    {articles.slice(0, 3).map((article) => (
                      <div
                        key={article.id}
                        className="flex space-x-3 hover:bg-gray-50 p-2 rounded-lg cursor-pointer group"
                      >
                        <div className="overflow-hidden rounded-lg flex-shrink-0">
                          <img
                            src={article.image}
                            alt={article.title}
                            className="w-16 h-16 object-cover transition-transform duration-300 ease-in-out group-hover:scale-110"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-sm text-gray-900 mb-1 line-clamp-2 group-hover:text-blue-600 transition-colors duration-300">
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

          
        </div>
      </div>
    </div>
  );
}

export default Home;