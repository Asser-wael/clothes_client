import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { IoArrowBack } from "react-icons/io5";
import {
  FiType,
  FiAlignLeft,
  FiTag,
  FiImage,
  FiLayers,
  FiPlus,
  FiX,
  FiCheck,
  FiUploadCloud,
} from "react-icons/fi";

import { editProduct, clearIdToEdit } from "../features/productsSlice";
import { getAllCategories } from "../features/customuseSlice";

function FieldLabel({ icon, children }) {
  return (
    <label className="mb-2 flex items-center gap-2 text-sm font-medium text-[var(--color-text)]">
      <span className="text-[var(--color-accent)]">{icon}</span>
      {children}
    </label>
  );
}

function Segmented({ value, onChange, options }) {
  return (
    <div className="inline-flex rounded-full border border-[var(--color-border)] bg-[var(--color-bg)] p-1">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={`relative rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${value === opt.value
            ? "text-white"
            : "text-[var(--color-muted)] hover:text-[var(--color-text)]"
            }`}
        >
          {value === opt.value && (
            <motion.span
              layoutId={`pill-${options[0].group}`}
              className="absolute inset-0 rounded-full bg-[var(--color-accent)]"
              transition={{ type: "spring", duration: 0.4 }}
            />
          )}
          <span className="relative">{opt.label}</span>
        </button>
      ))}
    </div>
  );
}

export default function Edit() {
  const dispatch = useDispatch();
  const { register, handleSubmit, reset, watch, setValue } = useForm();

  const { selectedProductToEdit, products } = useSelector(
    (state) => state.productsSlice
  );
  const { categories } = useSelector((state) => state.customuseSlice);

  const product = products?.find((p) => p._id === selectedProductToEdit);

  const [colors, setColors] = useState([""]);
  const [image, setImage] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [variants, setVariants] = useState([{ name: "", price: "", priceOffer: "", count: "" }]);
  const [submitting, setSubmitting] = useState(false);

  const offer = watch("offer");
  const availability = watch("availability");

  useEffect(() => {
    dispatch(getAllCategories());
  }, [dispatch]);

  useEffect(() => {
    if (!product) return;

    setImage(product.image);

    setVariants(
      product.sizes?.length
        ? product.sizes.map((s) => ({
          name: s.name ?? "",
          price: s.price ?? "",
          priceOffer: s.priceOffer ?? "",
          count: s.count ?? "",
        }))
        : [{ name: "", price: "", priceOffer: "", count: "" }]
    );

    setColors(product.colors?.length ? product.colors : [""]);

    reset({
      name: product.name,
      description: product.description,
      offer: String(product.offer),
      availability: String(product.availability),
      Category: product.Category,
    });
  }, [product, reset]);

  const updateVariant = (index, key, value) => {
    setVariants((prev) =>
      prev.map((v, i) => (i === index ? { ...v, [key]: value } : v))
    );
  };

  const addVariant = () =>
    setVariants((prev) => [...prev, { name: "", price: "", priceOffer: "", count: "" }]);

  const removeVariant = (index) =>
    setVariants((prev) => prev.filter((_, i) => i !== index));

  const updateColor = (index, value) => {
    setColors((prev) => prev.map((color, i) => (i === index ? value : color)));
  };

  const addColor = () => setColors((prev) => [...prev, ""]);

  const removeColor = (index) => setColors((prev) => prev.filter((_, i) => i !== index));

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file) setImage(file);
  };

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("description", data.description);
      formData.append("offer", data.offer);
      formData.append("availability", data.availability);
      formData.append("Category", data.Category);
      if (typeof image !== "string") {
        formData.append("image", image);
      }
      formData.append("sizes", JSON.stringify(variants));
      formData.append("colors", JSON.stringify(colors));

      const res = await dispatch(editProduct({ formData, id: product._id }));

      if (res.payload) {
        dispatch(clearIdToEdit());
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mx-auto w-full max-w-3xl p-6 text-[var(--color-text)]"
    >
      <button
        onClick={() => dispatch(clearIdToEdit())}
        type="button"
        className="mb-6 flex items-center gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] px-4 py-2 text-[var(--color-text)] shadow-md transition-all hover:scale-105"
      >
        <IoArrowBack size={18} />
        Back
      </button>

      <div className="mb-8">
        <h1 className="text-3xl font-bold">Edit product</h1>
        <p className="mt-1 text-sm text-[var(--color-muted)]">
          Update the details below and save your changes.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Basic info */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-5"
        >
          <FieldLabel icon={<FiType size={16} />}>Product name</FieldLabel>
          <input
            {...register("name", { required: true })}
            placeholder="e.g. Classic denim jacket"
            className="mb-5 w-full rounded-xl border border-[var(--color-border)] bg-transparent p-3 outline-none transition focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/20"
          />

          <FieldLabel icon={<FiAlignLeft size={16} />}>Description</FieldLabel>
          <textarea
            {...register("description", { required: true })}
            placeholder="What makes this product worth buying?"
            rows={3}
            className="w-full resize-none rounded-xl border border-[var(--color-border)] bg-transparent p-3 outline-none transition focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/20"
          />
        </motion.section>

        {/* Organize */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-5"
        >
          <FieldLabel icon={<FiTag size={16} />}>Category</FieldLabel>
          <select
            {...register("Category", { required: true })}
            defaultValue=""
            className="mb-5 w-full rounded-xl border border-[var(--color-border)] bg-transparent p-3 outline-none focus:border-[var(--color-accent)]"
          >
            <option value="" disabled>
              Select a category
            </option>
            {categories?.map((c) => (
              <option key={c._id} value={c.name} className="text-black">
                {c.name}
              </option>
            ))}
          </select>

          <div className="flex flex-wrap gap-8">
            <div>
              <p className="mb-2 text-sm font-medium text-[var(--color-text)]">Offer</p>
              <Segmented
                value={offer}
                onChange={(v) => setValue("offer", v)}
                options={[
                  { value: "false", label: "None", group: "offer" },
                  { value: "true", label: "On offer", group: "offer" },
                ]}
              />
            </div>

            <div>
              <p className="mb-2 text-sm font-medium text-[var(--color-text)]">Availability</p>
              <Segmented
                value={availability}
                onChange={(v) => setValue("availability", v)}
                options={[
                  { value: "true", label: "In stock", group: "avail" },
                  { value: "false", label: "Out of stock", group: "avail" },
                ]}
              />
            </div>
          </div>
        </motion.section>

        {/* Image */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-5"
        >
          <FieldLabel icon={<FiImage size={16} />}>Product image</FieldLabel>

          <label
            onDragOver={(e) => {
              e.preventDefault();
              setDragActive(true);
            }}
            onDragLeave={() => setDragActive(false)}
            onDrop={handleDrop}
            className={`relative flex h-40 w-full cursor-pointer flex-col items-center justify-center gap-2 overflow-hidden rounded-xl border-2 border-dashed transition-colors ${dragActive
              ? "border-[var(--color-accent)] bg-[var(--color-accent)]/5"
              : "border-[var(--color-border)] hover:border-[var(--color-accent)]/50"
              }`}
          >
            {image ? (
              <>
                <img
                  src={
                    typeof image === "string"
                      ? `${import.meta.env.VITE_API_URL}/uploads/${image}`
                      : URL.createObjectURL(image)
                  }
                  alt="preview"
                  className="h-full w-full object-cover"
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    setImage(null);
                  }}
                  className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80"
                  aria-label="Remove image"
                >
                  <FiX size={14} />
                </button>
              </>
            ) : (
              <>
                <FiUploadCloud className="text-3xl text-[var(--color-muted)]" />
                <span className="text-sm text-[var(--color-muted)]">
                  Drag an image here or click to browse
                </span>
              </>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
              className="hidden"
            />
          </label>
        </motion.section>

        {/* Variants */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-5"
        >
          <div className="mb-4 flex items-center justify-between">
            <FieldLabel icon={<FiLayers size={16} />}>Variants and pricing</FieldLabel>
            <button
              type="button"
              onClick={addVariant}
              className="flex items-center gap-1.5 rounded-full bg-[var(--color-accent)]/10 px-3 py-1.5 text-sm font-medium text-[var(--color-accent)] transition hover:bg-[var(--color-accent)]/20"
            >
              <FiPlus size={14} /> Add variant
            </button>
          </div>

          <div className="space-y-2">
            <AnimatePresence initial={false}>
              {variants.map((v, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                  animate={{ opacity: 1, height: "auto", marginBottom: 8 }}
                  exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center gap-2 overflow-hidden flex-wrap"
                >
                  <input
                    placeholder="e.g. Medium, 42, Blue"
                    value={v.name}
                    onChange={(e) => updateVariant(index, "name", e.target.value)}
                    className="flex-1 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] p-2.5 text-sm outline-none focus:border-[var(--color-accent)]"
                  />
                  <input
                    type="number"
                    placeholder="Price"
                    value={v.price}
                    onChange={(e) => updateVariant(index, "price", e.target.value)}
                    className="w-28 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] p-2.5 text-sm outline-none focus:border-[var(--color-accent)]"
                  />
                  {offer === "true" && (
                    <input
                      type="number"
                      placeholder="Price Offer"
                      value={v.priceOffer}
                      onChange={(e) => updateVariant(index, "priceOffer", e.target.value)}
                      className="w-28 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] p-2.5 text-sm outline-none focus:border-[var(--color-accent)]"
                    />
                  )}
                  <input
                    type="number"
                    placeholder="count"
                    value={v.count}
                    onChange={(e) => updateVariant(index, "count", e.target.value)}
                    className="w-28 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] p-2.5 text-sm outline-none focus:border-[var(--color-accent)]"
                  />
                  <button
                    type="button"
                    onClick={() => removeVariant(index)}
                    disabled={variants.length === 1}
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-red-500 transition hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-30"
                    aria-label="Remove variant"
                  >
                    <FiX size={16} />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </motion.section>

        {/* Colors */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-5"
        >
          <div className="mb-4 flex items-center justify-between">
            <FieldLabel icon={<FiLayers size={16} />}>Colors</FieldLabel>

            <button
              type="button"
              onClick={addColor}
              className="flex items-center gap-1.5 rounded-full bg-[var(--color-accent)]/10 px-3 py-1.5 text-sm font-medium text-[var(--color-accent)] hover:bg-[var(--color-accent)]/20"
            >
              <FiPlus size={14} />
              Add color
            </button>
          </div>

          <div className="space-y-2">
            <AnimatePresence>
              {colors.map((color, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-center gap-2 overflow-hidden"
                >
                  <input
                    type="text"
                    placeholder="Color name"
                    value={color}
                    onChange={(e) => updateColor(index, e.target.value)}
                    className="flex-1 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] p-2.5 text-sm outline-none focus:border-[var(--color-accent)]"
                  />

                  <button
                    type="button"
                    onClick={() => removeColor(index)}
                    disabled={colors.length === 1}
                    className="flex h-9 w-9 items-center justify-center rounded-xl text-red-500 hover:bg-red-500/10 disabled:opacity-30"
                  >
                    <FiX size={16} />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </motion.section>

        <motion.button
          type="submit"
          disabled={submitting}
          whileHover={{ scale: submitting ? 1 : 1.01 }}
          whileTap={{ scale: submitting ? 1 : 0.98 }}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--color-accent)] py-3.5 font-semibold text-white shadow-md transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? (
            <motion.span
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
              className="h-4 w-4 rounded-full border-2 border-white/40 border-t-white"
            />
          ) : (
            <FiCheck size={18} />
          )}
          {submitting ? "Saving..." : "Save changes"}
        </motion.button>
      </form>
    </motion.div>
  );
}