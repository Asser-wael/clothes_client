import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearNotification } from "../features/notificationSlice";
import { motion, AnimatePresence } from "framer-motion";

import {
  FaCheckCircle,
  FaTimesCircle,
  FaInfoCircle,
  FaExclamationTriangle,
  FaFirstOrder
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

  const styles = {
    success: {
      bg: "bg-green-500/10",
      border: "border-green-500/30",
      icon: FaCheckCircle,
      iconColor: "text-green-500",
    },
    error: {
      bg: "bg-red-500/10",
      border: "border-red-500/30",
      icon: FaTimesCircle,
      iconColor: "text-red-500",
    },
    order: {
      bg: "bg-blue-500/10",
      border: "border-red-blue/30",
      icon: FaFirstOrder,
      iconColor: "text-white-500",
    },
    info: {
      bg: "bg-sky-500/10",
      border: "border-sky-500/30",
      icon: FaInfoCircle,
      iconColor: "text-sky-500",
    },
    warning: {
      bg: "bg-yellow-500/10",
      border: "border-yellow-500/30",
      icon: FaExclamationTriangle,
      iconColor: "text-yellow-500",
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
          className={`
            fixed top-5 right-5 z-50
            flex items-center gap-3 px-4 py-3 rounded-xl
            border backdrop-blur-md shadow-xl
            bg-[var(--color-card)] text-[var(--color-text)]
            ${toast.bg} ${toast.border}
          `}
        >
          <Icon className={`text-lg ${toast.iconColor}`} />
          <span className="text-sm font-medium">{message}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}