import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "../../utils/supabase";
import Container from "../../components/layout/Container";
import { SEO } from "../../components/common/SEO";
import { ArrowLeft, Calendar, Clock, Share2 } from "lucide-react";
import ScrollReveal from "../../components/common/ScrollReveal";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import LinkExtension from "@tiptap/extension-link";
import Youtube from "@tiptap/extension-youtube";
import {
  generateBlogPostSchema,
  generateBreadcrumbSchema,
} from "../../utils/structured-data";

const BlogPost: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const editor = useEditor({
    editable: false,
    extensions: [StarterKit, Image, LinkExtension, Youtube],
    content: null,
  });

  useEffect(() => {
    if (slug) fetchPost();
  }, [slug]);

  useEffect(() => {
    if (editor && post?.content) {
      editor.commands.setContent(post.content);
    }
  }, [editor, post]);

  const fetchPost = async () => {
    try {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("slug", slug)
        .eq("status", "published")
        .single();

      if (error) throw error;
      setPost(data);

      // Increment view count
      await supabase
        .from("blog_posts")
        .update({ view_count: (data.view_count || 0) + 1 })
        .eq("id", data.id);
    } catch (error) {
      console.error("Error fetching post:", error);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: post.excerpt || post.seo_description,
          url,
        });
      } catch {
        // User cancelled
      }
    } else {
      await navigator.clipboard.writeText(url);
      alert("Link copied to clipboard!");
    }
  };

  if (loading)
    return (
      <div className="min-h-screen pt-32 pb-20 text-center">Loading...</div>
    );
  if (error || !post)
    return (
      <div className="min-h-screen pt-32 pb-20 text-center">
        <h1 className="text-2xl font-bold mb-4">Post Not Found</h1>
        <Link to="/blog" className="text-skyblue underline">
          Back to Blog
        </Link>
      </div>
    );

  const blogPostSchema = generateBlogPostSchema({
    title: post.seo_title || post.title,
    description: post.seo_description || post.excerpt || post.title,
    url: `/blog/${post.slug}`,
    image: post.featured_image,
    datePublished: post.published_at,
    dateModified: post.updated_at || post.published_at,
    keywords: post.keywords,
  });

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "https://gr8qm.com/" },
    { name: "Blog", url: "https://gr8qm.com/blog" },
    { name: post.title, url: `https://gr8qm.com/blog/${post.slug}` },
  ]);

  return (
    <>
      <SEO
        title={post.seo_title || post.title}
        description={post.seo_description || post.excerpt}
        keywords={post.keywords}
        image={post.featured_image}
        url={`/blog/${post.slug}`}
        type="article"
        structuredData={[blogPostSchema, breadcrumbSchema]}
      />

      <main className="pt-24 pb-20">
        <article>
          {/* Header / Featured Image Background */}
          <div className="relative w-full h-[50vh] min-h-[400px] bg-gray-900 flex items-end">
            {post.featured_image && (
              <div className="absolute inset-0">
                <img
                  src={post.featured_image}
                  alt={post.title}
                  className="w-full h-full object-cover opacity-60"
                />
                <div className="absolute inset-0 bg-linear-to-t from-gray-900 via-transparent to-transparent" />
              </div>
            )}

            <Container className="relative z-10 pb-12 text-white">
              <Link
                to="/blog"
                className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 uppercase tracking-wider text-xs font-bold transition-colors"
              >
                <ArrowLeft className="w-4 h-4" /> Back to Blog
              </Link>
              <ScrollReveal>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 leading-tight">
                  {post.title}
                </h1>
                <div className="flex flex-wrap items-center gap-6 text-sm md:text-base text-gray-300">
                  <span className="flex items-center gap-2">
                    <Calendar className="text-skyblue w-4 h-4" />
                    <time dateTime={post.published_at}>
                      {new Date(post.published_at).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        },
                      )}
                    </time>
                  </span>
                  <span className="flex items-center gap-2">
                    <Clock className="text-skyblue w-4 h-4" />
                    {Math.ceil(JSON.stringify(post.content).length / 3000)} min
                    read
                  </span>
                </div>
              </ScrollReveal>
            </Container>
          </div>

          {/* Content */}
          <div className="bg-white dark:bg-gray-900">
            <Container className="py-16 grid grid-cols-1 lg:grid-cols-12 gap-12">
              <div className="lg:col-span-8 lg:col-start-3">
                <div className="prose prose-lg prose-sky max-w-none dark:prose-invert">
                  <EditorContent editor={editor} />
                </div>

                <hr className="my-12 border-gray-100 dark:border-gray-700" />

                <div className="flex justify-between items-center">
                  <div className="text-gray-500 text-sm font-medium">
                    Share this article
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleShare}
                      className="p-2 rounded-full bg-gray-50 hover:bg-skyblue hover:text-white transition-colors dark:bg-gray-800"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </Container>
          </div>
        </article>
      </main>
    </>
  );
};

export default BlogPost;
