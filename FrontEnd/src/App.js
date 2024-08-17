import './App.css';
import {createBrowserRouter,RouterProvider} from 'react-router-dom';
import NavBar from './Components/NavBar/NavBar';
import AllProducts from './Components/AllProductsPage/AllProducts';
import Cart from './Components/CartPage/cart';
import DetailsPage from './Components/ProductsDetailsPage/ProductDetailsPage';
import {Provider} from 'react-redux';
import { store } from './Redux/store';
import EditProduct from './Components/EditProduct/editProduct';
import CreateFrom from './Components/CreatePage/CreateProductForm';

const router = createBrowserRouter([
  {path: "/", element:<NavBar/>,
    children: [
      {path: '', element:<AllProducts/>},
      {path:'/cart',element:<Cart/>},
      {path:'/productDetails', element:<DetailsPage/>},
      {path:"/productEdit", element:<EditProduct/>},
      {path:"/addProduct", element:<CreateFrom/>}
    ]
  }
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
