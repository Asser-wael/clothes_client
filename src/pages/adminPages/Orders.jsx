import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAdminOrders } from "../../features/orderSlice";
import { useNavigate } from "react-router-dom";
import Loading from "../../components/loading";

import { motion } from "framer-motion";

const STATUS_STYLES = {
  pending: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  accepted: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  preparing: "bg-purple-500/10 text-purple-500 border-purple-500/20",
  shipped: "bg-cyan-500/10 text-cyan-500 border-cyan-500/20",
  completed: "bg-green-500/10 text-green-500 border-green-500/20",
  cancelled: "bg-red-500/10 text-red-500 border-red-500/20",
};

export default function Orders() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const { orders, loading } = useSelector(
    (state) => state.orderSlice
  );

  useEffect(() => {
    dispatch(getAdminOrders());

  }, [dispatch]);

  const filteredOrders = orders?.filter((order) => {
    const matchesSearch =
      order._id.toLowerCase().includes(search.toLowerCase()) ||
      order.shippingAddress?.fullName?.toLowerCase().includes(search.toLowerCase())

    const matchesStatus =
      statusFilter === "all" || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <Loading />
    );
  }

  return (
    <motion.div className="p-4 md:p-8 min-h-screen bg-[var(--color-bg)] text-[var(--color-text)]"
      initial={{ opacity: 0, }}
      animate={{ opacity: 1, }}
      transition={{ duration: 0.2 }}>
      <h1 className="text-2xl font-bold mb-6">Orders</h1>
      <div className="flex flex-col md:flex-row gap-3 mb-6">
        <input
          type="text"
          placeholder="Search by Order ID or customer name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-4 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] outline-none"
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-card)]"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="accepted">Accepted</option>
          <option value="preparing">Preparing</option>
          <option value="shipped">Shipped</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredOrders?.map((order) => (
          <div
            key={order._id}
            className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl shadow-sm p-4 hover:shadow-md transition"
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-3">
              <div className="flex flex-col">
                <span className="font-semibold">
                  {order.shippingAddress?.fullName ?? "—"}
                </span>
                <span className="text-xs text-[var(--color-muted)]">
                  #{(order._id).slice(0, 7)}
                </span>
              </div>

              <span
                className={`px-3 py-1 rounded-full text-xs font-medium border ${
                  STATUS_STYLES[order.status] ?? STATUS_STYLES.pending
                }`}
              >
                {order.status}
              </span>
            </div>

            {/* Shipping */}
            <div className="text-sm text-[var(--color-muted)] mb-2">
              {order.shippingAddress?.city ?? "—"} · {order.shippingAddress?.phone ?? "—"}
            </div>

            {/* Payment */}
            <div className="text-sm text-[var(--color-muted)] mb-2">
              Payment:{" "}
              <b className="text-[var(--color-text)]">
                {order.paymentMethod}
              </b>
            </div>

            {/* Items */}
            <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
              {order.cart?.map((item, idx) => (
                <div
                  key={idx}
                  className="flex justify-between text-sm border-b border-[var(--color-border)] pb-1"
                >
                  <span>{item.name} ({item.size}) × {item.count}</span>
                  <span className="text-[var(--color-text)]">
                    {item.price * item.count} L.E
                  </span>
                </div>
              ))}
            </div>

            {/* Total */}
            <div className="mt-3 font-bold text-right text-[var(--color-text)]">
              Total: {order.totalPrice} L.E
            </div>

            {/* Button */}
            <button
              onClick={() => navigate(`/admin/orders/${order._id}`)}
              className="mt-3 w-full bg-[var(--color-accent)] text-white py-2 rounded-lg hover:opacity-90 transition"
            >
              View Order
            </button>
          </div>
        ))}
      </div>
    </motion.div>
  );
}