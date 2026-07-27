import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FaInstagram, FaTwitter, FaFacebookF } from "react-icons/fa";

export default function Footer() {
  const navigate = useNavigate();

  const links = [
    { id: 1, title: "Home", to: "/" },
    { id: 2, title: "Products", to: "/products" },
    { id: 3, title: "Offers", to: "/offers" },
    { id: 4, title: "Orders", to: "/orders" },
  ];

  return (
    <motion.footer
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="border-t border-[var(--color-border)] bg-[var(--color-card)]"
    >
      <div className="mx-auto flex flex-col gap-8 px-6 py-12 lg:px-10">
        <div className="flex flex-col items-start justify-between gap-8 sm:flex-row sm:items-center">
          <h2
            onClick={() => navigate("/")}
            className="cursor-pointer font-serif text-2xl italic tracking-tight text-[var(--color-text)]"
          >
            Provisions&nbsp;Co.
          </h2>

          <div className="flex flex-wrap items-center gap-6">
            {links.map((item) => (
              <button
                key={item.id}
                onClick={() => navigate(item.to)}
                className="text-[12px] font-medium uppercase tracking-[0.14em] text-[var(--color-muted)] transition-colors hover:text-[var(--color-text)]"
              >
                {item.title}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <a
              href="#"
              aria-label="Instagram"
              className="text-[15px] text-[var(--color-muted)] transition-colors hover:text-[var(--color-text)]"
            >
              <FaInstagram />
            </a>
            <a
              href="#"
              aria-label="Twitter"
              className="text-[15px] text-[var(--color-muted)] transition-colors hover:text-[var(--color-text)]"
            >
              <FaTwitter />
            </a>
            <a
              href="#"
              aria-label="Facebook"
              className="text-[15px] text-[var(--color-muted)] transition-colors hover:text-[var(--color-text)]"
            >
              <FaFacebookF />
            </a>
          </div>
        </div>

        <div className="flex flex-col items-start justify-between gap-3 border-t border-[var(--color-border)] pt-6 sm:flex-row sm:items-center">
          <p className="text-[11px] uppercase tracking-[0.14em] text-[var(--color-muted)]">
            © {new Date().getFullYear()} Provisions Co. All rights reserved.
          </p>
          <p className="text-[11px] uppercase tracking-[0.14em] text-[var(--color-muted)]">
            Curated daily · Delivered fresh
          </p>
        </div>
      </div>

      <style>{`
        .font-serif {
          font-family: "Fraunces", serif;
        }
      `}</style>
    </motion.footer>
  );
}
