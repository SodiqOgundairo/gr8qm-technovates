import { useEffect, useState, useRef } from "react";
import { supabase } from "../utils/supabase";
import Container from "../components/layout/Container";
import Skeleton from "../components/common/Skeleton";
import { SEO } from "../components/common/SEO";
import { Star, ArrowUpRight } from "lucide-react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import PageTransition from "../components/layout/PageTransition";
import MarqueeText from "../components/animations/MarqueeText";
import MagneticButton from "../components/animations/MagneticButton";
import OrbitalBackground from "../components/animations/OrbitalBackground";
import {
  Reveal,
  DotGrid,
  DiagonalLines,
  ConcentricCircles,
  CrossMark,
  FloatingRule,
  AccentLine,
  SectionConnector,
} from "../components/animations/DesignElements";

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
      <main className="flex flex-col bg-oxford-deep">
        {/* ==================== HERO ==================== */}
        <section
          ref={heroRef}
          className="relative min-h-[85vh] flex items-center justify-center overflow-hidden sticky top-0 z-10"
        >
          <OrbitalBackground variant="hero" />

          {/* Geometric decorations */}
          <DotGrid className="top-8 left-8 text-skyblue/20" />
          <DiagonalLines className="bottom-0 right-0 text-orange/10" thick />
          <CrossMark className="absolute top-[15%] right-[20%] text-skyblue/15" size={20} />
          <CrossMark className="absolute bottom-[20%] left-[12%] text-orange/15" size={14} />
          <ConcentricCircles className="-top-32 -right-32 text-skyblue/10" />
          <FloatingRule className="top-0 left-0 w-full" color="skyblue" dashed />

          {/* Hero content */}
          <motion.div
            style={{ y: heroY, opacity: heroOpacity, scale: heroScale }}
            className="relative z-10"
          >
            <Container className="text-center">
              <Reveal delay={0.1}>
                <motion.div
                  className="inline-flex items-center gap-2 bg-skyblue/10 border border-oxford-border rounded-full px-5 py-2.5 mb-8"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <motion.div
                    className="w-2 h-2 rounded-full bg-orange"
                    animate={{ scale: [1, 1.4, 1], opacity: [1, 0.6, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  <span className="text-sm font-medium text-iceblue/70 tracking-wide uppercase">
                    Our Work
                  </span>
                </motion.div>
              </Reveal>

              <Reveal delay={0.2}>
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight mb-2">
                  <span className="text-white">Our Creative</span>
                </h1>
              </Reveal>

              <Reveal delay={0.35}>
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight mb-6">
                  <span className="text-skyblue">Portfolio</span>
                </h1>
              </Reveal>

              <Reveal delay={0.5}>
                <AccentLine
                  color="skyblue"
                  thickness="medium"
                  width="w-20"
                  className="mx-auto mb-8"
                />
              </Reveal>

              <Reveal delay={0.6}>
                <p className="text-lg md:text-xl text-iceblue/70 max-w-2xl mx-auto mb-12 leading-relaxed">
                  Discover the innovative projects we've delivered across design,
                  print, and technology training.
                </p>
              </Reveal>

              {/* Category Filters */}
              <Reveal delay={0.8}>
                <div className="flex flex-wrap justify-center gap-3">
                  {categories.map((cat) => (
                    <MagneticButton key={cat} strength={20}>
                      <motion.button
                        onClick={() => setCategoryFilter(cat)}
                        className={`px-7 py-3 rounded-full font-medium transition-colors relative overflow-hidden border ${
                          categoryFilter === cat
                            ? "text-white border-skyblue"
                            : "bg-white/5 backdrop-blur-sm text-iceblue/70 border-oxford-border hover:border-skyblue/40"
                        }`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {categoryFilter === cat && (
                          <motion.div
                            layoutId="activePortfolioFilter"
                            className="absolute inset-0 bg-gradient-to-r from-skyblue to-skyblue/80 rounded-full"
                            transition={{
                              type: "spring" as const,
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
                              transition={{
                                type: "spring" as const,
                                stiffness: 300,
                                damping: 20,
                              }}
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
              </Reveal>
            </Container>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: [0.42, 0, 0.58, 1] }}
          >
            <span className="text-xs text-iceblue/30 uppercase tracking-widest">
              Scroll
            </span>
            <div className="w-[1px] h-8 bg-gradient-to-b from-skyblue/30 to-transparent" />
          </motion.div>

          <SectionConnector color="skyblue" side="center" />
        </section>

        {/* ==================== MARQUEE DIVIDER ==================== */}
        <section className="relative py-6 bg-oxford-deep sticky top-0 z-20 overflow-hidden border-y border-oxford-border">
          <MarqueeText
            text="Design & Build  ✦  Print Shop  ✦  Tech Training  ✦  Innovation  ✦  Creativity"
            speed={25}
            className="text-2xl md:text-3xl font-black text-white/10 uppercase tracking-widest"
          />
          <MarqueeText
            text="Portfolio  ✦  Projects  ✦  Solutions  ✦  Excellence  ✦  Quality"
            speed={30}
            className="text-lg md:text-xl font-bold text-skyblue/10 uppercase tracking-wider mt-1"
            reverse
          />
        </section>

        {/* ==================== PORTFOLIO GRID ==================== */}
        <section className="relative py-20 md:py-32 bg-oxford-deep sticky top-0 z-30 overflow-hidden min-h-[60vh]">
          <OrbitalBackground variant="section" />

          {/* Geometric decorations */}
          <DotGrid className="bottom-12 right-12 text-orange/15" />
          <DiagonalLines className="top-0 left-0 text-skyblue/10" />
          <CrossMark className="absolute top-[10%] left-[8%] text-skyblue/15" size={16} />
          <CrossMark className="absolute bottom-[15%] right-[10%] text-orange/15" size={18} />
          <FloatingRule className="bottom-0 left-0 w-full" color="orange" dashed />

          <Container className="relative z-10">
            {/* Section header */}
            <Reveal direction="up" className="mb-16 text-center">
              <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
                {categoryFilter === "all"
                  ? "All Projects"
                  : getCategoryLabel(categoryFilter)}
              </h2>
              <motion.div
                className="w-16 h-1 bg-gradient-to-r from-skyblue to-orange rounded-full mx-auto"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 0.6, 0.36, 1] }}
              />
            </Reveal>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[...Array(6)].map((_, i) => (
                  <Reveal key={i} direction="up" delay={i * 0.1}>
                    <Skeleton className="h-[420px] rounded-2xl bg-white/5" />
                  </Reveal>
                ))}
              </div>
            ) : items.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.22, 0.6, 0.36, 1] }}
                className="text-center py-24"
              >
                <motion.div
                  className="w-24 h-24 rounded-full bg-skyblue/10 border border-oxford-border mx-auto mb-6 flex items-center justify-center"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <span className="text-4xl">🎨</span>
                </motion.div>
                <p className="text-iceblue/70 text-lg mb-2">
                  No projects found in this category.
                </p>
                <p className="text-iceblue/40 text-sm">
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
                      <div className="group bg-white/5 backdrop-blur-sm border border-oxford-border rounded-2xl overflow-hidden h-full flex flex-col hover:border-skyblue/30 transition-colors duration-500">
                        {/* Image */}
                        <div className="relative h-64 overflow-hidden shrink-0">
                          <motion.img
                            src={item.image_url}
                            alt={item.title}
                            className="w-full h-full object-cover"
                            whileHover={{ scale: 1.08 }}
                            transition={{ duration: 0.6, ease: [0.22, 0.6, 0.36, 1] }}
                          />

                          {/* Image overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-oxford-deep via-oxford-deep/40 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-500" />

                          {/* Featured badge */}
                          {item.featured && (
                            <motion.div
                              initial={{ x: 20, opacity: 0 }}
                              animate={{ x: 0, opacity: 1 }}
                              transition={{
                                delay: 0.3,
                                type: "spring" as const,
                                stiffness: 300,
                                damping: 25,
                              }}
                              className="absolute top-4 right-4 z-10"
                            >
                              <div className="bg-orange/90 text-white px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-lg border border-orange/30">
                                <Star className="w-3 h-3 fill-current" />
                                Featured
                              </div>
                            </motion.div>
                          )}

                          {/* Category pill */}
                          <div className="absolute bottom-4 left-4 z-10">
                            <motion.span
                              className="inline-block bg-white/10 backdrop-blur-md text-white px-4 py-1.5 rounded-full text-xs font-semibold border border-oxford-border"
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
                            <div className="w-10 h-10 rounded-full bg-skyblue/20 backdrop-blur-sm flex items-center justify-center border border-oxford-border">
                              <ArrowUpRight className="w-4 h-4 text-white" />
                            </div>
                          </motion.div>
                        </div>

                        {/* Content */}
                        <div className="p-6 flex flex-col grow">
                          <h3 className="text-xl font-bold text-white mb-2 group-hover:text-skyblue transition-colors duration-300">
                            {item.title}
                          </h3>
                          <p className="text-iceblue/70 mb-4 line-clamp-3 grow leading-relaxed text-sm">
                            {item.description}
                          </p>
                          {item.project_date && (
                            <div className="mt-auto pt-4 border-t border-oxford-border flex items-center gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-skyblue" />
                              <p className="text-sm text-iceblue/40 font-medium">
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
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </Container>

          <SectionConnector color="orange" side="right" />
        </section>

        {/* ==================== BOTTOM MARQUEE ==================== */}
        <section className="relative py-8 bg-oxford-deep overflow-hidden border-t border-oxford-border">
          <MarqueeText
            text="Let's create something amazing together"
            speed={18}
            className="text-4xl md:text-6xl font-black text-white/[0.04] uppercase tracking-tight"
          />
        </section>
      </main>
    </PageTransition>
  );
};

export default PortfolioPage;
