import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { IoArrowBack } from "react-icons/io5";
import { clearProduct } from "../features/productsSlice";

export default function View() {
  const dispatch = useDispatch();

  const { selectedProduct } = useSelector((state) => state.productsSlice);

  if (!selectedProduct) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <h2 className="font-serif text-xl italic text-[var(--color-text)]">
          No product selected
        </h2>
      </div>
    );
  }

  const sizes = selectedProduct.sizes?.filter(
    (s) => s.price !== null && s.price !== ""
  );

  return (
    <div className="mx-auto max-w-5xl px-5 py-8 text-[var(--color-text)] md:px-8">
      <button
        onClick={() => dispatch(clearProduct())}
        className="mb-8 flex items-center gap-2 text-[13px] font-medium uppercase tracking-[0.14em] text-[var(--color-muted)] transition-colors hover:text-[var(--color-text)]"
      >
        <IoArrowBack size={16} />
        Back
      </button>

      <motion.div
        initial={{ y: 16, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        >
        {/* Cover */}
        <div className="relative overflow-hidden bg-[var(--color-card)]">
          <img
            src={`${import.meta.env.VITE_API_URL}/uploads/${selectedProduct.image}`}
            alt={selectedProduct.name}
            className="h-[260px] w-full object-cover sm:h-[360px] md:h-[460px]"
            />
        </div>

        <div className="grid grid-cols-1 gap-10 border-x border-b border-[var(--color-border)] p-6 md:grid-cols-[1.3fr_1fr] md:p-10">
          {/* Left: title, description, sizes */}
          <div>
            <div className="mb-4 flex items-start justify-between gap-4">
              <h1 className="font-serif text-[32px] italic leading-tight text-[var(--color-text)] sm:text-[40px]">
                {selectedProduct.name}
              </h1>
              {selectedProduct.offer && (
                <span className="mt-2 shrink-0 text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--color-accent)]">
                  On offer
                </span>
              )}

            </div>

            <p className="max-w-lg text-[15px] leading-relaxed text-[var(--color-muted)]">
              {selectedProduct.description}
            </p>

            {/* Sizes */}
            {sizes?.length > 0 && (
              <div className="mt-10">
                <h2 className="mb-4 text-[12px] font-semibold uppercase tracking-[0.14em] text-[var(--color-muted)]">
                  Sizes &amp; prices
                </h2>
                <div className="divide-y divide-[var(--color-border)] border-y border-[var(--color-border)]">
                  {sizes.map((size, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between py-3 text-[14px]"
                    >
                      <span className="font-medium">{size.name}</span>
                      <span className="font-semibold text-[var(--color-accent)]">
                        {size.price} EGP
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Colors */}
            {selectedProduct.colors?.length > 0 && (
              <div className="mt-10">
                <h2 className="mb-4 text-[12px] font-semibold uppercase tracking-[0.14em] text-[var(--color-muted)]">
                  Colors
                </h2>
                <div className="flex flex-wrap gap-5">
                  {selectedProduct.colors.map((color, index) => (
                    <div key={index} className="flex flex-col items-center gap-2">
                      <span
                        className="h-8 w-8 rounded-full border border-[var(--color-border)]"
                        style={{ backgroundColor: color }}
                        title={color}
                      />
                      <span className="text-[11px] text-[var(--color-muted)]">
                        {color}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right: meta panel */}
          <div className="flex flex-col divide-y divide-[var(--color-border)] border-y border-[var(--color-border)] md:border md:px-5">
            <div className="flex items-center justify-between py-3.5">
              <span className="text-[13px] text-[var(--color-muted)]">Category</span>
              <span className="text-[14px] font-medium">{selectedProduct.Category}</span>
            </div>
            <div className="flex items-center justify-between py-3.5">
              <span className="text-[13px] text-[var(--color-muted)]">Availability</span>
              <span
                className={`text-[14px] font-medium ${selectedProduct.availability ? "text-green-600" : "text-red-500"
                  }`}
              >
                {selectedProduct.availability ? "Available" : "Not available"}
              </span>
            </div>
            <div className="flex items-center justify-between py-3.5">
              <span className="text-[13px] text-[var(--color-muted)]">Available sizes</span>
              <span className="text-[14px] font-medium">{sizes?.length ?? 0}</span>
            </div>
            <div className="flex items-center justify-between py-3.5">
              <span className="text-[13px] text-[var(--color-muted)]">Created</span>
              <span className="text-[14px] font-medium">
                {new Date(selectedProduct.createdAt).toLocaleDateString("en-GB", {
                  dateStyle: "medium",
                })}
              </span>
            </div>
            <div className="flex items-center justify-between py-3.5">
              <span className="text-[13px] text-[var(--color-muted)]">Last updated</span>
              <span className="text-[14px] font-medium">
                {new Date(selectedProduct.updatedAt).toLocaleDateString("en-GB", {
                  dateStyle: "medium",
                })}
              </span>
            </div>
            <div className="py-3.5">
              <span className="block text-[13px] text-[var(--color-muted)]">Product ID</span>
              <span className="mt-1 block break-all font-mono text-[12px] text-[var(--color-muted)]">
                {selectedProduct._id}
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      <style>{`
        .font-serif { font-family: "Fraunces", serif; }
      `}</style>
    </div>
  );
}