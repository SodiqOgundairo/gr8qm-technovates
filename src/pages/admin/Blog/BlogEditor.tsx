import React, { useCallback, useEffect, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Youtube from "@tiptap/extension-youtube";
import Placeholder from "@tiptap/extension-placeholder";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../../../utils/supabase";
import AdminLayout from "../../../components/admin/AdminLayout";
import Button from "../../../components/common/Button";
import Input from "../../../components/common/Input";
import {
  Save,
  ChevronLeft,
  ImageIcon,
  Sparkles,
  Link as LinkIcon,
  Loader2,
  X,
} from "lucide-react";

// --- AI Helper ---
const callAI = async (
  action: string,
  blogContent: string,
  userMessage?: string,
): Promise<string> => {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  const response = await fetch(`${supabaseUrl}/functions/v1/ai-chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${supabaseKey}`,
    },
    body: JSON.stringify({
      messages: [{ role: "user", content: userMessage || action }],
      context: "blog-assist",
      blogContent,
      action,
    }),
  });

  const data = await response.json();
  if (data.error && !data.message) throw new Error(data.error);
  return data.message;
};

// --- Components for the Editor Toolbar ---
const MenuBar = ({
  editor,
  onAIAssist,
}: {
  editor: any;
  onAIAssist: () => void;
}) => {
  if (!editor) {
    return null;
  }

  const addImage = () => {
    const url = window.prompt("URL");
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const setLink = useCallback(() => {
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("URL", previousUrl);

    if (url === null) return;

    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    editor
      .chain()
      .focus()
      .extendMarkRange("link")
      .setLink({ href: url })
      .run();
  }, [editor]);

  return (
    <div className="border-b border-gray-200 p-2 flex flex-wrap gap-2 sticky top-0 bg-white z-10">
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        className={`p-2 rounded hover:bg-gray-100 ${editor.isActive("bold") ? "bg-gray-200" : ""}`}
      >
        <strong>B</strong>
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        className={`p-2 rounded hover:bg-gray-100 ${editor.isActive("italic") ? "bg-gray-200" : ""}`}
      >
        <em>I</em>
      </button>
      <button
        onClick={() => editor.chain().focus().toggleStrike().run()}
        disabled={!editor.can().chain().focus().toggleStrike().run()}
        className={`p-2 rounded hover:bg-gray-100 ${editor.isActive("strike") ? "bg-gray-200" : ""}`}
      >
        <s>S</s>
      </button>
      <div className="w-px h-6 bg-gray-300 mx-1 self-center" />
      <button
        onClick={() => editor.chain().focus().setParagraph().run()}
        className={`p-2 rounded hover:bg-gray-100 ${editor.isActive("paragraph") ? "bg-gray-200" : ""}`}
      >
        P
      </button>
      <button
        onClick={() =>
          editor.chain().focus().toggleHeading({ level: 2 }).run()
        }
        className={`p-2 rounded hover:bg-gray-100 ${editor.isActive("heading", { level: 2 }) ? "bg-gray-200" : ""}`}
      >
        H2
      </button>
      <button
        onClick={() =>
          editor.chain().focus().toggleHeading({ level: 3 }).run()
        }
        className={`p-2 rounded hover:bg-gray-100 ${editor.isActive("heading", { level: 3 }) ? "bg-gray-200" : ""}`}
      >
        H3
      </button>
      <div className="w-px h-6 bg-gray-300 mx-1 self-center" />
      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`p-2 rounded hover:bg-gray-100 ${editor.isActive("bulletList") ? "bg-gray-200" : ""}`}
      >
        &bull; List
      </button>
      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`p-2 rounded hover:bg-gray-100 ${editor.isActive("orderedList") ? "bg-gray-200" : ""}`}
      >
        1. List
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={`p-2 rounded hover:bg-gray-100 ${editor.isActive("blockquote") ? "bg-gray-200" : ""}`}
      >
        &ldquo;&rdquo;
      </button>
      <div className="w-px h-6 bg-gray-300 mx-1 self-center" />
      <button
        onClick={setLink}
        className={`p-2 rounded hover:bg-gray-100 ${editor.isActive("link") ? "bg-gray-200" : ""}`}
      >
        <LinkIcon className="w-4 h-4" />
      </button>
      <button onClick={addImage} className="p-2 rounded hover:bg-gray-100">
        <ImageIcon className="w-4 h-4" />
      </button>
      {/* AI Assistant */}
      <button
        className="p-2 rounded hover:bg-purple-100 text-purple-600 ml-auto flex items-center gap-1"
        onClick={onAIAssist}
      >
        <Sparkles className="w-4 h-4" />
        <span className="text-sm font-medium">AI Assist</span>
      </button>
    </div>
  );
};

interface BlogPostData {
  title: string;
  slug: string;
  excerpt: string;
  content: any;
  status: "draft" | "published" | "archived";
  seo_title: string;
  seo_description: string;
  keywords: string;
  featured_image: string;
  published_at?: string;
}

const BlogEditor: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = !!id;
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [aiLoading, setAiLoading] = useState<string | null>(null);
  const [aiResult, setAiResult] = useState<string | null>(null);
  const [aiPanelOpen, setAiPanelOpen] = useState(false);

  const [post, setPost] = useState<BlogPostData>({
    title: "",
    slug: "",
    excerpt: "",
    content: null,
    status: "draft",
    seo_title: "",
    seo_description: "",
    keywords: "",
    featured_image: "",
  });

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Link.configure({
        openOnClick: false,
      }),
      Youtube,
      Placeholder.configure({
        placeholder: "Write something amazing...",
      }),
    ],
    content: post.content,
    onUpdate: ({ editor }) => {
      setPost((prev) => ({ ...prev, content: editor.getJSON() }));
    },
  });

  useEffect(() => {
    if (isEditMode) {
      fetchPost();
    }
  }, [id]);

  useEffect(() => {
    if (editor && post.content && !editor.getText()) {
      editor.commands.setContent(post.content);
    }
  }, [post.content, editor]);

  const fetchPost = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;

      setPost({
        ...data,
        keywords: data.keywords ? data.keywords.join(", ") : "",
      });

      if (editor) {
        editor.commands.setContent(data.content);
      }
    } catch (error) {
      console.error("Error fetching post:", error);
    } finally {
      setLoading(false);
    }
  };

  const getEditorText = (): string => {
    if (!editor) return post.title;
    return `Title: ${post.title}\n\n${editor.getText()}`;
  };

  const handleAIAction = async (action: string) => {
    const content = getEditorText();
    if (!content || content.length < 10) {
      setAiResult("Please write some content first so I have something to work with.");
      return;
    }

    setAiLoading(action);
    setAiResult(null);
    setAiPanelOpen(true);

    try {
      const result = await callAI(action, content);

      if (action === "generate-seo") {
        // Try to parse and auto-fill SEO fields
        try {
          const jsonMatch = result.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            const seoData = JSON.parse(jsonMatch[0]);
            setPost((prev) => ({
              ...prev,
              seo_title: seoData.seo_title || prev.seo_title,
              seo_description:
                seoData.seo_description || prev.seo_description,
              keywords: Array.isArray(seoData.keywords)
                ? seoData.keywords.join(", ")
                : prev.keywords,
            }));
            setAiResult(
              "SEO fields updated! Check the SEO Settings section below.",
            );
          } else {
            setAiResult(result);
          }
        } catch {
          setAiResult(result);
        }
      } else if (action === "generate-excerpt") {
        setPost((prev) => ({ ...prev, excerpt: result }));
        setAiResult("Excerpt generated and applied!");
      } else {
        setAiResult(result);
      }
    } catch (error: any) {
      setAiResult(
        `Error: ${error.message || "Failed to get AI response. Make sure the AI edge function is deployed and ANTHROPIC_API_KEY is set."}`,
      );
    } finally {
      setAiLoading(null);
    }
  };

  const handleSave = async (status: "draft" | "published") => {
    if (!post.title) {
      alert("Please add a title");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        ...post,
        status,
        keywords: post.keywords
          .split(",")
          .map((k) => k.trim())
          .filter((k) => k),
        slug:
          post.slug ||
          post.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)+/g, ""),
        updated_at: new Date().toISOString(),
        published_at:
          status === "published" && !post.published_at
            ? new Date().toISOString()
            : undefined,
      };

      let result;
      if (isEditMode) {
        result = await supabase
          .from("blog_posts")
          .update(payload)
          .eq("id", id);
      } else {
        result = await supabase.from("blog_posts").insert([payload]).select();
      }

      if (result.error) throw result.error;

      alert("Post saved successfully!");
      if (!isEditMode && result.data) {
        navigate("/admin/blog");
      }
    } catch (error: any) {
      console.error("Save error:", error);
      alert(`Error saving post: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  const generateSlug = () => {
    const slug = post.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
    setPost({ ...post, slug });
  };

  if (loading) return <AdminLayout>Loading...</AdminLayout>;

  return (
    <AdminLayout>
      <div className="flex flex-col h-[calc(100vh-100px)]">
        {/* Top Bar */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/admin/blog")}
              className="text-gray-500 hover:text-gray-800"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <h1 className="text-2xl font-bold text-gray-800">
              {isEditMode ? "Edit Post" : "New Post"}
            </h1>
            <span
              className={`px-2 py-1 rounded text-xs font-medium uppercase ${post.status === "published" ? "bg-green-100 text-green-800" : "bg-gray-200 text-gray-800"}`}
            >
              {post.status}
            </span>
          </div>
          <div className="flex gap-3">
            <Button
              variant="sec"
              disabled={saving}
              onClick={() => handleSave("draft")}
            >
              Save Draft
            </Button>
            <Button
              variant="pry"
              disabled={saving}
              onClick={() => handleSave("published")}
              className="flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Publish
            </Button>
          </div>
        </div>

        <div className="flex gap-6 h-full overflow-hidden">
          {/* Main Editor Area */}
          <div className="flex-1 flex flex-col bg-white rounded-lg shadow h-full overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <input
                type="text"
                placeholder="Post Title"
                className="w-full text-3xl font-bold placeholder-gray-300 border-none focus:ring-0 outline-none"
                value={post.title}
                onChange={(e) => setPost({ ...post, title: e.target.value })}
                onBlur={() => !post.slug && generateSlug()}
              />
            </div>
            <MenuBar
              editor={editor}
              onAIAssist={() => setAiPanelOpen(!aiPanelOpen)}
            />
            <div className="flex-1 overflow-y-auto p-6 prose max-w-none">
              <EditorContent editor={editor} />
            </div>
          </div>

          {/* Sidebar Settings */}
          <div className="w-80 bg-white rounded-lg shadow h-full overflow-y-auto p-4 space-y-6">
            {/* AI Assistant Panel */}
            {aiPanelOpen && (
              <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-bold text-purple-800 flex items-center gap-2">
                    <Sparkles className="w-4 h-4" /> AI Assistant
                  </h3>
                  <button
                    onClick={() => {
                      setAiPanelOpen(false);
                      setAiResult(null);
                    }}
                    className="text-purple-400 hover:text-purple-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-xs text-purple-700 mb-3">
                  Use AI to speed up your writing workflow.
                </p>
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <button
                    className="bg-white text-purple-600 text-xs font-semibold py-2 rounded border border-purple-200 hover:bg-purple-100 disabled:opacity-50 flex items-center justify-center gap-1"
                    onClick={() => handleAIAction("suggest-title")}
                    disabled={!!aiLoading}
                  >
                    {aiLoading === "suggest-title" ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : null}
                    Suggest Titles
                  </button>
                  <button
                    className="bg-white text-purple-600 text-xs font-semibold py-2 rounded border border-purple-200 hover:bg-purple-100 disabled:opacity-50 flex items-center justify-center gap-1"
                    onClick={() => handleAIAction("improve-grammar")}
                    disabled={!!aiLoading}
                  >
                    {aiLoading === "improve-grammar" ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : null}
                    Fix Grammar
                  </button>
                  <button
                    className="bg-white text-purple-600 text-xs font-semibold py-2 rounded border border-purple-200 hover:bg-purple-100 disabled:opacity-50 flex items-center justify-center gap-1"
                    onClick={() => handleAIAction("generate-seo")}
                    disabled={!!aiLoading}
                  >
                    {aiLoading === "generate-seo" ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : null}
                    Generate SEO
                  </button>
                  <button
                    className="bg-white text-purple-600 text-xs font-semibold py-2 rounded border border-purple-200 hover:bg-purple-100 disabled:opacity-50 flex items-center justify-center gap-1"
                    onClick={() => handleAIAction("generate-excerpt")}
                    disabled={!!aiLoading}
                  >
                    {aiLoading === "generate-excerpt" ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : null}
                    Write Excerpt
                  </button>
                </div>
                {aiResult && (
                  <div className="bg-white rounded border border-purple-200 p-3 text-xs text-gray-700 max-h-48 overflow-y-auto whitespace-pre-wrap">
                    {aiResult}
                  </div>
                )}
              </div>
            )}

            {/* Publishing Settings */}
            <div>
              <h3 className="font-semibold text-gray-800 mb-3">Publishing</h3>
              <div className="space-y-3">
                <Input
                  labelText="URL Slug"
                  showLabel
                  value={post.slug}
                  onChange={(e) => setPost({ ...post, slug: e.target.value })}
                  className="text-sm"
                />
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-500 uppercase">
                    Excerpt
                  </label>
                  <textarea
                    className="w-full border rounded-md p-2 text-sm focus:ring-skyblue focus:border-skyblue"
                    rows={3}
                    placeholder="Brief summary of the post..."
                    value={post.excerpt}
                    onChange={(e) =>
                      setPost({ ...post, excerpt: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-500 uppercase">
                    Featured Image
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      className="w-full border rounded text-sm p-2"
                      placeholder="Image URL"
                      value={post.featured_image}
                      onChange={(e) =>
                        setPost({ ...post, featured_image: e.target.value })
                      }
                    />
                    <button
                      className="bg-gray-100 p-2 rounded hover:bg-gray-200"
                      title="Upload (Soon)"
                    >
                      <ImageIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <hr />

            {/* SEO Settings */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-semibold text-gray-800">SEO Settings</h3>
                <button
                  onClick={() => handleAIAction("generate-seo")}
                  disabled={!!aiLoading}
                  className="text-purple-500 hover:text-purple-700 disabled:opacity-50"
                  title="Auto-generate with AI"
                >
                  {aiLoading === "generate-seo" ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Sparkles className="w-4 h-4" />
                  )}
                </button>
              </div>

              <div className="space-y-3">
                <Input
                  labelText="SEO Title"
                  showLabel
                  value={post.seo_title}
                  placeholder={post.title}
                  onChange={(e) =>
                    setPost({ ...post, seo_title: e.target.value })
                  }
                />
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-700">
                    Meta Description
                  </label>
                  <textarea
                    className="w-full border rounded-md p-2 text-sm focus:ring-skyblue focus:border-skyblue"
                    rows={3}
                    value={post.seo_description}
                    onChange={(e) =>
                      setPost({ ...post, seo_description: e.target.value })
                    }
                  />
                  <p className="text-xs text-gray-400">
                    {post.seo_description.length}/160 characters
                  </p>
                </div>
                <Input
                  labelText="Keywords (comma separated)"
                  showLabel
                  value={post.keywords}
                  onChange={(e) =>
                    setPost({ ...post, keywords: e.target.value })
                  }
                />
              </div>

              {/* Search Preview */}
              <div className="mt-4 p-3 bg-gray-50 rounded border border-gray-200">
                <p className="text-xs text-uppercase font-bold text-gray-400 mb-1">
                  Google Preview
                </p>
                <div className="font-sans">
                  <div className="text-[#1a0dab] text-lg hover:underline cursor-pointer truncate">
                    {post.seo_title || post.title || "Your Post Title"}
                  </div>
                  <div className="text-[#006621] text-sm truncate">
                    https://gr8qm.com/blog/{post.slug || "post-slug"}
                  </div>
                  <div className="text-[#545454] text-sm line-clamp-2">
                    {post.seo_description ||
                      post.excerpt ||
                      "This is how your post description will appear in search results."}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default BlogEditor;
