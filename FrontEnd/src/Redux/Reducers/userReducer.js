import axios from 'axios';
import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import {toast} from "react-toastify";
const api = process.env.REACT_APP_BACKEND_API; ;

const initialState = {
    error:null,
    loading:false,
    message:null
}

const UserSlice = createSlice({
    name:"user",
    initialState,
    reducers:{

    },
    extraReducers:builder=>{
        builder
        // for user authentication
        .addCase(userAuth.fulfilled,(state,action)=>{
            state.isAuthenticated=true;
            state.user=action.payload;
            state.loading=false;
        })
        .addCase(userAuth.pending,(state)=>{
            state.loading=true;
        })
        .addCase(userAuth.rejected,(state,action)=>{
            state.isAuthenticated=false;
            state.error=action.payload;
            state.loading=false;
        })
        // for login
        .addCase(loginAsync.fulfilled,(state,action)=>{
            state.loading=false;
            state.message=action.payload;
        })
        .addCase(loginAsync.pending,(state,action)=>{
            state.loading=true;
        })
        .addCase(loginAsync.rejected,(state,action)=>{
            state.error=action.payload;
            state.loading=false;
        })
        // for signup
        .addCase(signupAsync.fulfilled,(state, action)=>{
            state.message=action.payload;
            state.loading=false
        })
        .addCase(signupAsync.pending,(state, action)=>{
            state.loading=true;
        })
        .addCase(signupAsync.rejected,(state, action)=>{
            state.error=action.payload;
            state.loading=false;
        })
    }
});

// log in the user
export const loginAsync = createAsyncThunk(
    "user/Login",
    async(user,{rejectWithValue})=>{
        try {
            const res = await axios.post(`${api}/user/login`,user);
            localStorage.setItem('token',res.data.token);
            toast.success(res.data.message);
            return res.data.message;    
        } catch (error) {
            toast.error(error.response.data.message);
            return rejectWithValue(error.response.data.message);
        }
    }
);

// signup||create new user
export const signupAsync = createAsyncThunk(
    "user/signup",
    async(user,{rejectWithValue})=>{
        try {
            const res = await axios.post(`${api}/user/signup`,user);
            console.log(res);
            toast.success(res.data.message);
            return res.data.message; 
        } catch (error) {
            toast.error(error.response.data.message);
            return rejectWithValue(error.response.data.message);
        }
    }
);

// check user authentication
export const userAuth = createAsyncThunk(
    "user/authUser",
    async(_,{rejectWithValue})=>{
        try {
            const res = await axios.get(`${api}/user/authUser`,
                {
                    headers:{"Authorization": `Bearer ${localStorage.getItem('token')}`}
                }
            );
            
            localStorage.setItem('userName',res.data.name);
            localStorage.setItem('userEmail',res.data.email);
            localStorage.setItem('isAuthenticated',true);
            return res.data;
        } catch (error) {
            localStorage.removeItem('token');
            localStorage.removeItem('userName');
            localStorage.removeItem('userEmail');
            localStorage.setItem('isAuthenticated', false);
            return rejectWithValue(error.message);
        }
    }
);

// signing out user
export const signOut = createAsyncThunk(
    '/user/signout',
    async(_,{rejectWithValue})=>{
        try {
            const res = await axios.post(`${api}/user/signout`);
            localStorage.removeItem('token');
            localStorage.removeItem('userName');
            localStorage.removeItem('userEmail');
            toast.success(res.data.message);
        } catch (error) {
            console.log(error);
            return rejectWithValue(error.message);
        }
    }
);

export const userReducer = UserSlice.reducer;
export const userActions = UserSlice.actions;
export const userSelector = (state)=>state.userReducer;