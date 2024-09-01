import './App.css'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'
import Layout from './Components/Layout/Layout.tsx';
import Home from './Components/Home/Home.tsx';
import Register from './Components/Register/Register.tsx';
import Login from './Components/Login/Login.tsx';
import Ordres from './Components/Ordres/Ordres.tsx';
import CheckAdmin from './Components/CheckAdmin/CheckAdmin.tsx';
import GetUsers from './Components/GetUsers/GetUsers.tsx';
import AdminGetProducts from './Components/AdminGetProducts/AdminGetProducts.tsx';
import CreateListing from './Components/CreateListing/CreateListing.tsx';
import CreateBrandAndCategory from './Components/CreateBrandAndCategory/CreateBrandAndCategory.tsx';
import EditProduct from './Components/EditProduct/EditProduct.tsx';
import Products from './Components/Products/Products.tsx';
import Basket from './Components/Basket/Basket.tsx';
import UserOrders from './Components/UserOrders/UserOrders.tsx';
import GetSingleProduct from './Components/GetSingleProduct/GetSingleProduct.tsx';
import UpdateStoreDetails from './Components/updateStoreDetails/UpdateStoreDetails.tsx';
import Contact from './Components/Contact/Contact.tsx';
import Page404 from './Components/404/Page404.tsx';
import CheckUserAuth from './Components/CheckUserAuth/CheckUserAuth.tsx';

function App() {

  const router: any = createBrowserRouter(createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      <Route index element={<Home />} />
      <Route path="/products" element={<Products />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />

      {/* For the user authenticated */}
      <Route element={<CheckUserAuth />}>
        <Route path="/panier" element={<Basket />} />
        <Route path="/orders" element={<UserOrders />} />
        <Route path="/get-single-product/:id" element={<GetSingleProduct />} />
      </Route>

      <Route path="*" element={<Page404 />} />

      {/* this is for the admin */}
      <Route path="/admin" element={<CheckAdmin />}>
        <Route path="admin-orders" element={<Ordres />} />
        <Route path="get-users" element={<GetUsers />} />
        <Route path="get-products" element={<AdminGetProducts />} />
        <Route path="create-listing" element={<CreateListing />} />
        <Route path="edit-product/:id" element={<EditProduct />} />
        <Route path="create-brand-and-category" element={<CreateBrandAndCategory />} />
        <Route path="update-store-details" element={<UpdateStoreDetails />} />
      </Route>
    </Route>
  ));

  return (
    <>
      <RouterProvider router={router}></RouterProvider>
    </>
  )
}

export default App
