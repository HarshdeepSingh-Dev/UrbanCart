import { configureStore } from "@reduxjs/toolkit";
import { productReducer } from "./Reducers/productReducer";
import { userReducer } from "./Reducers/userReducer"; 

export const store = configureStore({
    reducer:{
        productReducer,
        userReducer
    },
});