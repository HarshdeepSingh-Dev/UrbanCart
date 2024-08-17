import React from 'react'
import styles from "./editProduct.module.css";
import { useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { productActions } from '../../Redux/Reducers/productReducer'; 

export default function EditProduct() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const myproduct = location.state;
    const [product, setProduct] = useState(myproduct)

    // handling all the changes according to section name
    const handleEdit=(section, e)=>{
      if (section==="prodname") {
          setProduct({
            ...product,
            name:e.target.value
          })
      }else if(section==="prodPrice"){
        setProduct({
          ...product,
          price:e.target.value
        })
      }else if(section==="prodDescription"){
        setProduct({
          ...product,
          description:e.target.value
        })
      }
    }

    // handling for save button
    const handleSubmit = (e,product) =>{
      e.preventDefault();
      const newProduct={
        image:product.image,
        name:product.name,
        price:product.price,
        id:product.id,
        description:product.description
      }
      dispatch(productActions.editProduct(newProduct));
      navigate("/");
    }

    // handling for cancel button
    const handleCancel = (e) =>{
      e.preventDefault();
      navigate("/");
    }

  return (
    <div className={styles.editCard}>
        <div className={styles.imgContainer}>
            <img src={product.image} alt={product.name} />
        </div>

        <div className={styles.aboutProduct}>
            <input type="text"
              name='name' 
              value={product.name}
              onChange={(e)=>handleEdit("prodname",e)}
            />

            <div className={styles.price}>
                <input type="number" 
                  name="price" 
                  value={product.price}
                  onChange={(e)=>handleEdit("prodPrice",e)}
                />
            </div>
            <div className={styles.editbtn}
              onClick={(e)=>handleSubmit(e,product)}>
                <span>Save</span>
                <img src="https://cdn-icons-png.flaticon.com/128/5662/5662990.png" alt="edit" /> 
            </div>
        </div>

        <div className={styles.productDetails}>
            <div className={styles.description}>
                <textarea name="description" 
                  value={product.description}
                  onChange={(e)=>handleEdit("prodDescription",e)}/>
            </div>
            <div  className={styles.btn}
              onClick={(e)=>handleCancel(e)}>
              <span>Cancel</span>
              <img src="https://cdn-icons-png.flaticon.com/128/4347/4347434.png" alt="delete" /> 
            </div> 
        </div>
    </div>
  )
  
}
