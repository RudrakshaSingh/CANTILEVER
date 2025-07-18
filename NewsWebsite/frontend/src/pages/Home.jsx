import React, { useState, useEffect } from "react";
import {
  Menu,
  Search,
  Bell,
  User,
  Clock,
  Eye,
  MessageCircle,
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
    gaming: []
  });

  const [loading, setLoading] = useState(true);

  const NEWS_API_BASE_URL = import.meta.env.VITE_NEWS_API_BASE_URL || "https://newsapi.org/v2";
  const NEWS_API_KEY = import.meta.env.VITE_NEWS_API_KEY;

  const fetchGivenNews = async (endpoint,category) => {
    try {
      const response = await axios.get(
        `${NEWS_API_BASE_URL}/${endpoint}?apiKey=${NEWS_API_KEY}${category}`,
        {
          headers: {
            'Content-Type': 'application/json',
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
  const processArticles = (articles, categoryName = '') => {
    return articles
      .filter(article => article && article.title && article.title !== "[Removed]")
      .map((article, index) => {
        // Generate fallback image based on category
        const categoryImages = {
          technology: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=400&fit=crop",
          business: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=400&fit=crop",
          sports: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&h=400&fit=crop",
          entertainment: "https://images.unsplash.com/photo-1489599511810-b3c5e0b5781c?w=800&h=400&fit=crop",
          science: "https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=800&h=400&fit=crop",
          health: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=400&fit=crop",
          politics: "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=800&h=400&fit=crop",
          world: "https://images.unsplash.com/photo-1569163139394-de4e4f43e4e3?w=800&h=400&fit=crop",
          gaming: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&h=400&fit=crop"
        };

        const fallbackImage = categoryImages[categoryName.toLowerCase()] || 
                             "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&h=400&fit=crop";

        return {
          id: article.url || `article-${Date.now()}-${index}`,
          title: article.title || 'No title available',
          category: categoryName || article.source?.name || 'News',
          image: article.urlToImage || fallbackImage,
          summary: article.description || 
                   (article.content ? article.content.substring(0, 150) + '...' : 'No summary available'),
          author: article.author || 'Unknown Author',
          publishedAt: article.publishedAt || new Date().toISOString(),
          readTime: `${Math.max(1, Math.ceil(((article.content || article.description || '').length / 200)))} min read`,
          views: Math.floor(Math.random() * 50000) + 1000,
          comments: Math.floor(Math.random() * 500) + 10,
          isBreaking: index === 0 && Math.random() > 0.8,
          source: article.source || { name: 'News Source' },
          url: article.url || '#'
        };
      })
      .slice(0, 5); // Limit to 5 articles per category
  };

  const fetchNews = async () => {
  try {
    setLoading(true);
    
    // Fetch different categories of news
    const newsPromises = [
      fetchGivenNews('top-headlines', '&country=us&pageSize=10'),
      fetchGivenNews('everything', '&q=sports&sortBy=publishedAt&pageSize=10&language=en'),
      fetchGivenNews('everything', '&q=business&sortBy=publishedAt&pageSize=10&language=en'),
      fetchGivenNews('everything', '&q=entertainment&sortBy=publishedAt&pageSize=10&language=en'),
      fetchGivenNews('everything', '&q=technology&sortBy=publishedAt&pageSize=10&language=en'),
      fetchGivenNews('everything', '&q=health&sortBy=publishedAt&pageSize=10&language=en'),
      fetchGivenNews('everything', '&q=science&sortBy=publishedAt&pageSize=10&language=en'),
      fetchGivenNews('everything', '&q=world&sortBy=publishedAt&pageSize=10&language=en'),
      fetchGivenNews('everything', '&q=politics&sortBy=publishedAt&pageSize=10&language=en'),
      fetchGivenNews('everything', '&q=gaming&sortBy=publishedAt&pageSize=10&language=en')
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
      gaming
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
      gaming
    });

    // Process and set news data
    setNewsCategories({
      topHeadlines: processArticles(topHeadlines || [], 'Breaking'),
      sports: processArticles(sports || [], 'Sports'),
      business: processArticles(business || [], 'Business'),
      entertainment: processArticles(entertainment || [], 'Entertainment'),
      technology: processArticles(technology || [], 'Technology'),
      health: processArticles(health || [], 'Health'),
      science: processArticles(science || [], 'Science'),
      world: processArticles(world || [], 'World'),
      politics: processArticles(politics || [], 'Politics'),
      gaming: processArticles(gaming || [], 'Gaming')
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
            <p className="text-gray-700 text-sm mt-2">Fetching real-time updates from NewsAPI</p>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div>
      <Header />
    </div>
  );
}

export default Home;
