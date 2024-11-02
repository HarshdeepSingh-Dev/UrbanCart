import styles from './detailsPage.module.css';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from "react-redux";
import { addToCartAsync } from '../../Redux/Reducers/productReducer';
import { toast } from 'react-toastify';

function DetailsPage() {
    const loaction = useLocation();
    const product = loaction.state;
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // to add product in cart
    const handleCart=(product)=>{
        const auth = localStorage.getItem('isAuthenticated');
        const isAuth = auth === 'true';
        // check if user is authenticated or not
        if(!isAuth||isAuth===undefined){
            toast.error("Please sign in first!!");
            return;
        }
        dispatch(addToCartAsync(product));
    }

    // to edit product
    const handleEdit=(product)=>{
        navigate("/productEdit", {state:product});
    }

    return(
        <div className={styles.detailsCard}>
            <div className={styles.imgContainer}>
                <img src={product.images[0]} alt={product.name} />
            </div>
            <div className={styles.aboutProduct}>
                <div className={styles.nameContainer}><h2>{product.title}</h2></div>
                <span>${product.price}</span>
                {/* <div className={styles.editbtn}
                    onClick={()=>handleEdit(product)}
                >
                    <span>Edit</span>
                    <img src="https://cdn-icons-png.flaticon.com/128/1159/1159633.png" alt="edit" /> 
                </div> */}
            </div>
            <div className={styles.productDetails}>
                <span>
                    {product.description}
                </span>
                <div className={styles.cartAddBtn}>
                    <div className={styles.btn}
                    onClick={()=>handleCart(product)}>
                        <span>Cart</span>
                        <img src="https://cdn-icons-png.flaticon.com/128/4903/4903482.png" alt="cart" /> 
                    </div>

                </div>
            </div>
        </div>
    )
}
export default DetailsPage;