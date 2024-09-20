import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function RedirectAuth({children}){
    const navigate = useNavigate();
    const [isAuthenticated, setisAuthenticated] = useState();

    useEffect(()=>{
        const authentication = localStorage.getItem('isAuthenticated');
        const isAuth = authentication === 'true'; 
        setisAuthenticated(isAuth);
    },[]);

    useEffect(()=>{
        if(isAuthenticated){
            navigate('/');
        }
    },[isAuthenticated,navigate])

    return !isAuthenticated ? children : null;
}

export default RedirectAuth;