import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useSiteSettings } from "@/contexts/SiteSettingsContext";
import { getCategories, getPosts } from "@/services/supabaseService";
import { Header } from "@/components/Layout/Header";
import { Footer } from "@/components/Layout/Footer";
import { Search } from "lucide-react";

export default function NotFound() {
  const { settings } = useSiteSettings();
  const brandName = settings?.brand_name || "OnAssist";
  const [search, setSearch] = useState("");
  const [categories, setCategories] = useState([]);
  const [searchResults, setSearchResults] = useState({
    categories: [],
    posts: [],
  });
  const [searchLoading, setSearchLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchRef = useRef(null);
  const debounceTimeout = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    getCategories().then((cats) => setCategories(cats.slice(0, 4)));
  }, []);

  useEffect(() => {
    document.title = `404 | ${brandName}`;
  }, [brandName]);

  // Live search logic (copied from Header)
  useEffect(() => {
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    if (search.length < 2) {
      setSearchResults({ categories: [], posts: [] });
      setShowDropdown(false);
      setSearchLoading(false);
      return;
    }
    setSearchLoading(true);
    debounceTimeout.current = setTimeout(async () => {
      try {
        const [allCategories, allPosts] = await Promise.all([
          getCategories(),
          getPosts(),
        ]);
        const q = search.toLowerCase();
        const filteredCategories = allCategories.filter(
          (cat) =>
            cat.name.toLowerCase().includes(q) ||
            (cat.description && cat.description.toLowerCase().includes(q))
        );
        const filteredPosts = allPosts.filter(
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
  }, [search]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e) {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
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

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim() && search.length >= 2) {
      setShowDropdown(true);
    }
  };

  const handleResultClick = (type, slug) => {
    setShowDropdown(false);
    setSearch("");
    if (type === "category") navigate(`/category/${slug}`);
    else navigate(`/post/${slug}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-purple-50 to-blue-100 overflow-hidden">
      <Header />
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 z-0 animate-bg-gradient pointer-events-none" />
      {/* Floating Planets/Stars */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        <div className="floating-star left-1/4 top-1/5" />
        <div className="floating-star left-2/3 top-1/4 delay-200" />
        <div className="floating-star left-1/3 top-2/3 delay-400" />
        <div className="floating-planet left-3/4 top-3/4" />
      </div>
      {/* Main Content */}
      <main className="relative z-20 flex-1 flex flex-col items-center justify-center px-4 pt-12 md:pt-24 md:mt-9 pb-0 w-full">
        {/* Animated Astronaut SVG */}
        <div className="w-56 h-56 mb-8 flex items-center justify-center">
          <svg
            viewBox="0 0 220 220"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full animate-astronaut"
          >
            <g>
              <ellipse
                cx="110"
                cy="200"
                rx="60"
                ry="12"
                fill="#e0e7ff"
                opacity=".5"
              />
              <circle cx="110" cy="110" r="70" fill="url(#astroGradient)" />
              <circle
                cx="110"
                cy="110"
                r="50"
                fill="#fff"
                stroke="#a5b4fc"
                strokeWidth="3"
              />
              <ellipse
                cx="110"
                cy="110"
                rx="32"
                ry="28"
                fill="#6366f1"
                opacity=".15"
              />
              {/* Helmet */}
              <ellipse
                cx="110"
                cy="110"
                rx="28"
                ry="24"
                fill="#6366f1"
                className="animate-helmet-glow"
              />
              <ellipse
                cx="120"
                cy="105"
                rx="8"
                ry="6"
                fill="#fff"
                opacity=".7"
              />
              {/* Body */}
              <rect
                x="95"
                y="134"
                width="30"
                height="32"
                rx="12"
                fill="#6366f1"
              />
              {/* Arms */}
              <rect
                x="60"
                y="130"
                width="20"
                height="8"
                rx="4"
                fill="#a5b4fc"
                transform="rotate(-20 60 130)"
              />
              <rect
                x="140"
                y="130"
                width="20"
                height="8"
                rx="4"
                fill="#a5b4fc"
                transform="rotate(20 160 130)"
              />
              {/* Flag */}
              <rect
                x="170"
                y="90"
                width="24"
                height="6"
                rx="2"
                fill="#6366f1"
              />
              <rect
                x="194"
                y="88"
                width="6"
                height="20"
                rx="2"
                fill="#a5b4fc"
              />
              <rect
                x="170"
                y="90"
                width="12"
                height="6"
                rx="2"
                fill="#a5b4fc"
              />
              {/* 404 Text */}
              <text
                x="50%"
                y="60%"
                textAnchor="middle"
                fill="#6366f1"
                fontSize="48"
                fontWeight="bold"
                dy=".3em"
                className="animate-pulse"
              >
                404
              </text>
            </g>
            <defs>
              <radialGradient
                id="astroGradient"
                cx="0"
                cy="0"
                r="1"
                gradientTransform="translate(110 110) rotate(90) scale(70)"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#c7d2fe" />
                <stop offset="1" stopColor="#a5b4fc" />
              </radialGradient>
            </defs>
          </svg>
        </div>
        {/* Headline & Subtext */}
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-3 leading-tight tracking-tight drop-shadow-sm text-center animate-slide-down">
          You've drifted off course!
        </h1>
        <p className="text-lg text-gray-700 mb-8 text-center max-w-xl animate-fade-in delay-200">
          This page is lost in the cosmos. Let's get you back to the world of
          amazing articles!
        </p>
        {/* Search Bar with Dropdown */}
        <div className="w-full max-w-md mx-auto mb-6 relative" ref={searchRef}>
          <form
            onSubmit={handleSearch}
            className="flex gap-2 animate-fade-in delay-300"
          >
            <div className="relative flex-1">
              <Input
                type="text"
                placeholder="Search articles..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full border-blue-200 focus:border-blue-400 rounded-lg shadow-lg focus:shadow-blue-200/50 bg-white/70 backdrop-blur pl-10"
                style={{ boxShadow: "0 0 16px 0 #a5b4fc33" }}
                onFocus={() => search.length >= 2 && setShowDropdown(true)}
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-300 w-5 h-5 pointer-events-none" />
            </div>
            <Button
              type="submit"
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold px-6 py-2 rounded-lg shadow-md hover:from-blue-700 hover:to-purple-700 transition-all animate-bounce"
            >
              Search
            </Button>
          </form>
          {/* Dropdown Results */}
          {showDropdown && (
            <div className="absolute left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-blue-100 z-50 max-h-96 overflow-y-auto animate-fade-in">
              {searchLoading ? (
                <div className="p-6 text-center text-blue-400">
                  Searching...
                </div>
              ) : searchResults.categories.length === 0 &&
                searchResults.posts.length === 0 ? (
                <div className="p-6 text-center text-blue-400">
                  No results found.
                </div>
              ) : (
                <>
                  {searchResults.categories.length > 0 && (
                    <div className="px-6 pt-4 pb-2 border-b border-blue-50">
                      <div className="text-xs font-semibold text-blue-500 mb-2">
                        Categories
                      </div>
                      {searchResults.categories.map((cat) => (
                        <div
                          key={cat.id}
                          className="flex items-center gap-2 py-2 px-2 rounded-lg hover:bg-blue-50 cursor-pointer transition-all"
                          onClick={() =>
                            handleResultClick("category", cat.slug)
                          }
                        >
                          <span className="font-medium text-blue-700">
                            {cat.name}
                          </span>
                          <span className="text-xs text-blue-400 ml-2">
                            {cat.post_count || 0} posts
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                  {searchResults.posts.length > 0 && (
                    <div className="px-6 pt-4 pb-2">
                      <div className="text-xs font-semibold text-blue-500 mb-2">
                        Posts
                      </div>
                      {searchResults.posts.map((post) => (
                        <div
                          key={post.id}
                          className="flex flex-col py-2 px-2 rounded-lg hover:bg-purple-50 cursor-pointer transition-all"
                          onClick={() => handleResultClick("post", post.slug)}
                        >
                          <span className="font-medium text-gray-900 line-clamp-1">
                            {post.title}
                          </span>
                          <span className="text-xs text-gray-500 line-clamp-1">
                            {post.excerpt}
                          </span>
                          <span className="text-xs text-blue-400 mt-1">
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
        {/* Go Home Button */}
        <Link to="/" className="inline-block animate-fade-in delay-400">
          <Button className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold px-8 py-3 rounded-full shadow-lg hover:from-blue-600 hover:to-purple-600 transition-all text-lg animate-wiggle">
            ← Go to Home
          </Button>
        </Link>
      </main>
      <Footer />
      {/* Custom Animations & Background */}
      <style>{`
        .animate-bg-gradient {
          background: linear-gradient(120deg, #6366f1 0%, #a5b4fc 50%, #f3e8ff 100%);
          background-size: 200% 200%;
          animation: bgMove 8s ease-in-out infinite alternate;
        }
        @keyframes bgMove {
          0% { background-position: 0% 50%; }
          100% { background-position: 100% 50%; }
        }
        .floating-star, .floating-planet {
          position: absolute;
          width: 32px; height: 32px;
          border-radius: 50%;
          opacity: 0.7;
          z-index: 1;
        }
        .floating-star {
          background: radial-gradient(circle, #fff 60%, #a5b4fc 100%);
          box-shadow: 0 0 16px 4px #a5b4fc88;
          animation: floatStar 5s ease-in-out infinite;
        }
        .floating-planet {
          background: radial-gradient(circle, #f3e8ff 60%, #6366f1 100%);
          box-shadow: 0 0 32px 8px #6366f188;
          animation: floatPlanet 7s ease-in-out infinite;
        }
        .delay-200 { animation-delay: 0.2s; }
        .delay-400 { animation-delay: 0.4s; }
        @keyframes floatStar {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-18px) scale(1.1); }
        }
        @keyframes floatPlanet {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(12px) scale(1.05); }
        }
        .animate-astronaut { animation: astronautFloat 4s ease-in-out infinite; }
        @keyframes astronautFloat {
          0%, 100% { transform: translateY(0) rotate(-6deg); }
          50% { transform: translateY(-18px) rotate(6deg); }
        }
        .animate-helmet-glow { filter: drop-shadow(0 0 16px #6366f1cc); }
        .animate-fade-in { animation: fadeIn 1s cubic-bezier(.4,0,.2,1) both; }
        @keyframes fadeIn {
          0% { opacity: 0; transform: translateY(16px) scale(0.98); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-slide-down { animation: slideDown 1s cubic-bezier(.4,0,.2,1) both; }
        @keyframes slideDown {
          0% { opacity: 0; transform: translateY(-32px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-pulse { animation: pulse404 2s infinite; }
        @keyframes pulse404 {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        .animate-bounce { animation: bounceBtn 1.2s infinite alternate; }
        @keyframes bounceBtn {
          0% { transform: translateY(0); }
          100% { transform: translateY(-6px) scale(1.04); }
        }
        .animate-wiggle { animation: wiggleBtn 1.5s infinite alternate; }
        @keyframes wiggleBtn {
          0% { transform: rotate(-2deg); }
          100% { transform: rotate(2deg); }
        }
        .animate-pill-float { animation: pillFloat 2.5s ease-in-out infinite; }
        @keyframes pillFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
      `}</style>
    </div>
  );
}
