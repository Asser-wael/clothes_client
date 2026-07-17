import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { IoArrowBack } from "react-icons/io5";
import { FiPlus, FiX } from "react-icons/fi";

import { editProduct, clearIdToEdit } from "../features/productsSlice";
import { getAllCategories } from "../features/customuseSlice";

export default function Edit() {
  const dispatch = useDispatch();
  const { register, handleSubmit, reset, watch } = useForm();

  const { selectedProductToEdit, products } = useSelector(
    (state) => state.productsSlice
  );
  const { categories } = useSelector((state) => state.customuseSlice);

  useEffect(() => {
    dispatch(getAllCategories());
  }, [dispatch]);

  const [image, setImage] = useState(null);
  const [variants, setVariants] = useState([
    {
      name: "",
      price: "",
      priceOffer: "",
      count: "",
    },
  ]);
  const [colors, setColors] = useState([""]);
  const [submitting, setSubmitting] = useState(false);

  const product = products?.find((p) => p._id === selectedProductToEdit);

  const isOffer = watch("offer") === "true";

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
        : [
          {
            name: "",
            price: "",
            priceOffer: "",
            count: "",
          },
        ]
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

  // ---- Variants ----
  const updateVariant = (index, key, value) => {
    const updated = [...variants];
    updated[index][key] = value;
    setVariants(updated);
  };

  const addVariant = () =>
    setVariants([
      ...variants,
      {
        name: "",
        price: "",
        priceOffer: "",
        count: "",
      },
    ]);
  const removeVariant = (index) => {
    if (variants.length === 1) return;
    setVariants(variants.filter((_, i) => i !== index));
  };

  // ---- Colors ----
  const updateColor = (index, value) => {
    const updated = [...colors];
    updated[index] = value;
    setColors(updated);
  };

  const addColor = () => setColors([...colors, ""]);

  const removeColor = (index) => {
    if (colors.length === 1) return;
    setColors(colors.filter((_, i) => i !== index));
  };

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("description", data.description);
      formData.append("Category", data.Category);
      formData.append("offer", data.offer);
      formData.append("availability", data.availability);
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
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full p-6 text-[var(--color-text)]"
    >
      <div className="mx-auto mb-5 max-w-6xl">
        <button
          onClick={() => dispatch(clearIdToEdit())}
          type="button"
          className="flex items-center gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] px-4 py-2 text-[var(--color-text)] shadow-md transition-all hover:scale-105"
        >
          <IoArrowBack size={18} />
          Back
        </button>
      </div>

      <h1 className="mb-6 text-3xl font-bold">Edit product</h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mx-auto max-w-6xl space-y-5 rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-6"
      >
        <input
          {...register("name", { required: true })}
          placeholder="Product name"
          className="w-full rounded-xl border border-[var(--color-border)] bg-transparent p-3 outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
        />

        <textarea
          {...register("description", { required: true })}
          placeholder="Description"
          rows={4}
          className="w-full rounded-xl border border-[var(--color-border)] bg-transparent p-3 outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
        />

        <select
          {...register("offer")}
          className="w-full rounded-xl border border-[var(--color-border)] bg-transparent p-3"
        >
          <option value="false" className="text-black">No offer</option>
          <option value="true" className="text-black">Offer available</option>
        </select>

        <select
          {...register("availability")}
          className="w-full rounded-xl border border-[var(--color-border)] bg-transparent p-3"
        >
          <option value="false" className="text-black">Not available</option>
          <option value="true" className="text-black">Available</option>
        </select>

        <select
          {...register("Category", { required: true })}
          defaultValue=""
          className="w-full rounded-xl border border-[var(--color-border)] bg-transparent p-3"
        >
          <option value="" disabled>Select category</option>
          {categories?.map((c) => (
            <option key={c._id} value={c.name} className="text-black">
              {c.name}
            </option>
          ))}
        </select>

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
          className="w-full rounded-xl border border-[var(--color-border)] bg-transparent p-3"
        />

        {image && (
          <img
            src={
              typeof image === "string"
                ? `${import.meta.env.VITE_API_URL}/uploads/${image}`
                : URL.createObjectURL(image)
            }
            alt="preview"
            className="h-32 w-32 rounded-xl border object-cover"
          />
        )}

        {/* Sizes */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Sizes & prices</h2>
            <button
              type="button"
              onClick={addVariant}
              className="flex items-center gap-1.5 rounded-full bg-[var(--color-accent)]/10 px-3 py-1.5 text-sm font-medium text-[var(--color-accent)]"
            >
              <FiPlus size={14} /> Add size
            </button>
          </div>

          {variants.map((v, index) => (
            <div key={index} className="flex items-center gap-3">
              <input
                placeholder="Size"
                value={v.name}
                onChange={(e) => updateVariant(index, "name", e.target.value)}
                className="flex-1 rounded-xl border border-[var(--color-border)] bg-transparent p-2.5 text-sm outline-none"
              />

              <input
                type="number"
                placeholder="Price"
                value={v.price}
                onChange={(e) => updateVariant(index, "price", e.target.value)}
                className="w-28 rounded-xl border border-[var(--color-border)] bg-transparent p-2.5 text-sm outline-none"
              />

              {isOffer && (
                <input
                  type="number"
                  placeholder="Offer price"
                  value={v.priceOffer}
                  onChange={(e) => updateVariant(index, "priceOffer", e.target.value)}
                  className="w-28 rounded-xl border border-red-400 bg-transparent p-2.5 text-sm text-red-500 outline-none"
                />
              )}

              <input
                type="number"
                placeholder="Count"
                value={v.count}
                onChange={(e) => updateVariant(index, "count", e.target.value)}
                className="w-28 rounded-xl border border-[var(--color-border)] bg-transparent p-2.5 text-sm outline-none"
              />

              <button
                type="button"
                onClick={() => removeVariant(index)}
                disabled={variants.length === 1}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-red-500 disabled:opacity-30"
              >
                <FiX size={16} />
              </button>
            </div>
          ))}
        </div>

        {/* Colors */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Colors</h2>
            <button
              type="button"
              onClick={addColor}
              className="flex items-center gap-1.5 rounded-full bg-[var(--color-accent)]/10 px-3 py-1.5 text-sm font-medium text-[var(--color-accent)]"
            >
              <FiPlus size={14} /> Add color
            </button>
          </div>

          {colors.map((color, index) => (
            <div key={index} className="flex items-center gap-3">
              <input
                type="text"
                placeholder="Color name"
                value={color}
                onChange={(e) => updateColor(index, e.target.value)}
                className="flex-1 rounded-xl border border-[var(--color-border)] bg-transparent p-2.5 text-sm outline-none"
              />
              <button
                type="button"
                onClick={() => removeColor(index)}
                disabled={colors.length === 1}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-red-500 disabled:opacity-30"
              >
                <FiX size={16} />
              </button>
            </div>
          ))}
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-xl bg-[var(--color-accent)] py-3 font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? "Saving..." : "Save changes"}
        </button>

        <button
          type="button"
          onClick={() => dispatch(clearIdToEdit())}
          className="w-full rounded-xl bg-[var(--color-muted)] py-3 font-semibold text-white transition hover:opacity-90"
        >
          Cancel
        </button>
      </form>
    </motion.div>
  );
}