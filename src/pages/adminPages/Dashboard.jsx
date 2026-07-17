import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { CountUp } from "react-countup";
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

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, delay: i * 0.05, ease: "easeOut" },
  }),
};

function Card({ icon: Icon, label, value, type, sub, loading, index }) {
  const isMoney = type === "money";
  const decimals = isMoney && value != null && !Number.isInteger(value) ? 2 : 0;

  return (
    <motion.div
      custom={index}
      initial="hidden"
      animate="show"
      variants={fadeUp}
      className="flex flex-col gap-1.5 border border-border bg-card p-3 sm:gap-2 sm:p-5"
    >
      <div className="flex items-center gap-1.5 text-muted sm:gap-2">
        {Icon && <Icon size={13} className="shrink-0 sm:!w-[15px] sm:!h-[15px]" />}
        <span className="truncate text-[10px] font-medium uppercase tracking-[0.06em] sm:text-[12px] sm:tracking-[0.08em]">
          {label}
        </span>
      </div>

      {loading ? (
        <motion.div
          animate={{ opacity: [1, 0.4, 1] }}
          transition={{ duration: 1.2, repeat: Infinity }}
          className="h-6 w-2/3 bg-border sm:h-7"
        />
      ) : value == null ? (
        <p className="text-[17px] font-semibold leading-none text-text sm:text-[26px]">—</p>
      ) : (
        <p className="text-[17px] font-semibold leading-none text-text sm:text-[26px]">
          <CountUp
            end={value}
            duration={1.1}
            separator=","
            decimals={decimals}
            prefix={isMoney ? "$" : ""}
            preserveValue
          />
        </p>
      )}

      {sub && <span className="truncate text-[10px] text-muted sm:text-[12px]">{sub}</span>}
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
    <div className="flex w-full gap-1 border border-border p-1 sm:w-auto">
      {opts.map(({ label, icon: Icon, action, key }) => (
        <button
          key={key}
          onClick={() => dispatch(action())}
          className="relative flex flex-1 items-center justify-center gap-1.5 px-2 py-1.5 text-[10px] font-medium uppercase tracking-[0.04em] text-muted transition-colors duration-200 hover:text-text sm:flex-none sm:px-3 sm:text-[12px] sm:tracking-[0.06em]"
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
    { icon: FiUsers, label: "Online now", value: onlineUsers, type: "number", sub: "Live visitors" },
    {
      icon: FiDollarSign,
      label: "Revenue",
      value: data?.revenue ?? null,
      type: "money",
      sub: type === "day" ? "Today" : type === "month" ? "This month" : "This year",
    },
    { icon: FiShoppingBag, label: "Orders", value: data?.orders ?? null, type: "number", sub: "Total orders" },
    { icon: FiTrendingUp, label: "Avg order", value: data?.avgOrderValue ?? null, type: "money", sub: "Per transaction" },
    { icon: FiPackage, label: "Products", value: data?.products ?? null, type: "number", sub: "In catalog" },
    { icon: FiShoppingBag, label: "Pending", value: data?.pendingOrders ?? null, type: "number", sub: "Orders to fulfill" },
  ];

  return (
    <div className="min-h-screen bg-bg px-3 py-5 text-text sm:px-5 sm:py-8 md:px-8">
      <div className="mb-6 flex flex-col gap-4 border-b border-border pb-6 sm:mb-8 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:pb-8">
        <div>
          <h1 className="font-serif text-[22px] italic text-text sm:text-[32px] md:text-[38px]">Dashboard</h1>
          <p className="mt-1 text-[12px] text-muted sm:text-[13px]">Welcome back, Admin.</p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3">
          <div className="flex items-center justify-center gap-2 border border-border px-3.5 py-1.5">
            <motion.span
              animate={{ opacity: [1, 0.4, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="h-1.5 w-1.5 rounded-full bg-green-500"
            />
            <span className="text-[11px] font-medium text-muted sm:text-[12px]">{onlineUsers} online</span>
          </div>
          <PeriodToggle type={type} dispatch={dispatch} />
        </div>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-px border border-border bg-border sm:grid-cols-3 lg:grid-cols-6">
        {cards.map((c, i) => (
          <Card key={c.label} {...c} loading={loading} index={i} />
        ))}
      </div>

      <div className="border border-border bg-card p-3 sm:p-5 md:p-6">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-[12px] font-semibold uppercase tracking-[0.08em] text-text sm:text-[13px] sm:tracking-[0.1em]">
            Revenue &amp; orders
          </h2>
          <div className="flex gap-3 sm:gap-4">
            <span className="flex items-center gap-1.5 text-[11px] text-muted sm:text-[12px]">
              <span className="inline-block h-2.5 w-2.5 rounded-full bg-accent" />
              Revenue
            </span>
            <span className="flex items-center gap-1.5 text-[11px] text-muted sm:text-[12px]">
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
              className="h-56 bg-border sm:h-64"
            />
          ) : !hasChart ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex h-56 items-center justify-center text-sm text-muted sm:h-64"
            >
              No data for this period
            </motion.div>
          ) : (
            <motion.div key="chart" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
              <ResponsiveContainer width="100%" height={220} className="sm:!h-[260px]">
                <AreaChart data={chartData} margin={{ top: 4, right: 0, bottom: 0, left: 0 }}>
                  <defs>
                    <linearGradient id="gRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-accent)" stopOpacity={0.22} />
                      <stop offset="95%" stopColor="var(--color-accent)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
                  <XAxis dataKey="_label" tick={{ fill: "var(--color-muted)", fontSize: 9 }} axisLine={false} tickLine={false} />
                  <YAxis
                    yAxisId="rev"
                    orientation="left"
                    tick={{ fill: "var(--color-muted)", fontSize: 9 }}
                    axisLine={false}
                    tickLine={false}
                    width={38}
                    tickFormatter={(v) => "$" + (v >= 1000 ? (v / 1000).toFixed(1) + "k" : v)}
                  />
                  <YAxis yAxisId="ord" orientation="right" tick={{ fill: "var(--color-muted)", fontSize: 9 }} axisLine={false} tickLine={false} width={26} />
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

        <div className="mt-6 border border-border bg-card sm:mt-8">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-3 py-3 sm:px-5 sm:py-4">
            <h2 className="text-[12px] font-semibold uppercase tracking-[0.06em] text-text sm:text-[13px] sm:tracking-[0.08em]">
              Latest Orders
            </h2>

            <button
              onClick={() => navigate("/admin/orders")}
              className="text-[11px] font-medium text-[var(--color-accent)] hover:underline sm:text-[12px]"
            >
              View All
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[480px]">
              <thead className="border-b border-border">
                <tr className="text-left text-[11px] uppercase tracking-[0.06em] text-muted sm:text-[12px] sm:tracking-[0.08em]">
                  <th className="px-3 py-3 sm:px-5 sm:py-4">Table</th>
                  <th className="px-3 py-3 sm:px-5 sm:py-4">Price</th>
                  <th className="px-3 py-3 sm:px-5 sm:py-4">Status</th>
                  <th className="px-3 py-3 sm:px-5 sm:py-4">Date</th>
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
                    <td className="whitespace-nowrap px-3 py-3 text-sm font-medium text-text sm:px-5 sm:py-4">
                      Table {o.tableNumber}
                    </td>

                    <td className="whitespace-nowrap px-3 py-3 text-sm font-semibold text-[var(--color-accent)] sm:px-5 sm:py-4">
                      L.E {o.totalPrice}
                    </td>

                    <td className="whitespace-nowrap px-3 py-3 sm:px-5 sm:py-4">
                      <span
                        className={`rounded-full px-2.5 py-1 text-[10px] font-semibold capitalize sm:px-3 sm:text-[11px] ${getStatusStyle(
                          o.status
                        )}`}
                      >
                        {o.status}
                      </span>
                    </td>

                    <td className="whitespace-nowrap px-3 py-3 text-xs text-muted sm:px-5 sm:py-4 sm:text-sm">
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