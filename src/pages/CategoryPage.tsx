import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { PostCard } from "@/components/Blog/PostCard";
import { CategoryFilter } from "@/components/Blog/CategoryFilter";
import { SortFilter } from "@/components/Blog/SortFilter";
import { getPosts, getCategories } from "@/services/supabaseService";
import { Post, Category } from "@/types/blog";
import { ChevronRight, TrendingUp, Clock, Flame } from "lucide-react";
import { Link } from "react-router-dom";

export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("newest");
  const [allPosts, setAllPosts] = useState<Post[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [allPostsData, allCategories] = await Promise.all([
          getPosts(),
          getCategories(),
        ]);

        setAllPosts(allPostsData);
        const category = allCategories.find((cat) => cat.slug === slug);
        setCurrentCategory(category || null);

        if (category) {
          const categoryPosts = allPostsData.filter(
            (post) => post.category?.id === category.id
          );
          setPosts(categoryPosts);
        }

        setCategories(allCategories);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug]);

  const sortedPosts = [...posts].sort((a, b) => {
    switch (sortBy) {
      case "oldest":
        return (
          new Date(a.published_at).getTime() -
          new Date(b.published_at).getTime()
        );
      case "popular":
        return (b.views || 0) - (a.views || 0);
      case "newest":
      default:
        return (
          new Date(b.published_at).getTime() -
          new Date(a.published_at).getTime()
        );
    }
  });

  // Get Editor's Picks - top 3 most liked posts
  const editorsPicks = allPosts
    .filter((post) => post.category?.id !== currentCategory?.id)
    .sort((a, b) => (b.likes || 0) - (a.likes || 0))
    .slice(0, 3);

  // Get Most Read This Week - top 4 most viewed posts
  const mostRead = allPosts
    .filter((post) => post.category?.id !== currentCategory?.id)
    .sort((a, b) => (b.views || 0) - (a.views || 0))
    .slice(0, 4);

  // Get Hot Topics - trending posts
  const hotTopics = allPosts
    .filter(
      (post) => post.is_trending && post.category?.id !== currentCategory?.id
    )
    .slice(0, 3);

  // Get other popular categories with 3 posts each
  const getPopularCategoriesWithPosts = async () => {
    try {
      const otherCategories = categories.filter(
        (cat) => cat.id !== currentCategory?.id
      );

      return otherCategories.slice(0, 4).map((category) => {
        const categoryPosts = allPosts
          .filter((post) => post.category?.id === category.id)
          .slice(0, 3); // Get only 3 posts per category
        return {
          category,
          posts: categoryPosts,
        };
      });
    } catch (error) {
      console.error("Error fetching popular categories:", error);
      return [];
    }
  };

  const [popularCategories, setPopularCategories] = useState<
    Array<{ category: Category; posts: Post[] }>
  >([]);

  useEffect(() => {
    if (currentCategory && categories.length > 0 && allPosts.length > 0) {
      getPopularCategoriesWithPosts().then(setPopularCategories);
    }
  }, [currentCategory, categories, allPosts]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/3 mb-4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-gray-300 h-64 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!currentCategory) {
    // Prepare other popular categories (up to 4, each with up to 3 posts)
    const otherPopularCategories = categories.slice(0, 4).map((category) => {
      const categoryPosts = allPosts
        .filter((post) => post.category?.id === category.id)
        .slice(0, 3);
      return { category, posts: categoryPosts };
    });

    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-blue-100">
        <div className="w-full max-w-lg mx-auto bg-white/80 rounded-3xl shadow-2xl p-8 md:p-16 border border-blue-100 flex flex-col items-center animate-fade-in">
          {/* Animated SVG */}
          <div className="w-40 h-40 mb-8 animate-float">
            <svg
              viewBox="0 0 160 160"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-full"
            >
              <ellipse
                cx="80"
                cy="140"
                rx="55"
                ry="12"
                fill="#e0e7ff"
                opacity=".5"
              />
              <rect
                x="40"
                y="50"
                width="80"
                height="50"
                rx="16"
                fill="#6366f1"
              />
              <rect x="50" y="60" width="60" height="30" rx="8" fill="#fff" />
              <circle cx="80" cy="75" r="10" fill="#a5b4fc" />
              <text
                x="80"
                y="82"
                textAnchor="middle"
                fill="#6366f1"
                fontSize="20"
                fontWeight="bold"
                dy=".3em"
              >
                ?
              </text>
              <rect
                x="110"
                y="100"
                width="18"
                height="6"
                rx="3"
                fill="#a5b4fc"
                transform="rotate(30 110 100)"
              />
            </svg>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4 text-center">
            Category Not Found
          </h1>
          <p className="text-lg text-gray-600 mb-8 text-center max-w-md">
            Oops! The category you're looking for doesn't exist or has been
            removed. Try searching for something else or return to the homepage.
          </p>
          <Link to="/" className="inline-block mb-8">
            <button className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold px-8 py-3 rounded-full shadow-lg hover:from-blue-600 hover:to-purple-600 transition-all text-lg animate-wiggle">
              ← Go to Home
            </button>
          </Link>
          <style>{`
            .animate-float {
              animation: float 3s ease-in-out infinite;
            }
            @keyframes float {
              0%, 100% { transform: translateY(0); }
              50% { transform: translateY(-12px); }
            }
            .animate-fade-in {
              animation: fadeIn 0.8s cubic-bezier(.4,0,.2,1) both;
            }
            @keyframes fadeIn {
              0% { opacity: 0; transform: scale(0.98); }
              100% { opacity: 1; transform: scale(1); }
            }
            .animate-wiggle { animation: wiggleBtn 1.5s infinite alternate; }
            @keyframes wiggleBtn {
              0% { transform: rotate(-2deg); }
              100% { transform: rotate(2deg); }
            }
          `}</style>
        </div>
        {/* Other Popular Categories Section */}
        {otherPopularCategories.length > 0 && (
          <div className="w-full max-w-5xl mx-auto mt-12 mb-8 bg-white/80 rounded-2xl shadow-xl border border-blue-100 p-8">
            <h2 className="text-2xl font-bold text-blue-800 mb-8 text-center">
              Other Popular Categories
            </h2>
            <div className="space-y-12">
              {otherPopularCategories.map(({ category, posts }) => (
                <div key={category.id}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-900">
                      {category.name}
                    </h3>
                    <Link
                      to={`/category/${category.slug}`}
                      className="text-blue-600 hover:text-blue-700 font-medium flex items-center"
                    >
                      View all
                      <svg
                        className="h-4 w-4 ml-1"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </Link>
                  </div>
                  {posts.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {posts.map((post) => (
                        <PostCard key={post.id} post={post} />
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 italic">
                      No posts available in this category.
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center space-x-2 text-sm text-gray-600">
            <Link to="/" className="hover:text-blue-600">
              Home
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-gray-900 font-medium">
              {currentCategory.name}
            </span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Category Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {currentCategory.name}
          </h1>
          {currentCategory.description && (
            <p className="text-xl text-gray-600 max-w-3xl">
              {currentCategory.description}
            </p>
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <CategoryFilter
            categories={categories}
            selectedCategory={currentCategory.id}
            onCategorySelect={() => {}}
          />
          <SortFilter sortBy={sortBy} onSortChange={setSortBy} />
        </div>

        {/* Posts Grid */}
        {sortedPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {sortedPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No posts found
            </h3>
            <p className="text-gray-600">
              There are no posts in this category yet.
            </p>
          </div>
        )}

        {/* Editor's Picks */}
        {editorsPicks.length > 0 && (
          <div className="mb-16">
            <div className="flex items-center mb-6">
              <TrendingUp className="h-6 w-6 text-blue-600 mr-2" />
              <h2 className="text-3xl font-bold text-gray-900">
                Editor's Picks
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {editorsPicks.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          </div>
        )}

        {/* Most Read This Week */}
        {mostRead.length > 0 && (
          <div className="mb-16">
            <div className="flex items-center mb-6">
              <Clock className="h-6 w-6 text-green-600 mr-2" />
              <h2 className="text-3xl font-bold text-gray-900">
                Most Read This Week
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {mostRead.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          </div>
        )}

        {/* Hot Topics */}
        {hotTopics.length > 0 && (
          <div className="mb-16">
            <div className="flex items-center mb-6">
              <Flame className="h-6 w-6 text-red-600 mr-2" />
              <h2 className="text-3xl font-bold text-gray-900">Hot Topics</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {hotTopics.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          </div>
        )}

        {/* Other Popular Categories */}
        {popularCategories.length > 0 && (
          <div className="mt-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              Other Popular Categories
            </h2>
            <div className="space-y-12">
              {popularCategories.map(({ category, posts }) => (
                <div key={category.id}>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold text-gray-900">
                      {category.name}
                    </h3>
                    <Link
                      to={`/category/${category.slug}`}
                      className="text-blue-600 hover:text-blue-700 font-medium flex items-center"
                    >
                      View all
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Link>
                  </div>
                  {posts.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {posts.map((post) => (
                        <PostCard key={post.id} post={post} />
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 italic">
                      No posts available in this category.
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
