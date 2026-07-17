import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { motion } from "framer-motion";
import { CiHeart } from "react-icons/ci";

import { getAllProducts } from "../../features/productsSlice";
import { setView } from "../../features/usersSlice";
import UserView from "../../components/UserView";

export default function Favorites() {
  const dispatch = useDispatch();

  const { Products = [] } = useSelector((state) => state.productsSlice);
  const { view } = useSelector((state) => state.usersSlice);

  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    dispatch(getAllProducts());

    const stored = JSON.parse(localStorage.getItem("wishlist") || "[]");
    setWishlist(stored);
  }, [dispatch]);

  const toggleWishlist = (productId) => {
    setWishlist((prev) => {
      let updated;

      if (prev.includes(productId)) {
        updated = prev.filter((id) => id !== productId);
      } else {
        updated = [...prev, productId];
      }

      localStorage.setItem("wishlist", JSON.stringify(updated));

      return updated;
    });
  };

  const wishlistProducts = Products.filter((product) =>
    wishlist.includes(product._id)
  );

  if (view) {
    return <UserView />;
  }

  return (
    <div className="p-4">
      {wishlistProducts.length === 0 ? (
        <div className="mt-20 text-center text-[var(--color-muted)]">
          <CiHeart className="mx-auto mb-4 text-6xl" />
          <p>No favorite products yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 justify-items-center sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
          {wishlistProducts.map((product, index) => (
            <motion.div
              key={product._id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.4,
                delay: index * 0.05,
              }}
              className="flex w-full max-w-[320px] flex-col overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] shadow-sm"
            >
              <div className="relative h-[220px] w-full">
                <img
                  src={`${import.meta.env.VITE_API_URL}/uploads/${product.image}`}
                  alt={product.name}
                  className="h-full w-full object-cover"
                />

                <button
                  onClick={() => toggleWishlist(product._id)}
                  className="absolute right-3 top-3 rounded-full bg-white p-2 shadow"
                >
                  <CiHeart
                    className={`text-2xl ${
                      wishlist.includes(product._id)
                        ? "text-red-500"
                        : "text-gray-400"
                    }`}
                  />
                </button>
              </div>

              <div className="flex flex-1 flex-col justify-between p-4">
                <div>
                  <h3 className="text-lg font-bold text-[var(--color-text)]">
                    {product.name}
                  </h3>

                  <p className="mt-2 line-clamp-2 text-sm text-[var(--color-muted)]">
                    {product.description}
                  </p>
                </div>

                <div className="mt-5 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-[var(--color-muted)]">
                      {product.sizes?.[0]?.name}
                    </span>

                    <div className="text-xl font-bold text-[var(--color-accent)]">
                      {product.sizes?.[0]?.price} L.E
                    </div>
                  </div>

                  <button
                    onClick={() => dispatch(setView(product))}
                    className="rounded-lg bg-[var(--color-accent)] px-4 py-2 text-sm text-white"
                  >
                    View
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}