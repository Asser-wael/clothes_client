import React from "react";
import { motion } from "framer-motion";
import { BiSolidMessageAltError } from "react-icons/bi";
import { useNavigate } from "react-router-dom";

export default function Error() {
  const navigate = useNavigate();

  return (
    <div className="w-full min-h-screen bg-[var(--color-bg)] flex items-center justify-center px-4 overflow-hidden relative">

      {/* Glow Background */}
      <div className="absolute w-[500px] h-[500px] bg-[var(--color-accent)]/10 blur-[120px] rounded-full" />

      <motion.div
        initial={{ opacity: 0, scale: 0.7, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="
          relative z-10
          w-full max-w-xl
          bg-[var(--color-card)]/80 backdrop-blur-2xl
          border border-[var(--color-border)]
          rounded-3xl
          p-10
          flex flex-col items-center
          text-center
          shadow-[0_0_40px_rgba(0,0,0,0.15)]
        "
      >

        {/* ICON */}
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="
            text-[var(--color-accent)] text-8xl
            drop-shadow-[0_0_20px_rgba(0,0,0,0.25)]
          "
        >
          <BiSolidMessageAltError />
        </motion.div>

        {/* TITLE */}
        <h1
          className="
            mt-6 text-4xl md:text-5xl
            font-extrabold tracking-[4px]
            text-[var(--color-text)]
          "
        >
          404 ERROR
        </h1>

        {/* TEXT */}
        <p className="mt-4 text-[var(--color-muted)] text-sm md:text-base max-w-md leading-7">
          The page you are looking for does not exist or has been moved.
        </p>

        {/* BUTTON */}
        <motion.button
          whileHover={{
            scale: 1.05,
            boxShadow: "0 0 25px rgba(0,0,0,0.2)",
          }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/")}
          className="
            mt-8 px-8 py-3 rounded-2xl
            bg-[var(--color-card)]
            border border-[var(--color-border)]
            text-[var(--color-accent)] font-semibold
            backdrop-blur-xl
            transition-all
          "
        >
          Back Home
        </motion.button>
        <motion.button
          whileHover={{
            scale: 1.05,
            boxShadow: "0 0 25px rgba(0,0,0,0.2)",
          }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate(-1)}
          className="
            mt-8 px-8 py-3 rounded-2xl
            bg-[var(--color-card)]
            border border-[var(--color-border)]
            text-[var(--color-accent)] font-semibold
            backdrop-blur-xl
            transition-all
          "
        >
          Back to last page
        </motion.button>
      </motion.div>
    </div>
  );
}