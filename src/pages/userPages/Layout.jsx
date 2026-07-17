import React, { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import ToggleButton from "../../components/ToggleButton";
import { MdMenu, MdClose } from "react-icons/md";
import { RiAdminFill } from "react-icons/ri";
import { clearView } from "../../features/usersSlice";
import { useDispatch, useSelector } from "react-redux";
import { MdOutlineShoppingBag } from "react-icons/md";
const TICKER_TEXT = "Curated daily  ·  Sourced with care  ·  Delivered fresh  ·  ";

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();

  const menuItems = [
    { id: 1, title: "Home", to: "/" },
    { id: 2, title: "Products", to: "/products" },
    { id: 3, title: "Offers", to: "/offers" },
    { id: 4, title: "Favorites", to: "/favorites" },
    { id: 5, title: "Cart", to: "/cart" },
    { id: 6, title: "Orders", to: "/orders" },
  ];

  const token = localStorage.getItem("accessToken");
  const { cart } = useSelector((state) => state.cartSlice);


  useEffect(() => {
    dispatch(clearView());
  }, [location.pathname, dispatch]);
  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)]">
      {/* Ticker */}
      <div className="overflow-hidden border-b border-[var(--color-border)] bg-[var(--color-accent)] py-1.5">
        <div className="ticker-track flex whitespace-nowrap text-[11px] font-medium uppercase tracking-[0.2em] text-[var(--color-bg)]">
          <span className="px-2">
            {TICKER_TEXT.repeat(8)}
          </span>
          <span className="px-2" aria-hidden="true">
            {TICKER_TEXT.repeat(8)}
          </span>
        </div>
      </div>

      {/* Nav */}
      <nav className="sticky top-0 z-30 border-b border-[var(--color-border)] bg-[var(--color-card)]/95 backdrop-blur">
        <div className="mx-auto flex h-[72px] items-center justify-between px-6 lg:px-10">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setOpen(true)}
              className="text-2xl lg:hidden"
              aria-label="Open menu"
            >
              <MdMenu />
            </button>

            <h1
              onClick={() => navigate("/")}
              className="cursor-pointer font-serif text-2xl italic tracking-tight text-[var(--color-text)] sm:text-[26px]"
            >
              Provisions&nbsp;Co.
            </h1>
          </div>

          {/* Desktop Menu */}
          <div className="hidden items-center gap-8 lg:flex">
            {menuItems.map((item) => {
              const active = location.pathname === item.to;
              return (
                <button
                  key={item.id}
                  onClick={() => navigate(item.to)}
                  className={`relative py-2 text-[13px] font-medium uppercase tracking-[0.14em] transition-colors ${active
                    ? "text-[var(--color-text)]"
                    : "text-[var(--color-muted)] hover:text-[var(--color-text)]"
                    }`}
                >
                  {item.title}
                  {active && (
                    <span className="absolute -bottom-[1px] left-0 h-[1.5px] w-full bg-[var(--color-accent)]" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Right */}
          <div className="flex items-center gap-5">
            {token && (
              <RiAdminFill
                onClick={() => navigate("/admin")}
                className="cursor-pointer text-lg text-[var(--color-muted)] transition-colors hover:text-[var(--color-text)]"
              />
            )}

            <div className="relative">
              <MdOutlineShoppingBag
                onClick={() => navigate("/cart")}
                className={`cursor-pointer text-lg transition-colors ${location.pathname === "/cart"
                  ? "text-[var(--color-accent)]"
                  : "text-[var(--color-muted)] hover:text-[var(--color-text)]"
                  }`}
              />
              {cart.length > 0 && (
                <span className="absolute -right-2 -top-2 flex h-[16px] min-w-[16px] items-center justify-center rounded-full bg-[var(--color-accent)] px-1 text-[9px] font-semibold text-[var(--color-bg)]">
                  {cart.length}
                </span>
              )}
            </div>

            <ToggleButton />
          </div>
        </div>
      </nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-40 bg-black/40 lg:hidden"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.28, ease: "easeOut" }}
              className="fixed left-0 top-0 z-50 h-screen w-72 border-r border-[var(--color-border)] bg-[var(--color-card)] lg:hidden"
            >
              <div className="p-6">
                <div className="mb-10 flex items-center justify-between">
                  <span
                    className="cursor-pointer font-serif text-2xl italic text-[var(--color-text)]"
                    onClick={() => {
                      goHome();
                      setOpen(false);
                    }}
                  >
                    Provisions&nbsp;Co.
                  </span>
                  <button onClick={() => setOpen(false)} className="text-2xl" aria-label="Close menu">
                    <MdClose />
                  </button>
                </div>

                <div className="flex flex-col">
                  {menuItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        if (item.to === "/") dispatch(clearView());
                        navigate(item.to);
                        setOpen(false);
                      }}
                      className={`border-b border-[var(--color-border)] py-4 text-left text-[13px] font-medium uppercase tracking-[0.14em] ${location.pathname === item.to
                        ? "text-[var(--color-text)]"
                        : "text-[var(--color-muted)]"
                        }`}
                    >
                      {item.title}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <main>
        <Outlet />
      </main>
      {/* here */}
      <style>{`
        .ticker-track {
          width: max-content;
          animation: ticker-scroll 28s linear infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .ticker-track { animation: none; }
        }
        @keyframes ticker-scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .font-serif {
          font-family: "Fraunces", serif;
        }
      `}</style>
    </div>
  );
}