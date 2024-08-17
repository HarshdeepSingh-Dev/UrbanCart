import styles from "./form.module.css";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { addProductAsync } from "../../Redux/Reducers/productReducer";
import { useNavigate } from "react-router-dom";

function CreateFrom() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [product, setProduct] = useState({
        name:'',
        price:'',
        description:''
    });

    const handleChange=(e)=>{
        const {name, value} = e.target;
        setProduct({
            ...product,
            [name]:value
        })
    }

    const handleSubmit=(e)=>{
        e.preventDefault();
        dispatch(addProductAsync(product));
        navigate("/",{state:product});
        setProduct({
            name:'',
            price:'',
            description:''
        })     
    }

    return(
        <>
            <div className={styles.createFrom}>
                <form onSubmit={handleSubmit}>
                    <span>Add a product</span>
                    <input type="text" name="name" placeholder="Name" value={product.name} onChange={handleChange}/>
                    <input type="number" name="price" placeholder="Price" value={product.price} onChange={handleChange}/>
                    <textarea type="text" name="description" placeholder="Description..." value={product.description} onChange={handleChange}/>
                    <button type="submit">Add</button>
                </form>
            </div>
        </>
    )
}

export default CreateFrom;