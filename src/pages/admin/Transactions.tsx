import React, { useEffect, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import { supabase } from "../../utils/supabase";
import { HiDownload, HiSearch, HiFilter } from "react-icons/hi";

interface Transaction {
  id: string;
  created_at: string;
  amount: number;
  currency: string;
  status: string;
  reference: string;
  customer_email: string;
  customer_name: string;
  type: "course_application" | "service_invoice";
  metadata: any;
}

const AdminTransactions: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string>("all");

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("transactions")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setTransactions(data || []);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleExportCSV = () => {
    const headers = [
      "Date",
      "Reference",
      "Customer Name",
      "Customer Email",
      "Type",
      "Amount",
      "Status",
    ];

    const csvContent = [
      headers.join(","),
      ...transactions.map((t) =>
        [
          new Date(t.created_at).toLocaleDateString(),
          t.reference,
          `"${t.customer_name || ""}"`,
          t.customer_email,
          t.type,
          t.amount,
          t.status,
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute(
        "download",
        `transactions_${new Date().toISOString().split("T")[0]}.csv`
      );
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const filteredTransactions = transactions.filter((t) => {
    const matchesSearch =
      t.customer_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (t.customer_name &&
        t.customer_name.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesFilter =
      filterType === "all" ||
      (filterType === "course" && t.type === "course_application") ||
      (filterType === "service" && t.type === "service_invoice");

    return matchesSearch && matchesFilter;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(amount);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-oxford">Transactions</h1>
            <p className="text-gray-600">View and manage all payments</p>
          </div>
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 bg-oxford text-white px-4 py-2 rounded-lg hover:bg-opacity-90 transition-colors"
          >
            <HiDownload className="h-5 w-5" />
            Export CSV
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg shadow flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search by email, name, or reference..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-skyblue/50"
            />
          </div>
          <div className="flex items-center gap-2">
            <HiFilter className="text-gray-400 h-5 w-5" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-skyblue/50"
            >
              <option value="all">All Types</option>
              <option value="course">Course Applications</option>
              <option value="service">Service Invoices</option>
            </select>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 font-semibold text-gray-600">
                    Date
                  </th>
                  <th className="px-6 py-4 font-semibold text-gray-600">
                    Reference
                  </th>
                  <th className="px-6 py-4 font-semibold text-gray-600">
                    Customer
                  </th>
                  <th className="px-6 py-4 font-semibold text-gray-600">
                    Type
                  </th>
                  <th className="px-6 py-4 font-semibold text-gray-600">
                    Amount
                  </th>
                  <th className="px-6 py-4 font-semibold text-gray-600">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-8 text-center text-gray-500"
                    >
                      Loading transactions...
                    </td>
                  </tr>
                ) : filteredTransactions.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-8 text-center text-gray-500"
                    >
                      No transactions found matching your criteria.
                    </td>
                  </tr>
                ) : (
                  filteredTransactions.map((transaction) => (
                    <tr
                      key={transaction.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(transaction.created_at).toLocaleDateString()}
                        <br />
                        <span className="text-xs text-gray-400">
                          {new Date(
                            transaction.created_at
                          ).toLocaleTimeString()}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-mono text-gray-600">
                        {transaction.reference}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-oxford">
                          {transaction.customer_name || "N/A"}
                        </div>
                        <div className="text-xs text-gray-500">
                          {transaction.customer_email}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            transaction.type === "course_application"
                              ? "bg-orange/10 text-orange"
                              : "bg-skyblue/10 text-skyblue"
                          }`}
                        >
                          {transaction.type === "course_application"
                            ? "Course Fee"
                            : "Service Invoice"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-bold text-oxford">
                        {formatCurrency(transaction.amount)}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            transaction.status === "success"
                              ? "bg-green-100 text-green-800"
                              : transaction.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {transaction.status.charAt(0).toUpperCase() +
                            transaction.status.slice(1)}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminTransactions;
