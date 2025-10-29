import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, User, Menu, X, Bell, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { useSiteSettings } from "@/contexts/SiteSettingsContext";
import { getCategories, getPosts } from "@/services/supabaseService";
import { Category, Post } from "@/types/blog";

interface HeaderProps {
  onSearch?: (query: string) => void;
  searchQuery?: string;
}

export function Header({ onSearch, searchQuery = "" }: HeaderProps) {
  const { user, signOut, isAuthenticated, isAdmin } = useAuth();
  const { settings } = useSiteSettings();
  const [localSearchQuery, setLocalSearchQuery] = React.useState(searchQuery);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [searchResults, setSearchResults] = React.useState<{
    categories: Category[];
    posts: Post[];
  }>({ categories: [], posts: [] });
  const [searchLoading, setSearchLoading] = React.useState(false);
  const [showDropdown, setShowDropdown] = React.useState(false);
  const searchRef = React.useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const debounceTimeout = React.useRef<NodeJS.Timeout | null>(null);

  // Get brand name from settings or fallback
  const brandName = settings?.brand_name || "OnAssist";

  // Real-time search effect
  React.useEffect(() => {
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    if (localSearchQuery.length < 2) {
      setSearchResults({ categories: [], posts: [] });
      setShowDropdown(false);
      setSearchLoading(false);
      return;
    }
    setSearchLoading(true);
    debounceTimeout.current = setTimeout(async () => {
      try {
        const [categories, posts] = await Promise.all([
          getCategories(),
          getPosts(),
        ]);
        const q = localSearchQuery.toLowerCase();
        const filteredCategories = categories.filter(
          (cat) =>
            cat.name.toLowerCase().includes(q) ||
            (cat.description && cat.description.toLowerCase().includes(q))
        );
        const filteredPosts = posts.filter(
          (post) =>
            post.title.toLowerCase().includes(q) ||
            post.excerpt.toLowerCase().includes(q) ||
            post.content.toLowerCase().includes(q) ||
            (post.category?.name &&
              post.category.name.toLowerCase().includes(q))
        );
        setSearchResults({
          categories: filteredCategories,
          posts: filteredPosts,
        });
        setShowDropdown(true);
      } catch {
        setSearchResults({ categories: [], posts: [] });
        setShowDropdown(true);
      } finally {
        setSearchLoading(false);
      }
    }, 300);
  }, [localSearchQuery]);

  // Close dropdown on outside click
  React.useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    }
    if (showDropdown) {
      document.addEventListener("mousedown", handleClick);
    } else {
      document.removeEventListener("mousedown", handleClick);
    }
    return () => document.removeEventListener("mousedown", handleClick);
  }, [showDropdown]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(localSearchQuery);
    setShowDropdown(false);
  };

  const handleResultClick = (type: "category" | "post", slug: string) => {
    setShowDropdown(false);
    setLocalSearchQuery("");
    if (type === "category") navigate(`/category/${slug}`);
    else navigate(`/post/${slug}`);
  };

  return (
    <header
      className="sticky top-0 z-50 backdrop-blur-md border-b border-slate-200/50 shadow-sm"
      style={{
        background: "rgba(255, 255, 255, 0.85)",
        fontFamily:
          'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center space-x-2 text-2xl font-bold transition-all duration-200 hover:scale-105"
          >
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm"
              style={{
                background:
                  "linear-gradient(135deg, #4f46e5, #7c3aed, #0891b2)",
              }}
            >
              {brandName.charAt(0).toUpperCase()}
            </div>
            <span
              className="bg-clip-text text-transparent"
              style={{
                background: "linear-gradient(135deg, #1e293b, #475569)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {brandName}
            </span>
          </Link>

          {/* Desktop Search Bar */}
          <div
            className="hidden lg:flex items-center flex-1 max-w-xl mx-8 relative"
            ref={searchRef}
          >
            <form onSubmit={handleSearch} className="w-full" autoComplete="off">
              <div className="relative w-full group">
                <div
                  className="absolute inset-0 rounded-full blur opacity-0 group-hover:opacity-20 transition-opacity duration-300"
                  style={{
                    background: "linear-gradient(135deg, #4f46e5, #0891b2)",
                  }}
                ></div>
                <div className="relative flex items-center bg-slate-50/80 rounded-full border border-slate-200/50 transition-all duration-200 focus-within:bg-white focus-within:border-indigo-300 focus-within:shadow-lg focus-within:shadow-indigo-100/50">
                  <Search className="absolute left-4 text-slate-400 h-5 w-5 transition-colors duration-200 group-focus-within:text-indigo-500" />
                  <Input
                    type="text"
                    placeholder="Search articles, topics, authors..."
                    value={localSearchQuery}
                    onChange={(e) => setLocalSearchQuery(e.target.value)}
                    className="pl-12 pr-20 py-3 bg-transparent border-none outline-none text-slate-700 placeholder:text-slate-400 font-medium rounded-full"
                  />
                  <Button
                    type="submit"
                    size="sm"
                    className="absolute right-2 text-white rounded-full px-6 py-2 font-semibold shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105"
                    style={{
                      background: "linear-gradient(135deg, #4f46e5, #0891b2)",
                    }}
                  >
                    Search
                  </Button>
                </div>
                {/* Search Results Dropdown */}
                {showDropdown && (
                  <div className="absolute left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-slate-200 z-50 max-h-96 overflow-y-auto animate-fade-in">
                    {searchLoading ? (
                      <div className="p-6 text-center text-slate-400">
                        Searching...
                      </div>
                    ) : searchResults.categories.length === 0 &&
                      searchResults.posts.length === 0 ? (
                      <div className="p-6 text-center text-slate-400">
                        No results found.
                      </div>
                    ) : (
                      <>
                        {searchResults.categories.length > 0 && (
                          <div className="px-6 pt-4 pb-2 border-b border-slate-100">
                            <div className="text-xs font-semibold text-slate-500 mb-2">
                              Categories
                            </div>
                            {searchResults.categories.map((cat) => (
                              <div
                                key={cat.id}
                                className="flex items-center gap-2 py-2 px-2 rounded-lg hover:bg-indigo-50 cursor-pointer transition-all"
                                onClick={() =>
                                  handleResultClick("category", cat.slug)
                                }
                              >
                                <span className="font-medium text-indigo-700">
                                  {cat.name}
                                </span>
                                <span className="text-xs text-slate-400 ml-2">
                                  {cat.post_count || 0} posts
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                        {searchResults.posts.length > 0 && (
                          <div className="px-6 pt-4 pb-2">
                            <div className="text-xs font-semibold text-slate-500 mb-2">
                              Posts
                            </div>
                            {searchResults.posts.map((post) => (
                              <div
                                key={post.id}
                                className="flex flex-col py-2 px-2 rounded-lg hover:bg-cyan-50 cursor-pointer transition-all"
                                onClick={() =>
                                  handleResultClick("post", post.slug)
                                }
                              >
                                <span className="font-medium text-slate-900 line-clamp-1">
                                  {post.title}
                                </span>
                                <span className="text-xs text-slate-500 line-clamp-1">
                                  {post.excerpt}
                                </span>
                                <span className="text-xs text-slate-400 mt-1">
                                  {post.category?.name}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                )}
              </div>
            </form>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-6">
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="relative px-4 py-2 text-slate-600 hover:text-slate-900 font-medium transition-all duration-200 rounded-lg hover:bg-slate-50 group"
                  >
                    Dashboard
                    <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-500 to-cyan-500 group-hover:w-full transition-all duration-300"></div>
                  </Link>
                )}
                <div className="flex items-center space-x-3 pl-4 border-l border-slate-200">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-full"
                  >
                    <Bell className="h-5 w-5" />
                    <div className="absolute top-1 right-1 w-2 h-2 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full"></div>
                  </Button>
                  <div className="flex items-center space-x-3">
                    <div className="relative group cursor-pointer">
                      <img
                        src={
                          user?.avatar ||
                          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face"
                        }
                        alt={user?.name || user?.email || "User"}
                        className="w-9 h-9 rounded-full border-2 border-transparent group-hover:border-indigo-200 transition-all duration-200 shadow-sm"
                      />
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-slate-900">
                        {user?.name || user?.email?.split("@")[0] || "User"}
                      </span>
                      <span className="text-xs text-slate-500">Online</span>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={signOut}
                    className="text-slate-600 hover:text-red-600 hover:bg-red-50 px-4 py-2 rounded-lg font-medium transition-all duration-200"
                  >
                    Logout
                  </Button>
                </div>
              </div>
            ) : (
              <Link to="/login">
                <Button
                  className="text-white px-6 py-2.5 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                  style={{
                    background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
                  }}
                >
                  <User className="h-4 w-4 mr-2" />
                  Log in
                </Button>
              </Link>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
        </div>

        {/* Mobile Search */}
        <form onSubmit={handleSearch} className="lg:hidden mt-4">
          <div className="relative group">
            <div className="flex items-center bg-slate-50/80 rounded-xl border border-slate-200/50 transition-all duration-200 focus-within:bg-white focus-within:border-indigo-300 focus-within:shadow-lg focus-within:shadow-indigo-100/50">
              <Search className="absolute left-4 text-slate-400 h-5 w-5 transition-colors duration-200 group-focus-within:text-indigo-500" />
              <Input
                type="text"
                placeholder="Search articles..."
                value={localSearchQuery}
                onChange={(e) => setLocalSearchQuery(e.target.value)}
                className="pl-12 pr-4 py-3 bg-transparent border-none outline-none text-slate-700 placeholder:text-slate-400 font-medium rounded-xl"
              />
            </div>
          </div>
        </form>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden absolute left-0 right-0 top-full bg-white/95 backdrop-blur-md border-b border-slate-200/50 shadow-lg">
            <div className="container mx-auto px-6 py-6">
              <nav className="flex flex-col space-y-4">
                {isAuthenticated ? (
                  <>
                    <div className="flex items-center space-x-3 pb-4 border-b border-slate-200">
                      <img
                        src={
                          user?.avatar ||
                          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face"
                        }
                        alt={user?.name || user?.email || "User"}
                        className="w-10 h-10 rounded-full shadow-sm"
                      />
                      <div>
                        <div className="font-semibold text-slate-900">
                          {user?.name || user?.email?.split("@")[0] || "User"}
                        </div>
                        <div className="text-sm text-slate-500">
                          Welcome back!
                        </div>
                      </div>
                    </div>
                    <Link
                      to="/admin"
                      className="flex items-center space-x-3 px-4 py-3 text-slate-700 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-all duration-200"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Settings className="h-5 w-5" />
                      <span className="font-medium">Dashboard</span>
                    </Link>
                    <Button
                      variant="ghost"
                      onClick={() => {
                        signOut();
                        setIsMobileMenuOpen(false);
                      }}
                      className="flex items-center justify-start space-x-3 px-4 py-3 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg w-full"
                    >
                      <span className="font-medium">Logout</span>
                    </Button>
                  </>
                ) : (
                  <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button
                      className="w-full text-white py-3 rounded-xl font-semibold shadow-lg"
                      style={{
                        background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
                      }}
                    >
                      <User className="h-4 w-4 mr-2" />
                      Log in
                    </Button>
                  </Link>
                )}
              </nav>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
