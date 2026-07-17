import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/api";

// ─── thunk ──────────────────────────────────────────────────────────────────

export const adminDashboard = createAsyncThunk(
  "dashboardSlice/adminDashboard",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/admin/dashboard");
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  }
);

// ─── slice ───────────────────────────────────────────────────────────────────

const dashboardSlice = createSlice({
  name: "dashboardSlice",

  initialState: {
    todayData: null,   // { revenue, orders, users, products, pendingOrders, avgOrderValue, returnRate, chart[] }
    monthData: null,
    yearData: null,
    type: "month",   // "day" | "month" | "year"
    loading: false,
    error: null,
  },

  reducers: {
    setday: state => {
      try {
        state.type = "day";
      } catch (err) {
        console.error("setday reducer error:", err);
      }
    },
    setMonth: state => {
      try {
        state.type = "month";
      } catch (err) {
        console.error("setMonth reducer error:", err);
      }
    },
    setyear: state => {
      try {
        state.type = "year";
      } catch (err) {
        console.error("setyear reducer error:", err);
      }
    },
  },

  extraReducers: builder => {
    builder
      .addCase(adminDashboard.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(adminDashboard.fulfilled, (state, { payload }) => {
        try {
          state.loading = false;
          state.todayData = payload.day;
          state.monthData = payload.month;
          state.yearData = payload.year;
        } catch (err) {
          console.error("adminDashboard.fulfilled reducer error:", err);
        }
      })
      .addCase(adminDashboard.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      });
  },
});

export const { setday, setMonth, setyear } = dashboardSlice.actions;
export default dashboardSlice.reducer;