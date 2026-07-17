// notificationSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  message: "",
  type: "", // success | error | info
  visible: false,
};

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    setNotification: (state, action) => {
      state.message = action.payload.message;
      state.type = action.payload.type;
      state.visible = true;
    },

    clearNotification: (state) => {
      state.message = "";
      state.type = "";
      state.visible = false;
    },
  },
});

export const { setNotification, clearNotification } =
  notificationSlice.actions;

export default notificationSlice.reducer;