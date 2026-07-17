import { configureStore } from "@reduxjs/toolkit";
import notification from "../features/notificationSlice";
import authSlice from "../features/authSlice.js";
import usersSlice from "../features/usersSlice.js";
import dashboardSlice from "../features/dashboardSlice";
import productsSlice from "../features/productsSlice";
import customuseSlice from "../features/customuseSlice";
import soundNotificationSlice from "../features/soundNotificationSlice";
import notificationsAdminSlice from "../features/notificationsAdminSlice";
import cartSlice from "../features/cartSlice";
import orderSlice from "../features/orderSlice";


export const store = configureStore({
  reducer: {
    notification,
    authSlice,
    dashboardSlice,
    productsSlice,
    customuseSlice,
    orderSlice,
    usersSlice,
    cartSlice,
    notificationsAdminSlice,
    soundNotificationSlice
  },
});