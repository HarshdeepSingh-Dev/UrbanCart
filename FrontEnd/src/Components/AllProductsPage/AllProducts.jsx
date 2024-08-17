import React from 'react';
import styles from './allproducts.module.css';
import Card from '../ProductCard/ProductCard';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { getProductsAsync } from '../../Redux/Reducers/productReducer';
import Loader from "react-spinners/FadeLoader";
import { useLocation } from 'react-router-dom';

function AllProducts() {
    const dispatch = useDispatch();
    const { products, editedProduct, loading } = useSelector((state)=>state.productReducer);
    const [Products, setProducts] = useState(null);
    const location = useLocation();
    const newProduct = location.state;
    const [sort, setSort] = useState(false);


    // to get products from api
    useEffect(()=>{
        dispatch(getProductsAsync());     
    },[dispatch]);

    // to set products in local state
    useEffect(()=>{
        if(!loading){
            setProducts(products);
        }
    },[loading, products]);

    // to edit a product from our list
    useEffect(()=>{
        if(editedProduct&&Products){
            const updatedProducts = Products.map((product)=>{
                if (product.id===editedProduct.id) {
                    return editedProduct;
                }
                return product
            })
            setProducts(updatedProducts);
        }
    },[editedProduct, products]);

    // to add a new product to our db
    useEffect(()=>{
        if(newProduct&&Products){
            setProducts((prevProducts)=>[
                ...prevProducts,
                newProduct
            ])
        }
    },[newProduct, products]);

    // to sort products by price
    const handleSort=()=>{
        if(Products){
            const sortedProducts=[...Products].sort((a,b)=>a.price-b.price);
            setProducts(sortedProducts);
            setSort(!sort);
        }
    }

    // to unsort products
    const handleUnsort=()=>{
        if(Products&&products){
            setProducts(products);
        }
        setSort(!sort);
    }
    
    return(
        <div className={styles.productsPage}>
            {sort?
                <div className={styles.sortbtn}>
                    <button type="submit" onClick={handleUnsort}>Sort by price</button>
                    <img src="https://cdn-icons-png.flaticon.com/128/458/458595.png" alt="cancel" />
                </div>
            :
            <div className={styles.sortbtn}>
                <button type="submit" onClick={handleSort}>Sort by price</button>
            </div>
            }

            <div className={styles.allProducts}>
                {Products?
                    Products.map((product,index)=>(
                    <Card product={product} key={index}/>
                )):<Loader className={styles.loader}/>
                }
            </div>
        </div>
    )
}

export default AllProducts;