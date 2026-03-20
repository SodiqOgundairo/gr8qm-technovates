import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "../../utils/supabase";
import Container from "../../components/layout/Container";
import PageTransition from "../../components/layout/PageTransition";
import { SEO } from "../../components/common/SEO";
import { Clock, Calendar, ChevronRight, Search, X } from "lucide-react";
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

const springTransition = {
  type: "spring" as const,
  stiffness: 120,
  damping: 20,
};

const BlogIndex: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

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

      <main className="flex flex-col bg-oxford-deep">
        {/* ═══════════════ HERO SECTION ═══════════════ */}
        <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden z-10 sticky top-0">
          <OrbitalBackground variant="hero" />

          {/* Geometric decorations */}
          <DotGrid className="top-8 left-8 text-skyblue/20" />
          <DiagonalLines className="bottom-0 right-0 text-orange/10" thick />
          <CrossMark className="absolute top-[12%] right-[18%] text-skyblue/15" size={20} />
          <CrossMark className="absolute bottom-[18%] left-[12%] text-orange/15" size={14} />
          <FloatingRule className="top-0 left-0 w-full" color="skyblue" dashed />
          <FloatingRule className="bottom-0 left-0 w-full" color="orange" />

          <Container className="relative z-10 text-center">
            <Reveal delay={0}>
              <motion.div
                className="inline-block bg-skyblue/10 border border-oxford-border rounded-full px-5 py-2 mb-8"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <p className="text-sm text-iceblue/70 font-bold tracking-widest uppercase">
                  Insights & Ideas
                </p>
              </motion.div>
            </Reveal>

            <Reveal delay={0.1}>
              <AccentLine color="skyblue" thickness="medium" width="w-16" className="mx-auto mb-6" />
            </Reveal>

            <Reveal delay={0.15}>
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white leading-[0.95] mb-8">
                Our Latest{" "}
                <span className="text-skyblue">Insights</span>
              </h1>
            </Reveal>

            <Reveal delay={0.3}>
              <p className="text-xl md:text-2xl text-iceblue/70 max-w-2xl mx-auto font-light leading-relaxed mb-12">
                Thoughts, stories, and ideas from the Gr8QM team on design,
                technology, and building for the future.
              </p>
            </Reveal>

            {/* Search bar */}
            <Reveal delay={0.45}>
              <div className="relative max-w-lg mx-auto">
                <div className="bg-white/[0.04] backdrop-blur-xl rounded-2xl flex items-center gap-3 px-6 py-4 border border-oxford-border">
                  <Search className="w-5 h-5 text-skyblue shrink-0" />
                  <input
                    type="text"
                    placeholder="Search articles..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-transparent w-full text-white placeholder-iceblue/30 outline-none text-lg"
                  />
                  <AnimatePresence>
                    {searchQuery && (
                      <motion.button
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                        transition={springTransition}
                        onClick={() => setSearchQuery("")}
                        className="text-iceblue/40 hover:text-white transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </motion.button>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </Reveal>

            {/* Scroll indicator */}
            <Reveal delay={0.6}>
              <motion.div
                className="mt-16 flex flex-col items-center gap-2"
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: [0.42, 0, 0.58, 1] }}
              >
                <span className="text-xs text-iceblue/30 uppercase tracking-[0.3em]">
                  Scroll
                </span>
                <div className="w-px h-10 bg-gradient-to-b from-skyblue/60 to-transparent" />
              </motion.div>
            </Reveal>
          </Container>

          <SectionConnector color="skyblue" side="right" />
        </section>

        {/* ── Marquee divider ── */}
        <div className="relative z-[15]">
          <MarqueeText
            text="DESIGN  TECHNOLOGY  INNOVATION  TRAINING  PRODUCT  STRATEGY  UX  GROWTH"
            speed={30}
            className="py-5 bg-skyblue text-oxford font-black text-lg tracking-widest"
          />
        </div>

        {/* ═══════════════ FEATURED POST ═══════════════ */}
        <AnimatePresence mode="wait">
          {!loading && featuredPost && (
            <section className="relative py-24 md:py-32 bg-oxford-deep overflow-hidden z-20 sticky top-0">
              <OrbitalBackground variant="section" />

              {/* Geometric decorations */}
              <DiagonalLines className="top-0 left-0 text-skyblue/10" />
              <CrossMark className="absolute top-[8%] right-[10%] text-orange/15" size={18} />
              <FloatingRule className="top-0 left-0 w-full" color="orange" dashed />

              <Container className="relative z-10">
                <Reveal delay={0.1}>
                  <AccentLine color="orange" thickness="thick" width="w-10" className="mb-4" />
                  <span className="text-xs font-bold uppercase tracking-[0.3em] text-orange mb-6 block">
                    Featured Article
                  </span>
                </Reveal>

                <Link
                  to={`/new/blog/${featuredPost.slug}`}
                  className="group grid grid-cols-1 lg:grid-cols-2 gap-10 items-center"
                >
                  <Reveal direction="left" delay={0.2}>
                    <div className="relative aspect-[16/10] rounded-3xl overflow-hidden border border-oxford-border">
                      {featuredPost.featured_image ? (
                        <motion.img
                          src={featuredPost.featured_image}
                          alt={featuredPost.title}
                          className="w-full h-full object-cover"
                          whileHover={{ scale: 1.05 }}
                          transition={{ duration: 0.6, ease: [0.22, 0.6, 0.36, 1] }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-oxford/50 text-skyblue/30">
                          <span className="text-7xl font-black">GR8</span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-oxford-deep/60 to-transparent" />
                    </div>
                  </Reveal>

                  <Reveal direction="right" delay={0.3}>
                    <div className="space-y-6">
                      <div className="flex items-center gap-5 text-sm text-iceblue/40">
                        <span className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-skyblue" />
                          {new Date(featuredPost.published_at).toLocaleDateString(
                            "en-US",
                            { year: "numeric", month: "long", day: "numeric" },
                          )}
                        </span>
                        <span className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-skyblue" />
                          {Math.ceil(featuredPost.excerpt?.length / 200 || 5)} min
                          read
                        </span>
                      </div>

                      <h2 className="text-4xl md:text-5xl font-black text-white leading-tight group-hover:text-skyblue transition-colors duration-500">
                        {featuredPost.title}
                      </h2>

                      <p className="text-lg text-iceblue/50 leading-relaxed line-clamp-3">
                        {featuredPost.excerpt || "Click to read more..."}
                      </p>

                      <motion.span
                        className="inline-flex items-center gap-3 text-skyblue font-bold text-lg"
                        whileHover={{ x: 8 }}
                        transition={springTransition}
                      >
                        Read Article
                        <ChevronRight className="w-5 h-5" />
                      </motion.span>
                    </div>
                  </Reveal>
                </Link>
              </Container>

              <SectionConnector color="orange" side="left" />
            </section>
          )}
        </AnimatePresence>

        {/* ═══════════════ BLOG GRID ═══════════════ */}
        <section className="relative py-24 md:py-32 bg-oxford-deep overflow-hidden z-30 sticky top-0">
          <OrbitalBackground variant="section" />

          {/* Geometric decorations */}
          <DotGrid className="bottom-12 right-8 text-orange/15" />
          <CrossMark className="absolute top-[6%] left-[8%] text-skyblue/15" size={16} />
          <CrossMark className="absolute bottom-[12%] right-[15%] text-orange/15" size={12} />
          <FloatingRule className="top-0 left-0 w-full" color="skyblue" />

          <Container className="relative z-10">
            {/* Section header */}
            <Reveal>
              <div className="flex items-end justify-between mb-16">
                <div>
                  <AccentLine color="skyblue" thickness="thick" width="w-10" className="mb-4" />
                  <span className="text-xs font-bold uppercase tracking-[0.3em] text-orange mb-3 block">
                    All Articles
                  </span>
                  <h2 className="text-4xl md:text-5xl font-black text-white">
                    Explore{" "}
                    <span className="text-skyblue">Our Writing</span>
                  </h2>
                </div>
                <span className="hidden md:block text-sm text-iceblue/30 font-medium">
                  {filteredPosts.length} article{filteredPosts.length !== 1 ? "s" : ""}
                </span>
              </div>
            </Reveal>

            {/* States: loading / empty / grid */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[...Array(6)].map((_, i) => (
                  <Reveal key={i} delay={i * 0.08}>
                    <div className="rounded-3xl overflow-hidden bg-white/[0.03] border border-oxford-border">
                      <div className="aspect-video bg-white/[0.04] animate-pulse" />
                      <div className="p-7 space-y-4">
                        <div className="h-3 bg-white/[0.06] rounded-full w-1/3 animate-pulse" />
                        <div className="h-5 bg-white/[0.06] rounded-full w-full animate-pulse" />
                        <div className="h-5 bg-white/[0.06] rounded-full w-2/3 animate-pulse" />
                        <div className="h-3 bg-white/[0.06] rounded-full w-full animate-pulse" />
                        <div className="h-3 bg-white/[0.06] rounded-full w-4/5 animate-pulse" />
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
            ) : filteredPosts.length === 0 ? (
              <Reveal>
                <div className="text-center py-28 bg-white/[0.03] rounded-3xl border border-oxford-border backdrop-blur-sm">
                  <motion.div
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: [0.42, 0, 0.58, 1] }}
                    className="text-6xl mb-6 inline-block"
                  >
                    {searchQuery ? "?" : "..."}
                  </motion.div>
                  <h3 className="text-3xl font-black text-white mb-3">
                    {searchQuery ? "No matches found" : "No posts yet"}
                  </h3>
                  <p className="text-iceblue/40 text-lg">
                    {searchQuery
                      ? "Try a different search term."
                      : "Check back soon for new content!"}
                  </p>
                </div>
              </Reveal>
            ) : (
              <AnimatePresence mode="wait">
                <motion.div
                  key={searchQuery}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                  {(gridPosts.length > 0 ? gridPosts : filteredPosts).map(
                    (post, index) => (
                      <Reveal
                        key={post.id}
                        direction={
                          index % 3 === 0
                            ? "left"
                            : index % 3 === 1
                              ? "up"
                              : "right"
                        }
                        delay={index * 0.1}
                      >
                        <Link
                          to={`/new/blog/${post.slug}`}
                          className="group block h-full"
                          onMouseEnter={() => setHoveredCard(post.id)}
                          onMouseLeave={() => setHoveredCard(null)}
                        >
                          <article className="bg-white/[0.03] backdrop-blur-sm border border-oxford-border rounded-3xl overflow-hidden h-full flex flex-col hover:border-skyblue/30 hover:bg-white/[0.06] transition-all duration-500">
                            {/* Image */}
                            <div className="aspect-video overflow-hidden relative">
                              {post.featured_image ? (
                                <motion.img
                                  src={post.featured_image}
                                  alt={post.title}
                                  className="object-cover w-full h-full"
                                  animate={{
                                    scale: hoveredCard === post.id ? 1.08 : 1,
                                  }}
                                  transition={{
                                    duration: 0.6,
                                    ease: [0.22, 0.6, 0.36, 1] as [number, number, number, number],
                                  }}
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-oxford/50">
                                  <span className="text-4xl font-black text-skyblue/10">
                                    GR8
                                  </span>
                                </div>
                              )}
                              <div className="absolute inset-0 bg-gradient-to-t from-oxford-deep/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                              {/* Badge */}
                              <motion.div
                                className="absolute top-4 right-4 bg-white/[0.08] backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-black text-iceblue/70 uppercase tracking-wider border border-oxford-border"
                                whileHover={{ scale: 1.05 }}
                              >
                                Blog
                              </motion.div>
                            </div>

                            {/* Content */}
                            <div className="p-7 flex-1 flex flex-col">
                              <div className="flex items-center gap-4 text-xs text-iceblue/30 mb-4 font-medium">
                                <span className="flex items-center gap-1.5">
                                  <Calendar className="w-3.5 h-3.5 text-skyblue" />
                                  {new Date(
                                    post.published_at,
                                  ).toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                  })}
                                </span>
                                <span className="flex items-center gap-1.5">
                                  <Clock className="w-3.5 h-3.5 text-orange" />
                                  {Math.ceil(
                                    post.excerpt?.length / 200 || 5,
                                  )}{" "}
                                  min read
                                </span>
                              </div>

                              <h2 className="text-xl font-black text-white group-hover:text-skyblue transition-colors duration-300 mb-3 line-clamp-2 leading-snug">
                                {post.title}
                              </h2>

                              <p className="text-iceblue/40 text-sm leading-relaxed line-clamp-3 mb-6 flex-1">
                                {post.excerpt || "Click to read more..."}
                              </p>

                              {/* Read link */}
                              <div className="pt-5 border-t border-oxford-border flex items-center justify-between">
                                <span className="text-skyblue font-bold text-sm flex items-center gap-2 group-hover:gap-4 transition-all duration-300">
                                  Read Article
                                  <ChevronRight className="w-4 h-4" />
                                </span>
                                <span className="text-xs text-iceblue/20 font-medium">
                                  {post.view_count || 0} views
                                </span>
                              </div>
                            </div>
                          </article>
                        </Link>
                      </Reveal>
                    ),
                  )}
                </motion.div>
              </AnimatePresence>
            )}
          </Container>

          <SectionConnector color="skyblue" side="center" />
        </section>

        {/* ═══════════════ BOTTOM MARQUEE ═══════════════ */}
        <div className="relative z-40">
          <MarqueeText
            text="READ  LEARN  BUILD  GROW  INNOVATE  CREATE  DESIGN  SHIP"
            speed={25}
            className="py-4 bg-oxford-deep text-iceblue/5 font-black text-2xl tracking-[0.2em]"
            reverse
          />
        </div>
      </main>
    </PageTransition>
  );
};

export default BlogIndex;
