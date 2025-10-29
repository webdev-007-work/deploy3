
export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  post_count?: number;
  created_at: string;
  updated_at: string;
}

export interface Profile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
  role: "admin" | "user";
  created_at: string;
  updated_at: string;
  // For dashboard analytics (top authors)
  totalViews?: number;
  postCount?: number;
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  featured_image: string;
  category_id: string;
  category?: Category;
  author_id: string;
  author?: Profile;
  published_at: string;
  is_trending: boolean;
  views: number;
  likes: number;
  tags?: string[];
  created_at: string;
  updated_at: string;
}

export interface Comment {
  id: string;
  content: string;
  post_id: string;
  author_id: string;
  author?: Profile;
  post?: { title: string; slug: string };
  created_at: string;
  updated_at: string;
}

export interface BlogStats {
  totalPosts: number;
  totalUsers: number;
  totalCategories: number;
  totalComments: number;
  totalViews: number;
  recentPosts: Post[];
  popularPosts: Post[];
  trendingPosts: Post[];
  postsPerCategory: { category: string; count: number }[];
  viewsPerDay: { date: string; views: number }[];
}
