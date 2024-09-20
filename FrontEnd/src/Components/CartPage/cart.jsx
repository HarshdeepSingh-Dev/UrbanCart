import styles from "./cart.module.css";
import CartCard from "../CartCard/CartCard";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from 'react-router-dom';
import { getFromDbAsync, purchaseOrderAsync } from "../../Redux/Reducers/productReducer";
import { useEffect, useState } from "react";
import Loader from 'react-spinners/FadeLoader';

function Cart() {
    const navigate=useNavigate();
    const dispatch = useDispatch();
    const { cartItems, loading }=useSelector((state)=>state.productReducer);
    const [totalPrice,setTotalPrice]=useState(0);

    // to get total price of our cart
    useEffect(()=>{
        let newTotalPrice=0;
        cartItems.forEach(item=>{
            newTotalPrice+=item.product.price * item.quantity;
       })
       setTotalPrice(newTotalPrice);
    },[cartItems]);

    // to get all cart items
    useEffect(() => {
        dispatch(getFromDbAsync())
        // if user is unauthenticated redirect to home
            .unwrap()   //to return a promise that is either fulfilled
            .catch(error => {
                console.log('>>>>>', error);
                navigate('/');
            });
    }, [dispatch, navigate]);
    

    // to purchase cart item
    const handlePurchase = () => {
        dispatch(purchaseOrderAsync(cartItems));
    }


    return(
        <>
            <div className={styles.cart}>
                {loading?
                    <Loader className={styles.loader}/>
                :   
                    <>
                        {cartItems.length>0?
                            <>
                                <h1>My Cart</h1>
                                <div className={styles.priceContainer}>
                                    <h3>Summery Order</h3>
                                    <span>Total Price: ${totalPrice.toFixed(2)}/-</span>                    
                                    <button 
                                        type="submit"
                                        onClick={()=>handlePurchase()}
                                    >Purchase</button>                    
                                </div>
                            
                                <div className={styles.cartItems}>
                                    {cartItems.map((item,index)=>(
                                    <CartCard product={item} key={index}/>
                                    ))}
                                </div>
                            </>
                        :   <div className={styles.emptyCart}>
                                <img src="https://cdn-icons-png.flaticon.com/128/11329/11329060.png"
                                 alt="empty-carts" />
                            </div>
                            
                        }
                    </>
                }
            </div>
        </>
    )
}

export default Cart;