import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/api";

export const fetchNotifications = createAsyncThunk(
  "notifications/fetchNotifications",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/admin/notifications");
      return data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Error fetching notifications");
    }
  }
);

export const markNotificationAsRead = createAsyncThunk(
  "notifications/markAsRead",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await api.put(`/admin/notifications/${id}/read`);
      return data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Error updating notification");
    }
  }
);

export const markAllNotificationsAsRead = createAsyncThunk(
  "notifications/markAllAsRead",
  async (_, { rejectWithValue }) => {
    try {
      await api.put("/admin/notifications/read-all");
      return true;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Error updating notifications");
    }
  }
);

export const deleteNotification = createAsyncThunk(
  "notifications/deleteNotification",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/admin/notifications/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Error deleting notification");
    }
  }
);

const notificationsAdminSlice = createSlice({
  name: "notifications",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {
    addNotification: (state, action) => {
      state.items.unshift(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(markNotificationAsRead.fulfilled, (state, action) => {
        const notification = state.items.find((n) => n._id === action.payload._id);
        if (notification) notification.read = true;
      })
      .addCase(markAllNotificationsAsRead.fulfilled, (state) => {
        state.items.forEach((n) => {
          n.read = true;
        });
      })
      .addCase(deleteNotification.fulfilled, (state, action) => {
        state.items = state.items.filter((n) => n._id !== action.payload);
      });
  },
});

export const { addNotification } = notificationsAdminSlice.actions;

export default notificationsAdminSlice.reducer;