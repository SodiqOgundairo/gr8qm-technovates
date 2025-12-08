import { useEffect, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import { supabase } from "../../utils/supabase";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import Skeleton from "../../components/common/Skeleton";
import { formatAmount } from "../../utils/paystack";
import {
  IoIosArrowRoundForward,
  IoIosArrowRoundBack,
  IoMdRefresh,
} from "react-icons/io";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";

interface Application {
  id: string;
  created_at: string;
  name: string;
  email: string;
  phone: string;
  has_experience: boolean;
  experience_details: string | null;
  payment_status: string;
  payment_reference: string | null;
  status: string;
  courses: {
    name: string;
    commitment_fee: number;
  };
}

export default function Applications() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(0);
  const [pageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [paymentFilter, setPaymentFilter] = useState<string>("all");

  const fetchApplications = async (
    pageIndex: number,
    size: number,
    q: string,
    status: string,
    payment: string
  ) => {
    setLoading(true);
    setError(null);
    try {
      const from = pageIndex * size;
      const to = from + size - 1;
      let base = supabase
        .from("course_applications")
        .select(
          `
          *,
          courses (
            name,
            commitment_fee
          )
        `,
          { count: "exact" }
        )
        .order("created_at", { ascending: false });

      if (q.trim()) {
        base = base.or(`name.ilike.%${q}%,email.ilike.%${q}%`);
      }

      if (status !== "all") {
        base = base.eq("status", status);
      }

      if (payment !== "all") {
        base = base.eq("payment_status", payment);
      }

      const { data, count, error: selErr } = await base.range(from, to);

      if (selErr) {
        setError(selErr.message);
      } else {
        setApplications((data || []) as Application[]);
        setTotal(count || 0);
        setPage(pageIndex);
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchApplications(0, pageSize, query, statusFilter, paymentFilter);
    }, 500);
    return () => clearTimeout(timer);
  }, [query, statusFilter, paymentFilter]);

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: "bg-yellow-100 text-yellow-700",
      confirmed: "bg-green-100 text-green-700",
      rejected: "bg-red-100 text-red-700",
      completed: "bg-blue-100 text-blue-700",
    };
    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-semibold ${
          styles[status as keyof typeof styles] || "bg-gray-100 text-gray-700"
        }`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getPaymentBadge = (payment: string) => {
    const styles = {
      pending: "bg-yellow-100 text-yellow-700",
      paid: "bg-green-100 text-green-700",
      failed: "bg-red-100 text-red-700",
    };
    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-semibold ${
          styles[payment as keyof typeof styles] || "bg-gray-100 text-gray-700"
        }`}
      >
        {payment.charAt(0).toUpperCase() + payment.slice(1)}
      </span>
    );
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-oxford">
              Course Applications
            </h1>
            <p className="text-gray-600 mt-1">
              Manage student applications and enrollments
            </p>
          </div>
          <Button
            variant="pry"
            onClick={() =>
              fetchApplications(
                page,
                pageSize,
                query,
                statusFilter,
                paymentFilter
              )
            }
            className="px-4!"
          >
            <IoMdRefresh className="text-xl" />
          </Button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg">
            <p className="font-semibold">Error</p>
            <p>{error}</p>
          </div>
        )}

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Input
            placeholder="Search name or email..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-md border border-gray-300 px-4 py-2 focus:border-skyblue focus:outline-none"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="rejected">Rejected</option>
            <option value="completed">Completed</option>
          </select>
          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            className="rounded-md border border-gray-300 px-4 py-2 focus:border-skyblue focus:outline-none"
          >
            <option value="all">All Payments</option>
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
            <option value="failed">Failed</option>
          </select>
        </div>

        {/* Applications Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Applicant
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Course
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fee
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
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
                        <Skeleton width={150} />
                      </td>
                      <td className="px-6 py-4">
                        <Skeleton width={120} />
                      </td>
                      <td className="px-6 py-4">
                        <Skeleton width={80} />
                      </td>
                      <td className="px-6 py-4">
                        <Skeleton width={80} />
                      </td>
                      <td className="px-6 py-4">
                        <Skeleton width={80} />
                      </td>
                      <td className="px-6 py-4">
                        <Skeleton width={100} />
                      </td>
                    </tr>
                  ))
                ) : (
                  <>
                    {applications.map((app) => {
                      const course = Array.isArray(app.courses)
                        ? app.courses[0]
                        : app.courses;
                      return (
                        <tr key={app.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                            {new Date(app.created_at).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-oxford">
                              {app.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {app.email}
                            </div>
                            <div className="text-xs text-gray-400">
                              {app.phone}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                            {course?.name || "N/A"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-oxford">
                            {formatAmount(course?.commitment_fee || 0)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {getPaymentBadge(app.payment_status)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {getStatusBadge(app.status)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                            <div className="flex justify-end gap-2">
                              {app.status === "pending" &&
                                app.payment_status === "paid" && (
                                  <>
                                    <button className="text-green-600 hover:text-green-800">
                                      <FaCheckCircle size={20} />
                                    </button>
                                    <button className="text-red-600 hover:text-red-800">
                                      <FaTimesCircle size={20} />
                                    </button>
                                  </>
                                )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                    {applications.length === 0 && (
                      <tr>
                        <td
                          className="px-6 py-12 text-center text-gray-500"
                          colSpan={7}
                        >
                          No applications found
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
              Showing {applications.length > 0 ? page * pageSize + 1 : 0} to{" "}
              {Math.min((page + 1) * pageSize, total)} of {total} applications
            </div>
            <div className="flex gap-2">
              <Button
                variant="sec"
                onClick={() =>
                  fetchApplications(
                    Math.max(page - 1, 0),
                    pageSize,
                    query,
                    statusFilter,
                    paymentFilter
                  )
                }
                disabled={page === 0 || loading}
              >
                <IoIosArrowRoundBack className="text-xl mr-1" />
                Previous
              </Button>
              <Button
                variant="sec"
                onClick={() =>
                  fetchApplications(
                    page + 1,
                    pageSize,
                    query,
                    statusFilter,
                    paymentFilter
                  )
                }
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
}
