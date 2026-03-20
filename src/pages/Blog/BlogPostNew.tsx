import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
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
} from "lucide-react";
import OrbitalBackground from "../../components/animations/OrbitalBackground";
import MarqueeText from "../../components/animations/MarqueeText";
import {
  Reveal,
  DotGrid,
  DiagonalLines,
  CrossMark,
  FloatingRule,
  AccentLine,
  SectionConnector,
} from "../../components/animations/DesignElements";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import LinkExtension from "@tiptap/extension-link";
import Youtube from "@tiptap/extension-youtube";
import {
  generateBlogPostSchema,
  generateBreadcrumbSchema,
} from "../../utils/structured-data";

const springTransition = {
  type: "spring" as const,
  stiffness: 120,
  damping: 20,
};

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
      className="fixed top-0 left-0 h-1 bg-gradient-to-r from-skyblue via-orange to-skyblue z-50"
      style={{ width: `${progress}%` }}
      transition={{ duration: 0.1 }}
    />
  );
};

const BlogPost: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
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
        <div className="min-h-screen bg-oxford-deep flex items-center justify-center relative overflow-hidden">
          <OrbitalBackground variant="section" />
          <div className="relative z-10 text-center">
            <motion.div
              className="w-16 h-16 rounded-full border-2 border-skyblue/30 border-t-skyblue mx-auto mb-6"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
            <motion.p
              className="text-iceblue/40 text-lg font-medium tracking-wide"
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 2, repeat: Infinity, ease: [0.42, 0, 0.58, 1] }}
            >
              Loading article...
            </motion.p>
          </div>
        </div>
      </PageTransition>
    );
  }

  /* ── Error State ── */
  if (error || !post) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-oxford-deep flex items-center justify-center relative overflow-hidden">
          <OrbitalBackground variant="section" />
          <DotGrid className="top-8 left-8 text-skyblue/20" />
          <Container className="relative z-10 text-center">
            <Reveal>
              <span className="text-8xl font-black text-white/10 mb-8 block">
                404
              </span>
            </Reveal>
            <Reveal delay={0.15}>
              <h1 className="text-4xl md:text-6xl font-black text-white mb-6">
                Post Not Found
              </h1>
            </Reveal>
            <Reveal delay={0.3}>
              <p className="text-iceblue/40 text-lg mb-10 max-w-md mx-auto">
                This article may have been moved or doesn't exist anymore.
              </p>
              <motion.div whileHover={{ x: -4 }} transition={springTransition}>
                <Link
                  to="/new/blog"
                  className="inline-flex items-center gap-3 px-8 py-4 bg-skyblue text-white font-bold rounded-full hover:bg-skyblue/90 transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                  Back to Blog
                </Link>
              </motion.div>
            </Reveal>
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

      <main className="flex flex-col bg-oxford-deep">
        {/* ═══════════════ HERO / FEATURED IMAGE ═══════════════ */}
        <section className="relative w-full min-h-[70vh] flex items-end overflow-hidden z-10 sticky top-0">
          <OrbitalBackground variant="hero" />

          {/* Featured image background */}
          {post.featured_image && (
            <motion.div
              className="absolute inset-0"
              initial={{ scale: 1.1, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1.2, ease: [0.22, 0.6, 0.36, 1] as [number, number, number, number] }}
            >
              <img
                src={post.featured_image}
                alt={post.title}
                className="w-full h-full object-cover opacity-40"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-oxford-deep via-oxford-deep/70 to-oxford-deep/30" />
            </motion.div>
          )}

          {/* Geometric decorations */}
          <DotGrid className="top-8 right-8 text-skyblue/15" />
          <DiagonalLines className="bottom-0 left-0 text-orange/10" />
          <CrossMark className="absolute top-[15%] left-[10%] text-skyblue/15" size={18} />
          <FloatingRule className="bottom-0 left-0 w-full" color="skyblue" dashed />

          <Container className="relative z-10 pb-16 pt-32">
            {/* Back link */}
            <Reveal direction="left" delay={0.1}>
              <motion.div whileHover={{ x: -4 }} transition={springTransition}>
                <Link
                  to="/new/blog"
                  className="inline-flex items-center gap-2 text-iceblue/40 hover:text-white uppercase tracking-[0.2em] text-xs font-bold transition-colors duration-300 mb-10"
                >
                  <ArrowLeft className="w-4 h-4" /> Back to Blog
                </Link>
              </motion.div>
            </Reveal>

            <Reveal delay={0.15}>
              <AccentLine color="skyblue" thickness="medium" width="w-16" className="mb-6" />
            </Reveal>

            {/* Title */}
            <Reveal delay={0.2}>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white leading-[1.05] mb-8">
                {post.title}
              </h1>
            </Reveal>

            {/* Meta row */}
            <Reveal delay={0.4}>
              <div className="flex flex-wrap items-center gap-6 text-sm md:text-base">
                <span className="flex items-center gap-2 text-iceblue/40">
                  <Calendar className="text-skyblue w-4 h-4" />
                  <time dateTime={post.published_at}>
                    {new Date(post.published_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </time>
                </span>
                <span className="flex items-center gap-2 text-iceblue/40">
                  <Clock className="text-orange w-4 h-4" />
                  {readTime} min read
                </span>
                <span className="flex items-center gap-2 text-iceblue/40">
                  <Eye className="text-skyblue w-4 h-4" />
                  {(post.view_count || 0).toLocaleString()} views
                </span>

                {/* Share */}
                <motion.button
                  onClick={handleShare}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.06] backdrop-blur-sm text-iceblue/50 hover:bg-skyblue hover:text-white transition-all duration-300 text-sm font-bold border border-oxford-border hover:border-skyblue"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Share2 className="w-4 h-4" />
                  Share
                </motion.button>
              </div>
            </Reveal>
          </Container>

          <SectionConnector color="skyblue" side="right" />
        </section>

        {/* ── Marquee ── */}
        <div className="relative z-[15]">
          <MarqueeText
            text={post.title.toUpperCase()}
            speed={35}
            className="py-3 bg-skyblue text-oxford/20 font-black text-sm tracking-[0.3em]"
          />
        </div>

        {/* ═══════════════ ARTICLE CONTENT ═══════════════ */}
        <section className="relative bg-oxford-deep overflow-hidden z-20 sticky top-0">
          <OrbitalBackground variant="section" />

          {/* Geometric decorations */}
          <DiagonalLines className="top-0 right-0 text-skyblue/10" />
          <CrossMark className="absolute bottom-[10%] left-[5%] text-orange/10" size={14} />
          <FloatingRule className="top-0 left-0 w-full" color="orange" />

          <Container className="py-20 grid grid-cols-1 lg:grid-cols-12 gap-12 relative z-10">
            {/* Sidebar - sticky info */}
            <Reveal
              direction="left"
              delay={0.2}
              className="hidden lg:block lg:col-span-2"
            >
              <div className="sticky top-28 space-y-8">
                <div>
                  <span className="text-xs font-bold uppercase tracking-[0.2em] text-iceblue/20 block mb-2">
                    Published
                  </span>
                  <span className="text-sm font-bold text-white">
                    {new Date(post.published_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-[0.2em] text-iceblue/20 block mb-2">
                    Read Time
                  </span>
                  <span className="text-sm font-bold text-white">
                    {readTime} min
                  </span>
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-[0.2em] text-iceblue/20 block mb-2">
                    Views
                  </span>
                  <span className="text-sm font-bold text-white">
                    {(post.view_count || 0).toLocaleString()}
                  </span>
                </div>
                <div className="pt-4">
                  <motion.button
                    onClick={handleShare}
                    className="p-3 rounded-full bg-white/[0.06] border border-oxford-border hover:bg-skyblue hover:border-skyblue hover:text-white text-iceblue/30 transition-all duration-300"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Share2 className="w-5 h-5" />
                  </motion.button>
                </div>
              </div>
            </Reveal>

            {/* Main content */}
            <Reveal
              delay={0.3}
              className="lg:col-span-8"
            >
              <div className="bg-white/[0.03] backdrop-blur-sm rounded-3xl p-8 md:p-12 lg:p-16 border border-oxford-border">
                {/* Excerpt pull quote */}
                {post.excerpt && (
                  <motion.div
                    className="mb-12 pb-12 border-b border-oxford-border"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, ease: [0.22, 0.6, 0.36, 1] as [number, number, number, number] }}
                  >
                    <p className="text-xl md:text-2xl text-iceblue/50 leading-relaxed font-light italic border-l-4 border-skyblue pl-6">
                      {post.excerpt}
                    </p>
                  </motion.div>
                )}

                {/* TipTap rendered content */}
                <div className="prose prose-lg prose-invert max-w-none prose-headings:font-black prose-headings:text-white prose-p:text-iceblue/60 prose-p:leading-relaxed prose-a:text-skyblue prose-a:font-bold prose-a:no-underline hover:prose-a:underline prose-img:rounded-2xl prose-blockquote:border-skyblue prose-blockquote:text-iceblue/40 prose-strong:text-white prose-code:text-skyblue prose-code:bg-white/[0.06] prose-pre:bg-white/[0.04] prose-pre:border prose-pre:border-oxford-border prose-hr:border-oxford-border prose-li:text-iceblue/60">
                  <EditorContent editor={editor} />
                </div>

                {/* Divider + share */}
                <motion.div
                  className="mt-16 pt-10 border-t border-oxford-border"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-[0.2em] text-iceblue/20 block mb-2">
                        Enjoyed this article?
                      </span>
                      <span className="text-lg font-bold text-white">
                        Share it with your network
                      </span>
                    </div>
                    <motion.button
                      onClick={handleShare}
                      className="flex items-center gap-3 px-6 py-3 rounded-full bg-skyblue text-white font-bold hover:bg-skyblue/90 transition-colors duration-300"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Share2 className="w-4 h-4" />
                      Share Article
                    </motion.button>
                  </div>
                </motion.div>
              </div>
            </Reveal>

            {/* Right gutter - decorative */}
            <div className="hidden lg:block lg:col-span-2" />
          </Container>

          <SectionConnector color="orange" side="left" />
        </section>

        {/* ═══════════════ BACK TO BLOG CTA ═══════════════ */}
        <section className="relative py-20 bg-oxford-deep overflow-hidden z-30">
          <OrbitalBackground variant="cta" />

          <DotGrid className="bottom-8 right-8 text-orange/15" />
          <CrossMark className="absolute top-[10%] left-[15%] text-skyblue/15" size={16} />
          <FloatingRule className="top-0 left-0 w-full" color="skyblue" dashed />

          <Container className="relative z-10 text-center">
            <Reveal>
              <AccentLine color="orange" thickness="thick" width="w-10" className="mx-auto mb-4" />
              <span className="text-xs font-bold uppercase tracking-[0.3em] text-orange mb-4 block">
                Keep Reading
              </span>
              <h2 className="text-3xl md:text-5xl font-black text-white mb-8">
                Explore More{" "}
                <span className="text-skyblue">Articles</span>
              </h2>
              <motion.div whileHover={{ x: -6 }} transition={springTransition}>
                <Link
                  to="/new/blog"
                  className="inline-flex items-center gap-3 px-10 py-5 bg-skyblue text-white font-bold text-lg rounded-full hover:bg-skyblue/90 transition-colors duration-300 shadow-lg shadow-skyblue/20"
                >
                  <ArrowLeft className="w-5 h-5" />
                  All Articles
                </Link>
              </motion.div>
            </Reveal>
          </Container>
        </section>

        {/* Bottom marquee */}
        <div className="relative z-40">
          <MarqueeText
            text="READ  LEARN  BUILD  GROW  INNOVATE  CREATE  DESIGN  SHIP"
            speed={25}
            className="py-4 bg-oxford-deep text-iceblue/5 font-black text-2xl tracking-[0.2em]"
            reverse
          />
        </div>
      </main>

      {/* Scroll to top button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.5, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: 20 }}
            transition={springTransition}
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 z-50 p-4 rounded-full bg-skyblue text-white shadow-lg shadow-skyblue/30 hover:bg-oxford transition-colors duration-300 border border-oxford-border"
          >
            <ArrowUp className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>
    </PageTransition>
  );
};

export default BlogPost;
