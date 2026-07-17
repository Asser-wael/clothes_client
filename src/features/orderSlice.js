import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/api";
import { setNotification } from "./notificationSlice";
import { clearCart } from "./cartSlice";

export const getAdminOrders = createAsyncThunk(
    "order/getAdminOrders",
    async (_, { rejectWithValue }) => {
        try {
            const res = await api.get("/admin/orders");
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data);
        }
    }
);

export const getOrderById = createAsyncThunk(
    "order/getOrderById",
    async (id, { rejectWithValue }) => {
        try {
            const res = await api.get(`/admin/orders/${id}`);
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data);
        }
    }
);

export const checkOut = createAsyncThunk(
    "order/checkOut",
    async (formData, { rejectWithValue, dispatch }) => {
        try {
            let cart = null;
            let cartP = [];
            try {
                cart = localStorage.getItem("cart");
                cartP = cart ? JSON.parse(cart) : [];
            } catch (err) {
                console.error("Failed to read/parse cart from localStorage:", err);
                cart = null;
                cartP = [];
            }

            if (!cart || cart.length === 0) {
                try {
                    dispatch(
                        setNotification({
                            message: "The cart is empty",
                            type: "error",
                        })
                    );
                } catch (err) {
                    console.error("setNotification dispatch error:", err);
                }
                return rejectWithValue("Cart is empty");
            }

            try {
                formData.append("cart", cart);
            } catch (err) {
                console.error("Failed to append cart to formData:", err);
                return rejectWithValue("Failed to prepare checkout data");
            }

            const res = await api.post("/checkOut", formData);

            let oldOrders = [];
            try {
                oldOrders = JSON.parse(localStorage.getItem("orderTracking")) || [];
            } catch (err) {
                console.error("Failed to parse orderTracking from localStorage:", err);
                oldOrders = [];
            }

            const newOrder = {
                orderId: res.data.order._id,
                cart,
                status: "pending",
                time: new Date().toISOString(),
            };
            oldOrders.push(newOrder);

            try {
                localStorage.setItem(
                    "orderTracking",
                    JSON.stringify(oldOrders)
                );
            } catch (err) {
                console.error("Failed to save orderTracking to localStorage:", err);
            }

            try {
                dispatch(
                    setNotification({
                        message: res.data.message,
                        type: res.data.type,
                    })
                );
            } catch (err) {
                console.error("setNotification dispatch error:", err);
            }

            try {
                dispatch(clearCart());
            } catch (err) {
                console.error("clearCart dispatch error:", err);
            }

            return { order: res.data.order, newOrder };
        } catch (error) {
            return rejectWithValue(error.response?.data);
        }
    }
);

export const updateOrderStatus = createAsyncThunk(
    "order/updateOrderStatus",
    async ({ id, status }, { rejectWithValue, dispatch }) => {
        try {
            const res = await api.put("/updateOrderStatus", { id, status });

            try {
                dispatch(
                    setNotification({
                        message: res.data.message,
                        type: res.data.type,
                    })
                );
            } catch (err) {
                console.error("setNotification dispatch error:", err);
            }

            try {
                dispatch(clearCart());
            } catch (err) {
                console.error("clearCart dispatch error:", err);
            }

            return res.data.order;
        } catch (error) {
            return rejectWithValue(error.response?.data);
        }
    }
);

const getInitialOrderTracking = () => {
    try {
        return JSON.parse(localStorage.getItem("orderTracking")) || [];
    } catch (err) {
        console.error("Failed to parse initial orderTracking:", err);
        return [];
    }
};

const orderSlice = createSlice({
    name: "orderSlice",

    initialState: {
        orders: [],
        OrderTracking: getInitialOrderTracking(),
        order: null,
        loading: false,
        error: null,
    },

    reducers: {
        updateTracking(state, action) {
            try {
                const { orderId, status } = action.payload;

                state.OrderTracking = state.OrderTracking.map((order) =>
                    order.orderId === orderId
                        ? { ...order, status }
                        : order
                );

                try {
                    localStorage.setItem(
                        "orderTracking",
                        JSON.stringify(state.OrderTracking)
                    );
                } catch (err) {
                    console.error("Failed to save orderTracking to localStorage:", err);
                }
            } catch (err) {
                console.error("updateTracking reducer error:", err);
            }
        },
    },

extraReducers: (builder) => {
    builder

        // =========================
        // Checkout
        // =========================
        .addCase(checkOut.pending, (state) => {
            state.loading = true;
            state.error = null;
        })

        .addCase(checkOut.fulfilled, (state, action) => {
            state.loading = false;
            state.error = null;

            if (action.payload?.newOrder) {
                state.OrderTracking.push(action.payload.newOrder);
            }
        })

        .addCase(checkOut.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || action.error.message;
        })

        // =========================
        // Get Admin Orders
        // =========================
        .addCase(getAdminOrders.pending, (state) => {
            state.loading = true;
            state.error = null;
        })

        .addCase(getAdminOrders.fulfilled, (state, action) => {
            state.loading = false;
            state.orders = action.payload;
        })

        .addCase(getAdminOrders.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || action.error.message;
        })

        // =========================
        // Get Order By Id
        // =========================
        .addCase(getOrderById.pending, (state) => {
            state.loading = true;
            state.error = null;
        })

        .addCase(getOrderById.fulfilled, (state, action) => {
            state.loading = false;
            state.order = action.payload;
        })

        .addCase(getOrderById.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || action.error.message;
        })

        // =========================
        // Update Order Status
        // =========================
        .addCase(updateOrderStatus.pending, (state) => {
            state.loading = true;
            state.error = null;
        })

        .addCase(updateOrderStatus.fulfilled, (state, action) => {
            state.loading = false;

            const index = state.orders.findIndex(
                (o) => o._id === action.payload._id
            );

            if (index !== -1) {
                state.orders[index] = action.payload;
            }

            if (
                state.order &&
                state.order._id === action.payload._id
            ) {
                state.order = action.payload;
            }
        })

        .addCase(updateOrderStatus.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || action.error.message;
        });
}
});

export const { updateTracking } = orderSlice.actions;
export default orderSlice.reducer;