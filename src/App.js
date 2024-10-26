import { Navigate, Route, Routes } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import AddProduct from './pages/AddProduct';
import AddCategory from './pages/AddCategory';
import ViewProduct from './pages/ViewProducts';
import ViewCategory from './pages/ViewCategory';
import ViewPayments from './pages/ViewPayments';
import LoginPage from './pages/Login';
import Dashboard from './pages/Dashboard';
import ViewOrders from './pages/ViewOrders';
import Notifications from './pages/Notifications';
import AddImagePage from './pages/AddImage';
import AddSubcategory from './pages/AddSubCategory';
import ViewSubcategory from './pages/ViewSubCategory';
import AddSubAdmin from './pages/AddSubadmin';
import ViewSubAdmin from './pages/ViewSubadmin';
import SendNotification from './pages/SendNotifications';

function App() {
  const isAdminLoggedIn = () => {
    const adminToken = localStorage.getItem("groceryadmin");
    return adminToken;
  };
  const AdminRoute = ({ element }) => {
    return isAdminLoggedIn() ? element : <Navigate to="/login" />;
  };
  return (
    <div className="App">
      <Routes>
        <Route path='/' element={<AdminRoute element={<Home></Home>}/> }></Route>
        {/* <Route path='/addproduct' element={<AdminRoute element={<AddProduct></AddProduct>}/> }></Route>
        <Route path='/addcategory' element={<AdminRoute element={<AddCategory></AddCategory>}/> }></Route>
        <Route path='/viewproducts' element={<AdminRoute element={<ViewProduct></ViewProduct>}/> }></Route>
        <Route path='/viewcategory' element={<AdminRoute element={<ViewCategory></ViewCategory>}/> }></Route>
        <Route path='/viewpayments' element={<AdminRoute element={<ViewPayments></ViewPayments>}/> }></Route> */}
        <Route path='/login' element={<LoginPage></LoginPage>}></Route>
        {/* <Route path='/dashboard' element={<AdminRoute element={<Dashboard></Dashboard>}/> }></Route>
        <Route path='/vieworders' element={<AdminRoute element={<ViewOrders></ViewOrders>}/> }></Route>
        <Route path='/notifications' element={<AdminRoute element={<Notifications></Notifications>}/> }></Route>
        <Route path='/addimage' element={<AdminRoute element={<AddImagePage></AddImagePage>}/> }></Route>
        <Route path='/addsub' element={<AdminRoute element={<AddSubcategory></AddSubcategory>}/> }></Route>
        <Route path='/viewsub' element={<AdminRoute element={<ViewSubcategory></ViewSubcategory>}/> }></Route>
        <Route path='/addsubadmin' element={<AdminRoute element={<AddSubAdmin></AddSubAdmin>}/> }></Route>
        <Route path='/viewsubadmin' element={<AdminRoute element={<ViewSubAdmin></ViewSubAdmin>}/> }></Route>
        <Route path='/sendnotification' element={<AdminRoute element={<SendNotification></SendNotification>}/> }></Route> */}







      </Routes>
    </div>
  );
}

export default App;
