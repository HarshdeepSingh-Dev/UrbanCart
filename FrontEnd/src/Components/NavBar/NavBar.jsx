import styles from './navbar.module.css';
import { Outlet, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';

function NavBar() {
    const navigate = useNavigate();
    const {cartItems} = useSelector((state)=>state.productReducer);
    const [noOfCartItems, setNoOfCartItems]=useState(0);
    const [name, setName] = useState(null);
    
    const navigateTo = (link) =>{
        navigate(link);
    };

    // to get total no of cart items
    useEffect(()=>{
        if(cartItems){
            let totalCartItems=0;
            cartItems.map((product)=>(
                totalCartItems+=product.quantity
            ))
            setNoOfCartItems(totalCartItems);
        }
    },[cartItems]);

    // get userinfo from localstorage
    useEffect(()=>{
        const name=localStorage.getItem('userName');
        setName(name);
    })

    return(
        <>
        <div className={styles.navbar}>
            <div className={styles.sections}>
                <span onClick={()=>navigateTo("/")}>ECommerce</span>
                <span onClick={()=>navigateTo("/")}>Products</span>
                <div className={styles.cart} onClick={()=>navigateTo("/cart")}>             
                    <p>{noOfCartItems}</p>
                    <span>Cart</span>
                    <img src="https://cdn-icons-png.flaticon.com/128/3737/3737372.png" alt="cart" />
                </div>
                <span onClick={()=>navigateTo("/orders")}>Orders</span>             
            </div>
            {name?
                <>
                    <div className={styles.profile}
                    onClick={()=>navigateTo('/profile')}>
                    <span>{name}</span>
                    <img src="https://cdn-icons-png.flaticon.com/128/3135/3135715.png" alt="user" />
                    </div> 
                 </>
            :
                <>
                    <div className={styles.profile}
                    onClick={()=>navigateTo('/login')}>
                    <span>User</span>
                    <img src="https://cdn-icons-png.flaticon.com/128/3135/3135715.png" alt="user" />
                    </div> 
                </>
            }       
                     
        </div>
        
         <Outlet/>  
         </>
    )
}

export default NavBar;