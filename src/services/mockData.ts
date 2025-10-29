import { Category, Post, Comment, Profile, BlogStats } from '@/types/blog';

// This file is now obsolete as we use real Supabase data
// Keeping for reference only

export const mockCategories: Category[] = [
  {
    id: '1',
    name: 'Technology',
    slug: 'technology',
    description: 'Latest tech trends and innovations',
    post_count: 12,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  }
];

export const mockProfiles: Profile[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
    role: 'admin' as const,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  }
];

export const mockPosts: Post[] = [
  {
    id: '1',
    title: 'Getting Started with React',
    slug: 'getting-started-with-react',
    content: 'React is a popular JavaScript library...',
    excerpt: 'Learn the basics of React development',
    featured_image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800',
    category_id: '1',
    category: mockCategories[0],
    author_id: '1',
    author: mockProfiles[0],
    published_at: '2024-01-15T10:00:00Z',
    is_trending: false,
    views: 150,
    likes: 25,
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z'
  }
];

export const mockComments: Comment[] = [
  {
    id: '1',
    content: 'Great article! Very helpful.',
    post_id: '1',
    author_id: '1',
    author: mockProfiles[0],
    created_at: '2024-01-16T09:00:00Z',
    updated_at: '2024-01-16T09:00:00Z'
  }
];

export const mockBlogStats: BlogStats = {
  totalPosts: 25,
  totalUsers: 150,
  totalCategories: 6,
  totalComments: 89,
  totalViews: 15420,
  recentPosts: mockPosts,
  popularPosts: mockPosts,
  trendingPosts: [],
  postsPerCategory: [
    { category: 'Technology', count: 12 },
    { category: 'Travel', count: 8 },
    { category: 'Food', count: 5 }
  ],
  viewsPerDay: [
    { date: '2024-01-01', views: 120 },
    { date: '2024-01-02', views: 150 },
    { date: '2024-01-03', views: 180 }
  ]
};
