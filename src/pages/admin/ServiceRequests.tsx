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
import { FaEye } from "react-icons/fa";

interface ServiceRequest {
  id: string;
  created_at: string;
  name: string;
  email: string;
  phone: string;
  service_type: string;
  project_description: string;
  budget_range: string | null;
  timeline: string | null;
  status: string;
}

export default function ServiceRequests() {
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(0);
  const [pageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [serviceFilter, setServiceFilter] = useState<string>("all");
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(
    null
  );

  const fetchRequests = async (
    pageIndex: number,
    size: number,
    q: string,
    status: string,
    service: string
  ) => {
    setLoading(true);
    setError(null);
    try {
      const from = pageIndex * size;
      const to = from + size - 1;
      let base = supabase
        .from("service_requests")
        .select("*", { count: "exact" })
        .order("created_at", { ascending: false });

      if (q.trim()) {
        base = base.or(
          `name.ilike.%${q}%,email.ilike.%${q}%,service_type.ilike.%${q}%`
        );
      }

      if (status !== "all") {
        base = base.eq("status", status);
      }

      if (service !== "all") {
        base = base.eq("service_type", service);
      }

      const { data, count, error: selErr } = await base.range(from, to);

      if (selErr) {
        setError(selErr.message);
      } else {
        setRequests((data || []) as ServiceRequest[]);
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
      fetchRequests(0, pageSize, query, statusFilter, serviceFilter);
    }, 500);
    return () => clearTimeout(timer);
  }, [query, statusFilter, serviceFilter]);

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: "bg-yellow-100 text-yellow-700",
      contacted: "bg-blue-100 text-blue-700",
      "in-progress": "bg-purple-100 text-purple-700",
      completed: "bg-green-100 text-green-700",
      cancelled: "bg-red-100 text-red-700",
    };
    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-semibold ${
          styles[status as keyof typeof styles] || "bg-gray-100 text-gray-700"
        }`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1).replace("-", " ")}
      </span>
    );
  };

  const getServiceBadge = (service: string) => {
    const styles = {
      "design-build": "bg-blue-100 text-blue-700",
      "print-shop": "bg-green-100 text-green-700",
      other: "bg-gray-100 text-gray-700",
    };
    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-semibold ${
          styles[service as keyof typeof styles] || "bg-gray-100 text-gray-700"
        }`}
      >
        {service
          .split("-")
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(" ")}
      </span>
    );
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-oxford">Service Requests</h1>
            <p className="text-gray-600 mt-1">
              Manage design, build, and print shop inquiries
            </p>
          </div>
          <Button
            variant="pry"
            onClick={() =>
              fetchRequests(page, pageSize, query, statusFilter, serviceFilter)
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
            placeholder="Search name, email, or service..."
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
            <option value="contacted">Contacted</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <select
            value={serviceFilter}
            onChange={(e) => setServiceFilter(e.target.value)}
            className="rounded-md border border-gray-300 px-4 py-2 focus:border-skyblue focus:outline-none"
          >
            <option value="all">All Services</option>
            <option value="design-build">Design & Build</option>
            <option value="print-shop">Print Shop</option>
            <option value="other">Other</option>
          </select>
        </div>

        {/* Requests Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Client
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Service
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Budget
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
                        <Skeleton width={100} />
                      </td>
                    </tr>
                  ))
                ) : (
                  <>
                    {requests.map((request) => (
                      <tr key={request.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {new Date(request.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-oxford">
                            {request.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {request.email}
                          </div>
                          <div className="text-xs text-gray-400">
                            {request.phone}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getServiceBadge(request.service_type)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          {request.budget_range || "Not specified"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(request.status)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                          <button
                            onClick={() => setSelectedRequest(request)}
                            className="text-skyblue hover:text-oxford transition-colors inline-flex items-center gap-1"
                          >
                            <FaEye size={16} />
                            <span>View</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                    {requests.length === 0 && (
                      <tr>
                        <td
                          className="px-6 py-12 text-center text-gray-500"
                          colSpan={6}
                        >
                          No service requests found
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
              Showing {requests.length > 0 ? page * pageSize + 1 : 0} to{" "}
              {Math.min((page + 1) * pageSize, total)} of {total} requests
            </div>
            <div className="flex gap-2">
              <Button
                variant="sec"
                onClick={() =>
                  fetchRequests(
                    Math.max(page - 1, 0),
                    pageSize,
                    query,
                    statusFilter,
                    serviceFilter
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
                  fetchRequests(
                    page + 1,
                    pageSize,
                    query,
                    statusFilter,
                    serviceFilter
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

        {/* Detail Modal */}
        {selectedRequest && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-oxford">
                  Request Details
                </h2>
                <button
                  onClick={() => setSelectedRequest(null)}
                  className="text-gray-500 hover:text-oxford"
                >
                  ✕
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase">
                    Client Information
                  </h3>
                  <div className="mt-2 space-y-2">
                    <p>
                      <span className="font-semibold">Name:</span>{" "}
                      {selectedRequest.name}
                    </p>
                    <p>
                      <span className="font-semibold">Email:</span>{" "}
                      {selectedRequest.email}
                    </p>
                    <p>
                      <span className="font-semibold">Phone:</span>{" "}
                      {selectedRequest.phone}
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase">
                    Project Details
                  </h3>
                  <div className="mt-2 space-y-2">
                    <p>
                      <span className="font-semibold">Service:</span>{" "}
                      {getServiceBadge(selectedRequest.service_type)}
                    </p>
                    <p>
                      <span className="font-semibold">Budget Range:</span>{" "}
                      {selectedRequest.budget_range || "Not specified"}
                    </p>
                    <p>
                      <span className="font-semibold">Timeline:</span>{" "}
                      {selectedRequest.timeline || "Not specified"}
                    </p>
                    <p>
                      <span className="font-semibold">Status:</span>{" "}
                      {getStatusBadge(selectedRequest.status)}
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase">
                    Description
                  </h3>
                  <p className="mt-2 text-gray-700 whitespace-pre-wrap">
                    {selectedRequest.project_description}
                  </p>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    variant="pry"
                    onClick={() => setSelectedRequest(null)}
                  >
                    Close
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
