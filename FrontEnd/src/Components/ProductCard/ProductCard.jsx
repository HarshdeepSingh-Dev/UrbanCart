import styles from './productCard.module.css';
import { useNavigate } from 'react-router-dom';
import { addToCartAsync } from '../../Redux/Reducers/productReducer';
import {useDispatch} from 'react-redux';
import { toast } from 'react-toastify';

function Card({product}) {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // product details page
    const redirect = (link, product)=>{
        navigate(link,{state:product});
    }

    // add to cart product
    const handleAddToCart = (e, product)=>{
        e.stopPropagation();
        const auth = localStorage.getItem('isAuthenticated');
        const isAuth = auth === 'true';
        // check if user is authenticated or not
        if(!isAuth||isAuth===undefined){
            toast.error("Please sign in first!!");
            return;
        }
        dispatch(addToCartAsync(product));
    }

    return(
        <div className={styles.card} onClick={()=>redirect("/productDetails", product)}>
            <div className={styles.imgContainer}>
                <img src={product.images[0]} alt="itemImg" />
            </div>  

            <span>{product.title}</span>   

            <div className={styles.details}>   
                <span>Price:${product.price}</span>
                <button type="submit"
                    onClick={(e)=>handleAddToCart(e,product)}>
                Add to Cart
                </button>
            </div>
            
        </div>
    )
}

export default Card;