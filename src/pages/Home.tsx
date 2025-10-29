import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { PostCard } from "@/components/Blog/PostCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getPosts, getCategories } from "@/services/supabaseService";
import { Post, Category } from "@/types/blog";
import { useSiteSettings } from "@/contexts/SiteSettingsContext";
import {
  Search,
  TrendingUp,
  Clock,
  Eye,
  Calendar,
  User,
  ArrowRight,
  Flame,
  Star,
  BookOpen,
  Users,
  Award,
  ChevronRight,
  Trophy,
  Zap,
} from "lucide-react";

export default function Home() {
  const { settings } = useSiteSettings();
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);

  // Get brand name from settings
  const brandName = settings?.brand_name || "OnAssist";

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (searchTerm.trim()) {
      const filtered = posts.filter(
        (post) =>
          post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
          post.category?.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredPosts(filtered);
    } else {
      setFilteredPosts([]);
    }
  }, [searchTerm, posts]);

  // Update document title with dynamic brand name
  useEffect(() => {
    if (brandName) {
      document.title = `${brandName} - AI-Powered Blogging Platform | Latest Articles & Insights`;
    }
  }, [brandName]);

  const fetchData = async () => {
    try {
      const [postsData, categoriesData] = await Promise.all([
        getPosts(),
        getCategories(),
      ]);
      setPosts(postsData);
      setCategories(categoriesData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const featuredPost = posts.find((post) => post.is_trending) || posts[0];
  const trendingPosts = posts.filter((post) => post.is_trending).slice(0, 4);
  const latestPosts = posts.slice(0, 6);
  const popularPosts = [...posts].sort((a, b) => b.views - a.views).slice(0, 6);
  const editorsPicks = posts.slice(6, 12);

  // Get top 3 categories by post count
  const popularCategories = [...categories]
    .sort((a, b) => (b.post_count || 0) - (a.post_count || 0))
    .slice(0, 3);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  const displayPosts = searchTerm.trim() ? filteredPosts : latestPosts;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* SEO Meta Tags with dynamic brand name */}
      <head>
        <title>{brandName} - AI-Powered Blogging Platform | Latest Articles & Insights</title>
        <meta name="description" content={`Discover amazing content powered by AI. ${brandName} combines human creativity with artificial intelligence to deliver engaging articles on technology, lifestyle, travel, and more.`} />
        <meta name="keywords" content={`AI blog, artificial intelligence, technology articles, lifestyle content, travel guides, ${brandName}`} />
        <meta property="og:title" content={`${brandName} - AI-Powered Blogging Platform`} />
        <meta property="og:description" content="Discover amazing content powered by AI. Latest articles on technology, lifestyle, travel, and more." />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${brandName} - AI-Powered Blogging Platform`} />
        <meta name="twitter:description" content="Discover amazing content powered by AI. Latest articles on technology, lifestyle, travel, and more." />
      </head>

      {/* Top Navigation Bar */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-40">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between py-4 lg:py-6 gap-4 lg:gap-0">
            <div
              className="flex flex-nowrap items-center space-x-6 lg:space-x-10 mb-2 lg:mb-0 overflow-x-auto py-2 px-1 hide-scrollbar"
              style={{
                scrollbarWidth: "thin", // Firefox
                scrollbarColor: "#4f46e5 #f3f4f6", // Firefox (blue thumb, gray track)
              }}
            >
              <Link
                to="/"
                className="text-blue-600 font-semibold border-b-2 border-blue-600 pb-1 flex-shrink-0"
              >
                Home
              </Link>
              {categories.slice(0, 6).map((category) => (
                <Link
                  key={category.id}
                  to={`/category/${category.slug}`}
                  className="text-gray-700 hover:text-blue-600 font-medium transition-colors whitespace-nowrap flex-shrink-0"
                >
                  {category.name}
                </Link>
              ))}
            </div>
            <div className="flex items-center space-x-4">
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Search articles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-64 border-gray-300 focus:border-blue-500 rounded-lg"
                />
              </form>
              <Button
                type="submit"
                onClick={handleSearch}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold"
              >
                Search
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 lg:px-8 py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content Area - Left Column */}
          <div className="lg:col-span-3">
            {/* Search Results */}
            {searchTerm.trim() && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Search Results for "{searchTerm}" ({filteredPosts.length}{" "}
                  found)
                </h2>
                {filteredPosts.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredPosts.map((post) => (
                      <PostCard key={post.id} post={post} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">
                      No articles found matching your search.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Hero/Featured Article */}
            {!searchTerm.trim() && featuredPost && (
              <div className="mb-8">
                <Link to={`/post/${featuredPost.slug}`} className="block group">
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                    <div className="relative">
                      <img
                        src={featuredPost.featured_image}
                        alt={featuredPost.title}
                        className="w-full h-96 object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-4 left-4">
                        <Badge className="bg-red-600 hover:bg-red-700 text-white">
                          <Flame className="w-3 h-3 mr-1" />
                          Featured
                        </Badge>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-3">
                        <Badge
                          variant="outline"
                          className="text-blue-600 border-blue-600"
                        >
                          {featuredPost.category?.name}
                        </Badge>
                        <span className="text-sm text-gray-500">
                          {formatDate(featuredPost.published_at)}
                        </span>
                      </div>
                      <h1 className="text-3xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                        {featuredPost.title}
                      </h1>
                      <p className="text-gray-600 text-lg mb-4 line-clamp-2">
                        {featuredPost.excerpt}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-2">
                            <img
                              src={
                                featuredPost.author?.avatar ||
                                "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face"
                              }
                              alt={featuredPost.author?.name}
                              className="w-8 h-8 rounded-full"
                            />
                            <span className="text-sm font-medium text-gray-700">
                              {featuredPost.author?.name}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center space-x-1">
                            <Eye className="w-4 h-4" />
                            <span>{featuredPost.views.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>
                              {Math.ceil(featuredPost.content.length / 1000)}{" "}
                              min read
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            )}

            {/* Trending News Section */}
            {!searchTerm.trim() && trendingPosts.length > 0 && (
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                    <TrendingUp className="w-6 h-6 mr-2 text-red-600" />
                    Trending Now
                  </h2>
                  <Link
                    to="/trending"
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    View All <ArrowRight className="w-4 h-4 inline ml-1" />
                  </Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {trendingPosts.map((post) => (
                    <Link
                      key={post.id}
                      to={`/post/${post.slug}`}
                      className="block group"
                    >
                      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                        <div className="flex">
                          <div className="flex-shrink-0">
                            <img
                              src={post.featured_image}
                              alt={post.title}
                              className="w-32 h-24 object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                          <div className="p-4 flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant="outline" className="text-xs">
                                {post.category?.name}
                              </Badge>
                            </div>
                            <h3 className="text-sm font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                              {post.title}
                            </h3>
                            <div className="flex items-center justify-between text-xs text-gray-500">
                              <span>{formatDate(post.published_at)}</span>
                              <div className="flex items-center space-x-1">
                                <Eye className="w-3 h-3" />
                                <span>{post.views}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Latest Articles Grid */}
            {!searchTerm.trim() && (
              <div className="mb-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Latest Articles
                  </h2>
                  <div className="flex items-center space-x-2">
                    <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500">
                      <option>Latest</option>
                      <option>Most Popular</option>
                      <option>Most Viewed</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {latestPosts.map((post) => (
                    <PostCard key={post.id} post={post} />
                  ))}
                </div>
              </div>
            )}

            {/* Popular Categories - Redesigned (1 category per row) */}
            {!searchTerm.trim() && popularCategories.length > 0 && (
              <div className="mb-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                    <BookOpen className="w-6 h-6 mr-2 text-blue-600" />
                    Popular Categories
                  </h2>
                  <Link
                    to="/categories"
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    View All Categories{" "}
                    <ArrowRight className="w-4 h-4 inline ml-1" />
                  </Link>
                </div>
                <div className="space-y-8">
                  {popularCategories.map((category) => {
                    const categoryPosts = posts
                      .filter((post) => post.category_id === category.id)
                      .sort((a, b) => b.views - a.views)
                      .slice(0, 3);
                    return (
                      <div
                        key={category.id}
                        className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
                      >
                        {/* Category Header */}
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 border-b border-gray-100">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-3">
                              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                                <BookOpen className="w-6 h-6 text-white" />
                              </div>
                              <div>
                                <h3 className="text-xl font-bold text-gray-900">
                                  {category.name}
                                </h3>
                                <p className="text-gray-600 text-sm">
                                  {category.description ||
                                    "Explore amazing articles in this category"}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <Badge className="bg-blue-600 text-white text-sm px-3 py-1">
                                {category.post_count || 0} Articles
                              </Badge>
                              <p className="text-xs text-gray-500 mt-1">
                                Updated regularly
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Category Posts Grid */}
                        <div className="p-6">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {categoryPosts.map((post) => (
                              <Link
                                key={post.id}
                                to={`/post/${post.slug}`}
                                className="block group"
                              >
                                <div className="bg-gray-50 rounded-lg overflow-hidden hover:shadow-md transition-all duration-300 group-hover:bg-white">
                                  <img
                                    src={post.featured_image}
                                    alt={post.title}
                                    className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                                  />
                                  <div className="p-4">
                                    <h4 className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 mb-2">
                                      {post.title}
                                    </h4>
                                    <p className="text-xs text-gray-600 line-clamp-2 mb-3">
                                      {post.excerpt}
                                    </p>
                                    <div className="flex items-center justify-between text-xs text-gray-500">
                                      <span>{formatDate(post.published_at)}</span>
                                      <div className="flex items-center space-x-1">
                                        <Eye className="w-3 h-3" />
                                        <span>{post.views}</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </Link>
                            ))}
                          </div>
                          <div className="mt-6 text-center">
                            <Link
                              to={`/category/${category.slug}`}
                              className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-lg transition-colors"
                            >
                              Explore All {category.name} Articles
                              <ChevronRight className="w-4 h-4 ml-1" />
                            </Link>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Editor's Picks */}
            {!searchTerm.trim() && editorsPicks.length > 0 && (
              <div className="mb-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                    <Award className="w-6 h-6 mr-2 text-yellow-600" />
                    Editor's Picks
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {editorsPicks.slice(0, 4).map((post) => (
                    <Link
                      key={post.id}
                      to={`/post/${post.slug}`}
                      className="block group"
                    >
                      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                        <div className="flex">
                          <div className="flex-shrink-0">
                            <img
                              src={post.featured_image}
                              alt={post.title}
                              className="w-40 h-28 object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                          <div className="p-4 flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant="outline" className="text-xs">
                                {post.category?.name}
                              </Badge>
                            </div>
                            <h3 className="text-base font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                              {post.title}
                            </h3>
                            <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                              {post.excerpt}
                            </p>
                            <div className="flex items-center justify-between text-xs text-gray-500">
                              <span>{formatDate(post.published_at)}</span>
                              <div className="flex items-center space-x-3">
                                <div className="flex items-center space-x-1">
                                  <Eye className="w-3 h-3" />
                                  <span>{post.views}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <Clock className="w-3 h-3" />
                                  <span>
                                    {Math.ceil(post.content.length / 1000)} min
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Most Read This Week - Enhanced Design */}
            {!searchTerm.trim() && (
              <div className="mb-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                    <Trophy className="w-6 h-6 mr-2 text-yellow-600" />
                    Most Read This Week
                  </h2>
                </div>
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                  <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 border-b border-gray-200">
                    <div className="flex items-center space-x-2">
                      <Trophy className="w-5 h-5 text-yellow-600" />
                      <span className="font-semibold text-gray-900">
                        Top Performing Articles
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {popularPosts.slice(0, 6).map((post, index) => (
                        <Link
                          key={post.id}
                          to={`/post/${post.slug}`}
                          className="block group"
                        >
                          <div className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                            <div className="flex-shrink-0">
                              <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white ${
                                  index === 0
                                    ? "bg-yellow-500"
                                    : index === 1
                                    ? "bg-gray-400"
                                    : index === 2
                                    ? "bg-orange-500"
                                    : "bg-blue-500"
                                }`}
                              >
                                {index + 1}
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 mb-2">
                                {post.title}
                              </h4>
                              <div className="flex items-center space-x-2 mt-1">
                                <span className="text-xs text-gray-500">
                                  {formatDate(post.published_at)}
                                </span>
                                <span className="text-xs text-gray-400">•</span>
                                <div className="flex items-center space-x-1 text-xs text-gray-500">
                                  <Eye className="w-3 h-3" />
                                  <span className="font-semibold">
                                    {post.views.toLocaleString()}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Hot Topics Section */}
            {!searchTerm.trim() && (
              <div className="mb-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                    <Zap className="w-6 h-6 mr-2 text-orange-600" />
                    Hot Topics
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {posts.slice(12, 15).map((post) => (
                    <Link
                      key={post.id}
                      to={`/post/${post.slug}`}
                      className="block group"
                    >
                      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                        <img
                          src={post.featured_image}
                          alt={post.title}
                          className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="p-4">
                          <Badge variant="outline" className="text-xs mb-2">
                            {post.category?.name}
                          </Badge>
                          <h3 className="text-sm font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                            {post.title}
                          </h3>
                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <span>{formatDate(post.published_at)}</span>
                            <div className="flex items-center space-x-1">
                              <Eye className="w-3 h-3" />
                              <span>{post.views}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar - Right Column */}
          <div className="lg:col-span-1">
            <div className="sticky top-32 space-y-6">
              {/* Popular Articles */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <Star className="w-5 h-5 mr-2 text-yellow-600" />
                  Popular Articles
                </h3>
                <div className="space-y-4">
                  {popularPosts.slice(0, 4).map((post, index) => (
                    <Link
                      key={post.id}
                      to={`/post/${post.slug}`}
                      className="block group"
                    >
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                          {index + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                            {post.title}
                          </h4>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className="text-xs text-gray-500">
                              {formatDate(post.published_at)}
                            </span>
                            <span className="text-xs text-gray-400">•</span>
                            <div className="flex items-center space-x-1 text-xs text-gray-500">
                              <Eye className="w-3 h-3" />
                              <span>{post.views}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Categories */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Categories
                </h3>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <Link
                      key={category.id}
                      to={`/category/${category.slug}`}
                      className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors group"
                    >
                      <span className="text-sm font-medium text-gray-700 group-hover:text-blue-600">
                        {category.name}
                      </span>
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                        {category.post_count || 0}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Newsletter Signup */}
              <div className="bg-gradient-to-br from-blue-600 to-purple-700 rounded-lg p-6 text-white">
                <h3 className="text-lg font-bold mb-2">Stay Updated</h3>
                <p className="text-blue-100 mb-4 text-sm">
                  Get the latest articles delivered straight to your inbox.
                </p>
                <div className="space-y-3">
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    className="bg-white/20 border-white/30 text-white placeholder:text-white/70"
                  />
                  <Button className="w-full bg-white text-blue-600 hover:bg-gray-100">
                    Subscribe
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          height: 0px;
          background: transparent;
        }
        .hide-scrollbar {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
      `}</style>
    </div>
  );
}
