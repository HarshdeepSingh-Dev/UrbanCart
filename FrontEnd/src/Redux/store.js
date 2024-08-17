import { configureStore } from "@reduxjs/toolkit";
import { productReducer } from "./Reducers/productReducer";

export const store = configureStore({
    reducer:{
        productReducer,
    },
});