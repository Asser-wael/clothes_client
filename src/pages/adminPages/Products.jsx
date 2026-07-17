import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { FiEye, FiEdit2, FiTrash2 } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

import {
  getAllProducts,
  removeProduct,
  setIdToEdit,
  viewProduct,
} from "../../features/productsSlice";
import View from "../../components/View";
import Edit from "../../components/Edit";

const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
};

export default function Products() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    products,
    selectedProduct,
    selectedProductToEdit,
    loadingProducts,
    loadingAdd,
    loadingEdit,
  } = useSelector((state) => state.productsSlice);

  const [search, setSearch] = useState("");

  const filteredProducts = products?.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    dispatch(getAllProducts());
  }, [dispatch]);

  if (selectedProduct) return <View />;
  if (selectedProductToEdit) return <Edit />;

  const isLoading = loadingAdd || loadingProducts || loadingEdit;

  return (
    <div className="mx-auto w-full max-w-6xl px-5 py-10 text-[var(--color-text)] md:px-8">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-6 border-b border-[var(--color-border)] pb-8 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="font-serif text-[32px] italic text-[var(--color-text)] sm:text-[38px]">
            Products
          </h1>
          <p className="mt-1 text-[13px] text-[var(--color-muted)]">
            {products?.length ?? 0} pieces in your collection
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <input
            type="text"
            placeholder="Search by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-none border border-[var(--color-border)] bg-transparent px-4 py-2.5 text-[14px] outline-none transition focus:border-[var(--color-accent)] sm:w-64"
          />

          <button
            onClick={() => navigate("add")}
            className="whitespace-nowrap border border-[var(--color-text)] px-5 py-2.5 text-[13px] font-semibold uppercase tracking-[0.1em] text-[var(--color-text)] transition-colors hover:bg-[var(--color-text)] hover:text-[var(--color-bg)]"
          >
            + Add product
          </button>
        </div>
      </div>

      {/* Loading skeletons */}
      {isLoading && (
        <div className="grid grid-cols-1 gap-px border border-[var(--color-border)] bg-[var(--color-border)] sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-96 w-full animate-pulse bg-[var(--color-card)]" />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!isLoading && filteredProducts?.length === 0 && (
        <div className="flex min-h-[240px] items-center justify-center border border-[var(--color-border)]">
          <p className="text-[14px] text-[var(--color-muted)]">
            No products match your search.
          </p>
        </div>
      )}

      {/* Products grid */}
      {!isLoading && filteredProducts?.length > 0 && (
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 gap-px border border-[var(--color-border)] bg-[var(--color-border)] sm:grid-cols-2 lg:grid-cols-3"
        >
          {filteredProducts.map((item) => {
            const sizes = item.sizes?.filter((size) => size.price !== null && size.price !== "");

            return (
              <motion.div
                key={item._id}
                variants={fadeUp}
                className="group flex flex-col bg-[var(--color-card)]"
              >
                {/* Image */}
                <div className="relative aspect-[4/5] w-full overflow-hidden">
                  <img
                    src={`${import.meta.env.VITE_API_URL}/uploads/${item.image}`}
                    alt={item.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />

                  {item.offer && (
                    <span className="absolute right-3 top-3 bg-[var(--color-accent)] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-[var(--color-bg)]">
                      Offer
                    </span>
                  )}

                  {/* Hover actions */}
                  <div className="absolute inset-x-0 bottom-0 flex justify-center gap-2 bg-gradient-to-t from-black/60 to-transparent p-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <button
                      onClick={() => dispatch(viewProduct(item._id))}
                      className="flex h-9 w-9 items-center justify-center bg-[var(--color-bg)] text-[var(--color-text)] transition hover:bg-[var(--color-accent)] hover:text-[var(--color-bg)]"
                      aria-label="View product"
                    >
                      <FiEye size={16} />
                    </button>
                    <button
                      onClick={() => dispatch(setIdToEdit(item._id))}
                      className="flex h-9 w-9 items-center justify-center bg-[var(--color-bg)] text-[var(--color-text)] transition hover:bg-[var(--color-accent)] hover:text-[var(--color-bg)]"
                      aria-label="Edit product"
                    >
                      <FiEdit2 size={16} />
                    </button>
                    <button
                      onClick={() => dispatch(removeProduct(item._id))}
                      className="flex h-9 w-9 items-center justify-center bg-[var(--color-bg)] text-red-500 transition hover:bg-red-500 hover:text-white"
                      aria-label="Delete product"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="flex flex-1 flex-col p-5">
                  <h2 className="text-[16px] font-semibold text-[var(--color-text)]">
                    {item.name}
                  </h2>

                  <p className="mt-1 line-clamp-2 text-[13px] text-[var(--color-muted)]">
                    {item.description}
                  </p>

                  {/* Sizes */}
                  {sizes?.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1.5 border-t border-[var(--color-border)] pt-3 text-[12px]">
                      {sizes.map((size, idx) => (
                        <span key={idx} className="text-[var(--color-muted)]">
                          {size.name}{" "}
                          <span className="font-semibold text-[var(--color-text)]">
                            {size.price} EGP
                          </span>
                        </span>
                      ))}
                    </div>
                  )}

                  <span className="mt-4 text-[11px] text-[var(--color-muted)]">
                    Added {new Date(item.createdAt).toLocaleDateString("en-GB", { dateStyle: "medium" })}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}

      <style>{`
        .font-serif { font-family: "Fraunces", serif; }
      `}</style>
    </div>
  );
}