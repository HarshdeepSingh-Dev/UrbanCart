import { useState } from "react";
import styles from "./loginPage.module.css";
import {useDispatch} from 'react-redux'
import { loginAsync } from "../../Redux/Reducers/productReducer";

function LoginPage() {
    const dispatch = useDispatch();
    const [userDetails, setUserDetails] = useState({
        email:"",
        password:""
    });

    const handleChange=(e)=>{
        const {name,value} = e.target;
        setUserDetails({
            ...userDetails,
            [name]:value
        })
    };

    const handleSubmit=(e)=>{
        e.preventDefault();
        // check if email and password are there
        if(!userDetails.email||!userDetails.password){
            window.alert("Please enter details correctly");
        }
        // dispatch to send user data
        dispatch(loginAsync(userDetails));
        setUserDetails({
            email:"",
            password:""
        })
    }

    return(
        <>
        <div className={styles.loginForm}>
            <h2>Welcome back</h2>
            <span>Please enter your details to login</span>
            <div className={styles.input}>
                <label>E-Mail address</label>
                <input type="email" name="email" id="email" value={userDetails.email} onChange={handleChange}/>
            </div>

            <div className={styles.input}>
                <label htmlFor="">Password</label>
                <input type="password" name="password" id="password" value={userDetails.password} onChange={handleChange}/>
            </div>

            <button type="submit" onClick={handleSubmit}>Login</button>

            <span>
                Do not have an account?<a href="/signup">SignUp</a>
            </span>
        </div>
        </>
    )
}

export default LoginPage;