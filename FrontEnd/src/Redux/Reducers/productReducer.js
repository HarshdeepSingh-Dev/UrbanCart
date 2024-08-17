import axios from 'axios';
import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import { db } from '../../firebase';
import {toast} from "react-toastify";
import { addDoc, collection, deleteDoc, doc, getDocs, updateDoc } from 'firebase/firestore';
const url = "https://my-json-server.typicode.com/Harshh-singh/Ecommerce-demo/blob/master/products/";

const initialState = {
    totalCartItems:0,
    products:[],
    cartItems:[],
    loading:false,
    error:null,
    editedProduct:null,
}

const ProductSlice = createSlice({
    name:"product",
    initialState:initialState,
    reducers:{
        // delete product from list
        deleteProduct:(state,action)=>{
            const productId = action.payload;
            state.products = state.products.filter(product=>product.id!==productId);
            toast.success("Product deleted!!");
        },
        // edit product
        editProduct:(state, action)=>{
             state.editedProduct=action.payload;
        }
    },
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
            state.cartItems=state.cartItems.filter(item=>item.id!==action.payload);
            state.loading=false;
        })
        .addCase(removeFromCartAsync.pending,(state)=>{
            state.loading=true;
        })
        .addCase(removeFromCartAsync.rejected,(state, action)=>{
            state.error = action.payload;
            state.loading=false;
        })
        // add cases for purchaseOrderAsync
        .addCase(purchaseOrderAsync.fulfilled, (state,action)=>{
            state.cartItems=[];
            state.loading=false;
        })
        .addCase(purchaseOrderAsync.pending, (state)=>{
            state.loading=true;
        })
        .addCase(purchaseOrderAsync.rejected, (state,action)=>{
            state.error=action.payload;
            state.loading=false;
        })     
        // add case to add a new product
        .addCase(addProductAsync.fulfilled, (state, action)=>{
            state.products.push(...state.products, action.payload);
            state.loading=false;
        })   
        .addCase(addProductAsync.pending, (state)=>{
            state.loading=true;
        })   
        .addCase(addProductAsync.rejected, (state, action)=>{
            state.error=action.payload;
        })   
    }
})

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

//adding product to cart in firestore db
export const addToCartAsync = createAsyncThunk(
    "products/addToCart",
    async(product,{rejectWithValue})=>{
        try {
            const cart = await getDocs(collection(db,"Cart"));
            let itemExists = false;
            cart.forEach((item)=>{
                if (item.data().id===product.id) {
                    itemExists=true;
                    const productId=item.id;
                    const currentQuantity=item.data().quantity;
                    const cartItemRef=doc(db,"Cart",productId);
                     updateDoc(cartItemRef,{
                        quantity:currentQuantity+1,
                     })
                     toast.success("Added to Cart");
                }
            });
            if(!itemExists){
                await addDoc(collection(db,"Cart"), {
                    id:product.id,
                    description:product.description,
                    image:product.image,
                    name:product.name,
                    price:product.price,
                    quantity:1
                })
                toast.success("Added to Cart");
            }
            
        } catch (error) {
            toast.error("Error adding to cart");
            return rejectWithValue(error);
        }
    }
);

// get all products from our db
export const getFromDbAsync = createAsyncThunk(
    "products/getFromDb",
    async(_,{rejectWithValue})=>{
        try {
            const querySnapshot = await getDocs(collection(db,"Cart"));
            const items = []; 
            querySnapshot.forEach((doc) => {
                items.push({...doc.data()});
              });
              return items;
        } catch (error) {
            return rejectWithValue(error);
        }
    }   
)

// remove a product from cart
export const removeFromCartAsync = createAsyncThunk(
    "product/removeFromCart",
    async(product,{rejectWithValue})=>{
        try {
            const cartItems=await getDocs(collection(db,"Cart"));
            let docId=null;
            let itemId=null;
            cartItems.forEach((doc)=>{
                if (product.id===doc.data().id) {
                    docId=doc.id;
                    itemId=doc.data().id;
                }
            })
            if(docId){
                await deleteDoc(doc(db,"Cart",docId));
                toast.success("Product removed from Cart");
                return itemId;
            }
        } catch (error) {
            toast.error(error);
            return rejectWithValue(error);
        }
    }
);

// purchase cart order
export const purchaseOrderAsync=createAsyncThunk(
    "product/purchase",
    async(_,{rejectWithValue})=>{
        try {
            const cart = await getDocs(collection(db,"Cart"));
            cart.forEach(async (item)=>{
                await deleteDoc(doc(db,"Cart",item.id));
            });
            toast.success("Purchase successful!")
            return {message:"Purchase successful!"}

        } catch (error) {
            toast.error(error);
            return rejectWithValue(error);
        }
    }
)

// add a new product
export const addProductAsync=createAsyncThunk(
    "product/addnew",
    async(product,{rejectWithValue})=>{
        try {
            const res = await axios.post(`${url}`,product);
            toast.success("Product added!!");
            return res.data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
)

export const productReducer = ProductSlice.reducer;
export const productActions = ProductSlice.actions;
export const productSelector = (state)=>state.productReducer;