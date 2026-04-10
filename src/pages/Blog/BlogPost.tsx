import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "../../utils/supabase";
import Container from "../../components/layout/Container";
import PageTransition from "../../components/layout/PageTransition";
import { SEO } from "../../components/common/SEO";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Share2,
  Eye,
  ArrowUp,
  ChevronRight,
} from "lucide-react";
import { Button } from "devign";
import MagneticButton from "../../components/animations/MagneticButton";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import LinkExtension from "@tiptap/extension-link";
import Youtube from "@tiptap/extension-youtube";
import {
  generateBlogPostSchema,
  generateBreadcrumbSchema,
} from "../../utils/structured-data";

/* ─── constants ─── */
const EASE_SMOOTH: [number, number, number, number] = [0.22, 0.6, 0.36, 1];

/* Reading progress bar */
const ReadingProgress: React.FC = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      setProgress(docHeight > 0 ? (scrollTop / docHeight) * 100 : 0);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.div
      className="fixed top-0 left-0 h-[2px] bg-skyblue z-50"
      style={{ width: `${progress}%` }}
      transition={{ duration: 0.1 }}
    />
  );
};

const BlogPost: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

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

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 600);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  /* ── Loading State ── */
  if (loading) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
          <div className="text-center">
            <motion.div
              className="w-10 h-10 rounded-full border-2 border-white/10 border-t-skyblue mx-auto mb-4"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
            <p className="text-white/25 text-sm font-mono tracking-wider">
              Loading...
            </p>
          </div>
        </div>
      </PageTransition>
    );
  }

  /* ── Error State ── */
  if (error || !post) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
          <Container className="text-center">
            <p className="text-white/10 text-8xl font-bold tracking-[-0.04em] mb-4">
              404
            </p>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-[-0.03em]">
              Post Not Found
            </h1>
            <p className="text-white/25 text-base mb-8 max-w-md mx-auto">
              This article may have been moved or doesn't exist anymore.
            </p>
            <MagneticButton>
              <Button
                variant="primary"
                size="lg"
                onClick={() => navigate("/blog")}
                rightIcon={<ArrowLeft className="w-4 h-4" />}
              >
                Back to Blog
              </Button>
            </MagneticButton>
          </Container>
        </div>
      </PageTransition>
    );
  }

  const readTime = Math.ceil(JSON.stringify(post.content).length / 3000);

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
    <PageTransition>
      <SEO
        title={post.seo_title || post.title}
        description={post.seo_description || post.excerpt}
        keywords={post.keywords}
        image={post.featured_image}
        url={`/blog/${post.slug}`}
        type="article"
        structuredData={[blogPostSchema, breadcrumbSchema]}
      />

      <ReadingProgress />

      <main className="flex flex-col bg-[#0a0a0f]">
        {/* ════════════════ ARTICLE HEADER ════════════════ */}
        <section className="relative border-b border-white/[0.06]">
          <Container className="pt-28 md:pt-36 pb-12 md:pb-16 max-w-4xl mx-auto">
            {/* Back link */}
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, ease: EASE_SMOOTH }}
            >
              <Link
                to="/blog"
                className="inline-flex items-center gap-2 text-white/25 hover:text-white/50 text-xs font-mono uppercase tracking-[0.2em] transition-colors duration-300 mb-10 group"
              >
                <ArrowLeft className="w-3.5 h-3.5 transition-transform duration-300 group-hover:-translate-x-1" />
                Blog
              </Link>
            </motion.div>

            {/* Meta */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1, ease: EASE_SMOOTH }}
              className="flex flex-wrap items-center gap-4 text-xs text-white/20 font-mono mb-6"
            >
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                <time dateTime={post.published_at}>
                  {new Date(post.published_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </time>
              </span>
              <span className="w-0.5 h-0.5 rounded-full bg-white/15" />
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                {readTime} min read
              </span>
              <span className="w-0.5 h-0.5 rounded-full bg-white/15" />
              <span className="flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5" />
                {(post.view_count || 0).toLocaleString()} views
              </span>
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15, ease: EASE_SMOOTH }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-[1.08] tracking-[-0.035em] mb-6"
            >
              {post.title}
            </motion.h1>

            {/* Excerpt as subtitle */}
            {post.excerpt && (
              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.25, ease: EASE_SMOOTH }}
                className="text-lg md:text-xl text-white/30 leading-relaxed max-w-2xl"
              >
                {post.excerpt}
              </motion.p>
            )}

            {/* Share button — minimal */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.35 }}
              className="mt-8"
            >
              <motion.button
                onClick={handleShare}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-mono uppercase tracking-[0.15em] text-white/25 border border-white/[0.08] hover:border-white/[0.16] hover:text-white/40 transition-all duration-300"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Share2 className="w-3.5 h-3.5" />
                Share
              </motion.button>
            </motion.div>
          </Container>
        </section>

        {/* ════════════════ FEATURED IMAGE ════════════════ */}
        {post.featured_image && (
          <section className="border-b border-white/[0.06]">
            <motion.div
              initial={{ opacity: 0, scale: 1.02 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2, ease: EASE_SMOOTH }}
              className="max-w-5xl mx-auto px-4 md:px-8 py-8 md:py-12"
            >
              <div className="aspect-[2/1] rounded-2xl overflow-hidden bg-white/[0.02]">
                <img
                  src={post.featured_image}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>
          </section>
        )}

        {/* ════════════════ ARTICLE CONTENT ════════════════ */}
        <section className="relative">
          <Container className="py-12 md:py-20 max-w-3xl mx-auto relative z-10">
            {/* TipTap rendered content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3, ease: EASE_SMOOTH }}
              className="prose prose-lg prose-invert max-w-none
                prose-headings:font-bold prose-headings:tracking-[-0.03em] prose-headings:text-white
                prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-4
                prose-h3:text-2xl prose-h3:mt-10 prose-h3:mb-3
                prose-p:text-white/40 prose-p:leading-[1.8]
                prose-a:text-skyblue prose-a:font-medium prose-a:no-underline prose-a:border-b prose-a:border-skyblue/30 hover:prose-a:border-skyblue
                prose-img:rounded-xl
                prose-blockquote:border-l-2 prose-blockquote:border-white/15 prose-blockquote:text-white/30 prose-blockquote:italic prose-blockquote:pl-6
                prose-strong:text-white/60 prose-strong:font-semibold
                prose-code:text-skyblue/80 prose-code:bg-white/[0.04] prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:font-mono
                prose-pre:bg-white/[0.03] prose-pre:border prose-pre:border-white/[0.06] prose-pre:rounded-xl
                prose-hr:border-white/[0.06]
                prose-li:text-white/40
                prose-ul:marker:text-white/15
                prose-ol:marker:text-white/15"
            >
              <EditorContent editor={editor} />
            </motion.div>

            {/* Bottom share */}
            <motion.div
              className="mt-16 pt-8 border-t border-white/[0.06] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <div>
                <p className="text-xs font-mono uppercase tracking-[0.2em] text-white/15 mb-1">
                  Enjoyed this?
                </p>
                <p className="text-base font-medium text-white/50">
                  Share it with your network
                </p>
              </div>
              <motion.button
                onClick={handleShare}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/[0.04] text-white/40 hover:bg-skyblue hover:text-white text-sm font-medium transition-all duration-300 border border-white/[0.08] hover:border-skyblue"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <Share2 className="w-4 h-4" />
                Share Article
              </motion.button>
            </motion.div>
          </Container>
        </section>

        {/* ════════════════ BACK TO BLOG CTA ════════════════ */}
        <section className="border-t border-white/[0.06]">
          <Container className="py-20 md:py-28 text-center">
            <p className="text-xs font-mono uppercase tracking-[0.3em] text-white/15 mb-4">
              Keep reading
            </p>
            <h2 className="text-2xl md:text-3xl font-bold text-white tracking-[-0.03em] mb-8">
              Explore more articles
            </h2>
            <MagneticButton>
              <Button
                variant="primary"
                size="lg"
                onClick={() => navigate("/blog")}
                rightIcon={<ChevronRight className="w-4 h-4" />}
              >
                All Articles
              </Button>
            </MagneticButton>
          </Container>
        </section>
      </main>

      {/* Scroll to top */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 z-50 p-3 rounded-full bg-white/[0.06] text-white/40 hover:bg-skyblue hover:text-white border border-white/[0.08] hover:border-skyblue transition-all duration-300"
          >
            <ArrowUp className="w-4 h-4" />
          </motion.button>
        )}
      </AnimatePresence>
    </PageTransition>
  );
};

export default BlogPost;
