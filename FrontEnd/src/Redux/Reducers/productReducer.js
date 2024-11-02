import axios from 'axios';
import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import {toast} from "react-toastify";
const url = "https://dummyjson.com/products";   //for getting dummy products
const api = "http://localhost:8000";            //for connection with our backend

const initialState = {
    totalCartItems:0,
    products:[],
    cartItems:[],
    loading:false,
    error:null,
    editedProduct:null,
    message:null,
    orders:[]
}

const ProductSlice = createSlice({
    name:"product",
    initialState:initialState,
    reducers:{},
    extraReducers:builder=>{
        builder
        // add cases for getProductsAsync
        .addCase(getProductsAsync.fulfilled,(state,action)=>{
            state.products=action.payload;
            state.loading = false;
        })
        .addCase(getProductsAsync.pending,(state)=>{
            state.loading=true;
        })
        .addCase(getProductsAsync.rejected,(state,action)=>{
            state.error=action.payload;
            state.loading=false;
        })
        // case for add to cart
        .addCase(addToCartAsync.fulfilled,(state, action)=>{
            state.message=action.payload;
            state.loading=false;
        })
        .addCase(addToCartAsync.pending,(state)=>{
            state.loading=true;
        })
        .addCase(addToCartAsync.rejected,(state, action)=>{
            state.loading=false;
            state.error=action.payload
        })
        // add cases for getFromDbAsync
        .addCase(getFromDbAsync.fulfilled,(state,action)=>{
            state.cartItems=action.payload;
            state.loading=false;
        })
        .addCase(getFromDbAsync.pending,(state)=>{
            state.loading=true;
        })
        .addCase(getFromDbAsync.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.payload;
        })
        // add cases for removeFromCartAsync
        .addCase(removeFromCartAsync.fulfilled,(state,action)=>{
            state.cartItems=state.cartItems.filter(item=>item.product.id!==action.payload);
            state.loading=false;
        })
        .addCase(removeFromCartAsync.pending,(state)=>{
            state.loading=true;
        })
        .addCase(removeFromCartAsync.rejected,(state, action)=>{
            state.error = action.payload;
            state.loading=false;
        })            
        // add case for increasing quantity
        .addCase(increaseQuantity.fulfilled, (state,action)=>{
            const productId = action.payload;
            const product = state.cartItems.find(item=>item.product.id===productId);
            if(product){
                product.quantity+=1;
            }
            state.loading=false;
        })
        .addCase(increaseQuantity.pending, (state)=>{
            state.loading=true;
        })
        .addCase(increaseQuantity.rejected, (state,action)=>{
            state.loading=false;
            state.error=action.payload;
        })
        // add case for decreasing quantity
        .addCase(decreaseQuantity.fulfilled, (state,action)=>{
            const productId = action.payload;
            const product = state.cartItems.find(item=>item.product.id===productId);
            if(product){
                product.quantity-=1;
            }
            state.loading=false;
        })
        .addCase(decreaseQuantity.pending, (state)=>{
            state.loading=true;
        })
        .addCase(decreaseQuantity.rejected, (state,action)=>{
            state.loading=false;
            state.error=action.payload;
        })
        // add case for purchase items
        .addCase(purchaseOrderAsync.fulfilled,(state, action)=>{
            state.cartItems=[];
            state.orders=action.payload;
            state.loading=false;
        })
        .addCase(purchaseOrderAsync.pending,(state)=>{
            state.loading=true;
        })
        .addCase(purchaseOrderAsync.rejected,(state, action)=>{
            state.error=action.payload;
            state.loading=false;
        })
        // get orders from db
        .addCase(getOrders.fulfilled, (state, action)=>{
            state.orders=action.payload;
            state.loading=false;
        })
        .addCase(getOrders.pending, (state, action)=>{
            state.loading=true;
        })
        .addCase(getOrders.rejected, (state, action)=>{
            state.error=action.payload;
            state.loading=false;
        })
    }
});

//getting all products from api
export const getProductsAsync = createAsyncThunk(
    "products/get",
    async(_,{rejectWithValue})=>{
        try {
            const res = await axios.get(url);
            return res.data;
        }catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

//sending product to server to add into db
export const addToCartAsync = createAsyncThunk(
    "products/addToCart",
    async(product,{rejectWithValue})=>{
        try {     
            const res = await axios.post(`${api}/cart/add`,
                product,
            {
                headers: {"Authorization": `Bearer ${localStorage.getItem('token')}`},
            }
        );
        toast.success(res.data.message);
        return res.data.message;

        }catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
            return rejectWithValue(error.response);
        }
    }
);

// get all products from our db
export const getFromDbAsync = createAsyncThunk(
    "products/getFromDb",
    async(_,{rejectWithValue})=>{
        try {
            const res = await axios.get(`${api}/cart/allproducts`,
                {
                    headers:{"Authorization": `Bearer ${localStorage.getItem('token')}`}
                }
            );
            console.log(res.data);
              return res.data;
        } catch (error) {
            console.log(error);
            return rejectWithValue(error.response.data);
        }
    }   
);

// remove a product from cart
export const removeFromCartAsync = createAsyncThunk(
    "product/removeFromCart",
    async(product,{rejectWithValue})=>{
        try {
            const res = await axios.post(`${api}/cart/remove`,
                product,
                {
                    headers:{"Authorization":`Bearer ${localStorage.getItem('token')}`}
                }
            );
            toast.success(res.data.message);
            return res.data.product.id;
        } catch (error) {
            console.log(error);
            toast.error(error.response.message);
            return rejectWithValue(error.response.message);
        }
    }
);

// to increase product qty in cart
export const increaseQuantity=createAsyncThunk(
    "product/increaseQuantity",
    async(product,{rejectWithValue})=>{
        try {
            const res = await axios.put(`${api}/cart/increaseQuantity`,
                product,
                {
                    headers: {"Authorization":`Bearer ${localStorage.getItem('token')}`}
                }
            );
            console.log(res.data);
            toast.success(res.data.message);
            return res.data.product.id
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
            return rejectWithValue(error.response.data);
        }
    }
    
);

// to decrease product qty in cart
export const decreaseQuantity=createAsyncThunk(
    "product/decreaseQuantity",
    async(product,{rejectWithValue})=>{
        try {
            const res = await axios.put(`${api}/cart/decreaseQuantity`,
                product,
                {
                    headers: {"Authorization":`Bearer ${localStorage.getItem('token')}`}
                }
            );
            console.log(res.data);
            toast.success(res.data.message);
            return res.data.product.id
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
            return rejectWithValue(error.response.data);
        }
    }
);

// purchase cart order
export const purchaseOrderAsync=createAsyncThunk(
    "product/purchase",
    async(cartItems,{rejectWithValue})=>{
        try {
            const res = await axios.post(`${api}/cart/purchase`,
                cartItems,
                {
                    headers: {"Authorization":`Bearer ${localStorage.getItem('token')}`}
                }
            );
            console.log(res);
            const username = localStorage.getItem('userName');
            const useremail = localStorage.getItem('userEmail');

            // Open Razorpay Checkout
            
             /* global Razorpay */   //this comment is for including razorpay script globally
            const options = {
                key: process.env.RAZORPAY_KEY_ID,
                amount: res.data.amount,
                currency: 'INR',
                name: "UrbanCart",
                description: 'Purchase items',
                order_id: res.data.orderId, // This is the order_id created in the backend
                
                // Payment success handler
                handler: async function (res) {
                    try {
                        const paymentResponse = await axios.post(`${api}/orders/verifyPayment`,{
                            orderId: res.razorpay_order_id,
                            paymentId: res.razorpay_payment_id,
                            signature: res.razorpay_signature,
                            cartProducts:cartItems
                        },
                    {
                        headers:{"Authorization":`Bearer ${localStorage.getItem('token')}`}
                    }
                    );

                        console.log(">>>final response<<<",paymentResponse);
                        toast.success('Payment successful');

                    } catch (error) {
                        console.log(res);
                        toast.error('Payment Failed. Please try again.');
                    }
                },
                prefill: {
                  name: username,
                  email: useremail,
                },
                theme: {
                  color: '#F37254'
                },
              };
        
            const razorpay = new Razorpay(options);
            razorpay.open();
            return res.data.orderdItems;

        } catch (error) {
            console.log(error);
            return rejectWithValue(error.response.data);
        }
    }
);

// get orders of the user
export const getOrders = createAsyncThunk(
    'product/getOrders',
    async(_,{rejectWithValue})=>{
        try {
            const res = await axios.get(`${api}/orders/getOrders`,
                {
                    headers: {"Authorization":`Bearer ${localStorage.getItem('token')}`}
                }
            )
            console.log(res.data.orders);
            return res.data.orders;

        } catch (error) {
            console.log(error);
            return rejectWithValue(error.response.data);
        }
    }
);

export const productReducer = ProductSlice.reducer;
export const productActions = ProductSlice.actions;
export const productSelector = (state)=>state.productReducer;