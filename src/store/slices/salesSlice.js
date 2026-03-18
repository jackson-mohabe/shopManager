import { createSlice } from "@reduxjs/toolkit";

const salesSlice = createSlice({
  name: "sales",
  initialState: {
    salesList: [],
    todayTotal: 0,
  },
  reducers: {
    addSale: (state, action) => {
      state.salesList.push(action.payload);
      state.todayTotal += action.payload.total;
    },
    setSales: (state, action) => {
      state.salesList = action.payload;
    },

    resetSales: (state) => {
      state.salesList = [];
      state.todayTotal = 0;
    },
  },
});

export const { addSale, setSales, resetSales } = salesSlice.actions;
export default salesSlice.reducer;
