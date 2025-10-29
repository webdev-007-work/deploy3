
import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User, Eye, Clock, MessageSquare } from 'lucide-react';
import { Post } from '@/types/blog';
import { Badge } from '@/components/ui/badge';

interface PostCardProps {
  post: Post;
  featured?: boolean;
  compact?: boolean;
}

export function PostCard({ post, featured = false, compact = false }: PostCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const readTime = Math.ceil((post.content?.length || 500) / 1000);

  if (compact) {
    return (
      <Link to={`/post/${post.slug}`} className="block group">
        <article className="flex space-x-4 p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-all duration-200">
          <div className="flex-shrink-0">
            <img
              src={post.featured_image}
              alt={post.title}
              className="w-20 h-20 object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline" className="text-xs">
                {post.category?.name}
              </Badge>
              {post.is_trending && (
                <Badge className="bg-red-600 hover:bg-red-700 text-white text-xs">
                  Trending
                </Badge>
              )}
            </div>
            <h3 className="text-sm font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
              {post.title}
            </h3>
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>{post.author?.name}</span>
              <div className="flex items-center space-x-3">
                <span>{formatDate(post.published_at)}</span>
                <div className="flex items-center space-x-1">
                  <Eye className="w-3 h-3" />
                  <span>{post.views}</span>
                </div>
              </div>
            </div>
          </div>
        </article>
      </Link>
    );
  }

  return (
    <article className={`group cursor-pointer transition-all duration-300 hover:scale-[1.02] ${
      featured ? 'col-span-full md:col-span-2' : ''
    }`}>
      <Link to={`/post/${post.slug}`} className="block">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300">
          {/* Image */}
          <div className={`relative overflow-hidden ${featured ? 'h-64' : 'h-48'}`}>
            <img
              src={post.featured_image}
              alt={post.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute top-4 left-4 flex items-center gap-2">
              <Badge variant="secondary" className="bg-white/90 text-gray-900 shadow-sm">
                {post.category?.name}
              </Badge>
              {post.is_trending && (
                <Badge className="bg-red-600 hover:bg-red-700 text-white shadow-sm">
                  Trending
                </Badge>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <h2 className={`font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 ${
              featured ? 'text-2xl mb-3' : 'text-lg mb-2'
            }`}>
              {post.title}
            </h2>

            <p className={`text-gray-600 line-clamp-3 ${featured ? 'text-base mb-4' : 'text-sm mb-3'}`}>
              {post.excerpt}
            </p>

            {/* Author and Meta */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <img
                  src={post.author?.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face"}
                  alt={post.author?.name}
                  className="w-8 h-8 rounded-full border-2 border-gray-100"
                />
                <div>
                  <div className="text-sm font-medium text-gray-900">
                    {post.author?.name}
                  </div>
                  <div className="text-xs text-gray-500">
                    {formatDate(post.published_at)}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                  <Eye className="w-4 h-4" />
                  <span>{post.views.toLocaleString()}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>{readTime} min</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
}
