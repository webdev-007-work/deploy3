import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  getPages,
  createPage,
  updatePage,
  deletePage,
  Page,
} from "@/services/supabaseService";

export default function PageBuilder() {
  const [pages, setPages] = useState<Page[]>([]);
  const [form, setForm] = useState({
    title: "",
    slug: "",
    code: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    fetchPages();
  }, []);

  async function fetchPages() {
    try {
      const data = await getPages();
      setPages(data);
    } catch (e) {
      setError("Failed to load pages");
    }
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    // Validate JSX before saving
    try {
      const JsxParser = (await import("react-jsx-parser")).default;
      // Try parsing the code
      <JsxParser jsx={form.code} />;

      if (editingId) {
        await updatePage(editingId, form);
        setSuccess("Page updated!");
      } else {
        await createPage(form);
        setSuccess("Page published!");
      }
      setForm({ title: "", slug: "", code: "" });
      setEditingId(null);
      fetchPages();
    } catch (err: unknown) {
      setError(
        "Invalid JSX/TSX code: " +
          (err instanceof Error ? err.message : String(err))
      );
      setLoading(false);
      return;
    }
  }

  function handleEdit(page: Page) {
    setForm({ title: page.title, slug: page.slug, code: page.code });
    setEditingId(page.id);
    setSuccess("");
    setError("");
  }

  async function handleDelete(id: string) {
    if (!window.confirm("Delete this page?")) return;
    setLoading(true);
    setError("");
    try {
      await deletePage(id);
      setSuccess("Page deleted");
      fetchPages();
    } catch (e) {
      setError("Failed to delete page");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto py-12">
      <h1 className="text-3xl font-bold mb-8">Page Builder</h1>
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-lg p-8 mb-10 space-y-6 border border-blue-100"
      >
        <div className="mb-6 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded flex items-start gap-3">
          <svg
            className="w-6 h-6 text-yellow-500 mt-0.5 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v2m0 4h.01M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z"
            />
          </svg>
          <div className="text-yellow-900 text-sm space-y-1">
            <div className="font-semibold">
              Instructions for Custom Page Code:
            </div>
            <ul className="list-disc pl-5 space-y-0.5">
              <li>
                Strictly put <b>only valid JSX code</b> here.
              </li>
              <li>
                <b>
                  Do NOT include &lt;Header /&gt;, &lt;Footer /&gt;, or layout
                  components
                </b>
                —they are added automatically.
              </li>
              <li>
                <b>Do NOT include any import or export statements.</b>
              </li>
              <li>
                Only paste the content you want inside the page (e.g.,{" "}
                <code>&lt;div&gt;...&lt;/div&gt;</code>).
              </li>
              <li>
                Code must be <b>valid and error-free</b> or the page will not
                render.
              </li>
              <li>
                If you want to use icons or custom components, contact the
                developer to enable them.
              </li>
              <li>Preview your code before publishing for best results.</li>
            </ul>
          </div>
        </div>
        <div>
          <label className="block font-semibold mb-2">Title</label>
          <Input
            name="title"
            value={form.title}
            onChange={handleChange}
            required
            placeholder="Page title"
          />
        </div>
        <div>
          <label className="block font-semibold mb-2">Slug (route)</label>
          <Input
            name="slug"
            value={form.slug}
            onChange={handleChange}
            required
            placeholder="/returns"
          />
        </div>
        <div>
          <label className="block font-semibold mb-2">Code (HTML/JSX)</label>
          <Textarea
            name="code"
            value={form.code}
            onChange={handleChange}
            rows={8}
            required
            placeholder="<div>Shipping Policy...</div>"
          />
        </div>
        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-2 rounded-lg"
        >
          {editingId
            ? loading
              ? "Updating..."
              : "Update Page"
            : loading
            ? "Publishing..."
            : "Publish Page"}
        </Button>
        {success && (
          <div className="text-green-600 font-medium mt-2">{success}</div>
        )}
        {error && <div className="text-red-600 font-medium mt-2">{error}</div>}
      </form>
      <h2 className="text-xl font-bold mb-4">All Pages</h2>
      <div className="space-y-4">
        {pages.length === 0 && (
          <div className="text-gray-500">No pages created yet.</div>
        )}
        {pages.map((page) => (
          <div
            key={page.id}
            className="bg-blue-50 rounded-lg p-4 flex items-center justify-between shadow border border-blue-100"
          >
            <div>
              <div className="font-semibold text-blue-900">{page.title}</div>
              <div className="text-sm text-gray-600">
                Route: <span className="font-mono">{page.slug}</span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleEdit(page)}
              >
                Edit
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => handleDelete(page.id)}
              >
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
