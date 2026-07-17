import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import {
  AreaChart, Area,
  XAxis, YAxis,
  CartesianGrid, Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  FiUsers, FiShoppingBag, FiDollarSign, FiTrendingUp,
  FiCalendar, FiClock, FiActivity, FiPackage,
} from "react-icons/fi";
import { getAdminOrders } from "../../features/orderSlice";
import { useNavigate } from "react-router-dom";
import { socket } from "../../services/socket";
import { adminDashboard, setMonth, setday, setyear } from "../../features/dashboardSlice";

const fmt = (n) => (n == null ? "—" : Number(n).toLocaleString("en-US"));
const fmtMoney = (n) => (n == null ? "—" : "$" + Number(n).toLocaleString("en-US"));

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, delay: i * 0.05, ease: "easeOut" },
  }),
};

function Card({ icon: Icon, label, value, sub, loading, index }) {
  return (
    <motion.div
      custom={index}
      initial="hidden"
      animate="show"
      variants={fadeUp}
      className="flex flex-col gap-2 border border-border bg-card p-4 sm:p-5"
    >
      <div className="flex items-center gap-2 text-muted">
        {Icon && <Icon size={15} />}
        <span className="text-[11px] font-medium uppercase tracking-[0.08em] sm:text-[12px]">{label}</span>
      </div>

      {loading ? (
        <motion.div
          animate={{ opacity: [1, 0.4, 1] }}
          transition={{ duration: 1.2, repeat: Infinity }}
          className="h-7 w-2/3 bg-border"
        />
      ) : (
        <p className="text-[20px] font-semibold leading-none text-text sm:text-[26px]">{value}</p>
      )}

      {sub && <span className="text-[11px] text-muted sm:text-[12px]">{sub}</span>}
    </motion.div>
  );
}

function PeriodToggle({ type, dispatch }) {
  const opts = [
    { label: "Today", icon: FiClock, action: setday, key: "day" },
    { label: "Month", icon: FiCalendar, action: setMonth, key: "month" },
    { label: "Year", icon: FiActivity, action: setyear, key: "year" },
  ];

  return (
    <div className="flex gap-1 border border-border p-1">
      {opts.map(({ label, icon: Icon, action, key }) => (
        <button
          key={key}
          onClick={() => dispatch(action())}
          className="relative flex items-center gap-1.5 px-2.5 py-1.5 text-[11px] font-medium uppercase tracking-[0.06em] text-muted transition-colors duration-200 hover:text-text sm:px-3 sm:text-[12px]"
        >
          {type === key && (
            <motion.span
              layoutId="periodPill"
              className="absolute inset-0 bg-accent"
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            />
          )}
          <span className="relative z-10 flex items-center gap-1.5" style={type === key ? { color: "var(--color-bg)" } : {}}>
            <Icon size={12} />
            {label}
          </span>
        </button>
      ))}
    </div>
  );
}

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="border border-border bg-card px-4 py-2.5 text-sm">
      <p className="mb-1.5 text-[11px] uppercase tracking-[0.06em] text-muted">{label}</p>
      {payload.map((p) => (
        <p key={p.name} className="flex items-center gap-1.5 font-semibold text-text">
          <span
            className="inline-block h-2 w-2 rounded-full"
            style={{ background: p.dataKey === "revenue" ? "var(--color-accent)" : "var(--color-muted)" }}
          />
          {p.name}:&nbsp;
          {p.name.toLowerCase().includes("revenue") ? "$" : ""}
          {Number(p.value).toLocaleString()}
        </p>
      ))}
    </div>
  );
}
const getStatusStyle = (status) => {
  switch (status) {
    case "pending":
      return "bg-yellow-100 text-yellow-700";

    case "confirmed":
      return "bg-blue-100 text-blue-700";

    case "preparing":
      return "bg-purple-100 text-purple-700";

    case "completed":
      return "bg-green-100 text-green-700";

    case "cancelled":
      return "bg-red-100 text-red-700";

    default:
      return "bg-gray-100 text-gray-700";
  }
};
function trimLabels(data, maxVisible = 8) {
  if (!data?.length) return data;
  const step = Math.ceil(data.length / maxVisible);
  return data.map((d, i) => ({ ...d, _label: i % step === 0 ? d.label : "" }));
}

export default function Dashboard() {
  const [onlineUsers, setOnlineUsers] = useState(0);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { orders: allOrders } = useSelector(
    (state) => state.orderSlice
  );
  const { todayData, monthData, yearData, type, loading } = useSelector(
    (state) => state.dashboardSlice
  );

  useEffect(() => {
    socket.emit("getOnlineUsers");
    socket.on("onlineUsers", (count) => setOnlineUsers(count));
    return () => socket.off("onlineUsers");
  }, []);

  useEffect(() => {
    dispatch(adminDashboard());
    dispatch(getAdminOrders());

  }, [dispatch]);

  const data = type === "day" ? todayData : type === "month" ? monthData : yearData;
  const chartData = trimLabels(data?.chart ?? [], type === "year" ? 12 : 8);
  const hasChart = chartData.length > 0;

  const cards = [
    { icon: FiUsers, label: "Online now", value: onlineUsers, sub: "Live visitors" },
    {
      icon: FiDollarSign,
      label: "Revenue",
      value: fmtMoney(data?.revenue),
      sub: type === "day" ? "Today" : type === "month" ? "This month" : "This year",
    },
    { icon: FiShoppingBag, label: "Orders", value: fmt(data?.orders), sub: "Total orders" },
    { icon: FiTrendingUp, label: "Avg order", value: fmtMoney(data?.avgOrderValue), sub: "Per transaction" },
    { icon: FiPackage, label: "Products", value: fmt(data?.products), sub: "In catalog" },
    { icon: FiShoppingBag, label: "Pending", value: fmt(data?.pendingOrders), sub: "Orders to fulfill" },
  ];

  return (
    <div className="min-h-screen bg-bg px-4 py-6 text-text sm:px-5 sm:py-8 md:px-8">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-border pb-8">
        <div>
          <h1 className="font-serif text-[26px] italic text-text sm:text-[32px] md:text-[38px]">Dashboard</h1>
          <p className="mt-1 text-[13px] text-muted">Welcome back, Admin.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 border border-border px-3.5 py-1.5">
            <motion.span
              animate={{ opacity: [1, 0.4, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="h-1.5 w-1.5 rounded-full bg-green-500"
            />
            <span className="text-[12px] font-medium text-muted">{onlineUsers} online</span>
          </div>
          <PeriodToggle type={type} dispatch={dispatch} />
        </div>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-px border border-border bg-border sm:grid-cols-3 lg:grid-cols-6">
        {cards.map((c, i) => (
          <Card key={c.label} {...c} loading={loading} index={i} />
        ))}
      </div>

      <div className="border border-border bg-card p-4 sm:p-5 sm:p-6">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-[13px] font-semibold uppercase tracking-[0.1em] text-text">
            Revenue &amp; orders
          </h2>
          <div className="flex gap-4">
            <span className="flex items-center gap-1.5 text-[12px] text-muted">
              <span className="inline-block h-2.5 w-2.5 rounded-full bg-accent" />
              Revenue
            </span>
            <span className="flex items-center gap-1.5 text-[12px] text-muted">
              <span className="inline-block h-2.5 w-2.5 rounded-full bg-muted" />
              Orders
            </span>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              animate={{ opacity: [1, 0.4, 1] }}
              transition={{ duration: 1.2, repeat: Infinity }}
              className="h-64 bg-border"
            />
          ) : !hasChart ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex h-64 items-center justify-center text-sm text-muted"
            >
              No data for this period
            </motion.div>
          ) : (
            <motion.div key="chart" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={chartData} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
                  <defs>
                    <linearGradient id="gRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-accent)" stopOpacity={0.22} />
                      <stop offset="95%" stopColor="var(--color-accent)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                  <XAxis dataKey="_label" tick={{ fill: "var(--color-muted)", fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis
                    yAxisId="rev"
                    orientation="left"
                    tick={{ fill: "var(--color-muted)", fontSize: 10 }}
                    axisLine={false}
                    tickLine={false}
                    width={48}
                    tickFormatter={(v) => "$" + (v >= 1000 ? (v / 1000).toFixed(1) + "k" : v)}
                  />
                  <YAxis yAxisId="ord" orientation="right" tick={{ fill: "var(--color-muted)", fontSize: 10 }} axisLine={false} tickLine={false} width={32} />
                  <Tooltip content={<ChartTooltip />} />
                  <Area
                    yAxisId="rev"
                    type="monotone"
                    dataKey="revenue"
                    name="Revenue"
                    stroke="var(--color-accent)"
                    strokeWidth={2}
                    fill="url(#gRev)"
                    dot={false}
                    activeDot={{ r: 4, strokeWidth: 0 }}
                  />
                  <Area
                    yAxisId="ord"
                    type="monotone"
                    dataKey="orders"
                    name="Orders"
                    stroke="var(--color-muted)"
                    strokeWidth={2}
                    fill="transparent"
                    dot={false}
                    activeDot={{ r: 4, strokeWidth: 0 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </motion.div>
          )}
        </AnimatePresence>
        <div className="mt-8 border border-border bg-card">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-4 py-4 sm:px-5">
            <h2 className="text-[13px] font-semibold uppercase tracking-[0.08em] text-text">
              Latest Orders
            </h2>

            <button
              onClick={() => navigate("/admin/orders")}
              className="text-[12px] font-medium text-[var(--color-accent)] hover:underline"
            >
              View All
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[480px]">
              <thead className="border-b border-border">
                <tr className="text-left text-[12px] uppercase tracking-[0.08em] text-muted">
                  <th className="px-4 py-4 sm:px-5">Table</th>
                  <th className="px-4 py-4 sm:px-5">Price</th>
                  <th className="px-4 py-4 sm:px-5">Status</th>
                  <th className="px-4 py-4 sm:px-5">Date</th>
                </tr>
              </thead>

              <tbody>
                {allOrders?.slice(0, 5).map((o, i) => (
                  <motion.tr
                    key={o._id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                    onClick={() => navigate(`/admin/orders/${o._id}`)}
                    className="cursor-pointer border-b border-border transition-colors hover:bg-[var(--color-bg)]"
                  >
                    <td className="whitespace-nowrap px-4 py-4 font-medium text-text sm:px-5">
                      Table {o.tableNumber}
                    </td>

                    <td className="whitespace-nowrap px-4 py-4 font-semibold text-[var(--color-accent)] sm:px-5">
                      L.E {o.totalPrice}
                    </td>

                    <td className="whitespace-nowrap px-4 py-4 sm:px-5">
                      <span
                        className={`rounded-full px-3 py-1 text-[11px] font-semibold capitalize ${getStatusStyle(
                          o.status
                        )}`}
                      >
                        {o.status}
                      </span>
                    </td>

                    <td className="whitespace-nowrap px-4 py-4 text-sm text-muted sm:px-5">
                      {new Date(o.createdAt).toLocaleDateString()}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <style>{`
        .font-serif { font-family: "Fraunces", serif; }
      `}</style>
    </div>
  );
}