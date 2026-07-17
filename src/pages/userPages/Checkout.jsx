import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  FiUser,
  FiPhone,
  FiMapPin,
  FiFileText,
  FiCreditCard,
  FiTruck,
  FiUploadCloud,
  FiX,
} from "react-icons/fi";

import { checkOut } from "../../features/orderSlice";
import { socket } from "../../services/socket";

function Segmented({ value, onChange, options, group }) {
  return (
    <div className="inline-flex w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] p-1">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={`relative flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
            value === opt.value ? "text-white" : "text-[var(--color-muted)] hover:text-[var(--color-text)]"
          }`}
        >
          {value === opt.value && (
            <motion.span
              layoutId={`pill-${group}`}
              className="absolute inset-0 rounded-lg bg-[var(--color-accent)]"
              transition={{ type: "spring", duration: 0.4 }}
            />
          )}
          <span className="relative flex items-center gap-2">{opt.label}</span>
        </button>
      ))}
    </div>
  );
}

export default function Checkout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [preview, setPreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({ defaultValues: { paymentMethod: "cash" } });

  const paymentMethod = watch("paymentMethod");

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      const formData = new FormData();

      formData.append("paymentMethod", data.paymentMethod);
      formData.append("fullName", data.fullName);
      formData.append("phone", data.phone);
      formData.append("address", data.address);
      formData.append("city", data.city);
      formData.append("notes", data.notes || "");

      if (data.paymentMethod === "wallet") {
        formData.append("walletType", data.walletType);
        formData.append("walletName", data.walletName);
        formData.append("walletNumber", data.walletNumber);
        formData.append("image", data.image[0]);
      }

      const res = await dispatch(checkOut(formData));
      const orderId = res.payload?.order?._id;

      if (orderId) {
        socket.emit("join-order", orderId);
        window.dispatchEvent(new Event("orderPlaced"));
        navigate("/");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit(onSubmit)}
      className="mx-auto mt-10 max-w-2xl space-y-4 p-4"
    >
      <div className="mb-2">
        <h2 className="text-3xl font-bold text-[var(--color-text)]">Checkout</h2>
        <p className="mt-1 text-sm text-[var(--color-muted)]">
          Tell us where to send your order.
        </p>
      </div>

      {/* Shipping address */}
      <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-6">
        <div className="mb-4 flex items-center gap-2 text-[var(--color-text)]">
          <FiTruck className="text-[var(--color-accent)]" />
          <h3 className="font-semibold">Shipping address</h3>
        </div>

        <div className="space-y-4">
          <div className="relative">
            <FiUser className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-muted)]" />
            <input
              placeholder="Full name"
              {...register("fullName", { required: "Full name is required" })}
              className="w-full rounded-xl border border-[var(--color-border)] bg-transparent p-3 pl-10 outline-none focus:border-[var(--color-accent)]"
            />
          </div>
          {errors.fullName && <p className="text-sm text-red-500">{errors.fullName.message}</p>}

          <div className="relative">
            <FiPhone className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-muted)]" />
            <input
              type="tel"
              placeholder="Phone number"
              {...register("phone", {
                required: "Phone number is required",
                pattern: {
                  value: /^01[0-2,5]{1}[0-9]{8}$/,
                  message: "Invalid phone number",
                },
              })}
              className="w-full rounded-xl border border-[var(--color-border)] bg-transparent p-3 pl-10 outline-none focus:border-[var(--color-accent)]"
            />
          </div>
          {errors.phone && <p className="text-sm text-red-500">{errors.phone.message}</p>}

          <div className="relative">
            <FiMapPin className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-muted)]" />
            <input
              placeholder="Street address"
              {...register("address", { required: "Address is required" })}
              className="w-full rounded-xl border border-[var(--color-border)] bg-transparent p-3 pl-10 outline-none focus:border-[var(--color-accent)]"
            />
          </div>
          {errors.address && <p className="text-sm text-red-500">{errors.address.message}</p>}

          <input
            placeholder="City"
            {...register("city", { required: "City is required" })}
            className="w-full rounded-xl border border-[var(--color-border)] bg-transparent p-3 outline-none focus:border-[var(--color-accent)]"
          />
          {errors.city && <p className="text-sm text-red-500">{errors.city.message}</p>}

          <div className="relative">
            <FiFileText className="pointer-events-none absolute left-3 top-3 text-[var(--color-muted)]" />
            <textarea
              placeholder="Delivery notes (optional)"
              rows={2}
              {...register("notes")}
              className="w-full resize-none rounded-xl border border-[var(--color-border)] bg-transparent p-3 pl-10 outline-none focus:border-[var(--color-accent)]"
            />
          </div>
        </div>
      </section>

      {/* Payment */}
      <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-6">
        <div className="mb-4 flex items-center gap-2 text-[var(--color-text)]">
          <FiCreditCard className="text-[var(--color-accent)]" />
          <h3 className="font-semibold">Payment method</h3>
        </div>

        <Segmented
          group="payment"
          value={paymentMethod}
          onChange={(v) => setValue("paymentMethod", v)}
          options={[
            { value: "cash", label: "Cash on delivery" },
            { value: "wallet", label: "Mobile wallet" },
          ]}
        />
        <input type="hidden" {...register("paymentMethod")} />

        {paymentMethod === "wallet" && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mt-5 space-y-4 overflow-hidden"
          >
            <select
              {...register("walletType", { required: "Choose a wallet type" })}
              className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] p-3"
            >
              <option value="">Choose wallet</option>
              <option value="vodafone">Vodafone Cash</option>
              <option value="orange">Orange Cash</option>
              <option value="etisalat">Etisalat Cash</option>
              <option value="we">WE Pay</option>
              <option value="else">Other</option>
            </select>
            {errors.walletType && <p className="text-sm text-red-500">{errors.walletType.message}</p>}

            <input
              placeholder="Wallet owner name"
              {...register("walletName", { required: "Wallet owner name is required" })}
              className="w-full rounded-xl border border-[var(--color-border)] bg-transparent p-3"
            />
            {errors.walletName && <p className="text-sm text-red-500">{errors.walletName.message}</p>}

            <input
              type="tel"
              placeholder="Wallet number"
              {...register("walletNumber", {
                required: "Wallet number is required",
                pattern: {
                  value: /^01[0-2,5]{1}[0-9]{8}$/,
                  message: "Invalid wallet number",
                },
              })}
              className="w-full rounded-xl border border-[var(--color-border)] bg-transparent p-3"
            />
            {errors.walletNumber && <p className="text-sm text-red-500">{errors.walletNumber.message}</p>}

            <label className="relative flex h-40 w-full cursor-pointer flex-col items-center justify-center gap-2 overflow-hidden rounded-xl border-2 border-dashed border-[var(--color-border)] transition-colors hover:border-[var(--color-accent)]/50">
              {preview ? (
                <>
                  <img src={URL.createObjectURL(preview)} alt="preview" className="h-full w-full object-cover" />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      setPreview(null);
                      setValue("image", null);
                    }}
                    className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80"
                    aria-label="Remove screenshot"
                  >
                    <FiX size={14} />
                  </button>
                </>
              ) : (
                <>
                  <FiUploadCloud className="text-3xl text-[var(--color-muted)]" />
                  <span className="text-sm text-[var(--color-muted)]">Upload transfer screenshot</span>
                </>
              )}
              <input
                type="file"
                accept="image/*"
                {...register("image", { required: "Transfer screenshot is required" })}
                onChange={(e) => {
                  if (e.target.files[0]) setPreview(e.target.files[0]);
                }}
                className="hidden"
              />
            </label>
            {errors.image && <p className="text-sm text-red-500">{errors.image.message}</p>}
          </motion.div>
        )}
      </section>

      <motion.button
        type="submit"
        disabled={submitting}
        whileHover={{ scale: submitting ? 1 : 1.01 }}
        whileTap={{ scale: submitting ? 1 : 0.98 }}
        className="w-full rounded-xl bg-[var(--color-accent)] py-4 font-semibold text-white shadow-md transition disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting ? "Placing order..." : "Confirm order"}
      </motion.button>
    </motion.form>
  );
}