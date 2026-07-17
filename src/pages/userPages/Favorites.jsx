import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { motion } from "framer-motion";
import { CiHeart } from "react-icons/ci";

import { getAllProducts } from "../../features/productsSlice";
import { setView } from "../../features/usersSlice";
import UserView from "../../components/UserView";

export default function Favorites() {
  const dispatch = useDispatch();

  // FIX: كانت "Products" بحرف كبير وده مش موجود في الـ state أصلاً
  // (الاسم الصح في productsSlice هو "products")، فكانت الصفحة
  // دايمًا فاضية حتى لو فيه منتجات محفوظة في الـ wishlist.
  const { products = [] } = useSelector((state) => state.productsSlice);
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

  const wishlistProducts = products.filter((product) =>
    wishlist.includes(product._id)
  );

  if (view) {
    return <UserView />;
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 text-[var(--color-text)] sm:px-5 sm:py-10 md:px-8">
      <div className="mb-8 border-b border-[var(--color-border)] pb-8">
        <h1 className="font-serif text-[26px] italic text-[var(--color-text)] sm:text-[32px] md:text-[38px]">
          Favorites
        </h1>
        <p className="mt-1 text-[13px] text-[var(--color-muted)]">
          {wishlistProducts.length} saved item{wishlistProducts.length !== 1 ? "s" : ""}
        </p>
      </div>

      {wishlistProducts.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 border border-[var(--color-border)] px-4 py-16 text-center text-[var(--color-muted)] sm:py-24">
          <CiHeart className="text-6xl opacity-40" />
          <p className="text-sm">No favorite products yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-px border border-[var(--color-border)] bg-[var(--color-border)] sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {wishlistProducts.map((product, index) => {
            const size = product.sizes?.[0];
            const hasOffer =
              size?.priceOffer !== undefined &&
              size?.priceOffer !== null &&
              size?.priceOffer !== "";

            return (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: index * 0.05, ease: "easeOut" }}
                className="group flex flex-col bg-[var(--color-card)]"
              >
                <div className="relative aspect-[4/5] w-full overflow-hidden">
                  <img
                    src={`${import.meta.env.VITE_API_URL}/uploads/${product.image}`}
                    alt={product.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />

                  {hasOffer && (
                    <span className="absolute left-3 top-3 bg-red-500 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-white">
                      Offer
                    </span>
                  )}

                  <button
                    onClick={() => toggleWishlist(product._id)}
                    className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-[var(--color-bg)] shadow-sm transition hover:scale-105"
                    aria-label="Toggle favorite"
                  >
                    <CiHeart
                      className={`text-xl ${
                        wishlist.includes(product._id)
                          ? "text-red-500"
                          : "text-[var(--color-muted)]"
                      }`}
                    />
                  </button>
                </div>

                <div className="flex flex-1 flex-col p-4 sm:p-5">
                  <h3 className="text-[15px] font-semibold text-[var(--color-text)] sm:text-[16px]">
                    {product.name}
                  </h3>

                  <p className="mt-1 line-clamp-2 text-[13px] text-[var(--color-muted)]">
                    {product.description}
                  </p>

                  <div className="mt-4 flex flex-1 items-end justify-between gap-3 border-t border-[var(--color-border)] pt-4">
                    <div>
                      {size?.name && (
                        <span className="block text-[11px] text-[var(--color-muted)]">
                          {size.name}
                        </span>
                      )}

                      {hasOffer ? (
                        <div className="flex items-baseline gap-2">
                          <span className="text-[13px] text-[var(--color-muted)] line-through">
                            {size.price} L.E
                          </span>
                          <span className="text-[18px] font-bold text-red-500">
                            {size.priceOffer} L.E
                          </span>
                        </div>
                      ) : (
                        <div className="text-[18px] font-bold text-[var(--color-accent)]">
                          {size?.price} L.E
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => dispatch(setView(product))}
                      className="shrink-0 whitespace-nowrap border border-[var(--color-text)] px-4 py-2 text-[12px] font-semibold uppercase tracking-[0.08em] text-[var(--color-text)] transition-colors hover:bg-[var(--color-text)] hover:text-[var(--color-bg)]"
                    >
                      View
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      <style>{`
        .font-serif { font-family: "Fraunces", serif; }
      `}</style>
    </div>
  );
}