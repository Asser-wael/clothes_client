import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { getAllProducts, setCat } from "../../features/productsSlice";
import { getAllCategories } from "../../features/customuseSlice";
import { setView } from "../../features/usersSlice";
import UserView from "../../components/UserView";
import { addToCart } from "../../features/cartSlice";
import { setNotification } from "../../features/notificationSlice";
import { CiHeart, CiSearch } from "react-icons/ci";

export default function Products() {
  const dispatch = useDispatch();
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState(null);

  const { products, loadingProducts, cat } = useSelector(
    (state) => state.productsSlice
  );

  const { categories, loadingCategories } = useSelector(
    (state) => state.customuseSlice
  );

  const { view } = useSelector((state) => state.usersSlice);

  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("wishlist")) || [];
    setWishlist(stored);
  }, []);

  const toggleWishlist = (productId) => {
    setWishlist((prev) => {
      const updated = prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId];
      localStorage.setItem("wishlist", JSON.stringify(updated));
      return updated;
    });
  };

  const isInWishlist = (productId) => wishlist.includes(productId);

  const filteredProducts = products?.filter((product) => {
    const text = search.toLowerCase();
    const matchesSearch =
      product.name?.toLowerCase().includes(text) ||
      product.description?.toLowerCase().includes(text) ||
      product.Category?.toLowerCase().includes(text);
    const matchesCategory = cat === "All" || product.Category === cat;
    return matchesSearch && matchesCategory;
  });

  useEffect(() => {
    dispatch(getAllProducts());
    dispatch(getAllCategories());
  }, [dispatch]);

  if (view) {
    return <UserView />;
  }

  return (
    <div className="mx-auto max-w-screen-2xl px-4 py-6">
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-6"
      >
        <h1 className="text-3xl font-bold tracking-tight text-[var(--color-text)]">
          Our Products
        </h1>
        <p className="mt-1 text-sm text-[var(--color-muted)]">
          Browse our full collection, made just for you.
        </p>

        {/* Search */}
        <div className="mt-4 flex w-full max-w-sm items-center gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] px-3 py-2 transition-colors duration-150 focus-within:border-accent">
          <CiSearch className="shrink-0 text-xl text-[var(--color-muted)]" />
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-transparent text-sm text-[var(--color-text)] outline-none placeholder:text-[var(--color-muted)]"
          />
        </div>
      </motion.div>

      {/* Category filters */}
      <div className="mb-6 flex flex-wrap gap-2">
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          onClick={() => dispatch(setCat("All"))}
          className={`cursor-pointer rounded-full border px-4 py-1.5 text-sm font-medium transition-colors duration-150 ${
            cat === "All"
              ? "border-accent bg-accent text-white"
              : "border-[var(--color-border)] bg-[var(--color-card)] text-[var(--color-text)] hover:border-accent hover:text-accent"
          }`}
        >
          ALL
        </motion.button>

        {loadingCategories
          ? Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="h-8 w-20 animate-pulse rounded-full bg-[var(--color-card)]"
              />
            ))
          : categories?.length > 0
          ? categories.map((category, index) => (
              <motion.button
                key={category._id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.25, delay: index * 0.04 }}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => dispatch(setCat(category.name))}
                className={`cursor-pointer rounded-full border px-4 py-1.5 text-sm font-medium transition-colors duration-150 ${
                  cat === category.name
                    ? "border-accent bg-accent text-white"
                    : "border-[var(--color-border)] bg-[var(--color-card)] text-[var(--color-text)] hover:border-accent hover:text-accent"
                }`}
              >
                {category.name.toUpperCase()}
              </motion.button>
            ))
          : <p className="text-sm text-[var(--color-muted)]">No categories found</p>}
      </div>

      {/* Products grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5"
      >
        {loadingProducts &&
          Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="h-[140px] w-full animate-pulse rounded-2xl bg-[var(--color-card)] lg:h-[340px]"
            />
          ))}

        {!loadingProducts &&
          filteredProducts?.map((product, index) => {
            const firstSize = product.sizes?.[0];
            const effectivePrice = product.offer
              ? firstSize?.priceOffer
              : firstSize?.price;

            return (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: index * 0.04 }}
                whileHover={{ y: -4 }}
                className="group flex w-full flex-row overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] transition-all duration-200 hover:border-accent/40 hover:shadow-md lg:flex-col"
              >
                {/* Image Container (مضبوط بالكامل ومستقر الأبعاد) */}
                <div className="relative m-2 h-[120px] w-[120px] shrink-0 cursor-pointer overflow-hidden rounded-xl bg-neutral-100 lg:m-0 lg:aspect-[4/3] lg:h-auto lg:w-full lg:rounded-none">
                  <img
                    onClick={() => dispatch(setView(product))}
                    src={`${import.meta.env.VITE_API_URL}/uploads/${product.image}`}
                    alt={product.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {product.offer && (
                    <span className="absolute left-2 top-2 z-10 rounded-full bg-red-500 px-2 py-0.5 text-[10px] font-bold text-white shadow-sm">
                      OFFER
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="flex min-w-0 flex-1 flex-col justify-between p-3 lg:p-4">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="line-clamp-1 text-sm font-semibold leading-snug text-[var(--color-text)] lg:text-base">
                        {product.name}
                      </h3>
                      <button
                        onClick={() => toggleWishlist(product._id)}
                        className="shrink-0 rounded-full p-1 transition-colors hover:bg-[var(--color-border)]"
                        aria-label="Toggle wishlist"
                      >
                        <CiHeart
                          className={`text-xl transition-colors duration-150 ${
                            isInWishlist(product._id)
                              ? "text-red-500"
                              : "text-[var(--color-muted)]"
                          }`}
                        />
                      </button>
                    </div>

                    {/* Description - Desktop */}
                    <p className="mt-1 hidden text-xs leading-relaxed text-[var(--color-muted)] lg:block">
                      {expandedId === product._id
                        ? product.description
                        : `${product.description?.slice(0, 80)}${
                            product.description?.length > 80 ? "..." : ""
                          }`}
                    </p>

                    {product.description?.length > 80 && (
                      <button
                        onClick={() =>
                          setExpandedId(
                            expandedId === product._id ? null : product._id
                          )
                        }
                        className="mt-1 hidden text-[11px] font-semibold text-accent hover:underline lg:block"
                      >
                        {expandedId === product._id ? "Show Less" : "Read More"}
                      </button>
                    )}

                    {/* Category - Mobile only */}
                    <span className="mt-1 inline-block rounded-full bg-accent/10 px-2 py-0.5 text-[11px] font-medium text-accent lg:hidden">
                      {product.Category}
                    </span>
                  </div>

                  {/* Bottom row: price + button */}
                  <div className="mt-2 flex items-center justify-between gap-2 lg:mt-4">
                    <div>
                      <p className="mb-0.5 text-[10px] leading-none text-[var(--color-muted)]">
                        {firstSize?.name}
                      </p>
                      {product.offer ? (
                        <div className="flex items-baseline gap-1.5">
                          <p className="text-[11px] leading-none text-[var(--color-muted)] line-through">
                            {firstSize?.price} L.E
                          </p>
                          <p className="text-base font-bold leading-none text-red-500 lg:text-lg">
                            {firstSize?.priceOffer}
                            <span className="ml-0.5 text-xs font-normal">L.E</span>
                          </p>
                        </div>
                      ) : (
                        <p className="text-base font-bold leading-none text-accent lg:text-lg">
                          {firstSize?.price}
                          <span className="ml-0.5 text-xs font-normal">L.E</span>
                        </p>
                      )}
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.93 }}
                      onClick={() => {
                        dispatch(
                          addToCart({
                            _id: product._id,
                            name: product.name,
                            image: product.image,
                            size: firstSize?.name,
                            price: effectivePrice,
                          })
                        );
                        dispatch(
                          setNotification({
                            message: `${product.name} added to cart`,
                            type: "success",
                          })
                        );
                      }}
                      className="shrink-0 rounded-lg bg-accent px-3 py-1.5 text-xs font-medium text-white transition-colors duration-150 hover:bg-orange-600 lg:px-4 lg:py-2"
                    >
                      Add
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            );
          })}
      </motion.div>

      {/* Empty state */}
      {!loadingProducts && filteredProducts?.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-[var(--color-muted)]">
          <p className="mb-3 text-4xl">🛍️</p>
          <p className="text-sm">No products match your search.</p>
        </div>
      )}
    </div>
  );
}