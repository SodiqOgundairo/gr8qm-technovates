import { useEffect, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import { supabase } from "../../utils/supabase";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import Skeleton from "../../components/common/Skeleton";
import {
  IoIosArrowRoundForward,
  IoIosArrowRoundBack,
  IoMdRefresh,
} from "react-icons/io";
import { motion } from "framer-motion";

interface Message {
  id: string;
  name: string;
  email: string;
  message: string;
  created_at: string;
}

const AdminMessages: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);

  const fetchMessages = async (pageIndex: number, size: number, q: string) => {
    setLoading(true);
    setError(null);
    try {
      const from = pageIndex * size;
      const to = from + size - 1;
      let base = supabase
        .from("messages")
        .select("id,name,email,message,created_at", { count: "exact" })
        .order("created_at", { ascending: false });

      if (q.trim()) {
        base = base.or(
          `name.ilike.%${q}%,email.ilike.%${q}%,message.ilike.%${q}%`
        );
      }

      const { data, count, error: selErr } = await base.range(from, to);

      if (selErr) {
        setError(selErr.message);
      } else {
        setMessages((data || []) as Message[]);
        setTotal(count || 0);
        setPage(pageIndex);
        setPageSize(size);
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchMessages(0, pageSize, query);
    }, 500);
    return () => clearTimeout(timer);
  }, [query]);

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-oxford">Contact Messages</h1>
            <p className="text-gray-600 mt-1">
              View and manage contact form submissions
            </p>
          </div>
          <Button
            variant="pry"
            onClick={() => fetchMessages(page, pageSize, query)}
            className="px-4!"
          >
            <motion.div
              whileTap={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
            >
              <IoMdRefresh className="text-xl" />
            </motion.div>
          </Button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg">
            <p className="font-semibold">Error</p>
            <p>{error}</p>
          </div>
        )}

        {/* Search */}
        <div className="flex gap-3">
          <Input
            placeholder="Search name, email, or message..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1"
          />
        </div>

        {/* Messages Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Message
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i}>
                      <td className="px-6 py-4">
                        <Skeleton width={100} />
                      </td>
                      <td className="px-6 py-4">
                        <Skeleton width={120} />
                      </td>
                      <td className="px-6 py-4">
                        <Skeleton width={180} />
                      </td>
                      <td className="px-6 py-4">
                        <Skeleton width="100%" />
                      </td>
                    </tr>
                  ))
                ) : (
                  <>
                    {messages.map((m, index) => (
                      <motion.tr
                        key={m.id}
                        className="hover:bg-gray-50 transition-colors"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={{
                          backgroundColor: "rgba(241, 245, 249, 1)",
                        }}
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {new Date(m.created_at).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                          {m.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {m.email}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700">
                          <p className="line-clamp-2">{m.message}</p>
                        </td>
                      </motion.tr>
                    ))}
                    {messages.length === 0 && (
                      <tr>
                        <td
                          className="px-6 py-12 text-center text-gray-500"
                          colSpan={4}
                        >
                          No messages found
                        </td>
                      </tr>
                    )}
                  </>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-t border-gray-200">
            <div className="text-sm text-gray-600">
              Showing {messages.length > 0 ? page * pageSize + 1 : 0} to{" "}
              {Math.min((page + 1) * pageSize, total)} of {total} messages
            </div>
            <div className="flex gap-2">
              <Button
                variant="sec"
                onClick={() =>
                  fetchMessages(Math.max(page - 1, 0), pageSize, query)
                }
                disabled={page === 0 || loading}
              >
                <IoIosArrowRoundBack className="text-xl mr-1" />
                Previous
              </Button>
              <Button
                variant="sec"
                onClick={() => fetchMessages(page + 1, pageSize, query)}
                disabled={(page + 1) * pageSize >= total || loading}
              >
                Next
                <IoIosArrowRoundForward className="text-xl ml-1" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminMessages;
