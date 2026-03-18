import { configureStore } from "@reduxjs/toolkit";
import salesReducer from "./slices/salesSlice";
import stockReducer from "./slices/stockSlice";

const store = configureStore({
  reducer: {
    sales: salesReducer,
    stock: stockReducer,
  },
});

export default store;
