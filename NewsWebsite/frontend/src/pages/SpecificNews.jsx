import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { AlertCircle, RefreshCw, ExternalLink, Clock, ArrowLeft, TrendingUp, Loader } from 'lucide-react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../utils/firebaseConfig';
import axios from 'axios';
import Header from '../components/Header';

function SpecificNews() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [newsArticles, setNewsArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMoreArticles, setHasMoreArticles] = useState(true);
  const [totalResults, setTotalResults] = useState(0);

  const NEWS_API_KEY = import.meta.env.VITE_NEWS_API_KEY;
  const NEWS_API_BASE_URL = import.meta.env.VITE_NEWS_API_BASE_URL || 'https://newsapi.org/v2';

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  const formatTimeAgo = (dateString) => {
    const now = new Date();
    const published = new Date(dateString);
    const diffInHours = Math.floor((now - published) / (1000 * 60 * 60));

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  const processArticles = useCallback((articles) => {
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
          category: id || article.source?.name || "News",
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
          source: article.source || { name: "News Source" },
          url: article.url || "#",
          content: article.content || null,
        };
      });
  }, [id]);

  
const fetchNews = useCallback(
  async (page = 1, append = false) => {
    try {
      if (page === 1) {
        setLoading(true);
        setError(null);
      } else {
        setLoadingMore(true);
      }

      let response;

      if (id === 'TopHeadlines') {
        response = await axios.get(
          `${NEWS_API_BASE_URL}/top-headlines?apiKey=${NEWS_API_KEY}&country=us&pageSize=20&page=${page}`,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
      } else {
        response = await axios.get(
          `${NEWS_API_BASE_URL}/everything?apiKey=${NEWS_API_KEY}&q=${id}&sortBy=publishedAt&pageSize=20&language=en&page=${page}`,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
      }

      if (response.status !== 200) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = response.data;
      
      // Check for API errors including maximumResultsReached
      if (data.status === 'error') {
        if (data.code === 'maximumResultsReached') {
          // We've reached the API limit
          setHasMoreArticles(false);
          if (append) {
            // Don't show error toast for limit reached when appending
            // The "All caught up" message will show instead
            return; // Exit early without error
          } else {
            // If it's the first page and we hit the limit, it means no results
            throw new Error("API results limit reached. Please try a more specific search.");
          }
        } else {
          // Other API errors
          throw new Error(data.message || 'API request failed');
        }
      }

      const processedArticles = processArticles(data.articles || []);
      
      // Set total results for pagination logic
      setTotalResults(data.totalResults || 0);
      
      // Check if there are more articles to load
      // Continue loading as long as we get any articles, only stop when we get 0 articles
      if (append && processedArticles.length === 0) {
        setHasMoreArticles(false);
      } else if (!append) {
        // On initial load, assume there are more articles unless we got 0
        setHasMoreArticles(processedArticles.length > 0);
      }
      // For append=true with articles > 0, keep hasMoreArticles as true

      if (append) {
        // Remove duplicates when appending
        setNewsArticles(prevArticles => {
          const existingUrls = new Set(prevArticles.map(article => article.url));
          const newArticles = processedArticles.filter(article => !existingUrls.has(article.url));
          return [...prevArticles, ...newArticles];
        });
        
        if (processedArticles.length > 0) {
          toast.success(`Loaded ${processedArticles.length} more articles!`);
        } else {
          // Only when we get 0 articles, we've reached the end
          setHasMoreArticles(false);
          toast('No more articles available', { icon: 'ℹ️' });
        }
      } else {
        setNewsArticles(processedArticles);
        
        if (processedArticles.length > 0) {
          toast.success(`Found ${processedArticles.length} articles about ${id}!`);
        } else {
          toast.error(`No articles found for "${id}"`);
        }
      }

    } catch (error) {
      console.error("Error fetching news:", error);
      
      // Check if it's an axios error with response data
      if (error.response && error.response.data) {
        const errorData = error.response.data;
        if (errorData.status === 'error' && errorData.code === 'maximumResultsReached') {
          setHasMoreArticles(false);
          if (append) {
            // Don't show error toast for limit reached when appending
            return; // Exit silently, let the UI show "All caught up"
          } else {
            setError("API results limit reached. Please try a more specific search or upgrade your plan.");
          }
          return;
        }
      }
      
      const errorMessage = 'Failed to load news. Please check your connection and try again.';
      setError(errorMessage);
      toast.error(page === 1 ? "Failed to load news. Please try again later." : "Failed to load more articles.");
    } finally {
      if (page === 1) {
        setLoading(false);
      } else {
        setLoadingMore(false);
      }
    }
  },
  [
    id,
    NEWS_API_BASE_URL,
    NEWS_API_KEY,
    processArticles,
    setLoading,
    setError,
    setLoadingMore,
    setTotalResults,
    setHasMoreArticles,
    setNewsArticles,
  ]
);

  // Load more function for button click
  const loadMoreArticles = () => {
    if (loadingMore || !hasMoreArticles) return;
    
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    fetchNews(nextPage, true);
  };

  // Initial fetch
  useEffect(() => {
    if (id) {
      setCurrentPage(1);
      setNewsArticles([]);
      setHasMoreArticles(true);
      fetchNews(1, false);
    }
  }, [id, fetchNews]);

  const checkLoginStatus = (articleUrl) => {
    if (!currentUser) {
      toast.error('Please log in to read full articles');
      navigate('/user/login');
    } else {
      window.open(articleUrl, '_blank');
    }
  };

  if (loading) {
    return (
      <div>
        <Header />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <RefreshCw className="h-20 w-20 animate-spin text-purple-600 mx-auto mb-4" />
            <p className="text-gray-800 text-lg">Loading {id} news...</p>
            <p className="text-gray-700 text-sm mt-2">
              Fetching real-time updates from NewsAPI
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error && newsArticles.length === 0) {
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
            <p className="text-gray-600 mb-6">{error}</p>
            <button 
              onClick={() => fetchNews(1, false)}
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

  const featuredArticle = newsArticles[0]; // First article as featured
  const otherArticles = newsArticles.slice(1); // Rest of the articles

  return (
    <div>
      <Header />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          
          {/* Navigation and Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-6 w-6 text-blue-600" />
              <h1 className="text-3xl font-bold text-gray-900 capitalize">
                {id} News
              </h1>
            </div>
            {totalResults > 0 && (
              <div className="text-sm text-gray-500">
                Showing {newsArticles.length} of {totalResults.toLocaleString()} articles
              </div>
            )}
          </div>

          {newsArticles.length === 0 ? (
            <div className="text-center py-12">
              <div className="bg-gray-100 rounded-full p-8 mx-auto mb-6 w-fit">
                <AlertCircle className="h-16 w-16 text-gray-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">No Articles Found</h2>
              <p className="text-gray-600 mb-6">
                We couldn't find any articles for "{id}". Try searching for something else.
              </p>
              <button
                onClick={() => navigate('/')}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Back to Home
              </button>
            </div>
          ) : (
            <>
              {/* Featured Article Section */}
              {featuredArticle && (
                <div className="mb-12">
                  <div className="relative">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                      <div className="space-y-6">
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                          <span className="text-blue-600 font-bold text-sm uppercase tracking-wide">
                            Featured Story
                          </span>
                        </div>
                        <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                          {featuredArticle.title}
                        </h2>
                        <p className="text-xl text-gray-600 leading-relaxed">
                          {featuredArticle.summary}
                        </p>
                        <div className="flex items-center space-x-6 text-gray-500">
                          <div className="flex items-center space-x-2">
                            <Clock className="h-4 w-4" />
                            <span className="text-sm">
                              {formatTimeAgo(featuredArticle.publishedAt)}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm">
                              By {featuredArticle.author}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm">
                              {featuredArticle.readTime}
                            </span>
                          </div>
                        </div>
                        <div className="flex space-x-4">
                          <button 
                            onClick={() => checkLoginStatus(featuredArticle.url)}
                            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center space-x-2"
                          >
                            <span>Read Full Story</span>
                            <ExternalLink className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      <div className="relative group cursor-pointer" onClick={() => checkLoginStatus(featuredArticle.url)}>
                        <div className="overflow-hidden rounded-xl shadow-2xl">
                          <img
                            src={featuredArticle.image}
                            alt={featuredArticle.title}
                            className="w-full h-96 object-cover transition-transform duration-300 ease-in-out group-hover:scale-110"
                            onError={(e) => {
                              e.target.src = 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&h=600&fit=crop&q=80';
                            }}
                          />
                        </div>
                        <div className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                          FEATURED
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Articles Grid */}
              {otherArticles.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold text-gray-900">
                      More Stories
                    </h3>
                    <div className="text-sm text-gray-500">
                      {otherArticles.length} articles
                    </div>
                  </div>
                  
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {otherArticles.map((article) => (
                      <div
                        key={article.id}
                        className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow group cursor-pointer"
                        onClick={() => checkLoginStatus(article.url)}
                      >
                        <div className="relative overflow-hidden">
                          <img
                            src={article.image}
                            alt={article.title}
                            className="w-full h-48 object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
                            onError={(e) => {
                              e.target.src = 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&h=600&fit=crop&q=80';
                            }}
                          />
                          <div className="absolute top-3 left-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-2 py-1 rounded text-xs font-semibold">
                            {article.source.name}
                          </div>
                        </div>
                        <div className="p-4">
                          <h4 className="font-bold text-lg mb-2 text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors duration-300">
                            {article.title}
                          </h4>
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
                          <div className="mt-3 flex items-center justify-between">
                            <div className="flex items-center space-x-2 text-xs text-blue-600">
                              <Clock className="h-3 w-3" />
                              <span>
                                {new Date(article.publishedAt).toLocaleDateString('en-US', {
                                  day: 'numeric',
                                  month: 'short',
                                  year: 'numeric',
                                })}
                              </span>
                            </div>
                            <ExternalLink className="h-4 w-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Load More Button */}
              {hasMoreArticles && (
                <div className="text-center py-12">
                  <button
                    onClick={loadMoreArticles}
                    disabled={loadingMore}
                    className={`px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105 ${
                      loadingMore
                        ? 'bg-gray-400 text-white cursor-not-allowed'
                        : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl'
                    }`}
                  >
                    {loadingMore ? (
                      <div className="flex items-center space-x-3">
                        <Loader className="h-5 w-5 animate-spin" />
                        <span>Loading more articles...</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-3">
                        <RefreshCw className="h-5 w-5" />
                        <span>Load More Articles</span>
                      </div>
                    )}
                  </button>
                  <p className="text-gray-500 text-sm mt-4">
                    Showing {newsArticles.length} articles 
                  </p>
                </div>
              )}

              {/* End of Results Indicator */}
              {!hasMoreArticles && newsArticles.length > 0 && (
                <div className="text-center py-12">
                  <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-xl p-8 max-w-md mx-auto">
                    <div className="flex items-center justify-center mb-4">
                      <div className="bg-green-500 text-white rounded-full p-2">
                        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    </div>
                    <p className="text-gray-700 font-semibold text-lg mb-2">All caught up!</p>
                    <p className="text-gray-600 text-sm">
                      You've viewed all {newsArticles.length} available articles for "{id}".
                    </p>
                    <button
                      onClick={() => fetchNews(1, false)}
                      className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                    >
                      Refresh Articles
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default SpecificNews;