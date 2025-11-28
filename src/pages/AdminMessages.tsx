import { useEffect, useState } from "react";
import Container from "../components/layout/Container";
import { supabase } from "../utils/supabase";
import Modal from "../components/layout/Modal";
import Input from "../components/common/Input";
import Button from "../components/common/Button";
import {
  IoIosArrowRoundForward,
  IoIosArrowRoundBack,
  IoMdRefresh,
} from "react-icons/io";
import { GoSignOut } from "react-icons/go";

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
  const [userId, setUserId] = useState<string | null>(null);
  const [loginOpen, setLoginOpen] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.auth.getUser();
      const uid = data.user?.id || null;
      setUserId(uid);
      setLoginOpen(!uid);
    };
    init();

    const { data: sub } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        const uid = session?.user?.id || null;
        setUserId(uid);
        setLoginOpen(!uid);
      }
    );
    return () => {
      sub.subscription.unsubscribe();
    };
  }, []);

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

      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Request timed out")), 10000)
      );

      const {
        data,
        count,
        error: selErr,
      } = (await Promise.race([base.range(from, to), timeoutPromise])) as any;

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
    if (!userId) return;
    const timer = setTimeout(() => {
      fetchMessages(0, pageSize, query);
    }, 500);
    return () => clearTimeout(timer);
  }, [query, userId]);

  const signIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setError(null);
    const { error: authError } = await supabase.auth.signInWithPassword({
      email: loginEmail,
      password: loginPassword,
    });
    if (authError) setError(authError.message);
    setLoginLoading(false);
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    }
    localStorage.clear();
    window.location.reload();
  };

  return (
    <main className="py-12 md:py-20 lg:py-24">
      <Container className="flex flex-col gap-6">
        {/* DEBUG INFO - REMOVE LATER */}
        <div className="bg-yellow-100 p-4 rounded mb-4 text-xs font-mono text-black">
          <p>User ID: {String(userId)}</p>
          <p>Login Open: {String(loginOpen)}</p>
          <p>Loading: {String(loading)}</p>
          <p>Error: {String(error)}</p>
        </div>
        <div className="flex justify-between items-center">
          <h1 className="text-2xl md:text-3xl font-bold text-oxford">
            Admin: Contact Submissions
          </h1>
          {userId && (
            <Button variant="sec" onClick={signOut} type="button">
              <span className="button-content">
                Sign Out <GoSignOut className="arrow text-xl" />
              </span>
            </Button>
          )}
        </div>
        {error && <p className="text-red-600">{error}</p>}

        <div className="flex flex-col md:flex-row gap-3 items-center">
          <Input
            showLabel={false}
            placeholder="Search name, email, or message"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                fetchMessages(0, pageSize, query);
              }
            }}
          />
          <Button
            variant="pry"
            onClick={() => fetchMessages(0, pageSize, query)}
            size="md"
            className="px-4!"
            aria-label="Refresh messages"
          >
            <IoMdRefresh className="text-xl" />
          </Button>
        </div>

        <section>
          <h2 className="text-xl font-semibold text-oxford">Messages</h2>
          <div className="overflow-x-auto mt-4">
            <table className="min-w-full divide-y divide-gray-200 bg-white rounded-lg shadow">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">
                    Date
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">
                    Name
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">
                    Email
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">
                    Message
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="px-4 py-4">
                        <div className="h-4 bg-gray-200 rounded w-24"></div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="h-4 bg-gray-200 rounded w-32"></div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="h-4 bg-gray-200 rounded w-40"></div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="h-4 bg-gray-200 rounded w-full"></div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <>
                    {messages.map((m) => (
                      <tr key={m.id}>
                        <td className="px-4 py-2 text-sm text-gray-700">
                          {new Date(m.created_at).toLocaleString()}
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-700">
                          {m.name}
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-700">
                          {m.email}
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-700">
                          {m.message}
                        </td>
                      </tr>
                    ))}
                    {messages.length === 0 && (
                      <tr>
                        <td
                          className="px-4 py-6 text-sm text-gray-500"
                          colSpan={4}
                        >
                          No messages yet
                        </td>
                      </tr>
                    )}
                  </>
                )}
              </tbody>
            </table>
          </div>
          <div className="flex justify-between items-center mt-4">
            <div className="text-sm text-gray-600">Total: {total}</div>
            <div className="flex gap-2">
              <Button
                variant="sec"
                onClick={() =>
                  fetchMessages(Math.max(page - 1, 0), pageSize, query)
                }
                disabled={page === 0 || loading}
              >
                <span className="button-content">
                  <IoIosArrowRoundBack className="arrow text-xl" /> Previous
                </span>
              </Button>
              <Button
                variant="sec"
                onClick={() => fetchMessages(page + 1, pageSize, query)}
                disabled={(page + 1) * pageSize >= total || loading}
              >
                <span className="button-content">
                  Next <IoIosArrowRoundForward className="arrow text-xl" />
                </span>
              </Button>
            </div>
          </div>
        </section>
      </Container>

      <Modal
        open={loginOpen}
        onClose={() => setLoginOpen(false)}
        showCloseButton={false}
        closeOnOutsideClick={false}
        closeOnEscape={false}
      >
        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-semibold text-oxford">Admin Login</h2>
          <form onSubmit={signIn} className="flex flex-col gap-3">
            <Input
              showLabel
              labelText="Email"
              type="email"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              required
            />
            <Input
              showLabel
              labelText="Password"
              type="password"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              required
            />
            <Button type="submit" variant="pry" loading={loginLoading}>
              Sign In
            </Button>
          </form>
        </div>
      </Modal>
    </main>
  );
};

export default AdminMessages;
