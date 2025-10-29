import React, { useEffect, useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import {
  MessageCircle,
  Trash2,
  Search,
  Loader2,
  ChevronLeft,
  ChevronRight,
  ArrowDown,
  ArrowUp,
  Filter,
} from "lucide-react";
import {
  getCommentsByPost,
  getPosts,
  deleteComment,
} from "@/services/supabaseService";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

const PAGE_SIZE = 10;

export default function AdminComments() {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const [sortDir, setSortDir] = useState("desc");
  const [filterPost, setFilterPost] = useState("");
  const [filterUser, setFilterUser] = useState("");
  const [page, setPage] = useState(1);
  const { toast } = useToast();
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetchAllComments();
  }, []);

  async function fetchAllComments() {
    setLoading(true);
    try {
      const posts = await getPosts();
      setPosts(posts);
      let allComments = [];
      for (const post of posts) {
        const postComments = await getCommentsByPost(post.id);
        allComments = allComments.concat(
          postComments.map((c) => ({ ...c, post }))
        );
      }
      setComments(allComments);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load comments",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(commentId) {
    if (!window.confirm("Are you sure you want to delete this comment?"))
      return;
    try {
      await deleteComment(commentId);
      setComments((prev) => prev.filter((c) => c.id !== commentId));
      toast({ title: "Comment deleted" });
    } catch {
      toast({
        title: "Error",
        description: "Failed to delete comment",
        variant: "destructive",
      });
    }
  }

  // Filtering, searching, sorting, and pagination
  const filteredSorted = useMemo(() => {
    let data = [...comments];
    if (search.trim()) {
      data = data.filter(
        (c) =>
          c.content.toLowerCase().includes(search.toLowerCase()) ||
          c.author?.name?.toLowerCase().includes(search.toLowerCase()) ||
          c.post?.title?.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (filterPost) {
      data = data.filter((c) => c.post?.id === filterPost);
    }
    if (filterUser) {
      data = data.filter((c) => c.author?.id === filterUser);
    }
    data.sort((a, b) => {
      if (sortBy === "date") {
        return sortDir === "desc"
          ? new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          : new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      } else if (sortBy === "user") {
        return sortDir === "desc"
          ? (b.author?.name || "").localeCompare(a.author?.name || "")
          : (a.author?.name || "").localeCompare(b.author?.name || "");
      } else if (sortBy === "post") {
        return sortDir === "desc"
          ? (b.post?.title || "").localeCompare(a.post?.title || "")
          : (a.post?.title || "").localeCompare(b.post?.title || "");
      }
      return 0;
    });
    return data;
  }, [comments, search, sortBy, sortDir, filterPost, filterUser]);

  const totalPages = Math.max(1, Math.ceil(filteredSorted.length / PAGE_SIZE));
  const paginated = filteredSorted.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  // Unique users for filter dropdown
  const users = useMemo(() => {
    const map = new Map();
    comments.forEach((c) => {
      if (c.author?.id && !map.has(c.author.id)) {
        map.set(c.author.id, c.author);
      }
    });
    return Array.from(map.values());
  }, [comments]);

  // Handlers
  function handleSort(field) {
    if (sortBy === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(field);
      setSortDir("asc");
    }
  }

  function handlePageChange(newPage) {
    setPage(Math.max(1, Math.min(totalPages, newPage)));
  }

  // Reset page on filter/search/sort change
  useEffect(() => {
    setPage(1);
  }, [search, filterPost, filterUser, sortBy, sortDir]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <MessageCircle className="h-7 w-7 text-blue-600" />
            Comments Management
          </h1>
          <p className="text-gray-600">Manage all comments on your blog</p>
        </div>
        <div className="flex flex-wrap gap-2 items-center mt-4 sm:mt-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search comments, users, or posts..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <select
            className="border border-gray-300 rounded-lg px-2 py-1 text-sm focus:border-blue-400 bg-white"
            value={filterPost}
            onChange={(e) => setFilterPost(e.target.value)}
          >
            <option value="">All Posts</option>
            {posts.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title}
              </option>
            ))}
          </select>
          <select
            className="border border-gray-300 rounded-lg px-2 py-1 text-sm focus:border-blue-400 bg-white"
            value={filterUser}
            onChange={(e) => setFilterUser(e.target.value)}
          >
            <option value="">All Users</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name}
              </option>
            ))}
          </select>
          <Button
            variant="outline"
            size="icon"
            className="border-gray-300"
            onClick={() => {
              setFilterPost("");
              setFilterUser("");
            }}
            title="Clear filters"
          >
            <Filter className="h-5 w-5 text-gray-400" />
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Comments ({filteredSorted.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="animate-spin h-8 w-8 text-blue-500" />
            </div>
          ) : paginated.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No comments found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead
                      className="cursor-pointer select-none"
                      onClick={() => handleSort("user")}
                    >
                      User{" "}
                      {sortBy === "user" &&
                        (sortDir === "asc" ? (
                          <ArrowUp className="inline h-4 w-4" />
                        ) : (
                          <ArrowDown className="inline h-4 w-4" />
                        ))}
                    </TableHead>
                    <TableHead>Comment</TableHead>
                    <TableHead
                      className="cursor-pointer select-none"
                      onClick={() => handleSort("post")}
                    >
                      Post{" "}
                      {sortBy === "post" &&
                        (sortDir === "asc" ? (
                          <ArrowUp className="inline h-4 w-4" />
                        ) : (
                          <ArrowDown className="inline h-4 w-4" />
                        ))}
                    </TableHead>
                    <TableHead
                      className="cursor-pointer select-none"
                      onClick={() => handleSort("date")}
                    >
                      Date{" "}
                      {sortBy === "date" &&
                        (sortDir === "asc" ? (
                          <ArrowUp className="inline h-4 w-4" />
                        ) : (
                          <ArrowDown className="inline h-4 w-4" />
                        ))}
                    </TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginated.map((comment) => (
                    <TableRow key={comment.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <img
                            src={
                              comment.author?.avatar ||
                              `https://ui-avatars.com/api/?name=${
                                comment.author?.name || "U"
                              }`
                            }
                            alt={comment.author?.name}
                            className="w-10 h-10 rounded-full border border-gray-200"
                          />
                          <div>
                            <div className="font-semibold text-gray-900">
                              {comment.author?.name || "User"}
                            </div>
                            <div className="text-xs text-gray-400">
                              {comment.author?.email}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-gray-800 line-clamp-3 max-w-xs">
                          {comment.content}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Link
                          to={`/post/${comment.post?.slug}`}
                          className="text-blue-600 hover:underline font-medium"
                          target="_blank"
                        >
                          {comment.post?.title || "-"}
                        </Link>
                      </TableCell>
                      <TableCell>
                        <span className="text-gray-500 text-sm">
                          {new Date(comment.created_at).toLocaleString()}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(comment.id)}
                          className="text-red-500 hover:bg-red-100"
                          title="Delete comment"
                        >
                          <Trash2 className="h-5 w-5" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
          {/* Pagination */}
          {!loading && totalPages > 1 && (
            <div className="flex justify-between items-center mt-6">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
                className="border-gray-300"
              >
                <ChevronLeft className="h-4 w-4" /> Prev
              </Button>
              <div className="text-sm text-gray-700">
                Page {page} of {totalPages}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(page + 1)}
                disabled={page === totalPages}
                className="border-gray-300"
              >
                Next <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
