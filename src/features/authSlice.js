import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/api";
import axios from "axios";

import { setNotification } from "./notificationSlice"
// api url 
const API_URL = import.meta.env.VITE_API_URL;

// Register
export const registerUser = createAsyncThunk(
    "auth/register", async (formData, { rejectWithValue, dispatch }) => {
        try {
            const res = await axios.post(`${API_URL}/register`, formData)

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

            return res.data

        } catch (error) {
            return rejectWithValue({
                data: error.response?.data,
                status: error.response?.status,
            });
        }
    })

export const loginUser = createAsyncThunk(
    "auth/login", async (formData, { rejectWithValue, dispatch }) => {
        try {

            const res = await axios.post(`${API_URL}/login`, formData, {
                withCredentials: true
            });

            try {
                localStorage.setItem("accessToken", res.data.accessToken);
            } catch (err) {
                console.error("Failed to save accessToken to localStorage:", err);
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
                await dispatch(getUser())
            } catch (err) {
                console.error("getUser dispatch error:", err);
            }

            return res.data
        }
        catch (error) {
            return rejectWithValue({
                data: error.response?.data,
                status: error.response?.status,
            });
        }
    })

export const getUser = createAsyncThunk(
    "auth/getUser", async (_, { rejectWithValue }) => {
        try {
            let token = null;
            try {
                token = localStorage.getItem("accessToken");
            } catch (err) {
                console.error("Failed to read accessToken from localStorage:", err);
            }

            // if (token) {

            const res = await api.get(`/user`)
            // }
            return res.data
        }
        catch (error) {
            return rejectWithValue({
                data: error.response?.data,
                status: error.response?.status,
            });
        }
    }
)
///////////////
export const logoutUser = createAsyncThunk(
    "auth/logout",
    async (_, { rejectWithValue }) => {
        try {
            // امسح الـ subscription من الـ backend قبل الـ logout
            try {
                const reg = await navigator.serviceWorker.getRegistration();
                if (reg) {
                    const sub = await reg.pushManager.getSubscription();
                    if (sub) {
                        try {
                            await fetch(`${API_URL}/delete-admin-subscription`, {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ endpoint: sub.endpoint }),
                            });
                        } catch (err) {
                            console.error("Failed to delete admin subscription on server:", err);
                        }

                        try {
                            await sub.unsubscribe();
                        } catch (err) {
                            console.error("Failed to unsubscribe:", err);
                        }
                    }
                }
            } catch (err) {
                console.error("Failed to clean up push subscription on logout:", err);
            }

            await axios.post(
                `${API_URL}/logout`,
                {},
                { withCredentials: true }
            );

            try {
                localStorage.removeItem("accessToken");
            } catch (err) {
                console.error("Failed to remove accessToken from localStorage:", err);
            }

            return true;
        } catch (err) {
            return rejectWithValue(err.response?.data);
        }
    }
);
//////////////////////
const authSlice = createSlice({
    name: "authSlice",
    initialState: {
        userData: null,

        loadingRegister: false,
        loadingLogin: false,
        loadingUser: false,

        error: null,
    },

    extraReducers: (builder) => {
        builder

            /* Register */

            .addCase(registerUser.pending, (state) => {
                state.loadingRegister = true;
            })

            .addCase(registerUser.fulfilled, (state) => {
                state.loadingRegister = false;
            })

            .addCase(registerUser.rejected, (state, action) => {
                state.loadingRegister = false;
                state.error = action.payload;
            })

            /* Login */

            .addCase(loginUser.pending, (state) => {
                state.loadingLogin = true;
            })

            .addCase(loginUser.fulfilled, (state) => {
                state.loadingLogin = false;
            })

            .addCase(loginUser.rejected, (state, action) => {
                state.loadingLogin = false;
                state.error = action.payload;
            })

            /* Get User */
            .addCase(getUser.pending, (state) => {
                state.loadingUser = true;
            })

            .addCase(getUser.fulfilled, (state, action) => {
                try {
                    state.loadingUser = false;
                    state.userData = action.payload;
                } catch (err) {
                    console.error("getUser.fulfilled reducer error:", err);
                }
            })

            .addCase(getUser.rejected, (state, action) => {
                state.loadingUser = false;
                state.error = action.payload;
            });
    }

});

export default authSlice.reducer;