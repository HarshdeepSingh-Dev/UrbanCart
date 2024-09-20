import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

function Protected({children}){
    const navigate = useNavigate();
    const [isAuthenticated, setisAuthenticated] = useState();

    useEffect(()=>{
        const authentication = localStorage.getItem('isAuthenticated');
        const isAuth = authentication === 'true'; 
        setisAuthenticated(isAuth);
    },[]);

    useEffect(()=>{
        if(isAuthenticated===undefined){
            <h2>Loading...</h2>
        }
        else if (isAuthenticated===false) {
            navigate('/login');
            toast.error("Please Login!!");
        }
    },[isAuthenticated,navigate])

    return isAuthenticated ? children : null;
}

export default Protected;