import { useEffect, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import { supabase } from "../../utils/supabase";
import Button from "../../components/common/Button";
import Skeleton from "../../components/common/Skeleton";
import Modal from "../../components/layout/Modal";
import { IoMdAdd, IoMdRefresh } from "react-icons/io";
import { FaEdit, FaTrash, FaStar, FaRegStar } from "react-icons/fa";
import PortfolioForm from "../../components/admin/PortfolioForm";

interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  category: string;
  image_url: string;
  featured: boolean;
  project_date: string | null;
  created_at: string;
}

export default function Portfolio() {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<PortfolioItem | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  const fetchPortfolio = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from("portfolio")
        .select("*")
        .order("created_at", { ascending: false });

      if (categoryFilter !== "all") {
        query = query.eq("category", categoryFilter);
      }

      const { data, error } = await query;

      if (error) throw error;
      setItems(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPortfolio();
  }, [categoryFilter]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this portfolio item?"))
      return;

    try {
      const { error } = await supabase.from("portfolio").delete().eq("id", id);
      if (error) throw error;
      fetchPortfolio();
    } catch (err: any) {
      alert("Failed to delete: " + err.message);
    }
  };

  const handleToggleFeatured = async (item: PortfolioItem) => {
    try {
      const { error } = await supabase
        .from("portfolio")
        .update({ featured: !item.featured })
        .eq("id", item.id);

      if (error) throw error;
      fetchPortfolio();
    } catch (err: any) {
      alert("Failed to update: " + err.message);
    }
  };

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      "design-build": "Design & Build",
      "print-shop": "Print Shop",
      "tech-training": "Tech Training",
    };
    return labels[category] || category;
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-oxford">
            Portfolio Management
          </h1>
          <div className="flex gap-2">
            <Button
              variant="sec"
              onClick={() => fetchPortfolio()}
              className="flex items-center gap-2"
            >
              <IoMdRefresh /> Refresh
            </Button>
            <Button
              variant="pry"
              onClick={() => {
                setEditingItem(null);
                setShowModal(true);
              }}
              className="flex items-center gap-2"
            >
              <IoMdAdd /> Add Portfolio Item
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 flex gap-2">
          {["all", "design-build", "print-shop", "tech-training"].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                categoryFilter === cat
                  ? "bg-skyblue text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {cat === "all" ? "All" : getCategoryLabel(cat)}
            </button>
          ))}
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-64" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-12 bg-light rounded-lg">
            <p className="text-gray-500">No portfolio items found</p>
            <Button
              variant="pry"
              onClick={() => setShowModal(true)}
              className="mt-4"
            >
              Add Your First Portfolio Item
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="relative h-48">
                  <img
                    src={item.image_url}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                  {item.featured && (
                    <div className="absolute top-2 right-2 bg-orange text-white px-2 py-1 rounded-full text-xs flex items-center gap-1">
                      <FaStar /> Featured
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-bold text-lg text-oxford">
                      {item.title}
                    </h3>
                    <button
                      onClick={() => handleToggleFeatured(item)}
                      className="text-orange hover:text-orange/80 transition-colors"
                      title={
                        item.featured
                          ? "Remove from featured"
                          : "Mark as featured"
                      }
                    >
                      {item.featured ? <FaStar /> : <FaRegStar />}
                    </button>
                  </div>
                  <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                    {item.description}
                  </p>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="inline-block bg-iceblue text-oxford px-2 py-1 rounded text-xs">
                      {getCategoryLabel(item.category)}
                    </span>
                    {item.project_date && (
                      <span className="text-xs text-gray-500">
                        {new Date(item.project_date).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="sec"
                      onClick={() => {
                        setEditingItem(item);
                        setShowModal(true);
                      }}
                      className="flex-1 flex items-center justify-center gap-2"
                    >
                      <FaEdit /> Edit
                    </Button>
                    <Button
                      variant="pry"
                      onClick={() => handleDelete(item.id)}
                      className="flex-1 flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600"
                    >
                      <FaTrash /> Delete
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal */}
        {showModal && (
          <Modal
            open={showModal}
            onClose={() => {
              setShowModal(false);
              setEditingItem(null);
            }}
            title={editingItem ? "Edit Portfolio Item" : "Add Portfolio Item"}
          >
            <PortfolioForm
              item={editingItem}
              onSuccess={() => {
                setShowModal(false);
                setEditingItem(null);
                fetchPortfolio();
              }}
              onCancel={() => {
                setShowModal(false);
                setEditingItem(null);
              }}
            />
          </Modal>
        )}
      </div>
    </AdminLayout>
  );
}
