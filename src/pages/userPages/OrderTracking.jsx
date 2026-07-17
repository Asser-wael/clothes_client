import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";

export default function OrderTracking() {

  const reduxTracking = useSelector(
    (state) => state.orderSlice.OrderTracking
  );

  const [tracking, setTracking] = useState([]);

  useEffect(() => {
    setTracking(reduxTracking);
  }, [reduxTracking]);

  
  return (
    <motion.div
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold">
            Order Tracking
          </h1>
          <p className="text-[var(--color-muted)] mt-2">
            Track the status of your latest orders in real time.
          </p>
        </div>

        {tracking.length === 0 ? (
          <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl p-10 text-center shadow-sm">
            <div className="text-6xl mb-4">📦</div>

            <h3 className="text-xl font-semibold mb-2">
              No Orders Found
            </h3>

            <p className="text-[var(--color-muted)]">
              You don't have any tracked orders yet.
            </p>
          </div>
        ) : (
          <div className="grid gap-6">
            {tracking.map((order, index) => (
              <div
                key={index}
                className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden"
              >
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-5 border-b border-[var(--color-border)]">
                  <div>
                    <h2 className="font-bold text-lg">
                      Order #{index + 1}
                    </h2>

                    <p className="text-sm text-[var(--color-muted)] mt-1">
                      {new Date(order.time).toLocaleString()}
                    </p>
                  </div>

                  <span
                    className={`px-4 py-2 rounded-full text-sm font-semibold w-fit
                  ${order.status === "pending"
                        ? "bg-yellow-500/10 text-yellow-500"
                        : order.status === "accepted"
                          ? "bg-blue-500/10 text-blue-500"
                          : order.status === "preparing"
                            ? "bg-purple-500/10 text-purple-500"
                            : order.status === "completed"
                              ? "bg-green-500/10 text-green-500"
                              : "bg-red-500/10 text-red-500"
                      }`}
                  >
                    {order.status.toUpperCase()}
                  </span>
                </div>

                {/* Items */}
                <div className="p-5">
                  <h3 className="font-semibold mb-4">
                    Ordered Items
                  </h3>

                  <div className="space-y-3">
                    {JSON.parse(order.cart).map((item, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between border border-[var(--color-border)] rounded-xl p-4"
                      >
                        <div>
                          <h4 className="font-medium">{item.name}</h4>

                          <p className="text-sm text-[var(--color-muted)]">
                            Quantity: {item.count}
                          </p>
                        </div>

                        <div className="font-bold text-[var(--color-accent)]">
                          ${item.price * item.count}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer */}
                <div className="px-5 py-4 border-t border-[var(--color-border)] flex justify-between items-center">
                  <span className="text-[var(--color-muted)]">
                    Total Items
                  </span>

                  <span className="font-bold">
                    {JSON.parse(order.cart).reduce(
                      (acc, item) => acc + item.count,
                      0
                    )}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}