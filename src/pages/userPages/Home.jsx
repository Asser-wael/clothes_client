import { FaTruckFast, FaShirt, FaRegCreditCard, FaTrophy } from "react-icons/fa6";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { getAllProducts, setCat } from "../../features/productsSlice";
import { getOffers, getPopularProducts, getAllCategories } from "../../features/customuseSlice";
import { setView } from "../../features/usersSlice";
import UserView from "../../components/UserView";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

export default function Home() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [viewAll, setViewAll] = useState(false);

  const {
    categories = [],
    offers,
    popularProducts,
    loadingCategories,
    loadingPopular,
  } = useSelector((state) => state.customuseSlice);

  const { view } = useSelector((state) => state.usersSlice);

  useEffect(() => {
    dispatch(getOffers());
    dispatch(getAllProducts());
    dispatch(getAllCategories());
    dispatch(getPopularProducts());
  }, [dispatch]);

  const features = [
    { id: 1, icon: <FaTruckFast size={18} />, title: "Fast delivery", desc: "On time, every time" },
    { id: 2, icon: <FaShirt size={18} />, title: "Premium fabric", desc: "Finished with care" },
    { id: 3, icon: <FaRegCreditCard size={18} />, title: "Secure payment", desc: "100% protected" },
    { id: 4, icon: <FaTrophy size={18} />, title: "Best craftsmanship", desc: "Built to last" },
  ];

  if (view) {
    return <UserView />;
  }

  return (
    <section className="mx-auto w-full max-w-[1400px] px-5 py-14 sm:px-8 lg:px-14">
      {/* Hero */}
      <div className="grid w-full grid-cols-1 gap-14 lg:grid-cols-[1.1fr_0.9fr] lg:gap-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col justify-center"
        >
          <span className="mb-5 text-[12px] font-semibold uppercase tracking-[0.22em] text-[var(--color-accent)]">
            The season&rsquo;s edit
          </span>

          <h1 className="font-serif text-[42px] italic leading-[1.08] tracking-tight text-[var(--color-text)] sm:text-[56px] lg:text-[64px]">
            Considered style,
            <br />
            made to last.
          </h1>

          <p className="mt-6 max-w-md text-[15px] leading-relaxed text-[var(--color-muted)] sm:text-base">
            A small, thoughtfully made collection — chosen for quality first,
            not trends. Every piece is cut and finished the way we&rsquo;d wear it ourselves.
          </p>

          <button
            onClick={() => navigate("/products")}
            className="mt-9 w-fit border border-[var(--color-text)] px-8 py-3.5 text-[13px] font-semibold uppercase tracking-[0.14em] text-[var(--color-text)] transition-colors hover:bg-[var(--color-text)] hover:text-[var(--color-bg)]"
          >
            Browse the selection
          </button>
        </motion.div>

        {/* Offers list */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="flex flex-col divide-y divide-[var(--color-border)] border-y border-[var(--color-border)]"
        >
          {offers?.length === 0 ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-20 animate-pulse bg-[var(--color-card)]" />
            ))
          ) : (
            offers?.map((offer, index) => (
              <motion.div
                key={offer._id || index}
                variants={fadeUp}
                onClick={() => dispatch(setView(offer))}
                className="group flex cursor-pointer items-center gap-4 py-5"
              >
                <span className="w-8 shrink-0 font-serif text-sm italic text-[var(--color-muted)]">
                  {String(index + 1).padStart(2, "0")}
                </span>

                <div className="h-14 w-14 shrink-0 overflow-hidden bg-[var(--color-card)]">
                  <img
                    src={`${import.meta.env.VITE_API_URL}/uploads/${offer?.image}`}
                    alt=""
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                <div className="flex min-w-0 flex-1 flex-col">
                  <h3 className="truncate text-[15px] font-semibold text-[var(--color-text)]">
                    {offer.name || "Special offer"}
                  </h3>
                  <p className="line-clamp-1 text-[13px] text-[var(--color-muted)]">
                    {offer.description || "A limited-time selection"}
                  </p>
                </div>

                {offer.offer ==true && (
                  <div className="flex items-center gap-2">
                    {offer.name}
                    <span className="text-gray-400 line-through">
                      {offer.sizes[0].price}
                    </span>

                    <span className="font-semibold text-[var(--color-accent)]">
                      {offer.sizes[0].priceOffer}
                    </span>
                  </div>
                )}
              </motion.div>
            ))
          )}
        </motion.div>
      </div>

      {/* Features */}
      <motion.div
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.4 }}
        className="mt-16 flex w-full flex-wrap gap-x-10 gap-y-6 border-y border-[var(--color-border)] py-8"
      >
        {features.map((item, i) => (
          <motion.div
            variants={fadeUp}
            key={item.id}
            className={`flex flex-1 min-w-[220px] items-center gap-3 ${i > 0 ? "sm:border-l sm:border-[var(--color-border)] sm:pl-10" : ""
              }`}
          >
            <span className="text-[var(--color-accent)]">{item.icon}</span>
            <div>
              <h4 className="text-[14px] font-semibold text-[var(--color-text)]">{item.title}</h4>
              <p className="text-[13px] text-[var(--color-muted)]">{item.desc}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Categories */}
      <div className="mt-16 w-full">
        <div className="mb-8 flex w-full items-end justify-between">
          <h2 className="font-serif text-[28px] italic text-[var(--color-text)] sm:text-[32px]">
            Categories
          </h2>
          {categories.length > 8 && (
            <button
              className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[var(--color-muted)] transition-colors hover:text-[var(--color-text)]"
              onClick={() => setViewAll((prev) => !prev)}
            >
              {viewAll ? "Show less" : "View all"}
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-x-10 gap-y-8">
          {loadingCategories ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-24 w-20 animate-pulse rounded-full bg-[var(--color-card)]" />
            ))
          ) : (
            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.2 }}
              className="flex w-full flex-wrap gap-x-10 gap-y-8"
            >
              {(viewAll ? categories : categories.slice(0, 8)).map((category) => (
                <motion.div
                  variants={fadeUp}
                  key={category._id}
                  onClick={() => {
                    dispatch(setCat(category.name));
                    navigate("/products");
                  }}
                  className="flex w-20 cursor-pointer flex-col items-center gap-3"
                >
                  {category.image && (
                    <img
                      src={`${import.meta.env.VITE_API_URL}/uploads/${category.image}`}
                      alt={category.name}
                      className="h-16 w-16 rounded-full object-cover grayscale transition-all duration-300 hover:grayscale-0"
                    />
                  )}
                  <h3 className="w-full truncate text-center text-[12px] font-medium uppercase tracking-[0.06em] text-[var(--color-text)]">
                    {category.name}
                  </h3>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>

      {/* Popular products */}
      <div className="mt-16 w-full">
        <h2 className="mb-8 font-serif text-[28px] italic text-[var(--color-text)] sm:text-[32px]">
          Popular products
        </h2>

        {loadingPopular ? (
          <div className="grid grid-cols-1 gap-px bg-[var(--color-border)] sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-[360px] w-full animate-pulse bg-[var(--color-card)]" />
            ))}
          </div>
        ) : (
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.1 }}
            className="grid w-full grid-cols-1 gap-px border border-[var(--color-border)] bg-[var(--color-border)] sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          >
            {popularProducts?.map((item) => {
              const product = item.id;
              if (!product) return null;

              return (
                <motion.div
                  key={item._id}
                  variants={fadeUp}
                  className="flex h-full flex-col bg-[var(--color-card)]"
                >
                  <div
                    className="group relative aspect-[4/5] w-full cursor-pointer overflow-hidden"
                    onClick={() => dispatch(setView(product))}
                  >
                    <img
                      src={`${import.meta.env.VITE_API_URL}/uploads/${product?.image}`}
                      alt={product?.name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>

                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="truncate text-[16px] font-semibold text-[var(--color-text)]">
                      {product?.name}
                    </h3>
                    <p className="mt-1 line-clamp-2 text-[13px] text-[var(--color-muted)]">
                      {product?.description}
                    </p>

                    <div className="mt-4 flex-1 space-y-2">
                      {product.sizes
                        ?.filter((size) => size.price)
                        .map((size, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between border-t border-[var(--color-border)] py-2 text-[13px]"
                          >
                            <span className="text-[var(--color-muted)]">{size.name}</span>
                            <span className="font-semibold text-[var(--color-text)]">
                              {size.price} EGP
                            </span>
                          </div>
                        ))}
                    </div>

                    <button
                      onClick={() => dispatch(setView(product))}
                      className="mt-5 flex w-full items-center justify-center border border-[var(--color-text)] py-2.5 text-[12px] font-semibold uppercase tracking-[0.14em] text-[var(--color-text)] transition-colors hover:bg-[var(--color-text)] hover:text-[var(--color-bg)]"
                    >
                      View
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>

      <style>{`
        .font-serif { font-family: "Fraunces", serif; }
      `}</style>
    </section>
  );
}