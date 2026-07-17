import React from "react";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";

import {
  increase,
  decrease,
  removeFromCart,
  clearCart,
} from "../../features/cartSlice";

import {
  FaPlus,
  FaMinus,
  FaTrash,
  FaCartShopping,
} from "react-icons/fa6";
import { FiShoppingBag } from "react-icons/fi";
import { LuWallet } from "react-icons/lu";
import { MdArrowForward } from "react-icons/md";
import { useNavigate } from "react-router-dom";

export default function Cart() {

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const { cart } = useSelector((state) => state.cartSlice);

  const totalPrice = cart.reduce(
    (acc, item) => acc + item.price * item.count,
    0
  );


  if (cart.length === 0) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center p-4 bg-[var(--color-bg)] transition-colors duration-300">
        <div className="max-w-md w-full bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl p-8 md:p-12 text-center shadow-sm backdrop-blur-sm flex flex-col items-center justify-center">

          <div className="w-24 h-24 rounded-full bg-[var(--color-bg)] border border-[var(--color-border)] flex items-center justify-center mb-6 text-[var(--color-muted)] animate-pulse">
            <FaCartShopping size={36} className="opacity-80" />
          </div>

          <h2 className="font-serif text-3xl md:text-4xl font-semibold text-[var(--color-text)] mb-3 tracking-wide">
            Your cart is empty
          </h2>

          <p className="text-[var(--color-muted)] text-sm md:text-base mb-8 max-w-[280px] leading-relaxed">
            You haven't added anything to your cart yet 
          </p>

          <button
            onClick = {() => navigate("products") }
            className="inline-flex items-center justify-center px-8 py-3.5 rounded-xl bg-[var(--color-accent)] text-[var(--color-bg)] font-medium text-sm transition-all duration-300 hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] shadow-md shadow-[var(--color-accent)]/10"
          >
            Explore Products
          </button>
        </div>
      </div>
    );
  }
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">


      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-black text-[var(--color-text)]">
            Shopping Cart
          </h1>

          <p className="text-[var(--color-muted)] mt-2">
            {cart.length} Items
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => dispatch(clearCart())}
          className="
            bg-red-500
            text-white
            px-4 py-2
            rounded-xl
          "
        >
          Clear Cart
        </motion.button>
      </div>

      <div className="grid lg:grid-cols-[1fr_350px] gap-6">

        <div className="space-y-4">
          {cart.map((item, index) => (
            <motion.div
              key={`${item._id}-${item.size}-${item.color}`}
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: index * 0.05,
              }}
              whileHover={{
                y: -2,
              }}
              className="
                bg-[var(--color-card)]
                border border-[var(--color-border)]
                rounded-3xl
                p-4
                shadow-lg
              "
            >
              <div className="flex flex-col sm:flex-row gap-4 justify-between" >

                <div className="flex  gap-5 ">

                  <img
                    src={`${import.meta.env.VITE_API_URL}/uploads/${item.image}`}
                    alt={item.name}
                    className="
                  w-36
                  h-36
                  object-cover
                  rounded-2xl
                  "
                  />


                  <div className=" mt-2">
                    <h2 className="text-xl font-bold text-[var(--color-text)]">
                      {item.name}
                    </h2>

                    <p className="text-[var(--color-muted)] mt-2">
                      Size: {item.size}
                    </p>
                    <p className="text-[var(--color-muted)] mt-2">
                      Size: {item.color}
                    </p>

                    <div className="mt-3 text-2xl font-black text-[var(--color-accent)]">
                      {item.price} L.E
                    </div>
                  </div>
                </div>


                <div className="flex flex-row sm:flex-col justify-between gap-3 ">
                  <div
                    className="
                      flex items-center
                      gap-3
                      bg-[var(--color-bg)]
                      rounded-xl
                      px-3 py-2
                    "
                  >
                    <button
                      onClick={() =>
                        dispatch(decrease(item))
                      }
                    >
                      <FaMinus />
                    </button>

                    <span className="font-bold">
                      {item.count}
                    </span>

                    <button
                      onClick={() =>
                        dispatch(increase(item))
                      }
                    >
                      <FaPlus />
                    </button>
                  </div>

                  <button
                    onClick={() =>
                      dispatch(
                        removeFromCart({
                          _id: item._id,
                          size: item.size,
                          color: item.color,
                        })
                      )
                    }
                    className="
                      bg-red-500
                      text-white
                      rounded-xl
                      px-4 py-2
                    "
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>

            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.45 }}
          className="
    sticky top-5
    overflow-hidden
    rounded-3xl
    border border-white/10
    bg-[var(--color-card)]/80
    backdrop-blur-xl
    shadow-[0_20px_60px_rgba(0,0,0,.18)]
  "
        >
          {/* Top */}
          <div className="bg-gradient-to-r from-[var(--color-accent)]/10 to-transparent p-6 border-b border-[var(--color-border)]">
            <h2 className="text-2xl font-black text-[var(--color-text)]">
              Order Summary
            </h2>

            <p className="mt-1 text-sm text-[var(--color-muted)]">
              Review your cart before checkout.
            </p>
          </div>

          <div className="space-y-5 p-6">
            {/* Items */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--color-accent)]/10">
                  <FiShoppingBag className="text-xl text-[var(--color-accent)]" />
                </div>

                <div>
                  <p className="text-sm text-[var(--color-muted)]">
                    Total Items
                  </p>
                  <h3 className="font-bold text-[var(--color-text)]">
                    {cart.reduce((acc, item) => acc + item.count, 0)}
                  </h3>
                </div>
              </div>
            </div>

            <div className="h-px bg-[var(--color-border)]" />

            {/* Total */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-green-500/10">
                  <LuWallet className="text-xl text-green-500" />
                </div>

                <div>
                  <p className="text-sm text-[var(--color-muted)]">
                    Grand Total
                  </p>

                  <h2 className="text-3xl font-black text-[var(--color-accent)]">
                    {totalPrice}
                    <span className="ml-1 text-base font-medium">
                      L.E
                    </span>
                  </h2>
                </div>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate("/checkout")}
              className="
        group
        mt-2
        flex
        w-full
        items-center
        justify-center
        gap-2
        rounded-2xl
        bg-[var(--color-accent)]
        px-5
        py-4
        font-bold
        text-white
        transition-all
        duration-300
        hover:shadow-[0_10px_30px_rgba(249,115,22,.35)]
      "
            >
              Proceed to Checkout

              <MdArrowForward className="transition-transform duration-300 group-hover:translate-x-1" />
            </motion.button>

            <p className="text-center text-xs text-[var(--color-muted)]">
              Secure checkout • Fast delivery • 100% Fresh
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}