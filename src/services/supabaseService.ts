import { supabase } from "@/integrations/supabase/client";
import { Category, Post, Comment, Profile, BlogStats } from "@/types/blog";

// Site Settings
export interface SiteSettings {
  id: string;
  brand_name: string;
  brand_email: string;
  brand_phone: string;
  openrouter_api_key?: string;
  pexels_api_key?: string;
  head_scripts: string;
  body_scripts: string;
  created_at: string;
  updated_at: string;
}

export const getSiteSettings = async (): Promise<SiteSettings | null> => {
  try {
    const { data, error } = await supabase
      .from("site_settings")
      .select("*")
      .single();

    if (error) {
      console.error("Error fetching site settings:", error);
      return null;
    }
    return data;
  } catch (error) {
    console.error("Error in getSiteSettings:", error);
    return null;
  }
};

export const updateSiteSettings = async (
  settings: Partial<Omit<SiteSettings, "id" | "created_at" | "updated_at">>
): Promise<SiteSettings> => {
  try {
    console.log("Updating site settings with data:", settings);

    // First check if any settings exist
    const { data: existingSettings, error: fetchError } = await supabase
      .from("site_settings")
      .select("*")
      .single();

    if (fetchError && fetchError.code !== "PGRST116") {
      console.error("Error fetching existing settings:", fetchError);
      throw fetchError;
    }

    let result;

    if (existingSettings) {
      // Update existing settings
      const { data, error } = await supabase
        .from("site_settings")
        .update({ ...settings, updated_at: new Date().toISOString() })
        .eq("id", existingSettings.id)
        .select()
        .single();

      if (error) {
        console.error("Error updating settings:", error);
        throw error;
      }
      result = data;
    } else {
      // Create new settings record
      const { data, error } = await supabase
        .from("site_settings")
        .insert({ ...settings, updated_at: new Date().toISOString() })
        .select()
        .single();

      if (error) {
        console.error("Error creating settings:", error);
        throw error;
      }
      result = data;
    }

    console.log("Settings updated successfully:", result);
    return result;
  } catch (error) {
    console.error("Error in updateSiteSettings:", error);
    throw error;
  }
};

// Categories
export const getCategories = async (): Promise<Category[]> => {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("name");

  if (error) throw error;

  // Add post count to each category
  const categoriesWithCount = await Promise.all(
    data.map(async (category) => {
      const { count } = await supabase
        .from("posts")
        .select("*", { count: "exact", head: true })
        .eq("category_id", category.id);

      return {
        ...category,
        post_count: count || 0,
      };
    })
  );

  return categoriesWithCount;
};

export const createCategory = async (
  category: Omit<Category, "id" | "created_at" | "updated_at">
): Promise<Category> => {
  const { data, error } = await supabase
    .from("categories")
    .insert(category)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateCategory = async (
  id: string,
  updates: Partial<Category>
): Promise<Category> => {
  const { data, error } = await supabase
    .from("categories")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteCategory = async (id: string): Promise<void> => {
  const { error } = await supabase.from("categories").delete().eq("id", id);

  if (error) throw error;
};

// Posts
export const getPosts = async (filters?: {
  categoryId?: string;
  sortBy?: string;
  search?: string;
  limit?: number;
}): Promise<Post[]> => {
  let query = supabase.from("posts").select(`
      *,
      category:categories(*),
      author:profiles(*)
    `);

  if (filters?.categoryId) {
    query = query.eq("category_id", filters.categoryId);
  }

  if (filters?.search) {
    query = query.or(
      `title.ilike.%${filters.search}%,content.ilike.%${filters.search}%`
    );
  }

  if (filters?.sortBy) {
    switch (filters.sortBy) {
      case "newest":
        query = query.order("published_at", { ascending: false });
        break;
      case "oldest":
        query = query.order("published_at", { ascending: true });
        break;
      case "popular":
        query = query.order("likes", { ascending: false });
        break;
      case "views":
        query = query.order("views", { ascending: false });
        break;
      default:
        query = query.order("published_at", { ascending: false });
    }
  } else {
    query = query.order("published_at", { ascending: false });
  }

  if (filters?.limit) {
    query = query.limit(filters.limit);
  }

  const { data, error } = await query;

  if (error) throw error;
  return (data || []).map((post) => ({
    ...post,
    author: post.author
      ? {
          ...post.author,
          role: post.author.role as "admin" | "user",
        }
      : undefined,
  }));
};

export const getPost = async (slug: string): Promise<Post | null> => {
  const { data, error } = await supabase
    .from("posts")
    .select(
      `
      *,
      category:categories(*),
      author:profiles(*)
    `
    )
    .eq("slug", slug)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null;
    throw error;
  }

  return {
    ...data,
    author: data.author
      ? {
          ...data.author,
          role: data.author.role as "admin" | "user",
        }
      : undefined,
  };
};

export const incrementPostViews = async (postId: string): Promise<void> => {
  await supabase.rpc("increment_post_views", { post_id: postId });
};

export const getPostBySlug = async (slug: string): Promise<Post | null> => {
  const { data, error } = await supabase
    .from("posts")
    .select(
      `
      *,
      category:categories(*),
      author:profiles(*)
    `
    )
    .eq("slug", slug)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null;
    throw error;
  }

  // Increment view count
  await supabase.rpc("increment_post_views", { post_id: data.id });

  return {
    ...data,
    author: data.author
      ? {
          ...data.author,
          role: data.author.role as "admin" | "user",
        }
      : undefined,
  };
};

export const createPost = async (
  post: Omit<Post, "id" | "created_at" | "updated_at" | "views" | "likes">
): Promise<Post> => {
  const { data, error } = await supabase
    .from("posts")
    .insert(post)
    .select(
      `
      *,
      category:categories(*),
      author:profiles(*)
    `
    )
    .single();

  if (error) throw error;
  return {
    ...data,
    author: data.author
      ? {
          ...data.author,
          role: data.author.role as "admin" | "user",
        }
      : undefined,
  };
};

export const updatePost = async (
  id: string,
  updates: Partial<Post>
): Promise<Post> => {
  const { data, error } = await supabase
    .from("posts")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select(
      `
      *,
      category:categories(*),
      author:profiles(*)
    `
    )
    .single();

  if (error) throw error;
  return {
    ...data,
    author: data.author
      ? {
          ...data.author,
          role: data.author.role as "admin" | "user",
        }
      : undefined,
  };
};

export const deletePost = async (id: string): Promise<void> => {
  const { error } = await supabase.from("posts").delete().eq("id", id);

  if (error) throw error;
};

// Comments
export const getCommentsByPost = async (postId: string): Promise<Comment[]> => {
  const { data, error } = await supabase
    .from("comments")
    .select(
      `
      *,
      author:profiles(*)
    `
    )
    .eq("post_id", postId)
    .order("created_at", { ascending: true });

  if (error) throw error;
  return (data || []).map((comment) => ({
    ...comment,
    author: comment.author
      ? {
          ...comment.author,
          role: comment.author.role as "admin" | "user",
        }
      : undefined,
  }));
};

export const createComment = async (
  comment: Omit<Comment, "id" | "created_at" | "updated_at">
): Promise<Comment> => {
  const { data, error } = await supabase
    .from("comments")
    .insert(comment)
    .select(
      `
      *,
      author:profiles(*)
    `
    )
    .single();

  if (error) throw error;
  return {
    ...data,
    author: data.author
      ? {
          ...data.author,
          role: data.author.role as "admin" | "user",
        }
      : undefined,
  };
};

export const deleteComment = async (id: string): Promise<void> => {
  const { error } = await supabase.from("comments").delete().eq("id", id);

  if (error) throw error;
};

// Users/Profiles
export const getProfiles = async (): Promise<Profile[]> => {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data || []).map((profile) => ({
    ...profile,
    role: profile.role as "admin" | "user",
  }));
};

export const deleteProfile = async (id: string): Promise<void> => {
  const { error } = await supabase.from("profiles").delete().eq("id", id);

  if (error) throw error;
};

// Analytics
export const getBlogStats = async (): Promise<BlogStats> => {
  const [postsResult, usersResult, categoriesResult, commentsResult] =
    await Promise.all([
      supabase.from("posts").select("*", { count: "exact", head: true }),
      supabase.from("profiles").select("*", { count: "exact", head: true }),
      supabase.from("categories").select("*", { count: "exact", head: true }),
      supabase.from("comments").select("*", { count: "exact", head: true }),
    ]);

  // Get total views
  const { data: viewsData } = await supabase.from("posts").select("views");

  const totalViews = viewsData?.reduce((sum, post) => sum + post.views, 0) || 0;

  // Get recent posts
  const { data: recentPostsData } = await supabase
    .from("posts")
    .select(
      `
      *,
      category:categories(*),
      author:profiles(*)
    `
    )
    .order("published_at", { ascending: false })
    .limit(5);

  // Get popular posts
  const { data: popularPostsData } = await supabase
    .from("posts")
    .select(
      `
      *,
      category:categories(*),
      author:profiles(*)
    `
    )
    .order("views", { ascending: false })
    .limit(5);

  // Get trending posts
  const { data: trendingPostsData } = await supabase
    .from("posts")
    .select(
      `
      *,
      category:categories(*),
      author:profiles(*)
    `
    )
    .eq("is_trending", true)
    .order("views", { ascending: false })
    .limit(5);

  // Get all categories
  const { data: allCategories } = await supabase
    .from("categories")
    .select("id, name");
  // Get all posts with category and views
  const { data: postsWithCategory } = await supabase
    .from("posts")
    .select("category_id, views");
  // Aggregate post count and total views per category
  const categoryStatsMap: {
    [id: string]: { name: string; count: number; views: number };
  } = {};
  (allCategories || []).forEach((cat) => {
    categoryStatsMap[cat.id] = { name: cat.name, count: 0, views: 0 };
  });
  (postsWithCategory || []).forEach((post) => {
    if (post.category_id && categoryStatsMap[post.category_id]) {
      categoryStatsMap[post.category_id].count += 1;
      categoryStatsMap[post.category_id].views += post.views || 0;
    }
  });
  // Fix the mapping to match BlogStats type
  const postsPerCategory = Object.values(categoryStatsMap).map((stat) => ({
    category: stat.name,
    count: stat.count,
  }));

  // Dynamic views per day (sum of all post views for each day in last 7 days)
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const { data: allPosts } = await supabase
    .from("posts")
    .select("views, published_at");
  const viewsPerDayMap: { [date: string]: number } = {};
  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - (6 - i));
    const key = d.toISOString().split("T")[0];
    viewsPerDayMap[key] = 0;
  }
  (allPosts || []).forEach((post) => {
    const date = post.published_at?.split("T")[0];
    if (date && viewsPerDayMap[date] !== undefined) {
      viewsPerDayMap[date] += post.views || 0;
    }
  });
  const viewsPerDay = Object.entries(viewsPerDayMap).map(([date, views]) => ({
    date,
    views,
  }));

  const recentPosts = (recentPostsData || []).map((post) => ({
    ...post,
    author: post.author
      ? {
          ...post.author,
          role: post.author.role as "admin" | "user",
        }
      : undefined,
  }));

  const popularPosts = (popularPostsData || []).map((post) => ({
    ...post,
    author: post.author
      ? {
          ...post.author,
          role: post.author.role as "admin" | "user",
        }
      : undefined,
  }));

  const trendingPosts = (trendingPostsData || []).map((post) => ({
    ...post,
    author: post.author
      ? {
          ...post.author,
          role: post.author.role as "admin" | "user",
        }
      : undefined,
  }));

  return {
    totalPosts: postsResult.count || 0,
    totalUsers: usersResult.count || 0,
    totalCategories: categoriesResult.count || 0,
    totalComments: commentsResult.count || 0,
    totalViews,
    recentPosts,
    popularPosts,
    trendingPosts,
    postsPerCategory,
    viewsPerDay,
  };
};

// Get recent comments for dashboard
export const getRecentComments = async (limit = 5): Promise<Comment[]> => {
  const { data, error } = await supabase
    .from("comments")
    .select(`*, author:profiles(*), post:posts(title, slug)`)
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return (data || []).map((comment) => ({
    ...comment,
    author: comment.author
      ? {
          ...comment.author,
          role: comment.author.role as "admin" | "user",
        }
      : undefined,
  }));
};

// Get top authors by total post views and post count
export const getTopAuthors = async (limit = 5): Promise<Profile[]> => {
  // Get all posts with author
  const { data: posts, error } = await supabase
    .from("posts")
    .select("author:profiles(*), views");
  if (error) throw error;
  // Aggregate by author
  const authorMap: {
    [id: string]: { profile: Profile; totalViews: number; postCount: number };
  } = {};
  (posts || []).forEach((post) => {
    if (post.author) {
      const safeProfile = {
        ...post.author,
        role: post.author.role as "admin" | "user",
      };
      if (!authorMap[safeProfile.id]) {
        authorMap[safeProfile.id] = {
          profile: safeProfile,
          totalViews: 0,
          postCount: 0,
        };
      }
      authorMap[safeProfile.id].totalViews += post.views || 0;
      authorMap[safeProfile.id].postCount += 1;
    }
  });
  // Sort by totalViews, then postCount
  const topAuthors = Object.values(authorMap)
    .sort((a, b) => b.totalViews - a.totalViews || b.postCount - a.postCount)
    .slice(0, limit)
    .map((a) => ({
      ...a.profile,
      role: a.profile.role as "admin" | "user",
      totalViews: a.totalViews,
      postCount: a.postCount,
    }));
  return topAuthors;
};

export const getPostById = async (id: string): Promise<Post | null> => {
  const { data, error } = await supabase
    .from("posts")
    .select(
      `
      *,
      category:categories(*),
      author:profiles(*)
    `
    )
    .eq("id", id)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null;
    throw error;
  }

  return {
    ...data,
    author: data.author
      ? {
          ...data.author,
          role: data.author.role as "admin" | "user",
        }
      : undefined,
  };
};

// Pages (Custom Page Builder)
export interface Page {
  id: string; // uuid
  title: string;
  slug: string; // e.g. '/returns'
  code: string; // JSX/TSX or HTML code
  created_at: string;
  updated_at: string;
}

export const getPages = async (): Promise<Page[]> => {
  const { data, error } = await supabase
    .from("pages")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data || [];
};

export const getPageBySlug = async (slug: string): Promise<Page | null> => {
  const { data, error } = await supabase
    .from("pages")
    .select("*")
    .eq("slug", slug)
    .single();
  if (error || !data) return null;
  return data;
};

export const createPage = async (
  page: Omit<Page, "id" | "created_at" | "updated_at">
): Promise<Page> => {
  const { data, error } = await supabase
    .from("pages")
    .insert({ ...page })
    .select()
    .single();
  if (error || !data) throw error;
  return data;
};

export const updatePage = async (
  id: string,
  updates: Partial<Omit<Page, "id" | "created_at">>
): Promise<Page> => {
  const { data, error } = await supabase
    .from("pages")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();
  if (error || !data) throw error;
  return data;
};

export const deletePage = async (id: string): Promise<void> => {
  const { error } = await supabase.from("pages").delete().eq("id", id);
  if (error) throw error;
};
