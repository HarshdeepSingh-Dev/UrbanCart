import styles from './orderCard.module.css';

function OrderCard({product}) {

    console.log(product);

    return(
        <>
            <div className={styles.card}>
                <div className={styles.orderdate}>
                    <span>{product.orderDate}</span>
                </div>

                <div className={styles.productsList}>
                    {product?.products?.length > 0 ? (
                        product.products.map((item) => (
                            <div key={item.id} className={styles.information}>
                                <div className={styles.imageContainer}>
                                    <img src={item.myProduct.image} alt={item.myProduct.name} />
                                </div>
                                <h3>{item.myProduct.name}</h3>
                                <div className={styles.price}>
                                    Price
                                    <span>${item.myProduct.price}</span>
                                </div>
                                <div className={styles.quantity}>
                                    Quantity
                                    <span>{item.quantity}</span>
                                </div>
                                
                            </div>
                        ))
                    ) : (
                        <p>No products available</p> // Fallback UI in case no products are found
                    )}
                </div>
            </div>
        </>
    )
}

export default OrderCard;