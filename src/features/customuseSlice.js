import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/api";
import { setNotification } from "./notificationSlice";

export const getAllCategories = createAsyncThunk(
    "categories/getAll",
    async (_, { rejectWithValue }) => {
        try {
            const res = await api.get("/getAllCategories");
            return res.data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data);
        }
    }
);

export const getOffers = createAsyncThunk(
    "offers/getOffers",
    async (_, { rejectWithValue }) => {
        try {
            const res = await api.get("/getOffers");

            return res.data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data);
        }
    }
);

export const getAllOffers = createAsyncThunk(
    "offers/getAllOffers",
    async (_, { rejectWithValue }) => {
        try {
            const res = await api.get("/getAllOffers");

            return res.data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data);
        }
    }
);

export const addNewCategory = createAsyncThunk(
    "categories/add",
    async (formdata, { rejectWithValue, dispatch }) => {
        try {
            const res = await api.post("/addNewCategory", formdata);

            try {
                dispatch(setNotification({
                    message: res.data.message,
                    type: res.data.type,
                }));
            } catch (err) {
                console.error("setNotification dispatch error:", err);
            }

            return res.data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data);
        }
    }
);

export const deleteCategory = createAsyncThunk(
    "categories/delete",
    async (id, { rejectWithValue, dispatch }) => {
        try {
            const res = await api.delete(`/deleteCategory/${id}`);

            try {
                dispatch(setNotification({
                    message: res.data.message,
                    type: res.data.type,
                }));
            } catch (err) {
                console.error("setNotification dispatch error:", err);
            }

            return id;
        } catch (err) {
            return rejectWithValue(err.response?.data);
        }
    }
);

export const getPopularProducts = createAsyncThunk(
    "popular/getAll",
    async (_, { rejectWithValue }) => {
        try {
            const res = await api.get("/getPopularProducts");
            return res.data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data);
        }
    }
);

export const addPopular = createAsyncThunk(
    "popular/add",
    async (id, { rejectWithValue, dispatch }) => {
        try {
            const res = await api.post("/addPopular", { id });

            try {
                dispatch(setNotification({
                    message: res.data.message,
                    type: res.data.type,
                }));
            } catch (err) {
                console.error("setNotification dispatch error:", err);
            }

            return res.data.popularProduct;
        } catch (err) {
            return rejectWithValue(err.response?.data);
        }
    }
);

export const deletePopular = createAsyncThunk(
    "popular/delete",
    async (id, { rejectWithValue, dispatch }) => {
        try {
            const res = await api.delete(`/deletePopular/${id}`);

            try {
                dispatch(setNotification({
                    message: res.data.message,
                    type: res.data.type,
                }));
            } catch (err) {
                console.error("setNotification dispatch error:", err);
            }

            return id;
        } catch (err) {
            return rejectWithValue(err.response?.data);
        }
    }
);

const customuseSlice = createSlice({
    name: "customuse",
    initialState: {
        categories: [],
        offers: [],
        allOffers: [],
        popularProducts: [],
        loadingoffers: false,
        loadingAllOffers: false,
        loadingCategories: false,
        loadingPopular: false,

        loadingCreateCategory: false,
        loadingDeleteCategory: false,

        loadingAddPopular: false,
        loadingDeletePopular: false,
    },

    extraReducers: (builder) => {
        builder

            .addCase(getAllCategories.pending, (state) => {
                state.loadingCategories = true;
            })
            .addCase(getAllCategories.fulfilled, (state, action) => {
                try {
                    state.loadingCategories = false;
                    state.categories = action.payload;
                } catch (err) {
                    console.error("getAllCategories.fulfilled reducer error:", err);
                }
            })
            .addCase(getAllCategories.rejected, (state) => {
                state.loadingCategories = false;
            })

            .addCase(getOffers.pending, (state) => {
                state.loadingoffers = true;
            })
            .addCase(getOffers.fulfilled, (state, action) => {
                try {
                    state.loadingoffers = false;
                    state.offers = action.payload;
                } catch (err) {
                    console.error("getOffers.fulfilled reducer error:", err);
                }
            })
            .addCase(getOffers.rejected, (state) => {
                state.loadingoffers = false;
            })

            .addCase(getAllOffers.pending, (state) => {
                state.loadingAllOffers = true;
            })
            .addCase(getAllOffers.fulfilled, (state, action) => {
                try {
                    state.loadingAllOffers = false;
                    state.allOffers = action.payload;
                } catch (err) {
                    console.error("getAllOffers.fulfilled reducer error:", err);
                }
            })
            .addCase(getAllOffers.rejected, (state) => {
                state.loadingAllOffers = false;
            })

            .addCase(addNewCategory.pending, (state) => {
                state.loadingCreateCategory = true;
            })
            .addCase(addNewCategory.fulfilled, (state, action) => {
                try {
                    state.loadingCreateCategory = false;
                    state.categories.push(action.payload);
                } catch (err) {
                    console.error("addNewCategory.fulfilled reducer error:", err);
                }
            })
            .addCase(addNewCategory.rejected, (state) => {
                state.loadingCreateCategory = false;
            })

            .addCase(deleteCategory.pending, (state) => {
                state.loadingDeleteCategory = true;
            })
            .addCase(deleteCategory.fulfilled, (state, action) => {
                try {
                    state.loadingDeleteCategory = false;
                    state.categories = state.categories.filter(
                        (c) => c._id !== action.payload
                    );
                } catch (err) {
                    console.error("deleteCategory.fulfilled reducer error:", err);
                }
            })
            .addCase(deleteCategory.rejected, (state) => {
                state.loadingDeleteCategory = false;
            })

            .addCase(getPopularProducts.pending, (state) => {
                state.loadingPopular = true;
            })
            .addCase(getPopularProducts.fulfilled, (state, action) => {
                try {
                    state.loadingPopular = false;
                    state.popularProducts = action.payload;
                } catch (err) {
                    console.error("getPopularProducts.fulfilled reducer error:", err);
                }
            })
            .addCase(getPopularProducts.rejected, (state) => {
                state.loadingPopular = false;
            })

            .addCase(addPopular.pending, (state) => {
                state.loadingAddPopular = true;
            })
            .addCase(addPopular.fulfilled, (state, action) => {
                try {
                    state.loadingAddPopular = false;
                    state.popularProducts.push(action.payload);
                } catch (err) {
                    console.error("addPopular.fulfilled reducer error:", err);
                }
            })
            .addCase(addPopular.rejected, (state) => {
                state.loadingAddPopular = false;
            })

            .addCase(deletePopular.pending, (state) => {
                state.loadingDeletePopular = true;
            })
            .addCase(deletePopular.fulfilled, (state, action) => {
                try {
                    state.loadingDeletePopular = false;
                    state.popularProducts = state.popularProducts.filter(
                        (p) => p._id !== action.payload
                    );
                } catch (err) {
                    console.error("deletePopular.fulfilled reducer error:", err);
                }
            })
            .addCase(deletePopular.rejected, (state) => {
                state.loadingDeletePopular = false;
            });
    },
});
export default customuseSlice.reducer;