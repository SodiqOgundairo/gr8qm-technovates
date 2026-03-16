import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "../../utils/supabase";
import Container from "../../components/layout/Container";
import PageTransition from "../../components/layout/PageTransition";
import { SEO } from "../../components/common/SEO";
import { Clock, Calendar, ChevronRight, Search, X } from "lucide-react";
import RevealOnScroll from "../../components/animations/RevealOnScroll";
import SplitText from "../../components/animations/SplitText";
import Scene3D from "../../components/animations/Scene3D";
import MarqueeText from "../../components/animations/MarqueeText";
import MagneticButton from "../../components/animations/MagneticButton";
import GlowCard from "../../components/animations/GlowCard";
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

/* Floating orb component */
const FloatingOrb: React.FC<{
  size: number;
  color: string;
  top: string;
  left: string;
  delay: number;
}> = ({ size, color, top, left, delay }) => (
  <motion.div
    className="absolute rounded-full blur-3xl pointer-events-none"
    style={{
      width: size,
      height: size,
      background: color,
      top,
      left,
    }}
    animate={{
      y: [0, -30, 0, 20, 0],
      x: [0, 15, -10, 5, 0],
      scale: [1, 1.1, 0.95, 1.05, 1],
    }}
    transition={{
      duration: 12,
      delay,
      repeat: Infinity,
      ease: "easeInOut",
    }}
  />
);

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

      <main className="overflow-hidden">
        {/* ── Hero Section ── */}
        <section className="relative min-h-[85vh] flex items-center justify-center bg-oxford overflow-hidden">
          <Scene3D variant="hero" />

          {/* Floating orbs */}
          <FloatingOrb size={400} color="rgba(0,152,218,0.08)" top="10%" left="5%" delay={0} />
          <FloatingOrb size={300} color="rgba(245,134,52,0.06)" top="60%" left="75%" delay={2} />
          <FloatingOrb size={250} color="rgba(201,235,251,0.1)" top="20%" left="65%" delay={4} />

          {/* Noise overlay */}
          <div className="noise-overlay absolute inset-0 z-[1]" />

          <Container className="relative z-10 text-center">
            <RevealOnScroll direction="scale" delay={0.1}>
              <span className="inline-block px-5 py-2 rounded-full border border-skyblue/30 bg-skyblue/10 text-skyblue text-sm font-bold tracking-widest uppercase mb-8 backdrop-blur-sm">
                Insights & Ideas
              </span>
            </RevealOnScroll>

            <SplitText
              as="h1"
              type="words"
              className="text-5xl md:text-7xl lg:text-8xl font-black text-white leading-[0.95] mb-8"
              delay={0.2}
              stagger={0.06}
            >
              Our Latest Insights
            </SplitText>

            <RevealOnScroll direction="up" delay={0.6}>
              <p className="text-xl md:text-2xl text-iceblue/70 max-w-2xl mx-auto font-light leading-relaxed mb-12">
                Thoughts, stories, and ideas from the Gr8QM team on design,
                technology, and building for the future.
              </p>
            </RevealOnScroll>

            {/* Search bar */}
            <RevealOnScroll direction="up" delay={0.8}>
              <div className="relative max-w-lg mx-auto">
                <div className="glass-card rounded-2xl flex items-center gap-3 px-6 py-4 border border-white/10">
                  <Search className="w-5 h-5 text-skyblue shrink-0" />
                  <input
                    type="text"
                    placeholder="Search articles..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-transparent w-full text-white placeholder-white/40 outline-none text-lg"
                  />
                  <AnimatePresence>
                    {searchQuery && (
                      <motion.button
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                        onClick={() => setSearchQuery("")}
                        className="text-white/50 hover:text-white transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </motion.button>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </RevealOnScroll>

            {/* Scroll indicator */}
            <RevealOnScroll direction="up" delay={1}>
              <motion.div
                className="mt-16 flex flex-col items-center gap-2"
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <span className="text-xs text-white/30 uppercase tracking-[0.3em]">
                  Scroll
                </span>
                <div className="w-px h-10 bg-gradient-to-b from-skyblue/60 to-transparent" />
              </motion.div>
            </RevealOnScroll>
          </Container>
        </section>

        {/* ── Marquee divider ── */}
        <MarqueeText
          text="DESIGN  TECHNOLOGY  INNOVATION  TRAINING  PRODUCT  STRATEGY  UX  GROWTH"
          speed={30}
          className="py-5 bg-skyblue text-oxford font-black text-lg tracking-widest"
        />

        {/* ── Featured Post ── */}
        <AnimatePresence mode="wait">
          {!loading && featuredPost && (
            <section className="relative py-24 bg-dark overflow-hidden">
              <FloatingOrb size={500} color="rgba(0,152,218,0.04)" top="0%" left="60%" delay={1} />
              <div className="noise-overlay absolute inset-0" />

              <Container className="relative z-10">
                <RevealOnScroll direction="left" delay={0.1}>
                  <span className="text-xs font-bold uppercase tracking-[0.3em] text-orange mb-6 block">
                    Featured Article
                  </span>
                </RevealOnScroll>

                <Link
                  to={`/blog/${featuredPost.slug}`}
                  className="group grid grid-cols-1 lg:grid-cols-2 gap-10 items-center"
                >
                  <RevealOnScroll direction="left" delay={0.2}>
                    <div className="relative aspect-[16/10] rounded-3xl overflow-hidden">
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
                      <div className="absolute inset-0 bg-gradient-to-t from-dark/40 to-transparent" />
                    </div>
                  </RevealOnScroll>

                  <RevealOnScroll direction="right" delay={0.3}>
                    <div className="space-y-6">
                      <div className="flex items-center gap-5 text-sm text-white/50">
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

                      <p className="text-lg text-white/50 leading-relaxed line-clamp-3">
                        {featuredPost.excerpt || "Click to read more..."}
                      </p>

                      <MagneticButton strength={20}>
                        <span className="inline-flex items-center gap-3 text-skyblue font-bold text-lg group-hover:gap-5 transition-all duration-300">
                          Read Article
                          <ChevronRight className="w-5 h-5" />
                        </span>
                      </MagneticButton>
                    </div>
                  </RevealOnScroll>
                </Link>
              </Container>
            </section>
          )}
        </AnimatePresence>

        {/* ── Blog Grid ── */}
        <section className="relative py-24 bg-light overflow-hidden">
          <FloatingOrb size={350} color="rgba(0,152,218,0.05)" top="30%" left="0%" delay={3} />
          <FloatingOrb size={280} color="rgba(245,134,52,0.04)" top="70%" left="85%" delay={1} />

          <Container className="relative z-10">
            {/* Section header */}
            <RevealOnScroll direction="up">
              <div className="flex items-end justify-between mb-16">
                <div>
                  <span className="text-xs font-bold uppercase tracking-[0.3em] text-orange mb-3 block">
                    All Articles
                  </span>
                  <h2 className="text-4xl md:text-5xl font-black text-oxford">
                    Explore{" "}
                    <span className="gradient-text">Our Writing</span>
                  </h2>
                </div>
                <span className="hidden md:block text-sm text-oxford/40 font-medium">
                  {filteredPosts.length} article{filteredPosts.length !== 1 ? "s" : ""}
                </span>
              </div>
            </RevealOnScroll>

            {/* States: loading / empty / grid */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[...Array(6)].map((_, i) => (
                  <RevealOnScroll key={i} direction="up" delay={i * 0.08}>
                    <div className="rounded-3xl overflow-hidden bg-white shadow-sm">
                      <div className="aspect-video bg-gray-100 animate-pulse" />
                      <div className="p-7 space-y-4">
                        <div className="h-3 bg-gray-100 rounded-full w-1/3 animate-pulse" />
                        <div className="h-5 bg-gray-100 rounded-full w-full animate-pulse" />
                        <div className="h-5 bg-gray-100 rounded-full w-2/3 animate-pulse" />
                        <div className="h-3 bg-gray-100 rounded-full w-full animate-pulse" />
                        <div className="h-3 bg-gray-100 rounded-full w-4/5 animate-pulse" />
                      </div>
                    </div>
                  </RevealOnScroll>
                ))}
              </div>
            ) : filteredPosts.length === 0 ? (
              <RevealOnScroll direction="scale">
                <div className="text-center py-28 glass-card rounded-3xl border border-oxford/5">
                  <motion.div
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 4, repeat: Infinity }}
                    className="text-6xl mb-6 inline-block"
                  >
                    {searchQuery ? "🔍" : "📝"}
                  </motion.div>
                  <h3 className="text-3xl font-black text-oxford mb-3">
                    {searchQuery ? "No matches found" : "No posts yet"}
                  </h3>
                  <p className="text-oxford/50 text-lg">
                    {searchQuery
                      ? "Try a different search term."
                      : "Check back soon for new content!"}
                  </p>
                </div>
              </RevealOnScroll>
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
                      <RevealOnScroll
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
                          to={`/blog/${post.slug}`}
                          className="group block h-full"
                          onMouseEnter={() => setHoveredCard(post.id)}
                          onMouseLeave={() => setHoveredCard(null)}
                        >
                          <GlowCard
                            className="h-full rounded-3xl"
                            glowColor="rgba(0,152,218,0.12)"
                          >
                            <article className="glass-card bg-white/80 backdrop-blur-sm border border-oxford/5 rounded-3xl overflow-hidden h-full flex flex-col shadow-sm group-hover:shadow-2xl group-hover:shadow-skyblue/5 transition-all duration-500">
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
                                      ease: [0.22, 0.6, 0.36, 1],
                                    }}
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-oxford/5 to-skyblue/5">
                                    <span className="text-4xl font-black text-oxford/10">
                                      GR8
                                    </span>
                                  </div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                {/* Badge */}
                                <motion.div
                                  className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-black text-oxford uppercase tracking-wider shadow-lg"
                                  whileHover={{ scale: 1.05 }}
                                >
                                  Blog
                                </motion.div>
                              </div>

                              {/* Content */}
                              <div className="p-7 flex-1 flex flex-col">
                                <div className="flex items-center gap-4 text-xs text-oxford/40 mb-4 font-medium">
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

                                <h2 className="text-xl font-black text-oxford group-hover:text-skyblue transition-colors duration-300 mb-3 line-clamp-2 leading-snug">
                                  {post.title}
                                </h2>

                                <p className="text-oxford/50 text-sm leading-relaxed line-clamp-3 mb-6 flex-1">
                                  {post.excerpt || "Click to read more..."}
                                </p>

                                {/* Read link */}
                                <div className="pt-5 border-t border-oxford/5 flex items-center justify-between">
                                  <span className="text-skyblue font-bold text-sm flex items-center gap-2 group-hover:gap-4 transition-all duration-300">
                                    Read Article
                                    <ChevronRight className="w-4 h-4" />
                                  </span>
                                  <span className="text-xs text-oxford/20 font-medium">
                                    {post.view_count || 0} views
                                  </span>
                                </div>
                              </div>
                            </article>
                          </GlowCard>
                        </Link>
                      </RevealOnScroll>
                    ),
                  )}
                </motion.div>
              </AnimatePresence>
            )}
          </Container>
        </section>

        {/* ── Bottom marquee ── */}
        <MarqueeText
          text="READ  LEARN  BUILD  GROW  INNOVATE  CREATE  DESIGN  SHIP"
          speed={25}
          className="py-4 bg-oxford text-white/10 font-black text-2xl tracking-[0.2em]"
          reverse
        />
      </main>
    </PageTransition>
  );
};

export default BlogIndex;
