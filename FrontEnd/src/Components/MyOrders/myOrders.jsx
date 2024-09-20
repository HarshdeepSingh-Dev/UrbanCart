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
                        <h1>MY ORDERS</h1>
                        {orders.length>0?
                        <>
                        {orders.map((item,index)=>(
                            <OrderCard product={item} key={index}/>
                        ))}
                        </>
                        :
                            <h1> No Orders </h1>
                        }
                    </div>
                
            }
        </div>
        
        </>
    )
}

export default MyOrders