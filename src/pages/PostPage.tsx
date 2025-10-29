import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  getPost,
  incrementPostViews,
  getPosts,
  getCommentsByPost,
  createComment,
} from "@/services/supabaseService";
import { Post } from "@/types/blog";
import {
  Calendar,
  Eye,
  Heart,
  Share2,
  ChevronRight,
  TrendingUp,
  Clock,
  Flame,
} from "lucide-react";
import { Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { PostCard } from "@/components/Blog/PostCard";
import { useAuth } from "@/contexts/AuthContext";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import type { Comment } from "@/types/blog";

export default function PostPage() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [relatedPosts, setRelatedPosts] = useState<Post[]>([]);
  const [editorsPicks, setEditorsPicks] = useState<Post[]>([]);
  const [mostRead, setMostRead] = useState<Post[]>([]);
  const [hotTopics, setHotTopics] = useState<Post[]>([]);
  const { user, isAuthenticated } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentInput, setCommentInput] = useState("");
  const [commentLoading, setCommentLoading] = useState(false);
  const [commentError, setCommentError] = useState("");

  useEffect(() => {
    const fetchPost = async () => {
      if (!slug) return;

      try {
        const postData = await getPost(slug);
        setPost(postData);

        // Increment view count
        if (postData) {
          await incrementPostViews(postData.id);

          // Fetch related posts and other sections
          const allPosts = await getPosts();

          // Related posts from same category
          if (postData.category) {
            const related = allPosts
              .filter(
                (p) =>
                  p.category?.id === postData.category?.id &&
                  p.id !== postData.id
              )
              .slice(0, 3);
            setRelatedPosts(related);
          }

          // Editor's Picks - top 3 most liked posts
          const picks = allPosts
            .filter((p) => p.id !== postData.id)
            .sort((a, b) => (b.likes || 0) - (a.likes || 0))
            .slice(0, 3);
          setEditorsPicks(picks);

          // Most Read This Week - top 4 most viewed posts
          const read = allPosts
            .filter((p) => p.id !== postData.id)
            .sort((a, b) => (b.views || 0) - (a.views || 0))
            .slice(0, 4);
          setMostRead(read);

          // Hot Topics - trending posts
          const trending = allPosts
            .filter((p) => p.is_trending && p.id !== postData.id)
            .slice(0, 3);
          setHotTopics(trending);
        }
      } catch (error) {
        console.error("Error fetching post:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug]);

  useEffect(() => {
    if (post?.id) {
      getCommentsByPost(post.id).then(setComments);
    }
  }, [post?.id]);

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim()) return;
    setCommentLoading(true);
    setCommentError("");
    try {
      const newComment = await createComment({
        content: commentInput,
        post_id: post!.id,
        author_id: user.id,
      });
      setComments((prev) => [...prev, newComment]);
      setCommentInput("");
    } catch (err: unknown) {
      setCommentError("Failed to add comment. Please try again.");
    } finally {
      setCommentLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-3/4 mb-4"></div>
            <div className="h-64 bg-gray-300 rounded-lg mb-8"></div>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-4 bg-gray-300 rounded w-full"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    // Custom 404 for post not found
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
            Post Not Found
          </h1>
          <p className="text-lg text-gray-600 mb-8 text-center max-w-md">
            Oops! The post you're looking for doesn't exist or has been removed.
            Try searching for something else or return to the homepage.
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
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

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
            {post.category && (
              <>
                <Link
                  to={`/category/${post.category.slug}`}
                  className="hover:text-blue-600"
                >
                  {post.category.name}
                </Link>
                <ChevronRight className="h-4 w-4" />
              </>
            )}
            <span className="text-gray-900 font-medium line-clamp-1">
              {post.title}
            </span>
          </nav>
        </div>
      </div>

      <article className="container mx-auto px-4 py-8 flex flex-row gap-12">
        {/* Main Post Content - left aligned, not centered */}
        <div className="w-full max-w-4xl bg-white/90 rounded-3xl shadow-2xl p-8 md:p-12 border border-blue-100 relative overflow-hidden">
          {/* Header */}
          <header className="mb-10 relative z-10 text-left">
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 leading-tight tracking-tight drop-shadow-sm text-left">
              {post.title}
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed text-left">
              {post.excerpt}
            </p>
            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 mb-10">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                {formatDate(post.published_at)}
              </div>
              <div className="flex items-center">
                <Eye className="h-4 w-4 mr-2" />
                {post.views || 0} views
              </div>
              {post.category && (
                <Link
                  to={`/category/${post.category.slug}`}
                  className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium hover:bg-blue-200 transition-colors"
                >
                  {post.category.name}
                </Link>
              )}
            </div>
          </header>
          {/* Featured Image */}
          {post.featured_image && (
            <img
              src={post.featured_image}
              alt={post.title}
              className="w-full max-h-96 object-contain"
              style={{
                display: "block",
                margin: 0,
                padding: 0,
                background: "none",
                border: "none",
                boxShadow: "none",
                borderRadius: 0,
              }}
            />
          )}
          {/* Content with React Markdown */}
          <div className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-headings:font-bold prose-h1:text-3xl prose-h1:mb-10 prose-h1:mt-14 prose-h2:text-2xl prose-h2:mb-8 prose-h2:mt-14 prose-h3:text-xl prose-h3:mb-6 prose-h3:mt-10 prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-8 prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline prose-strong:text-gray-900 prose-strong:font-semibold prose-em:text-gray-700 prose-em:italic prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:pl-6 prose-blockquote:my-10 prose-blockquote:text-gray-600 prose-blockquote:font-medium prose-blockquote:italic prose-ul:my-10 prose-ol:my-10 prose-li:mb-4 prose-li:leading-relaxed prose-code:bg-gray-100 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-sm prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-pre:p-4 prose-pre:rounded-lg prose-pre:overflow-x-auto prose-img:rounded-lg prose-img:shadow-md prose-img:my-10 bg-white/80 p-10 md:p-16 rounded-2xl shadow-md border border-blue-50 text-left custom-prose-spacing">
            <ReactMarkdown>{post.content}</ReactMarkdown>
          </div>
          <style>{`
            .custom-prose-spacing p {
              margin-bottom: 2.2em !important;
            }
            .custom-prose-spacing ul,
            .custom-prose-spacing ol {
              margin-top: 1.5em !important;
              margin-bottom: 2em !important;
            }
            .custom-prose-spacing li {
              margin-bottom: 1.1em !important;
            }
            .custom-prose-spacing h1,
            .custom-prose-spacing h2,
            .custom-prose-spacing h3 {
              margin-top: 2.5em !important;
              margin-bottom: 1.5em !important;
            }
            .custom-prose-spacing blockquote {
              margin-top: 2em !important;
              margin-bottom: 2em !important;
            }
          `}</style>
          {/* Comments Section - more space and clarity */}
          <section className="max-w-3xl mx-auto mt-20 mb-16 bg-white/80 rounded-xl shadow-xl p-10 border-t-4 border-blue-200">
            <h2 className="text-2xl font-bold text-blue-800 mb-8 flex items-center gap-2">
              💬 Comments ({comments.length})
            </h2>
            {isAuthenticated ? (
              <form
                onSubmit={handleAddComment}
                className="mb-10 flex flex-col gap-4"
              >
                <Textarea
                  value={commentInput}
                  onChange={(e) => setCommentInput(e.target.value)}
                  placeholder="Add your comment..."
                  rows={3}
                  className="border-2 border-blue-200 rounded-lg focus:border-blue-400"
                  disabled={commentLoading}
                />
                <div className="flex items-center gap-4">
                  <Button
                    type="submit"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold px-6 py-2 rounded-lg shadow-md hover:from-blue-700 hover:to-purple-700 transition-all"
                    disabled={commentLoading || !commentInput.trim()}
                  >
                    {commentLoading ? "Posting..." : "Post Comment"}
                  </Button>
                  {commentError && (
                    <span className="text-red-500 text-sm">{commentError}</span>
                  )}
                </div>
              </form>
            ) : (
              <div className="mb-10 text-blue-700 font-medium">
                Please{" "}
                <Link to="/login" className="underline">
                  log in
                </Link>{" "}
                to add a comment.
              </div>
            )}
            <div className="space-y-8">
              {comments.length === 0 ? (
                <div className="text-gray-500">
                  No comments yet. Be the first to comment!
                </div>
              ) : (
                comments.map((comment) => (
                  <div
                    key={comment.id}
                    className="flex items-start gap-4 bg-blue-50/60 rounded-lg p-6 shadow-sm"
                  >
                    <img
                      src={
                        comment.author?.avatar ||
                        "https://ui-avatars.com/api/?name=" +
                          (comment.author?.name || "U")
                      }
                      alt={comment.author?.name}
                      className="w-10 h-10 rounded-full border-2 border-blue-300"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-blue-900">
                          {comment.author?.name || "User"}
                        </span>
                        <span className="text-xs text-gray-400">
                          {formatDate(comment.created_at)}
                        </span>
                      </div>
                      <div className="text-gray-800 mt-2 whitespace-pre-line">
                        {comment.content}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>
        {/* Optionally, you can add a right sidebar here for future widgets */}
      </article>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <div className="max-w-6xl mx-auto mt-24">
          <h2 className="text-3xl font-bold text-gray-900 mb-10">
            Related Articles
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {relatedPosts.map((relatedPost) => (
              <PostCard key={relatedPost.id} post={relatedPost} />
            ))}
          </div>
        </div>
      )}

      {/* Editor's Picks */}
      {editorsPicks.length > 0 && (
        <div className="max-w-6xl mx-auto mt-24">
          <div className="flex items-center mb-10">
            <TrendingUp className="h-6 w-6 text-blue-600 mr-2" />
            <h2 className="text-3xl font-bold text-gray-900">Editor's Picks</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {editorsPicks.map((pick) => (
              <PostCard key={pick.id} post={pick} />
            ))}
          </div>
        </div>
      )}

      {/* Most Read This Week */}
      {mostRead.length > 0 && (
        <div className="max-w-6xl mx-auto mt-24">
          <div className="flex items-center mb-10">
            <Clock className="h-6 w-6 text-green-600 mr-2" />
            <h2 className="text-3xl font-bold text-gray-900">
              Most Read This Week
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {mostRead.map((read) => (
              <PostCard key={read.id} post={read} />
            ))}
          </div>
        </div>
      )}

      {/* Hot Topics */}
      {hotTopics.length > 0 && (
        <div className="max-w-6xl mx-auto mt-24 mb-24">
          <div className="flex items-center mb-10">
            <Flame className="h-6 w-6 text-red-600 mr-2" />
            <h2 className="text-3xl font-bold text-gray-900">Hot Topics</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {hotTopics.map((topic) => (
              <PostCard key={topic.id} post={topic} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
