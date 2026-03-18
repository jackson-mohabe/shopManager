import { createSlice } from "@reduxjs/toolkit";

const stockSlice = createSlice({
  name: "stock",
  initialState: {
    productsList: [],
    lowStockItems: [],
  },
  reducers: {
    setProducts: (state, action) => {
      state.productsList = action.payload;
    },
    addProduct: (state, action) => {
      state.productsList.push(action.payload);
    },
    updateProduct: (state, action) => {
      const index = state.productsList.findIndex(
        (p) => p.id === action.payload.id,
      );
      if (index !== -1) {
        state.productsList[index] = action.payload;
      }
    },
    deleteProduct: (state, action) => {
      state.productsList = state.productsList.filter(
        (p) => p.id !== action.payload,
      );
    },
    setLowStock: (state, action) => {
      state.lowStockItems = action.payload;
    },
  },
});

export const {
  setProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  setLowStock,
} = stockSlice.actions;
export default stockSlice.reducer;
