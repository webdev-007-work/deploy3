import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import {
  getCategories,
  getPostById,
  updatePost,
  createPost,
} from "@/services/supabaseService";
import { generateBlogContentAndImage } from "@/services/aiService";
import { useAuth } from "@/contexts/AuthContext";
import { Category } from "@/types/blog";
import { Sparkles, Wand2, Upload, Save, Eye, TrendingUp } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { useParams, useNavigate } from "react-router-dom";

export default function CreateOrEditPost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isTrending, setIsTrending] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<{
    title: string;
    content: string;
    excerpt: string;
    image: string;
  } | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();
  const [isEditingContent, setIsEditingContent] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [loadingPost, setLoadingPost] = useState(false);
  const [slug, setSlug] = useState("");

  useEffect(() => {
    fetchCategories();
    if (id) {
      setIsEditMode(true);
      setLoadingPost(true);
      (async () => {
        try {
          // Fetch post by id
          const post = await getPostById(id);
          if (post) {
            setSelectedCategory(post.category_id);
            setIsTrending(post.is_trending);
            setGeneratedContent({
              title: post.title,
              content: post.content,
              excerpt: post.excerpt,
              image: post.featured_image,
            });
            setSlug(post.slug || "");
          }
        } catch (error) {
          toast({
            title: "Error",
            description: "Failed to load post for editing",
            variant: "destructive",
          });
        } finally {
          setLoadingPost(false);
        }
      })();
    }
  }, [id]);

  const fetchCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast({
        title: "Error",
        description: "Failed to load categories",
        variant: "destructive",
      });
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  };

  const handleGenerate = async () => {
    if (!selectedCategory || !prompt.trim()) {
      toast({
        title: "Missing information",
        description: "Please select a category and enter a prompt",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    try {
      console.log("Generating content for prompt:", prompt);

      // Generate content and image using the new function
      const result = await generateBlogContentAndImage(prompt);

      console.log("Generated content and image:", result);

      setGeneratedContent(result);

      toast({
        title: "Content generated successfully! ✨",
        description:
          "Your AI-powered blog post is ready to review and publish.",
      });
    } catch (error) {
      console.error("Error generating content:", error);
      toast({
        title: "Generation failed",
        description: "Failed to generate content. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePublish = async () => {
    if (!generatedContent || !user) return;
    try {
      const newSlug = isEditMode ? slug : generateSlug(generatedContent.title);
      if (isEditMode && id) {
        await updatePost(id, {
          title: generatedContent.title,
          slug: newSlug,
          content: generatedContent.content,
          excerpt: generatedContent.excerpt,
          featured_image: generatedContent.image,
          category_id: selectedCategory,
          is_trending: isTrending,
        });
        toast({
          title: "Post updated!",
          description: "Your post has been updated successfully.",
        });
      } else {
        await createPost({
          title: generatedContent.title,
          slug: newSlug,
          content: generatedContent.content,
          excerpt: generatedContent.excerpt,
          featured_image: generatedContent.image,
          category_id: selectedCategory,
          author_id: user.id,
          published_at: new Date().toISOString(),
          is_trending: isTrending,
        });
        toast({
          title: "Post published! 🎉",
          description:
            "Your AI-generated post has been published successfully.",
        });
      }
      // Reset form and redirect
      setSelectedCategory("");
      setPrompt("");
      setIsTrending(false);
      setGeneratedContent(null);
      setSlug("");
      navigate("/admin/posts");
    } catch (error) {
      toast({
        title: isEditMode ? "Update failed" : "Publishing failed",
        description: `Failed to ${
          isEditMode ? "update" : "publish"
        } the post. Please try again.`,
        variant: "destructive",
      });
    }
  };

  if (loadingPost) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 p-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <div className="p-3 rounded-full bg-gradient-to-br from-purple-500 to-pink-500">
            <Sparkles className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            {isEditMode ? "Edit Post" : "AI Content Creator"}
          </h1>
        </div>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          {isEditMode
            ? "Update your blog post details below."
            : "Transform your ideas into engaging blog posts with the power of artificial intelligence. Generate compelling content and stunning visuals in seconds."}
        </p>
      </div>

      {/* Generation Form */}
      <Card className="border-2 border-dashed border-purple-200 bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 shadow-xl">
        <CardHeader className="text-center pb-6">
          <CardTitle className="flex items-center justify-center gap-3 text-2xl">
            <Wand2 className="h-6 w-6 text-purple-600" />
            {isEditMode ? "Edit Post" : "AI Content Generator"}
          </CardTitle>
          <p className="text-gray-600">
            {isEditMode
              ? "Edit your post details below."
              : "Configure your content preferences and let AI do the magic"}
          </p>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Form Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label
                htmlFor="category"
                className="text-sm font-semibold text-gray-700"
              >
                Category *
              </Label>
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger className="h-12 border-2 focus:border-purple-500">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      📁 {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label className="text-sm font-semibold text-gray-700">
                Content Settings
              </Label>
              <div className="flex items-center space-x-4 p-4 rounded-lg bg-white/60 border">
                <div className="flex items-center space-x-3">
                  <Switch
                    id="trending"
                    checked={isTrending}
                    onCheckedChange={setIsTrending}
                  />
                  <Label
                    htmlFor="trending"
                    className="text-sm font-medium text-gray-700 flex items-center gap-2"
                  >
                    <TrendingUp className="h-4 w-4 text-orange-500" />
                    Mark as Trending
                  </Label>
                </div>
                {isTrending && (
                  <div className="text-xs text-orange-600 bg-orange-100 px-2 py-1 rounded-full">
                    🔥 Hot content
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Prompt Input and Generate Button (only in create mode) */}
          {!isEditMode && (
            <>
              <div className="space-y-3">
                <Label
                  htmlFor="prompt"
                  className="text-sm font-semibold text-gray-700"
                >
                  Content Prompt *
                </Label>
                <Textarea
                  id="prompt"
                  placeholder="🎯 Example: 'Write a comprehensive guide about the top 10 gaming laptops under $1000 with detailed reviews, specifications, pros and cons, and buying recommendations for 2024'"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  rows={5}
                  className="resize-none border-2 focus:border-purple-500 text-sm"
                />
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-900 mb-2 flex items-center gap-2">
                    💡 Pro Tips for Better Content
                  </h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Be specific about the topic and target audience</li>
                    <li>
                      • Include keywords like "comprehensive guide", "top 10",
                      "best practices"
                    </li>
                    <li>
                      • Mention the year for timely content (e.g., "2024
                      trends")
                    </li>
                    <li>
                      • Specify the content format (tutorial, review,
                      comparison, tips)
                    </li>
                  </ul>
                </div>
              </div>
              <Button
                onClick={handleGenerate}
                disabled={isGenerating || !selectedCategory || !prompt.trim()}
                className="w-full h-14 bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 hover:from-purple-700 hover:via-pink-700 hover:to-indigo-700 text-white font-semibold text-lg shadow-lg transition-all duration-300 transform hover:scale-105"
                size="lg"
              >
                {isGenerating ? (
                  <div className="flex items-center gap-3">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                    <span>Generating magical content...</span>
                    <Sparkles className="h-5 w-5 animate-pulse" />
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <Wand2 className="h-6 w-6" />
                    <span>Generate AI Content & Image</span>
                    <Sparkles className="h-5 w-5" />
                  </div>
                )}
              </Button>
            </>
          )}
        </CardContent>
      </Card>

      {/* Generated Content Preview */}
      {generatedContent && (
        <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-t-lg">
            <CardTitle className="flex items-center gap-3 text-xl">
              <Eye className="h-6 w-6" />
              Generated Content Preview
              {isTrending && (
                <div className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                  <TrendingUp className="h-4 w-4" />
                  Trending
                </div>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-8 pt-8">
            {/* Featured Image */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2 text-green-800">
                🖼️ Featured Image
              </h3>
              <div className="relative rounded-xl overflow-hidden shadow-lg">
                <img
                  src={generatedContent.image}
                  alt="Generated featured image"
                  className="w-full h-80 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                {isTrending && (
                  <div className="absolute top-4 right-4 bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg">
                    🔥 Trending Post
                  </div>
                )}
              </div>
            </div>

            {/* Content Editor */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Title */}
              <div className="space-y-3">
                <Label
                  htmlFor="title"
                  className="text-lg font-semibold flex items-center gap-2 text-green-800"
                >
                  📌 Title
                </Label>
                {isEditingContent ? (
                  <Input
                    id="title"
                    value={generatedContent.title}
                    onChange={(e) =>
                      setGeneratedContent({
                        ...generatedContent,
                        title: e.target.value,
                      })
                    }
                    className="text-xl font-bold border-2 focus:border-green-500 h-12"
                  />
                ) : (
                  generatedContent.title && (
                    <div className="prose prose-green max-w-none border-2 border-green-200 rounded-lg p-2 bg-white/80 mt-2">
                      <ReactMarkdown>{generatedContent.title}</ReactMarkdown>
                    </div>
                  )
                )}
                {/* Slug Input - always visible in edit mode */}
                {isEditMode && (
                  <div className="space-y-2">
                    <Label
                      htmlFor="slug"
                      className="text-lg font-semibold flex items-center gap-2 text-green-800"
                    >
                      🔗 Slug
                    </Label>
                    <Input
                      id="slug"
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                      className="text-base border-2 focus:border-green-500"
                      placeholder="post-slug"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      URL-friendly identifier for this post
                    </p>
                  </div>
                )}
              </div>

              {/* Category Display */}
              <div className="space-y-3">
                <Label className="text-lg font-semibold text-green-800">
                  📁 Category
                </Label>
                <div className="h-12 px-4 py-3 bg-white rounded-lg border-2 border-gray-200 font-medium">
                  {categories.find((c) => c.id === selectedCategory)?.name ||
                    "Unknown"}
                </div>
              </div>
            </div>

            {/* Excerpt */}
            <div className="space-y-3">
              <Label
                htmlFor="excerpt"
                className="text-lg font-semibold flex items-center gap-2 text-green-800"
              >
                📄 Excerpt
              </Label>
              {isEditingContent ? (
                <Textarea
                  id="excerpt"
                  value={generatedContent.excerpt}
                  onChange={(e) =>
                    setGeneratedContent({
                      ...generatedContent,
                      excerpt: e.target.value,
                    })
                  }
                  rows={3}
                  className="border-2 focus:border-green-500"
                />
              ) : (
                generatedContent.excerpt && (
                  <div className="prose prose-green max-w-none border-2 border-green-200 rounded-lg p-2 bg-white/80 mt-2">
                    <ReactMarkdown>{generatedContent.excerpt}</ReactMarkdown>
                  </div>
                )
              )}
            </div>

            {/* Content */}
            <div className="space-y-3">
              <Label
                htmlFor="content"
                className="text-lg font-semibold flex items-center gap-2 text-green-800"
              >
                📖 Content
              </Label>
              <div className="flex items-center gap-4 mb-2">
                <Button
                  type="button"
                  variant={isEditingContent ? "default" : "outline"}
                  onClick={() => setIsEditingContent(false)}
                  className="text-sm"
                  disabled={!isEditingContent}
                >
                  Preview
                </Button>
                <Button
                  type="button"
                  variant={isEditingContent ? "outline" : "default"}
                  onClick={() => setIsEditingContent(true)}
                  className="text-sm"
                  disabled={isEditingContent}
                >
                  Edit
                </Button>
              </div>
              {isEditingContent ? (
                <Textarea
                  id="content"
                  value={generatedContent.content}
                  onChange={(e) =>
                    setGeneratedContent({
                      ...generatedContent,
                      content: e.target.value,
                    })
                  }
                  rows={20}
                  className="font-mono text-sm border-2 focus:border-green-500 mt-2"
                />
              ) : (
                <div className="prose prose-green max-w-none border-2 border-green-200 rounded-lg p-4 bg-white/80">
                  <ReactMarkdown>{generatedContent.content}</ReactMarkdown>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <Button
                onClick={handlePublish}
                className="flex-1 h-14 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold text-lg shadow-lg transition-all duration-300 transform hover:scale-105"
                size="lg"
              >
                <div className="flex items-center gap-3">
                  <Upload className="h-6 w-6" />
                  <span>{isEditMode ? "Update Post" : "Publish Post"}</span>
                  <Save className="h-5 w-5" />
                </div>
              </Button>
              <Button
                variant="outline"
                onClick={() => setGeneratedContent(null)}
                className="flex-1 h-14 border-2 border-red-300 text-red-600 hover:bg-red-50 font-semibold text-lg transition-all duration-300"
                size="lg"
              >
                <div className="flex items-center gap-3">
                  <span>🗑️</span>
                  <span>Discard</span>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
