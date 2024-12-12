import styles from './signupPage.module.css';
import { useState } from 'react';
import {useDispatch} from 'react-redux'
import { useNavigate } from "react-router-dom";
import { signupAsync } from '../../Redux/Reducers/userReducer';
import { toast } from 'react-toastify';

function SignupPage(){
    const navigate = useNavigate();
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

    // handle submit btn
    const handleSubmit= async(e)=>{
        e.preventDefault();
         // check if email, name and password are there
         if(!userDetails.email||!userDetails.password||!userDetails.name){
            window.alert("Please enter details correctly");
            return
        }
        // dispatch to send user data
        try {
            const res = await dispatch(signupAsync(userDetails));
            if(res.error){
                return;
            }
            navigate('/login');
            setUserDetails({
                name:"",
                email:"",
                password:""
            })
        } catch (error) {
            toast.error(error);
            console.log(error);
            return;
        }
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