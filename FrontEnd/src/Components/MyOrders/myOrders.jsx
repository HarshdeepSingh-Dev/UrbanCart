import { useEffect } from 'react';
import styles from './myOrders.module.css';
import {useDispatch, useSelector} from 'react-redux';
import { getOrders } from '../../Redux/Reducers/productReducer';
import Loader from 'react-spinners/FadeLoader';
import OrderCard from '../OrderCard/orderCard';

function MyOrders(){
    const dispatch = useDispatch();
    const orders = useSelector((state)=>state.productReducer.orders);
    const loading = useSelector((state)=>state.productReducer.loading);

    console.log(orders,loading);

    useEffect(()=>{
        dispatch(getOrders());
    },[dispatch])

    return(
        <>
        <div className={styles.orders}>
            {loading?
                <Loader className={styles.loader}/>
                    :
                    <div className={styles.ordersPage}>
                        {Array.isArray(orders)&&orders.length>0?
                            <>
                                <h2>Order History</h2>
                                {/* <hr /> */}
                                <div className={styles.allOrders}>
                                    {orders.map((item,index)=>(
                                        <OrderCard product={item} key={index}/>
                                    ))}
                                </div>
                            </>
                        :
                            <div className={styles.imgContainer}>
                              
                                <img src="https://cdn-icons-png.flaticon.com/128/17569/17569003.png" alt="no-orders" />
                                <span>Oops!! seems like nothing here</span>
                            </div>
                        }
                    </div>
                
            }
        </div>
        
        </>
    )
}

export default MyOrders