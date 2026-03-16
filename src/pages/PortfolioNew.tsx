import { useEffect, useState, useRef } from "react";
import { supabase } from "../utils/supabase";
import Container from "../components/layout/Container";
import Skeleton from "../components/common/Skeleton";
import { SEO } from "../components/common/SEO";
import { Star, ArrowUpRight } from "lucide-react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import PageTransition from "../components/layout/PageTransition";
import RevealOnScroll from "../components/animations/RevealOnScroll";
import SplitText from "../components/animations/SplitText";
import Scene3D from "../components/animations/Scene3D";
import MarqueeText from "../components/animations/MarqueeText";
import MagneticButton from "../components/animations/MagneticButton";
import GlowCard from "../components/animations/GlowCard";

interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  category: string;
  image_url: string;
  featured: boolean;
  project_date: string | null;
}

const categories = ["all", "design-build", "print-shop", "tech-training"] as const;

const getCategoryLabel = (category: string) => {
  const labels: Record<string, string> = {
    "design-build": "Design & Build",
    "print-shop": "Print Shop",
    "tech-training": "Tech Training",
  };
  return labels[category] || category;
};

const PortfolioPage = () => {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const heroRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const heroY = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 0.95]);

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        setLoading(true);
        let query = supabase
          .from("portfolio")
          .select("*")
          .order("featured", { ascending: false })
          .order("created_at", { ascending: false });

        if (categoryFilter !== "all") {
          query = query.eq("category", categoryFilter);
        }

        const { data, error } = await query;
        if (error) throw error;
        setItems(data || []);
      } catch (error) {
        console.error("Error fetching portfolio:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolio();
  }, [categoryFilter]);

  return (
    <PageTransition>
      <SEO
        title="Our Portfolio"
        description="Explore our portfolio of design, print, and tech training projects at Gr8QM Technovates."
      />
      <main className="flex flex-col overflow-hidden">
        {/* ═══════════════ Hero Section ═══════════════ */}
        <div
          ref={heroRef}
          className="relative min-h-[85vh] flex items-center justify-center overflow-hidden"
        >
          {/* Scene3D background */}
          <Scene3D variant="hero" />

          {/* Floating gradient orbs */}
          <motion.div
            className="absolute top-20 -left-32 w-96 h-96 rounded-full bg-skyblue/20 blur-[120px] pointer-events-none"
            animate={{
              x: [0, 40, -20, 0],
              y: [0, -30, 20, 0],
              scale: [1, 1.2, 0.9, 1],
            }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute bottom-10 -right-24 w-80 h-80 rounded-full bg-orange/15 blur-[100px] pointer-events-none"
            animate={{
              x: [0, -30, 20, 0],
              y: [0, 40, -20, 0],
              scale: [1, 0.85, 1.15, 1],
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-iceblue/10 blur-[150px] pointer-events-none"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Noise overlay */}
          <div className="noise-overlay absolute inset-0 pointer-events-none z-[1]" />

          {/* Hero content */}
          <motion.div
            style={{ y: heroY, opacity: heroOpacity, scale: heroScale }}
            className="relative z-10"
          >
            <Container className="text-center">
              <RevealOnScroll direction="scale" delay={0.1}>
                <div className="glass-card inline-flex items-center gap-2 px-5 py-2.5 rounded-full mb-8">
                  <motion.div
                    className="w-2 h-2 rounded-full bg-orange"
                    animate={{ scale: [1, 1.4, 1], opacity: [1, 0.6, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  <span className="text-sm font-medium text-oxford tracking-wide uppercase">
                    Our Work
                  </span>
                </div>
              </RevealOnScroll>

              <div className="mb-6">
                <SplitText
                  as="h1"
                  type="words"
                  className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight text-oxford"
                  delay={0.2}
                  stagger={0.08}
                >
                  Our Creative
                </SplitText>
                <br />
                <SplitText
                  as="h1"
                  type="words"
                  className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight gradient-text"
                  delay={0.5}
                  stagger={0.08}
                >
                  Portfolio
                </SplitText>
              </div>

              <RevealOnScroll direction="up" delay={0.8}>
                <p className="text-lg md:text-xl text-dark/70 max-w-2xl mx-auto mb-12 leading-relaxed">
                  Discover the innovative projects we've delivered across design,
                  print, and technology training.
                </p>
              </RevealOnScroll>

              {/* Category Filters */}
              <RevealOnScroll direction="up" delay={1}>
                <div className="flex flex-wrap justify-center gap-3">
                  {categories.map((cat) => (
                    <MagneticButton key={cat} strength={20}>
                      <motion.button
                        onClick={() => setCategoryFilter(cat)}
                        className={`px-7 py-3 rounded-full font-medium transition-colors relative overflow-hidden border ${
                          categoryFilter === cat
                            ? "text-white border-skyblue"
                            : "glass-card text-oxford border-white/20 hover:border-skyblue/40"
                        }`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {categoryFilter === cat && (
                          <motion.div
                            layoutId="activePortfolioFilter"
                            className="absolute inset-0 bg-gradient-to-r from-skyblue to-skyblue/80 rounded-full"
                            transition={{
                              type: "spring",
                              stiffness: 400,
                              damping: 30,
                            }}
                          />
                        )}
                        <span className="relative z-10 flex items-center gap-2">
                          {cat === "all" ? "All Projects" : getCategoryLabel(cat)}
                          {categoryFilter === cat && (
                            <motion.span
                              initial={{ scale: 0, rotate: -90 }}
                              animate={{ scale: 1, rotate: 0 }}
                              className="inline-block"
                            >
                              <ArrowUpRight className="w-4 h-4" />
                            </motion.span>
                          )}
                        </span>
                      </motion.button>
                    </MagneticButton>
                  ))}
                </div>
              </RevealOnScroll>
            </Container>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <span className="text-xs text-oxford/40 uppercase tracking-widest">
              Scroll
            </span>
            <div className="w-[1px] h-8 bg-gradient-to-b from-oxford/30 to-transparent" />
          </motion.div>
        </div>

        {/* ═══════════════ Marquee Divider ═══════════════ */}
        <div className="relative py-6 bg-oxford overflow-hidden">
          <MarqueeText
            text="Design & Build ✦ Print Shop ✦ Tech Training ✦ Innovation ✦ Creativity"
            speed={25}
            className="text-2xl md:text-3xl font-black text-white/10 uppercase tracking-widest"
          />
          <MarqueeText
            text="Portfolio ✦ Projects ✦ Solutions ✦ Excellence ✦ Quality"
            speed={30}
            className="text-lg md:text-xl font-bold text-skyblue/10 uppercase tracking-wider mt-1"
            reverse
          />
        </div>

        {/* ═══════════════ Portfolio Grid ═══════════════ */}
        <div className="relative py-20 md:py-32 bg-light min-h-[60vh]">
          {/* Subtle background orbs */}
          <motion.div
            className="absolute top-40 right-0 w-72 h-72 rounded-full bg-skyblue/5 blur-[100px] pointer-events-none"
            animate={{ x: [0, -30, 0], y: [0, 20, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute bottom-20 left-0 w-64 h-64 rounded-full bg-orange/5 blur-[80px] pointer-events-none"
            animate={{ x: [0, 20, 0], y: [0, -30, 0] }}
            transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
          />

          <Container>
            {/* Section header */}
            <RevealOnScroll direction="up" className="mb-16 text-center">
              <SplitText
                as="h2"
                type="words"
                className="text-3xl md:text-4xl font-black text-oxford"
                stagger={0.06}
              >
                {categoryFilter === "all"
                  ? "All Projects"
                  : getCategoryLabel(categoryFilter)}
              </SplitText>
              <motion.div
                className="w-16 h-1 bg-gradient-to-r from-skyblue to-orange rounded-full mx-auto mt-4"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.3 }}
              />
            </RevealOnScroll>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[...Array(6)].map((_, i) => (
                  <RevealOnScroll key={i} direction="up" delay={i * 0.1}>
                    <Skeleton className="h-[420px] rounded-2xl" />
                  </RevealOnScroll>
                ))}
              </div>
            ) : items.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center py-24"
              >
                <motion.div
                  className="w-24 h-24 rounded-full bg-iceblue/50 mx-auto mb-6 flex items-center justify-center"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <span className="text-4xl">🎨</span>
                </motion.div>
                <p className="text-gray-500 text-lg mb-2">
                  No projects found in this category.
                </p>
                <p className="text-gray-400 text-sm">
                  Try selecting a different filter above.
                </p>
              </motion.div>
            ) : (
              <motion.div
                layout
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                <AnimatePresence mode="popLayout">
                  {items.map((item, index) => (
                    <motion.div
                      layout
                      key={item.id}
                      initial={{ opacity: 0, y: 40, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9, y: -20 }}
                      transition={{
                        duration: 0.5,
                        delay: index * 0.08,
                        ease: [0.22, 0.6, 0.36, 1],
                      }}
                    >
                      <GlowCard
                        className="group rounded-2xl h-full"
                        glowColor={
                          item.featured
                            ? "rgba(245, 134, 52, 0.2)"
                            : "rgba(0, 152, 218, 0.15)"
                        }
                      >
                        <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-shadow duration-500 h-full flex flex-col border border-gray-100/50">
                          {/* Image */}
                          <div className="relative h-64 overflow-hidden shrink-0">
                            <motion.img
                              src={item.image_url}
                              alt={item.title}
                              className="w-full h-full object-cover"
                              whileHover={{ scale: 1.08 }}
                              transition={{ duration: 0.6, ease: "easeOut" }}
                            />

                            {/* Image overlay on hover */}
                            <div className="absolute inset-0 bg-gradient-to-t from-oxford/80 via-oxford/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />

                            {/* Featured badge */}
                            {item.featured && (
                              <motion.div
                                initial={{ x: 20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: 0.3 }}
                                className="absolute top-4 right-4 z-10"
                              >
                                <div className="glass-card bg-orange/90 text-white px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-lg backdrop-blur-sm border border-orange/30">
                                  <Star className="w-3 h-3 fill-current" />
                                  Featured
                                </div>
                              </motion.div>
                            )}

                            {/* Category pill */}
                            <div className="absolute bottom-4 left-4 z-10">
                              <motion.span
                                className="inline-block glass-card bg-white/90 text-oxford px-4 py-1.5 rounded-full text-xs font-semibold backdrop-blur-md border border-white/30"
                                whileHover={{ scale: 1.05 }}
                              >
                                {getCategoryLabel(item.category)}
                              </motion.span>
                            </div>

                            {/* Hover arrow indicator */}
                            <motion.div
                              className="absolute top-4 left-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                              whileHover={{ rotate: 45 }}
                            >
                              <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/20">
                                <ArrowUpRight className="w-4 h-4 text-white" />
                              </div>
                            </motion.div>
                          </div>

                          {/* Content */}
                          <div className="p-6 flex flex-col grow">
                            <h3 className="text-xl font-bold text-oxford mb-2 hover-line inline-block w-fit">
                              {item.title}
                            </h3>
                            <p className="text-gray-600 mb-4 line-clamp-3 grow leading-relaxed text-sm">
                              {item.description}
                            </p>
                            {item.project_date && (
                              <div className="mt-auto pt-4 border-t border-gray-100 flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-skyblue" />
                                <p className="text-sm text-gray-400 font-medium">
                                  {new Date(item.project_date).toLocaleDateString(
                                    "en-US",
                                    {
                                      year: "numeric",
                                      month: "long",
                                    }
                                  )}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </GlowCard>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </Container>
        </div>

        {/* ═══════════════ Bottom Marquee ═══════════════ */}
        <div className="py-8 bg-gradient-to-r from-oxford via-oxford/95 to-oxford overflow-hidden">
          <MarqueeText
            text="Let's create something amazing together"
            speed={18}
            className="text-4xl md:text-6xl font-black text-white/[0.04] uppercase tracking-tight"
          />
        </div>
      </main>
    </PageTransition>
  );
};

export default PortfolioPage;
