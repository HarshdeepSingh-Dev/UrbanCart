import styles from './orderCard.module.css';

function OrderCard({product}) {

    console.log(product);

    return(
        <>
            <div className={styles.card}>
                <div className={styles.imageContainer}>
                    <img src="" alt="" />
                </div>
                <div className={styles.information}>
                    {/* <h3></h3> */}
                    <span></span>
                    <span></span>
                </div>
                <img src="" alt="" />
            </div>
        </>
    )
}

export default OrderCard;