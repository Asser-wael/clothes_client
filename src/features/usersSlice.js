import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/api";
import { setNotification } from "./notificationSlice";

export const getAllUsers = createAsyncThunk(
  "users/getAllUsers",
  async (_, { rejectWithValue, dispatch }) => {
    try {
      const res = await api.get("/admin/users");
      console.log(res.data);

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

      return res.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  }
);

export const deleteUser = createAsyncThunk(
  "users/deleteUser",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/admin/deleteUser/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  }
);

export const changeStatus = createAsyncThunk(
  "users/changeStatus",
  async ({ id, status }, { rejectWithValue, dispatch }) => {
    try {
      const res = await api.put(`/admin/changeStatus/${id}`, {
        status,
      });

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

      return {
        id: res.data.id,
        status,
      };
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  }
);

const isViewValid = (view) => {
  if (!view) return false;
  if (!view._id) return false;
  return true;
};

const getInitialView = () => {
  try {
    const stored = localStorage.getItem("view");
    if (!stored) return null;

    const parsed = JSON.parse(stored);

    if (!isViewValid(parsed)) {
      try {
        localStorage.removeItem("view");
      } catch (err) {
        console.error("Failed to remove invalid view from localStorage:", err);
      }
      return null;
    }

    return parsed;
  } catch (err) {
    console.error("Failed to parse initial view:", err);
    return null;
  }
};
// review
export const addReview = createAsyncThunk(
  "users/addReview",
  async ({ id, review }, thunkAPI) => {
    try {
      const { data } = await api.post(
        `/review/${id}`,
        review
      );

      return data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data);
    }
  }
);
const usersSlice = createSlice({
  name: "usersSlice",
  initialState: {
    usersData: [],
    view: getInitialView(),
    loadingUsers: false,
    loadingDelete: false,

    loadingStatus: false,
    error: null,
  },

  reducers: {
    setView: (state, action) => {
      try {
        const payload = action.payload;

        if (!isViewValid(payload)) {
          console.warn("Invalid view (missing _id), clearing view instead:", payload);
          state.view = null;
          try {
            localStorage.removeItem("view");
          } catch (err) {
            console.error("Failed to remove view from localStorage:", err);
          }
          return;
        }

        state.view = payload;

        try {
          localStorage.setItem(
            "view",
            JSON.stringify(payload)
          );
        } catch (err) {
          console.error("Failed to save view to localStorage:", err);
        }
      } catch (err) {
        console.error("setView reducer error:", err);
      }
    },

    clearView: (state) => {
      try {
        state.view = null;
        localStorage.removeItem("view");
      } catch (err) {
        console.error("clearView reducer error:", err);
      }
    },
  },

  extraReducers: (builder) => {
    builder
      // GET USERS
      .addCase(addReview.fulfilled, (state, action) => {
        state.view = action.payload;
      })
      .addCase(getAllUsers.pending, (state) => {
        state.loadingUsers = true;
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.loadingUsers = false;
        state.usersData = action.payload;
      })
      .addCase(getAllUsers.rejected, (state, action) => {
        state.loadingUsers = false;
        state.error = action.payload;
      })
      // changeStatus
      .addCase(changeStatus.pending, (state) => {
        state.loadingStatus = true;
      })
      .addCase(changeStatus.fulfilled, (state, action) => {
        try {
          state.loadingStatus = false;

          const user = state.usersData.find(
            (u) => u._id === action.payload.id
          );

          if (user) {
            user.status = action.payload.status;
          }
        } catch (err) {
          console.error("changeStatus.fulfilled reducer error:", err);
        }
      })
      // DELETE
      .addCase(deleteUser.pending, (state) => {
        state.loadingDelete = true;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        try {
          state.loadingDelete = false;
          state.usersData = state.usersData.filter(
            (user) => user._id !== action.payload
          );
        } catch (err) {
          console.error("deleteUser.fulfilled reducer error:", err);
        }
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loadingDelete = false;
        state.error = action.payload;
      });
  },
});

export const { setView, clearView } = usersSlice.actions;
export default usersSlice.reducer;