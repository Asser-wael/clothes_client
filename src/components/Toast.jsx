import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearNotification } from "../features/notificationSlice";
import { motion, AnimatePresence } from "framer-motion";

import {
  FaCheckCircle,
  FaTimesCircle,
  FaInfoCircle,
  FaExclamationTriangle,
  FaFirstOrder,
} from "react-icons/fa";

export default function Toast() {
  const dispatch = useDispatch();
  const { message, type, visible } = useSelector(
    (state) => state.notification
  );

  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => {
        dispatch(clearNotification());
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [visible, dispatch]);

  // ألوان متسقة مع الـ theme بتاع الموقع (--color-*)
  // بدل الألوان العشوائية الشفافة، بقى كل نوع عنده لون تمييز بسيط
  // (أيقونة + شريط جانبي) فوق كارت محايد بألوان الـ theme.
  const styles = {
    success: {
      icon: FaCheckCircle,
      accent: "#3F8F5F",
    },
    error: {
      icon: FaTimesCircle,
      accent: "#C1483D",
    },
    order: {
      icon: FaFirstOrder,
      accent: "var(--color-accent)",
    },
    info: {
      icon: FaInfoCircle,
      accent: "#4A8FBF",
    },
    warning: {
      icon: FaExclamationTriangle,
      accent: "#C99A3E",
    },
  };

  const toast = styles[type] || styles.info;
  const Icon = toast.icon;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          className="fixed right-5 top-5 z-50 flex max-w-xs items-center gap-3 border border-[var(--color-border)] bg-[var(--color-card)] py-3 pl-4 pr-5 text-[var(--color-text)] shadow-xl sm:max-w-sm"
          style={{ borderLeft: `3px solid ${toast.accent}` }}
        >
          <Icon className="shrink-0 text-lg" style={{ color: toast.accent }} />
          <span className="text-[13px] font-medium leading-snug">{message}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}