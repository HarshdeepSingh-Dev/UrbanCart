import styles from './userProfile.module.css';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {useDispatch} from 'react-redux';
import { signOut } from '../../Redux/Reducers/userReducer';

function UserProfile() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [name, setName] = useState(null);

    useEffect(()=>{
        const username = localStorage.getItem('userName');
        setName(username);
    },[]);

    const handleSignout=async(e)=>{
        e.preventDefault();
            await dispatch(signOut());
            navigate('/');
    }

    return(
        <div className={styles.profilePage}>
             <h1>Profile page</h1>
             <h2>{name}</h2>

             <button onClick={handleSignout}>SignOut</button>
        </div>
    )
}

export default UserProfile;