import { useNavigate } from 'react-router-dom';
import styles from './notfound.module.css';

function PageNotFound() {
    const navigate = useNavigate();

    // back to home page
    const handleredirect=(e)=>{
        e.preventDefault();
        navigate('/');
    }
    return(
        <div className={styles.notfound}>
            <div className={styles.code}>
                <span>404</span>
                <img src="https://cdn-icons-png.flaticon.com/128/7486/7486820.png" alt="not found" />
            </div>
            <span>Page not found!!</span>
            <button onClick={handleredirect}>Go To Home Page</button>
        </div> 
    )
}

export default PageNotFound;
