import { useState, useEffect } from "react";
import { supabase } from "../../utils/supabase";
import Input from "../common/Input";
import Button from "../common/Button";
import { uploadToCloudinary } from "../../utils/cloudinary";

interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  category: string;
  image_url: string;
  featured: boolean;
  project_date: string | null;
}

interface PortfolioFormProps {
  item: PortfolioItem | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function PortfolioForm({
  item,
  onSuccess,
  onCancel,
}: PortfolioFormProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "design-build",
    image_url: "",
    featured: false,
    project_date: "",
  });
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (item) {
      setFormData({
        title: item.title,
        description: item.description,
        category: item.category,
        image_url: item.image_url,
        featured: item.featured,
        project_date: item.project_date || "",
      });
    }
  }, [item]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const url = await uploadToCloudinary(file);
      setFormData((prev) => ({ ...prev, image_url: url }));
    } catch (err: any) {
      setError("Failed to upload image: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!formData.image_url) {
        throw new Error("Please upload an image");
      }

      const data = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        image_url: formData.image_url,
        featured: formData.featured,
        project_date: formData.project_date || null,
      };

      if (item) {
        // Update existing item
        const { error } = await supabase
          .from("portfolio")
          .update(data)
          .eq("id", item.id);

        if (error) throw error;
      } else {
        // Create new item
        const { error } = await supabase.from("portfolio").insert([data]);
        if (error) throw error;
      }

      onSuccess();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <Input
        showLabel
        labelText="Title"
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        placeholder="Project title"
        required
      />

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-gray-700">Description</label>
        <textarea
          className="w-full rounded-md border outline-none transition-all duration-200 border-gray-300 text-gray-900 focus:bg-iceblue focus:text-oxford focus:outline-skyblue px-4 py-3 h-24"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          placeholder="Project description"
          required
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-gray-700">Category *</label>
        <select
          className="w-full rounded-md border outline-none transition-all duration-200 border-gray-300 text-gray-900 focus:bg-iceblue focus:text-oxford focus:outline-skyblue px-4 py-3"
          value={formData.category}
          onChange={(e) =>
            setFormData({ ...formData, category: e.target.value })
          }
          required
        >
          <option value="design-build">Design & Build</option>
          <option value="print-shop">Print Shop</option>
          <option value="tech-training">Tech Training</option>
        </select>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-gray-700">
          Project Image *
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="w-full px-4 py-2 border border-gray-300 rounded-md"
          disabled={uploading}
        />
        {uploading && <p className="text-sm text-gray-500">Uploading...</p>}
        {formData.image_url && (
          <img
            src={formData.image_url}
            alt="Preview"
            className="w-full h-48 object-cover rounded-md mt-2"
          />
        )}
      </div>

      <Input
        showLabel
        labelText="Project Date (Optional)"
        type="date"
        value={formData.project_date}
        onChange={(e) =>
          setFormData({ ...formData, project_date: e.target.value })
        }
      />

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="featured"
          checked={formData.featured}
          onChange={(e) =>
            setFormData({ ...formData, featured: e.target.checked })
          }
          className="w-4 h-4 text-skyblue border-gray-300 rounded"
        />
        <label htmlFor="featured" className="text-sm font-medium text-gray-700">
          Mark as Featured
        </label>
      </div>

      <div className="flex gap-2 mt-4">
        <Button
          type="button"
          variant="sec"
          onClick={onCancel}
          className="flex-1"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="pry"
          loading={loading || uploading}
          className="flex-1"
        >
          {item ? "Update" : "Create"} Portfolio Item
        </Button>
      </div>
    </form>
  );
}
