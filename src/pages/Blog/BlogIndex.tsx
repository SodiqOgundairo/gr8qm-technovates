import React, { useEffect, useState, useMemo, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { supabase } from "../../utils/supabase";
import Container from "../../components/layout/Container";
import PageTransition from "../../components/layout/PageTransition";
import { SEO } from "../../components/common/SEO";
import { Clock, Calendar, ChevronRight, Search, X, ArrowUpRight } from "lucide-react";
import {
  generateBlogSchema,
  generateBreadcrumbSchema,
} from "../../utils/structured-data";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  featured_image: string;
  published_at: string;
  view_count: number;
}

/* ─── constants ─── */
const EASE_SMOOTH: [number, number, number, number] = [0.22, 0.6, 0.36, 1];
const EASE_DECEL: [number, number, number, number] = [0.16, 1, 0.3, 1];

const gridBg = {
  backgroundImage:
    "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
  backgroundSize: "64px 64px",
};

const BlogIndex: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const heroRef = useRef<HTMLDivElement>(null);

  /* ── hero parallax ── */
  const { scrollYProgress } = useScroll({
    target: heroRef as React.RefObject<HTMLElement>,
    offset: ["start start", "end start"],
  });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 0.6], [0, 80]);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from("blog_posts")
        .select(
          "id, title, slug, excerpt, featured_image, published_at, view_count",
        )
        .eq("status", "published")
        .order("published_at", { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPosts = useMemo(() => {
    if (!searchQuery.trim()) return posts;
    const q = searchQuery.toLowerCase();
    return posts.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.excerpt?.toLowerCase().includes(q),
    );
  }, [posts, searchQuery]);

  const featuredPost = filteredPosts[0];
  const gridPosts = filteredPosts.slice(1);

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  const getReadTime = (excerpt: string | null) =>
    Math.ceil((excerpt?.length || 1000) / 200);

  return (
    <PageTransition>
      <SEO
        title="Blog - Design, Tech & Training Insights"
        description="Expert insights on UX design, product development, tech training, and digital strategy from the Gr8QM Technovates team in Lagos, Nigeria."
        keywords={[
          "design blog",
          "tech blog Nigeria",
          "UX design insights",
          "product design articles",
          "tech training blog",
          "digital agency blog Lagos",
        ]}
        type="blog"
        url="/blog"
        structuredData={[
          generateBlogSchema(),
          generateBreadcrumbSchema([
            { name: "Home", url: "https://gr8qm.com/" },
            { name: "Blog", url: "https://gr8qm.com/blog" },
          ]),
        ]}
      />

      <main className="flex flex-col bg-[#0a0a0f]">
        {/* ════════════════ HERO ════════════════ */}
        <section
          ref={heroRef}
          className="relative min-h-[70vh] flex items-center justify-center overflow-hidden border-b border-white/[0.06]"
        >
          {/* Subtle grid bg */}
          <div className="absolute inset-0" style={gridBg} />

          {/* Soft ambient glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] rounded-full bg-skyblue/[0.04] blur-[160px] pointer-events-none" />

          <motion.div
            style={{ opacity: heroOpacity, y: heroY }}
            className="relative z-10 text-center px-4"
          >
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: EASE_SMOOTH }}
              className="font-mono text-[11px] uppercase tracking-[0.35em] text-white/30 mb-6"
            >
              Insights & Ideas
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1, ease: EASE_DECEL }}
              className="text-5xl md:text-7xl lg:text-[5.5rem] font-bold tracking-[-0.04em] text-white leading-[0.95] mb-6"
            >
              The GR8QM Blog
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: EASE_SMOOTH }}
              className="text-lg md:text-xl text-white/35 max-w-xl mx-auto leading-relaxed mb-10"
            >
              Thoughts on design, technology, and building for the future.
            </motion.p>

            {/* Search bar — Figma-style minimal */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3, ease: EASE_SMOOTH }}
              className="relative max-w-md mx-auto"
            >
              <div className="flex items-center gap-3 px-5 py-3.5 rounded-full bg-white/[0.04] border border-white/[0.08] backdrop-blur-sm transition-colors duration-300 focus-within:border-white/[0.16]">
                <Search className="w-4 h-4 text-white/25 shrink-0" />
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent w-full text-white/80 placeholder-white/20 outline-none text-sm"
                />
                <AnimatePresence>
                  {searchQuery && (
                    <motion.button
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.5 }}
                      onClick={() => setSearchQuery("")}
                      className="text-white/30 hover:text-white transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </motion.div>
        </section>

        {/* ════════════════ FEATURED POST — Figma-style large card ════════════════ */}
        <AnimatePresence mode="wait">
          {!loading && featuredPost && (
            <section className="relative border-b border-white/[0.06]">
              <Container className="py-16 md:py-24">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <span className="font-mono text-[10px] uppercase tracking-[0.35em] text-white/25 mb-8 block">
                    Latest
                  </span>

                  <Link
                    to={`/blog/${featuredPost.slug}`}
                    className="group grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center"
                  >
                    {/* Image — 7 cols */}
                    <motion.div
                      className="lg:col-span-7"
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.3, ease: EASE_SMOOTH }}
                    >
                      <div className="relative aspect-[16/10] rounded-2xl overflow-hidden bg-white/[0.03]">
                        {featuredPost.featured_image ? (
                          <motion.img
                            src={featuredPost.featured_image}
                            alt={featuredPost.title}
                            className="w-full h-full object-cover"
                            whileHover={{ scale: 1.03 }}
                            transition={{ duration: 0.6, ease: EASE_SMOOTH }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-white/[0.02]">
                            <span className="text-7xl font-bold text-white/[0.04]">GR8</span>
                          </div>
                        )}
                        {/* Subtle overlay on hover */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      </div>
                    </motion.div>

                    {/* Text — 5 cols */}
                    <motion.div
                      className="lg:col-span-5"
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.45, ease: EASE_SMOOTH }}
                    >
                      <div className="flex items-center gap-4 text-xs text-white/25 mb-5 font-mono">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5" />
                          {formatDate(featuredPost.published_at)}
                        </span>
                        <span className="w-1 h-1 rounded-full bg-white/15" />
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5" />
                          {getReadTime(featuredPost.excerpt)} min read
                        </span>
                      </div>

                      <h2 className="text-3xl md:text-4xl lg:text-[2.75rem] font-bold text-white leading-[1.1] tracking-[-0.03em] mb-5">
                        <span className="bg-gradient-to-r from-white to-white bg-[length:0%_1.5px] bg-left-bottom bg-no-repeat group-hover:bg-[length:100%_1.5px] transition-[background-size] duration-500 ease-[cubic-bezier(0.8,0,0.2,1)] pb-1">
                          {featuredPost.title}
                        </span>
                      </h2>

                      <p className="text-white/30 text-base leading-relaxed line-clamp-3 mb-6">
                        {featuredPost.excerpt || "Click to read more..."}
                      </p>

                      <span className="inline-flex items-center gap-2 text-sm font-medium text-white/40 group-hover:text-skyblue transition-colors duration-300">
                        Read article
                        <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </span>
                    </motion.div>
                  </Link>
                </motion.div>
              </Container>
            </section>
          )}
        </AnimatePresence>

        {/* ════════════════ POST GRID ════════════════ */}
        <section className="relative overflow-hidden">
          {/* Very subtle ambient light */}
          <div className="absolute top-[40%] -right-40 w-[500px] h-[500px] rounded-full bg-skyblue/[0.02] blur-[140px] pointer-events-none" />

          <Container className="py-16 md:py-24 relative z-10">
            {/* Section header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: EASE_SMOOTH }}
              className="flex items-end justify-between mb-12 border-b border-white/[0.06] pb-6"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-white tracking-[-0.03em]">
                All Articles
              </h2>
              <span className="text-xs font-mono text-white/20 uppercase tracking-[0.2em]">
                {filteredPosts.length} post{filteredPosts.length !== 1 ? "s" : ""}
              </span>
            </motion.div>

            {/* States */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="space-y-4">
                    <div className="aspect-[16/10] rounded-xl bg-white/[0.03] animate-pulse" />
                    <div className="h-3 bg-white/[0.04] rounded w-1/3 animate-pulse" />
                    <div className="h-5 bg-white/[0.04] rounded w-full animate-pulse" />
                    <div className="h-5 bg-white/[0.04] rounded w-2/3 animate-pulse" />
                    <div className="h-3 bg-white/[0.04] rounded w-full animate-pulse" />
                  </div>
                ))}
              </div>
            ) : filteredPosts.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center py-32"
              >
                <p className="text-white/25 text-lg mb-2">
                  {searchQuery ? "No matches found" : "No posts yet"}
                </p>
                <p className="text-white/15 text-sm">
                  {searchQuery
                    ? "Try a different search term."
                    : "Check back soon for new content."}
                </p>
              </motion.div>
            ) : (
              <AnimatePresence mode="wait">
                <motion.div
                  key={searchQuery}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-14"
                >
                  {(gridPosts.length > 0 ? gridPosts : filteredPosts).map(
                    (post, index) => (
                      <motion.div
                        key={post.id}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{
                          duration: 0.5,
                          delay: index * 0.06,
                          ease: EASE_SMOOTH,
                        }}
                      >
                        <Link
                          to={`/blog/${post.slug}`}
                          className="group block h-full"
                        >
                          <article className="h-full flex flex-col">
                            {/* Image — clean, no border, just rounded */}
                            <div className="aspect-[16/10] rounded-xl overflow-hidden bg-white/[0.03] mb-5">
                              {post.featured_image ? (
                                <motion.img
                                  src={post.featured_image}
                                  alt={post.title}
                                  className="object-cover w-full h-full transition-transform duration-500 ease-[cubic-bezier(0.22,0.6,0.36,1)] group-hover:scale-[1.04]"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-white/[0.02]">
                                  <span className="text-3xl font-bold text-white/[0.04]">
                                    GR8
                                  </span>
                                </div>
                              )}
                            </div>

                            {/* Meta */}
                            <div className="flex items-center gap-3 text-[11px] text-white/20 mb-3 font-mono">
                              <span>{formatDate(post.published_at)}</span>
                              <span className="w-0.5 h-0.5 rounded-full bg-white/15" />
                              <span>{getReadTime(post.excerpt)} min read</span>
                            </div>

                            {/* Title with animated underline — Figma style */}
                            <h2 className="text-lg font-bold text-white leading-snug mb-3 tracking-[-0.02em]">
                              <span className="bg-gradient-to-r from-white to-white bg-[length:0%_1px] bg-left-bottom bg-no-repeat group-hover:bg-[length:100%_1px] transition-[background-size] duration-500 ease-[cubic-bezier(0.8,0,0.2,1)] pb-0.5">
                                {post.title}
                              </span>
                            </h2>

                            {/* Excerpt */}
                            <p className="text-white/25 text-sm leading-relaxed line-clamp-2 mb-4 flex-1">
                              {post.excerpt || "Click to read more..."}
                            </p>

                            {/* Read link */}
                            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-white/20 group-hover:text-skyblue transition-colors duration-300">
                              Read
                              <ChevronRight className="w-3 h-3 transition-transform duration-300 group-hover:translate-x-0.5" />
                            </span>
                          </article>
                        </Link>
                      </motion.div>
                    ),
                  )}
                </motion.div>
              </AnimatePresence>
            )}
          </Container>
        </section>

        {/* ════════════════ BOTTOM BORDER ════════════════ */}
        <div className="border-t border-white/[0.06]" />
      </main>
    </PageTransition>
  );
};

export default BlogIndex;
