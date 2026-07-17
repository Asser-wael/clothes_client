import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  visible: false,
  message: "",
  playSound: false,
};

const soundNotificationSlice = createSlice({
  name: "soundNotification",
  initialState,
  reducers: {
    show: (state, action) => {
      state.visible = true;
      state.message = action.payload.message;
      state.playSound = true;
    },

    hide: (state) => {
      state.visible = false;
      state.message = "";
    },

    resetSound: (state) => {
      state.playSound = false;
    },
  },
});

export const { show, hide, resetSound } =
  soundNotificationSlice.actions;

export default soundNotificationSlice.reducer;