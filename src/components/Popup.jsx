import { useSelector, useDispatch } from "react-redux";
import { hide } from "../features/soundNotificationSlice";
import { motion, AnimatePresence } from "framer-motion";

export default function Popup() {
  const dispatch = useDispatch();

  const { visible, message } = useSelector(
    (state) => state.soundNotificationSlice
  );
// /admin/orders/6a3bfa7a6879a2e664937bec
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ x: 100, opacity: 0, scale: 0.9 }}
          animate={{ x: 0, opacity: 1, scale: 1 }}
          exit={{ x: -100, opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.25 }}
          style={{
            position: "fixed",
            top: 20,
            left: 20,
            minWidth: "280px",
            background: "linear-gradient(135deg, #16a34a, #22c55e)",
            color: "white",
            padding: "14px 16px",
            borderRadius: "14px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "10px",
            zIndex: 9999,
          }}
        >
          {/* message */}
          <div style={{ fontWeight: "500", fontSize: "14px" }}>
            🛒 {message}
          </div>

          {/* close button */}
          <button
            onClick={() => dispatch(hide())}
            style={{
              background: "rgba(255,255,255,0.2)",
              border: "none",
              color: "white",
              width: "28px",
              height: "28px",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            ✕
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}