import './App.css';
import {createBrowserRouter,RouterProvider} from 'react-router-dom';
import NavBar from './Components/NavBar/NavBar';
import AllProducts from './Components/AllProductsPage/AllProducts';
import Cart from './Components/CartPage/cart';
import DetailsPage from './Components/ProductsDetailsPage/ProductDetailsPage';
import {Provider} from 'react-redux';
import { store } from './Redux/store';
import EditProduct from './Components/EditProduct/editProduct';
import LoginPage from './Components/LoginPage/loginPage';
import SignupPage from './Components/SignupPage/signupPage';
import Protected from './Routes/protected-route';
import PageNotFound from './Components/NotFound/NotFound';
import UserProfile from './Components/UserProfile/userProfile';
import RedirectAuth from './Routes/redirect-authentication';
import MyOrders from './Components/MyOrders/myOrders';

const router = createBrowserRouter([
  {path: "/", element:<NavBar/>,
    children: [
      {path: '', element:<AllProducts/>},
      {path:'/cart',element:<Protected><Cart/></Protected>},
      {path:'/productDetails', element:<DetailsPage/>},
      {path:"/productEdit", element:<EditProduct/>},
      {path:"/login", element:<RedirectAuth><LoginPage/></RedirectAuth>},
      {path:"/signup", element:<RedirectAuth><SignupPage/></RedirectAuth>},
      {path:"/profile", element:<Protected><UserProfile/></Protected>},
      {path:"/orders", element:<Protected><MyOrders/></Protected>}
    ]
  },
  {path: "*", element:<PageNotFound/>}
])

function App() {
  return (
    <>
    <Provider store={store}>
      <RouterProvider router={router}/>
    </Provider>
    </>
  );
}

export default App;
