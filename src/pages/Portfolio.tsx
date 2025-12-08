import { useEffect, useState } from "react";
import { supabase } from "../utils/supabase";
import Container from "../components/layout/Container";
import Skeleton from "../components/common/Skeleton";
import { SEO } from "../components/common/SEO";
import { FaStar } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import PageTransition from "../components/layout/PageTransition";
import ScrollReveal from "../components/common/ScrollReveal";

interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  category: string;
  image_url: string;
  featured: boolean;
  project_date: string | null;
}

const PortfolioPage = () => {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

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

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      "design-build": "Design & Build",
      "print-shop": "Print Shop",
      "tech-training": "Tech Training",
    };
    return labels[category] || category;
  };

  return (
    <PageTransition>
      <SEO
        title="Our Portfolio"
        description="Explore our portfolio of design, print, and tech training projects at Gr8QM Technovates."
      />
      <main className="flex flex-col">
        {/* Hero Section */}
        <div className="py-12 md:py-20 lg:py-24 bg-linear-to-br from-skyblue/20 to-orange/20">
          <Container className="text-center">
            <ScrollReveal>
              <div className="bg-iceblue/40 border border-skyblue rounded-full px-4 py-2 w-fit mx-auto mb-4">
                <p className="text-sm text-oxford">Our Work</p>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={0.2}>
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tight mb-4">
                <span className="text-oxford">Our </span>
                <span className="text-skyblue">Portfolio</span>
              </h1>
            </ScrollReveal>
            <ScrollReveal delay={0.4}>
              <p className="text-dark max-w-2xl mx-auto mb-8">
                Discover the innovative projects we've delivered across design,
                print, and technology training.
              </p>
            </ScrollReveal>

            {/* Category Filters */}
            <ScrollReveal delay={0.6}>
              <div className="flex flex-wrap justify-center gap-3">
                {["all", "design-build", "print-shop", "tech-training"].map(
                  (cat) => (
                    <motion.button
                      key={cat}
                      onClick={() => setCategoryFilter(cat)}
                      className={`px-6 py-2 rounded-full transition-colors relative ${
                        categoryFilter === cat
                          ? "text-white"
                          : "bg-white text-oxford hover:bg-iceblue"
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {categoryFilter === cat && (
                        <motion.div
                          layoutId="activeFilter"
                          className="absolute inset-0 bg-skyblue rounded-full"
                          transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 30,
                          }}
                        />
                      )}
                      <span className="relative z-10">
                        {cat === "all" ? "All Projects" : getCategoryLabel(cat)}
                      </span>
                    </motion.button>
                  )
                )}
              </div>
            </ScrollReveal>
          </Container>
        </div>

        {/* Portfolio Grid */}
        <div className="py-16 md:py-24 bg-light min-h-[50vh]">
          <Container>
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[...Array(6)].map((_, i) => (
                  <Skeleton key={i} className="h-96" />
                ))}
              </div>
            ) : items.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20"
              >
                <p className="text-gray-500 text-lg">
                  No projects found in this category.
                </p>
              </motion.div>
            ) : (
              <motion.div
                layout
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                <AnimatePresence mode="popLayout">
                  {items.map((item) => (
                    <motion.div
                      layout
                      key={item.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.3 }}
                      className="bg-white rounded-lg overflow-hidden shadow-md group h-full flex flex-col"
                      whileHover={{
                        y: -8,
                        boxShadow:
                          "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                      }}
                    >
                      <div className="relative h-64 overflow-hidden shrink-0">
                        <motion.img
                          src={item.image_url}
                          alt={item.title}
                          className="w-full h-full object-cover"
                          whileHover={{ scale: 1.1 }}
                          transition={{ duration: 0.5 }}
                        />
                        {item.featured && (
                          <div className="absolute top-4 right-4 bg-orange text-white px-3 py-1 rounded-full text-sm flex items-center gap-2 shadow-lg z-10">
                            <FaStar /> Featured
                          </div>
                        )}
                        <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/70 to-transparent p-4 z-10">
                          <span className="inline-block bg-white/90 text-oxford px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm">
                            {getCategoryLabel(item.category)}
                          </span>
                        </div>
                      </div>
                      <div className="p-6 flex flex-col grow">
                        <h3 className="text-xl font-bold text-oxford mb-2">
                          {item.title}
                        </h3>
                        <p className="text-gray-600 mb-4 line-clamp-3 grow">
                          {item.description}
                        </p>
                        {item.project_date && (
                          <p className="text-sm text-gray-500 mt-auto pt-4 border-t border-gray-100">
                            {new Date(item.project_date).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "long",
                              }
                            )}
                          </p>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </Container>
        </div>
      </main>
    </PageTransition>
  );
};

export default PortfolioPage;
