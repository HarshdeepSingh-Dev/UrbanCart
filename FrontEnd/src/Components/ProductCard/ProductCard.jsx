import styles from './productCard.module.css';
import { useNavigate } from 'react-router-dom';
import { addToCartAsync } from '../../Redux/Reducers/productReducer';
import { productActions } from '../../Redux/Reducers/productReducer';
import {useDispatch} from 'react-redux';

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
        dispatch(addToCartAsync(product));
    }

    // delete the product
    const handleDeleteProduct = (e, product)=>{
        e.stopPropagation();
        dispatch(productActions.deleteProduct(product.id));
    }
    // edit the product
    const handleEditProduct = (e, product)=>{
        e.stopPropagation();
        navigate("/productEdit",{state:product});
    }

    return(
        <div className={styles.card} onClick={()=>redirect("/productDetails", product)}>
            <div className={styles.imgContainer}>
                <img src={product.image} alt="itemImg" />
            </div>        
            <div className={styles.details}>
                <h3>{product.name}</h3>
                <span>${product.price}</span>
            </div>
            <button type="submit"
            onClick={(e)=>handleAddToCart(e,product)}>Add to Cart</button>
            <div className={styles.editBtn}>
                <img
                    onClick={(e)=>handleEditProduct(e,product)}
                src="https://cdn-icons-png.flaticon.com/128/1159/1159633.png" alt="edit"/>
                
                <img
                onClick={(e)=>handleDeleteProduct(e,product)}
                src="https://cdn-icons-png.flaticon.com/128/3405/3405244.png" alt="delete" />
            </div>
        </div>
    )
}

export default Card;