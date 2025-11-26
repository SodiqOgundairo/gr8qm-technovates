import { useEffect, useState } from "react";
import { supabase } from "../utils/supabase";
import Container from "../components/layout/Container";
import Skeleton from "../components/common/Skeleton";
import { SEO } from "../components/common/SEO";
import { FaStar } from "react-icons/fa";

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
    <>
      <SEO
        title="Our Portfolio"
        description="Explore our portfolio of design, print, and tech training projects at Gr8QM Technovates."
      />
      <main className="flex flex-col">
        {/* Hero Section */}
        <div className="py-12 md:py-20 lg:py-24 bg-gradient-to-br from-skyblue/20 to-orange/20">
          <Container className="text-center">
            <div className="bg-iceblue/40 border border-skyblue rounded-full px-4 py-2 w-fit mx-auto mb-4">
              <p className="text-sm text-oxford">Our Work</p>
            </div>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tight mb-4">
              <span className="text-oxford">Our </span>
              <span className="text-skyblue">Portfolio</span>
            </h1>
            <p className="text-dark max-w-2xl mx-auto mb-8">
              Discover the innovative projects we've delivered across design,
              print, and technology training.
            </p>

            {/* Category Filters */}
            <div className="flex flex-wrap justify-center gap-3">
              {["all", "design-build", "print-shop", "tech-training"].map(
                (cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategoryFilter(cat)}
                    className={`px-6 py-2 rounded-full transition-all ${
                      categoryFilter === cat
                        ? "bg-skyblue text-white shadow-lg"
                        : "bg-white text-oxford hover:bg-iceblue"
                    }`}
                  >
                    {cat === "all" ? "All Projects" : getCategoryLabel(cat)}
                  </button>
                )
              )}
            </div>
          </Container>
        </div>

        {/* Portfolio Grid */}
        <div className="py-16 md:py-24 bg-light">
          <Container>
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[...Array(6)].map((_, i) => (
                  <Skeleton key={i} className="h-96" />
                ))}
              </div>
            ) : items.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-gray-500 text-lg">
                  No projects found in this category.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 group"
                  >
                    <div className="relative h-64 overflow-hidden">
                      <img
                        src={item.image_url}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      {item.featured && (
                        <div className="absolute top-4 right-4 bg-orange text-white px-3 py-1 rounded-full text-sm flex items-center gap-2 shadow-lg">
                          <FaStar /> Featured
                        </div>
                      )}
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                        <span className="inline-block bg-white/90 text-oxford px-3 py-1 rounded-full text-xs font-medium">
                          {getCategoryLabel(item.category)}
                        </span>
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-oxford mb-2">
                        {item.title}
                      </h3>
                      <p className="text-gray-600 mb-4 line-clamp-3">
                        {item.description}
                      </p>
                      {item.project_date && (
                        <p className="text-sm text-gray-500">
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
                  </div>
                ))}
              </div>
            )}
          </Container>
        </div>
      </main>
    </>
  );
};

export default PortfolioPage;
