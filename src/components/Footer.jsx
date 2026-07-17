import { FaGamepad, FaPhone, FaUser, FaCrown } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function Footer() {
  const navigate = useNavigate();

  const navItems = [
    { name: "HOME", path: "/home" },
    { name: "GAMES", path: "/games" },
    { name: "DEALS", path: "/deals" },
    { name: "ORDERS", path: "/orders" },
  ];

  return (
    <footer className="w-full bg-black text-white border-t border-white/10 mt-20">
      
      <div className="max-w-7xl mx-auto px-6 py-12 grid md:grid-cols-3 gap-10">

        {/* ================= BRAND ================= */}
        <div>
          <div className="flex items-center gap-2 text-green-400 text-2xl font-black">
            <FaGamepad />
            GAME STORE
          </div>

          <p className="text-zinc-400 text-sm mt-4 leading-relaxed">
            Premium gaming platform for buying accounts,
            <br /> deals and games instantly.
          </p>
        </div>

        {/* ================= NAV ================= */}
        <div>
          <h3 className="text-lg font-bold mb-4 text-green-400">
            Navigation
          </h3>

          <div className="flex flex-col gap-2">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => navigate(item.path)}
                className="text-zinc-400 hover:text-green-400 transition text-left"
              >
                {item.name}
              </button>
            ))}
          </div>
        </div>

        {/* ================= INFO ================= */}
        <div className="space-y-4">

          <h3 className="text-lg font-bold text-green-400">
            Developers & Owner
          </h3>

          {/* OWNER */}
          <div className="flex items-center gap-2 text-zinc-300">
            <FaCrown className="text-yellow-400" />
            <span>Owner: Moataz</span>
          </div>
          <div className="flex items-center gap-2 text-zinc-300">
            <FaPhone className="text-blue-400" />
            
            <span>:01111191289</span>
          </div>

          {/* DEVELOPER */}
          <div className="flex items-center gap-2 text-zinc-300">
            <FaUser className="text-green-400" />
            <span>Developer: Asser Wael</span>
          </div>

          {/* PHONE */}
          <div className="flex items-center gap-2 text-zinc-300">
            <FaPhone className="text-blue-400" />
            <span>01129691951</span> (dev)
          </div>

        </div>
      </div>

      {/* ================= BOTTOM BAR ================= */}
      <div className="border-t border-white/10 py-4 text-center text-zinc-500 text-sm">
        © {new Date().getFullYear()} Game Store. All rights reserved.
      </div>
    </footer>
  );
}