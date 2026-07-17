import { createSlice } from "@reduxjs/toolkit";

const getInitialCart = () => {
  try {
    const stored = localStorage.getItem("cart");
    return stored ? JSON.parse(stored) : [];
  } catch (err) {
    console.error("Failed to parse cart:", err);
    return [];
  }
};

const initialState = {
  cart: getInitialCart(),
};

// حفظ الكارت
const saveCart = (cart) => {
  try {
    localStorage.setItem("cart", JSON.stringify(cart));
  } catch (err) {
    console.error("Failed to save cart:", err);
  }
};

const cartSlice = createSlice({
  name: "cart",

  initialState,

  reducers: {
    // Add To Cart
    addToCart: (state, action) => {
      try {
        const exist = state.cart.find(
          (item) =>
            item._id === action.payload._id &&
            item.size === action.payload.size &&
            item.color === action.payload.color
        );

        if (exist) {
          exist.count += 1;
        } else {
          state.cart.push({
            ...action.payload,
            count: 1,
          });
        }

        saveCart(state.cart);
      } catch (err) {
        console.error("addToCart reducer error:", err);
      }
    },

    // Increase
    increase: (state, action) => {
      try {
        const exist = state.cart.find(
          (item) =>
            item._id === action.payload._id &&
            item.size === action.payload.size &&
            item.color === action.payload.color
        );

        if (!exist) return;

        exist.count += 1;

        saveCart(state.cart);
      } catch (err) {
        console.error("increase reducer error:", err);
      }
    },

    // Decrease
    decrease: (state, action) => {
      try {
        const exist = state.cart.find(
          (item) =>
            item._id === action.payload._id &&
            item.size === action.payload.size &&
            item.color === action.payload.color
        );

        if (!exist) return;

        if (exist.count > 1) {
          exist.count -= 1;
        } else {
          state.cart = state.cart.filter(
            (item) =>
              !(
                item._id === action.payload._id &&
                item.size === action.payload.size &&
                item.color === action.payload.color
              )
          );
        }

        saveCart(state.cart);
      } catch (err) {
        console.error("decrease reducer error:", err);
      }
    },

    // Remove Item
    removeFromCart: (state, action) => {
      try {
        const { _id, size, color } = action.payload;

        state.cart = state.cart.filter(
          (item) =>
            !(
              item._id === _id &&
              item.size === size &&
              item.color === color
            )
        );

        saveCart(state.cart);
      } catch (err) {
        console.error("removeFromCart reducer error:", err);
      }
    },

    // Clear Cart
    clearCart: (state) => {
      try {
        state.cart = [];
        localStorage.removeItem("cart");
      } catch (err) {
        console.error("clearCart reducer error:", err);
      }
    },
  },
});

export const {
  addToCart,
  increase,
  decrease,
  removeFromCart,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;