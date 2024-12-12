import styles from './homepage.module.css';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { userAuth } from '../../Redux/Reducers/userReducer';

function Home() {

    const navigate = useNavigate();
    const dispatch = useDispatch();

    // to check if the user is authenticated or not
    useEffect(()=>{
        dispatch(userAuth());
    },[dispatch])

    const allproducts = () => {
        navigate('/allProducts')
    }

 return(
    <div className={styles.homePage}>
        <section className={styles.hero}>
            <h1>Welcome to Our Shop</h1>
            <p>Discover the best products at unbeatable prices!</p>
            <button onClick={allproducts} className={styles.shopNowButton}>Shop Now</button>
        </section>

        <section className={styles.featuredSection}>
            <h2>Featured Products</h2>
            <div className={styles.productGrid}>
                <div className={styles.productCard}>
                <img src="https://i.pinimg.com/564x/5d/7c/51/5d7c51f1b0fcb6a0f6ecfaef0a049ada.jpg" alt="Product 1" />
                <h3>Men's Wear</h3>
                <p>$25.00</p>
                </div>
                <div className={styles.productCard}>
                <img src="https://i.pinimg.com/564x/a1/21/55/a12155e6247c876177149c59f8df72f5.jpg" alt="Product 2" />
                <h3>Women's wear</h3>
                <p>$30.00</p>
                </div>
                <div className={styles.productCard}>
                <img src="https://i.pinimg.com/564x/6b/1d/f3/6b1df3bf020f095e6ad0e196dfb73ee5.jpg" alt="Product 3" />
                <h3>Accessories</h3>
                <p>$45.00</p>
                </div>
                <div className={styles.productCard}>
                <img src="https://i.pinimg.com/564x/28/bd/94/28bd94b07b0a427ff259df02f002515a.jpg" alt="Product 4" />
                <h3>Smartphones</h3>
                <p>$50.00</p>
                </div>
            </div>
        </section>

        <section className={styles.callToAction}>
        <h2>Join Our Newsletter</h2>
        <p>Get exclusive deals and updates straight to your inbox.</p>
        <button className={styles.subscribeButton}>Subscribe Now</button>
        </section>
  </div>
 )   
}


export default Home;