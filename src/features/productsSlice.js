import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/api";
import { setNotification } from "./notificationSlice";
import { clearView, setView } from "./usersSlice";


const notify = (dispatch, res) => {
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
};

const getStoredView = () => {
    try {
        const storedView = localStorage.getItem("view");
        return storedView ? JSON.parse(storedView) : null;
    } catch (err) {
        console.error("Failed to read/parse stored view:", err);
        return null;
    }
};

//  GET 
export const getAllProducts = createAsyncThunk(
    "products/getAllProducts",
    async (_, { rejectWithValue, dispatch }) => {
        try {
            const res = await api.get("/getAllProducts");
            return res.data.data;
        } catch (err) {
            return rejectWithValue(err.response?.data);
        }
    }
);

//  ADD 
export const addProduct = createAsyncThunk(
    "products/addProduct",
    async (formData, { rejectWithValue, dispatch }) => {
        try {
            const res = await api.post("/addProduct", formData);
            notify(dispatch, res);
            return res.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data);
        }
    }
);

//  DELETE 
export const removeProduct = createAsyncThunk(
    "products/removeProduct",
    async (id, { rejectWithValue, dispatch }) => {
        try {
            const res = await api.delete(`/removeProduct/${id}`);
            notify(dispatch, res);


            try {
                const parsedView = getStoredView();
                if (parsedView?._id === id) {
                    dispatch(clearView());
                }
            } catch (err) {
                console.error("Failed to check/clear stale view after delete:", err);
            }

            return id;
        } catch (error) {
            return rejectWithValue(error.response?.data);
        }
    }
);

// VIEW 
export const viewProduct = createAsyncThunk(
    "products/viewProduct",
    async (id, { rejectWithValue }) => {
        try {
            const res = await api.get(`/viewProduct/${id}`);

            return res.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data);
        }

    }
);

//  EDIT 
export const editProduct = createAsyncThunk(
    "products/editProduct",
    async ({ formData, id }, { rejectWithValue, dispatch }) => {
        try {
            const res = await api.put(`/editProduct/${id}`, formData);
            notify(dispatch, res);


            try {
                const parsedView = getStoredView();
                if (parsedView?._id === id) {
                    dispatch(setView(res.data.data));
                }
            } catch (err) {
                console.error("Failed to sync view after edit:", err);
            }

            return res.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data);
        }
    }
);

//  SLICE 
const productsSlice = createSlice({
    name: "productsSlice",

    initialState: {
        products: [],
        cat: "All",
        selectedProduct: null,
        selectedProductToEdit: null,

        loadingProducts: false,
        loadingAdd: false,
        loadingDelete: false,
        loadingView: false,
        loadingEdit: false,

        error: null,
    },

    reducers: {
        clearProduct: (state) => {
            try {
                state.selectedProduct = null;
            } catch (err) {
                console.error("clearProduct reducer error:", err);
            }
        },
        clearIdToEdit: (state) => {
            try {
                state.selectedProductToEdit = null;
            } catch (err) {
                console.error("clearIdToEdit reducer error:", err);
            }
        },
        setIdToEdit: (state, action) => {
            try {
                state.selectedProductToEdit = action.payload;
            } catch (err) {
                console.error("setIdToEdit reducer error:", err);
            }
        },
        setCat: (state, action) => {
            try {
                state.cat = action.payload;
            } catch (err) {
                console.error("setCat reducer error:", err);
            }
        },
    },

    extraReducers: (builder) => {
        builder

            //  GET 
            .addCase(getAllProducts.pending, (state) => {
                state.loadingProducts = true;
            })
            .addCase(getAllProducts.fulfilled, (state, action) => {
                try {
                    state.loadingProducts = false;
                    state.products = action.payload;
                } catch (err) {
                    console.error("getAllProducts.fulfilled reducer error:", err);
                }
            })
            .addCase(getAllProducts.rejected, (state, action) => {
                state.loadingProducts = false;
                state.error = action.payload;
            })

            //  ADD 
            .addCase(addProduct.pending, (state) => {
                state.loadingAdd = true;
            })
            .addCase(addProduct.fulfilled, (state, action) => {
                try {
                    state.loadingAdd = false;
                    state.products.push(action.payload);
                } catch (err) {
                    console.error("addProduct.fulfilled reducer error:", err);
                }
            })
            .addCase(addProduct.rejected, (state, action) => {
                state.loadingAdd = false;
                state.error = action.payload;
            })

            //  DELETE
            .addCase(removeProduct.pending, (state) => {
                state.loadingDelete = true;
            })
            .addCase(removeProduct.fulfilled, (state, action) => {
                try {
                    state.loadingDelete = false;

                    state.products = state.products.filter(
                        (product) => product._id !== action.payload
                    );
                } catch (err) {
                    console.error("removeProduct.fulfilled reducer error:", err);
                }
            })
            .addCase(removeProduct.rejected, (state, action) => {
                state.loadingDelete = false;
                state.error = action.payload;
            })

            //  VIEW 
            .addCase(viewProduct.pending, (state) => {
                state.loadingView = true;
            })
            .addCase(viewProduct.fulfilled, (state, action) => {
                try {
                    state.loadingView = false;
                    state.selectedProduct = action.payload;
                } catch (err) {
                    console.error("viewProduct.fulfilled reducer error:", err);
                }
            })
            .addCase(viewProduct.rejected, (state, action) => {
                state.loadingView = false;
                state.error = action.payload;
            })
            // EDIT 
            .addCase(editProduct.pending, (state) => {
                state.loadingEdit = true;
            })
            .addCase(editProduct.fulfilled, (state, action) => {
                try {
                    state.loadingEdit = false;

                    const index = state.products.findIndex(
                        (product) => product._id === action.payload._id
                    );

                    if (index !== -1) {
                        state.products[index] = action.payload;
                    }

                    if (state.selectedProduct?._id === action.payload._id) {
                        state.selectedProduct = action.payload;
                    }
                } catch (err) {
                    console.error("editProduct.fulfilled reducer error:", err);
                }
            })
            .addCase(editProduct.rejected, (state, action) => {
                state.loadingEdit = false;
                state.error = action.payload;
            });
    },
});

export const { clearProduct, clearIdToEdit, setIdToEdit, setCat } = productsSlice.actions;
export default productsSlice.reducer;