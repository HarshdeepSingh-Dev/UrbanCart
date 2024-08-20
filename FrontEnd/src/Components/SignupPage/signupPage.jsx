import styles from './signupPage.module.css';
import { useState } from 'react';
import {useDispatch} from 'react-redux'
import { signupAsync } from '../../Redux/Reducers/productReducer';

function SignupPage(){
    const dispatch = useDispatch();
    const [userDetails, setUserDetails]=useState({
        name:"",
        email:"",
        password:""
    });

    const handleChange=(e)=>{
        const {name,value}=e.target;
        setUserDetails({
            ...userDetails,
            [name]:value
        });
    }

    const handleSubmit=(e)=>{
        e.preventDefault();
        dispatch(signupAsync(userDetails));
        setUserDetails({
            name:"",
            email:"",
            password:""
        })
    }
    return(
        <>
            <div className={styles.signupForm}>
                <h2>Create a new Account</h2>
                <span>Enter your details below to create a new account</span>
                <div className={styles.input}>
                    <label>Name</label>
                    <input  type="text" 
                            name="name"
                            id="name"
                            value={userDetails.name}
                            onChange={handleChange}/>
                </div>

                <div className={styles.input}>
                    <label>Email</label>
                    <input type="email"
                       name="email"
                       id="email"
                       value={userDetails.email}
                       onChange={handleChange}/>
                </div>
                <div className={styles.input}>
                    <label>Password</label>
                    <input type="password"
                        name="password"
                        id="password"
                        value={userDetails.password}
                        onChange={handleChange}/>
                </div>

                <button onClick={handleSubmit}>SignUp</button>

                <span>
                    Already have an account?<a href='/login'>Login</a>
                </span>

            </div>
        </>
    )
}

export default SignupPage;