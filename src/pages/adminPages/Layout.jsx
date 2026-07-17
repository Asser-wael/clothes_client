import React, { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  MdDashboard,
  MdShoppingCart,
  MdPeople,
  MdMenu,
  MdDashboardCustomize,
  MdLogout,
} from "react-icons/md";
import { BiPackage } from "react-icons/bi";
import { FaPager } from "react-icons/fa";
import { motion } from "framer-motion";
import { useDispatch } from "react-redux";
import { logoutUser } from "../../features/authSlice";
import ThemeToggle from "../../components/ToggleButton";
import { IoIosNotifications } from "react-icons/io";
export default function Layout() {
  const [open, setOpen] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { id: 1, title: "Dashboard", icon: <MdDashboard />, to: "/admin" },
    { id: 2, title: "Products", icon: <BiPackage />, to: "/admin/Products" },
    { id: 3, title: "Orders", icon: <MdShoppingCart />, to: "/admin/orders" },
    { id: 4, title: "Users", icon: <MdPeople />, to: "/admin/users" },
    { id: 5, title: "Customuse", icon: <MdDashboardCustomize />, to: "/admin/customuse" },
    { id: 6, title: "Notifications", icon: <IoIosNotifications  />, to: "/admin/notificationsAdmin" },
    { id: 7, title: "Home", icon: <FaPager />, to: "/" },
  ];

  return (
    <div className="flex h-screen bg-[var(--color-bg)] text-[var(--color-text)]">
      {/* SIDEBAR */}
      <div
        className={`flex flex-col border-r border-border p-3 transition-all duration-300
        ${open ? "w-64 max-sm:w-50" : "w-20"}`}
      >
        {/* TOP */}
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-6 flex items-center justify-between"
        >
          <motion.button
            onClick={() => setOpen(!open)}
            className="rounded-lg p-2 text-2xl hover:bg-[var(--color-card)]"
          >
            <MdMenu />
          </motion.button>

          {open && <ThemeToggle />}
        </motion.div>

        {/* MENU */}
        <div className="flex flex-1 flex-col gap-2">
          {menuItems.map((item, index) => (
            <motion.div
              key={item.id}
              onClick={() => navigate(item.to)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.05 }}
              className={`flex cursor-pointer items-center gap-4 rounded-xl p-3 transition
                ${
                  location.pathname === item.to
                    ? "border-l-2 bg-[var(--color-card)] text-[var(--color-accent)]"
                    : "text-[var(--color-muted)] hover:bg-[var(--color-card)]"
                }`}
            >
              <span className="text-xl">{item.icon}</span>
              {open && <span className="font-medium">{item.title}</span>}
            </motion.div>
          ))}
        </div>

        {/* LOGOUT */}
        <motion.button
          onClick={async () => {
            try {
              await dispatch(logoutUser()).unwrap();
              window.location.reload();
              navigate("/");
            } catch (error) {
              console.log(error);
            }
          }}
          className="flex items-center gap-4 rounded-xl p-3 text-red-500 transition hover:bg-red-500/10"
        >
          <MdLogout className="text-xl" />
          {open && <span>Logout</span>}
        </motion.button>
      </div>

      {/* CONTENT */}
      <div className="flex-1 overflow-auto bg-[var(--color-bg)] p-4">
        <Outlet />
      </div>
    </div>
  );
}