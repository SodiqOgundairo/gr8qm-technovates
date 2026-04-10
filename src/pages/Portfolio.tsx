import { useEffect, useState, useRef } from "react";
import { supabase } from "../utils/supabase";
import Container from "../components/layout/Container";
import Skeleton from "../components/common/Skeleton";
import { SEO } from "../components/common/SEO";
import { Star, ArrowUpRight } from "lucide-react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import PageTransition from "../components/layout/PageTransition";

/* ─── constants ─── */
const EASE_SMOOTH: [number, number, number, number] = [0.22, 0.6, 0.36, 1];
const EASE_DECEL: [number, number, number, number] = [0.16, 1, 0.3, 1];

const gridBg = {
  backgroundImage:
    "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
  backgroundSize: "64px 64px",
};

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

  const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 0.6], [0, 80]);

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
              Our Work
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1, ease: EASE_DECEL }}
              className="text-5xl md:text-7xl lg:text-[5.5rem] font-bold tracking-[-0.04em] text-white leading-[0.95] mb-6"
            >
              Portfolio
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: EASE_SMOOTH }}
              className="text-lg md:text-xl text-white/35 max-w-xl mx-auto leading-relaxed"
            >
              Innovative projects across design, print, and technology training.
            </motion.p>
          </motion.div>
        </section>

        {/* ════════════════ FILTERS + GRID ════════════════ */}
        <section className="relative overflow-hidden">
          {/* Very subtle ambient light */}
          <div className="absolute top-[30%] -right-40 w-[500px] h-[500px] rounded-full bg-skyblue/[0.02] blur-[140px] pointer-events-none" />

          <Container className="py-16 md:py-24 relative z-10">
            {/* Filter bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: EASE_SMOOTH }}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-12 border-b border-white/[0.06] pb-6"
            >
              <h2 className="text-2xl md:text-3xl font-bold text-white tracking-[-0.03em]">
                {categoryFilter === "all"
                  ? "All Projects"
                  : getCategoryLabel(categoryFilter)}
              </h2>

              {/* Category pills — Figma-style monospace tags */}
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategoryFilter(cat)}
                    className={`px-4 py-2 rounded-full text-xs font-mono uppercase tracking-[0.15em] transition-all duration-300 border ${
                      categoryFilter === cat
                        ? "bg-skyblue text-white border-skyblue"
                        : "bg-transparent text-white/30 border-white/[0.08] hover:border-white/[0.2] hover:text-white/50"
                    }`}
                  >
                    {cat === "all" ? "All" : getCategoryLabel(cat)}
                  </button>
                ))}
              </div>
            </motion.div>

            {/* States */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="space-y-4">
                    <Skeleton className="aspect-[4/3] rounded-xl bg-white/[0.03]" />
                    <div className="h-3 bg-white/[0.04] rounded w-1/4 animate-pulse" />
                    <div className="h-5 bg-white/[0.04] rounded w-full animate-pulse" />
                    <div className="h-3 bg-white/[0.04] rounded w-2/3 animate-pulse" />
                  </div>
                ))}
              </div>
            ) : items.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-32"
              >
                <p className="text-white/25 text-lg mb-2">
                  No projects found in this category.
                </p>
                <p className="text-white/15 text-sm">
                  Try selecting a different filter.
                </p>
              </motion.div>
            ) : (
              <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-14">
                <AnimatePresence mode="popLayout">
                  {items.map((item, index) => (
                    <motion.div
                      layout
                      key={item.id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{
                        duration: 0.5,
                        delay: index * 0.06,
                        ease: EASE_SMOOTH,
                      }}
                    >
                      <article className="group h-full flex flex-col">
                        {/* Image — clean, no border */}
                        <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-white/[0.03] mb-5">
                          <motion.img
                            src={item.image_url}
                            alt={item.title}
                            className="w-full h-full object-cover transition-transform duration-500 ease-[cubic-bezier(0.22,0.6,0.36,1)] group-hover:scale-[1.04]"
                          />

                          {/* Subtle hover overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                          {/* Featured badge */}
                          {item.featured && (
                            <div className="absolute top-3 right-3 z-10">
                              <div className="bg-orange/90 text-white px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 uppercase tracking-wider">
                                <Star className="w-2.5 h-2.5 fill-current" />
                                Featured
                              </div>
                            </div>
                          )}

                          {/* Arrow on hover */}
                          <div className="absolute bottom-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
                              <ArrowUpRight className="w-3.5 h-3.5 text-white" />
                            </div>
                          </div>
                        </div>

                        {/* Category + date */}
                        <div className="flex items-center gap-3 text-[11px] text-white/20 mb-3 font-mono">
                          <span className="uppercase tracking-[0.15em]">
                            {getCategoryLabel(item.category)}
                          </span>
                          {item.project_date && (
                            <>
                              <span className="w-0.5 h-0.5 rounded-full bg-white/15" />
                              <span>
                                {new Date(item.project_date).toLocaleDateString(
                                  "en-US",
                                  { year: "numeric", month: "short" }
                                )}
                              </span>
                            </>
                          )}
                        </div>

                        {/* Title with animated underline */}
                        <h3 className="text-lg font-bold text-white leading-snug mb-3 tracking-[-0.02em]">
                          <span className="bg-gradient-to-r from-white to-white bg-[length:0%_1px] bg-left-bottom bg-no-repeat group-hover:bg-[length:100%_1px] transition-[background-size] duration-500 ease-[cubic-bezier(0.8,0,0.2,1)] pb-0.5">
                            {item.title}
                          </span>
                        </h3>

                        {/* Description */}
                        <p className="text-white/25 text-sm leading-relaxed line-clamp-2 flex-1">
                          {item.description}
                        </p>
                      </article>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </Container>
        </section>

        {/* ════════════════ BOTTOM BORDER ════════════════ */}
        <div className="border-t border-white/[0.06]" />
      </main>
    </PageTransition>
  );
};

export default PortfolioPage;
