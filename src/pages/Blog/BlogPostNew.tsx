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
import RevealOnScroll from "../../components/animations/RevealOnScroll";
import SplitText from "../../components/animations/SplitText";
import Scene3D from "../../components/animations/Scene3D";
import MarqueeText from "../../components/animations/MarqueeText";
import MagneticButton from "../../components/animations/MagneticButton";
import GlowCard from "../../components/animations/GlowCard";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import LinkExtension from "@tiptap/extension-link";
import Youtube from "@tiptap/extension-youtube";
import {
  generateBlogPostSchema,
  generateBreadcrumbSchema,
} from "../../utils/structured-data";

/* Floating orb */
const FloatingOrb: React.FC<{
  size: number;
  color: string;
  top: string;
  left: string;
  delay: number;
}> = ({ size, color, top, left, delay }) => (
  <motion.div
    className="absolute rounded-full blur-3xl pointer-events-none"
    style={{ width: size, height: size, background: color, top, left }}
    animate={{
      y: [0, -25, 0, 18, 0],
      x: [0, 12, -8, 4, 0],
      scale: [1, 1.08, 0.96, 1.04, 1],
    }}
    transition={{
      duration: 14,
      delay,
      repeat: Infinity,
      ease: "easeInOut",
    }}
  />
);

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
        <div className="min-h-screen bg-oxford flex items-center justify-center relative overflow-hidden">
          <Scene3D variant="minimal" />
          <div className="noise-overlay absolute inset-0" />
          <div className="relative z-10 text-center">
            <motion.div
              className="w-16 h-16 rounded-full border-2 border-skyblue/30 border-t-skyblue mx-auto mb-6"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
            <motion.p
              className="text-white/50 text-lg font-medium tracking-wide"
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 2, repeat: Infinity }}
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
        <div className="min-h-screen bg-oxford flex items-center justify-center relative overflow-hidden">
          <Scene3D variant="minimal" />
          <div className="noise-overlay absolute inset-0" />
          <Container className="relative z-10 text-center">
            <RevealOnScroll direction="scale">
              <motion.div
                className="text-8xl mb-8 inline-block"
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                404
              </motion.div>
            </RevealOnScroll>
            <SplitText
              as="h1"
              type="words"
              className="text-4xl md:text-6xl font-black text-white mb-6"
            >
              Post Not Found
            </SplitText>
            <RevealOnScroll direction="up" delay={0.3}>
              <p className="text-white/50 text-lg mb-10 max-w-md mx-auto">
                This article may have been moved or doesn't exist anymore.
              </p>
              <MagneticButton strength={25}>
                <Link
                  to="/blog"
                  className="inline-flex items-center gap-3 px-8 py-4 bg-skyblue text-white font-bold rounded-full hover:bg-skyblue/90 transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                  Back to Blog
                </Link>
              </MagneticButton>
            </RevealOnScroll>
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

      <main className="overflow-hidden">
        {/* ── Hero / Featured Image ── */}
        <section className="relative w-full min-h-[70vh] flex items-end bg-oxford overflow-hidden">
          <Scene3D variant="minimal" />

          {/* Featured image background */}
          {post.featured_image && (
            <motion.div
              className="absolute inset-0"
              initial={{ scale: 1.1, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1.2, ease: [0.22, 0.6, 0.36, 1] }}
            >
              <img
                src={post.featured_image}
                alt={post.title}
                className="w-full h-full object-cover opacity-50"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-oxford via-oxford/60 to-oxford/30" />
            </motion.div>
          )}

          {/* Floating orbs */}
          <FloatingOrb size={350} color="rgba(0,152,218,0.06)" top="10%" left="70%" delay={0} />
          <FloatingOrb size={250} color="rgba(245,134,52,0.05)" top="50%" left="5%" delay={2} />

          <div className="noise-overlay absolute inset-0 z-[1]" />

          <Container className="relative z-10 pb-16 pt-32">
            {/* Back link */}
            <RevealOnScroll direction="left" delay={0.1}>
              <MagneticButton strength={15}>
                <Link
                  to="/blog"
                  className="inline-flex items-center gap-2 text-white/60 hover:text-white uppercase tracking-[0.2em] text-xs font-bold transition-colors duration-300 mb-10 hover-line"
                >
                  <ArrowLeft className="w-4 h-4" /> Back to Blog
                </Link>
              </MagneticButton>
            </RevealOnScroll>

            {/* Title */}
            <SplitText
              as="h1"
              type="words"
              className="text-4xl md:text-6xl lg:text-7xl font-black text-white leading-[1.05] mb-8"
              delay={0.2}
              stagger={0.05}
            >
              {post.title}
            </SplitText>

            {/* Meta row */}
            <RevealOnScroll direction="up" delay={0.6}>
              <div className="flex flex-wrap items-center gap-6 text-sm md:text-base">
                <span className="flex items-center gap-2 text-white/50">
                  <Calendar className="text-skyblue w-4 h-4" />
                  <time dateTime={post.published_at}>
                    {new Date(post.published_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </time>
                </span>
                <span className="flex items-center gap-2 text-white/50">
                  <Clock className="text-orange w-4 h-4" />
                  {readTime} min read
                </span>
                <span className="flex items-center gap-2 text-white/50">
                  <Eye className="text-skyblue w-4 h-4" />
                  {(post.view_count || 0).toLocaleString()} views
                </span>

                {/* Share */}
                <MagneticButton strength={20}>
                  <button
                    onClick={handleShare}
                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm text-white/60 hover:bg-skyblue hover:text-white transition-all duration-300 text-sm font-bold"
                  >
                    <Share2 className="w-4 h-4" />
                    Share
                  </button>
                </MagneticButton>
              </div>
            </RevealOnScroll>
          </Container>
        </section>

        {/* ── Marquee ── */}
        <MarqueeText
          text={post.title.toUpperCase()}
          speed={35}
          className="py-3 bg-skyblue text-oxford/20 font-black text-sm tracking-[0.3em]"
        />

        {/* ── Article Content ── */}
        <section className="relative bg-light">
          <FloatingOrb size={400} color="rgba(0,152,218,0.03)" top="20%" left="80%" delay={1} />
          <FloatingOrb size={300} color="rgba(245,134,52,0.03)" top="60%" left="-5%" delay={3} />

          <Container className="py-20 grid grid-cols-1 lg:grid-cols-12 gap-12 relative z-10">
            {/* Sidebar - sticky info */}
            <RevealOnScroll
              direction="left"
              delay={0.2}
              className="hidden lg:block lg:col-span-2"
            >
              <div className="sticky top-28 space-y-8">
                <div>
                  <span className="text-xs font-bold uppercase tracking-[0.2em] text-oxford/30 block mb-2">
                    Published
                  </span>
                  <span className="text-sm font-bold text-oxford">
                    {new Date(post.published_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-[0.2em] text-oxford/30 block mb-2">
                    Read Time
                  </span>
                  <span className="text-sm font-bold text-oxford">
                    {readTime} min
                  </span>
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-[0.2em] text-oxford/30 block mb-2">
                    Views
                  </span>
                  <span className="text-sm font-bold text-oxford">
                    {(post.view_count || 0).toLocaleString()}
                  </span>
                </div>
                <div className="pt-4">
                  <MagneticButton strength={20}>
                    <button
                      onClick={handleShare}
                      className="p-3 rounded-full bg-oxford/5 hover:bg-skyblue hover:text-white text-oxford/40 transition-all duration-300"
                    >
                      <Share2 className="w-5 h-5" />
                    </button>
                  </MagneticButton>
                </div>
              </div>
            </RevealOnScroll>

            {/* Main content */}
            <RevealOnScroll
              direction="up"
              delay={0.3}
              className="lg:col-span-8"
            >
              <GlowCard
                className="rounded-3xl"
                glowColor="rgba(0,152,218,0.06)"
              >
                <div className="glass-card bg-white/90 backdrop-blur-sm rounded-3xl p-8 md:p-12 lg:p-16 border border-oxford/5 shadow-xl shadow-oxford/5">
                  {/* Excerpt pull quote */}
                  {post.excerpt && (
                    <motion.div
                      className="mb-12 pb-12 border-b border-oxford/10"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                    >
                      <p className="text-xl md:text-2xl text-oxford/60 leading-relaxed font-light italic border-l-4 border-skyblue pl-6">
                        {post.excerpt}
                      </p>
                    </motion.div>
                  )}

                  {/* TipTap rendered content */}
                  <div className="prose prose-lg prose-sky max-w-none prose-headings:font-black prose-headings:text-oxford prose-p:text-oxford/70 prose-p:leading-relaxed prose-a:text-skyblue prose-a:font-bold prose-a:no-underline hover:prose-a:underline prose-img:rounded-2xl prose-blockquote:border-skyblue prose-blockquote:text-oxford/50">
                    <EditorContent editor={editor} />
                  </div>

                  {/* Divider + share */}
                  <motion.div
                    className="mt-16 pt-10 border-t border-oxford/10"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                  >
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                      <div>
                        <span className="text-xs font-bold uppercase tracking-[0.2em] text-oxford/30 block mb-2">
                          Enjoyed this article?
                        </span>
                        <span className="text-lg font-bold text-oxford">
                          Share it with your network
                        </span>
                      </div>
                      <MagneticButton strength={25}>
                        <button
                          onClick={handleShare}
                          className="flex items-center gap-3 px-6 py-3 rounded-full bg-oxford text-white font-bold hover:bg-skyblue transition-colors duration-300"
                        >
                          <Share2 className="w-4 h-4" />
                          Share Article
                        </button>
                      </MagneticButton>
                    </div>
                  </motion.div>
                </div>
              </GlowCard>
            </RevealOnScroll>

            {/* Right gutter - decorative */}
            <div className="hidden lg:block lg:col-span-2" />
          </Container>
        </section>

        {/* ── Back to blog CTA ── */}
        <section className="relative py-20 bg-oxford overflow-hidden">
          <Scene3D variant="minimal" />
          <div className="noise-overlay absolute inset-0" />
          <Container className="relative z-10 text-center">
            <RevealOnScroll direction="up">
              <span className="text-xs font-bold uppercase tracking-[0.3em] text-orange mb-4 block">
                Keep Reading
              </span>
              <h2 className="text-3xl md:text-5xl font-black text-white mb-8">
                Explore More{" "}
                <span className="gradient-text">Articles</span>
              </h2>
              <MagneticButton strength={25}>
                <Link
                  to="/blog"
                  className="inline-flex items-center gap-3 px-10 py-5 bg-skyblue text-white font-bold text-lg rounded-full hover:bg-skyblue/90 transition-colors duration-300 shadow-lg shadow-skyblue/20"
                >
                  <ArrowLeft className="w-5 h-5" />
                  All Articles
                </Link>
              </MagneticButton>
            </RevealOnScroll>
          </Container>
        </section>

        {/* Bottom marquee */}
        <MarqueeText
          text="READ  LEARN  BUILD  GROW  INNOVATE  CREATE  DESIGN  SHIP"
          speed={25}
          className="py-4 bg-dark text-white/10 font-black text-2xl tracking-[0.2em]"
          reverse
        />
      </main>

      {/* Scroll to top button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.5, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: 20 }}
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 z-50 p-4 rounded-full bg-skyblue text-white shadow-lg shadow-skyblue/30 hover:bg-oxford transition-colors duration-300"
          >
            <ArrowUp className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>
    </PageTransition>
  );
};

export default BlogPost;
