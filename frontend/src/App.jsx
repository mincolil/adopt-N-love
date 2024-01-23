import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./layouts/common/login/Login";
import Register from "./layouts/common/register/Register";
import Dashboard from "./layouts/dashboard/Dashboard";
import { ToastContainer } from "react-toastify";

import BasicTable from "./layouts/dashboard/UserDashboard/UserTable";
import ServiceTable from "./layouts/dashboard/service/ServiceTables";
import PetTable from "./layouts/dashboard/pet/PetTables";
import ProductTable from "./layouts/dashboard/product/ProductTables";
import OrderTable from "./layouts/dashboard/order/OrderTable";
import LandingPage from "./layouts/LandingPage/LandingPage";

import Header from "./components/Header/Header";
import ProductList from "./layouts/LandingPage/Product/ProductList";
import BookingTable from "./layouts/dashboard/booking/BookingTable";
import CartService from "./layouts/LandingPage/Cart/CartService";
import CartProduct from "./layouts/LandingPage/Cart/CartProduct";

import RequireAuth from "./components/RequireAuth";
import ChangePassword from "./layouts/User/ChangePassword";
import UserPRofile from "./layouts/User/UserProfile";
import PetUser from "./layouts/User/PetUser";
import VerifyCode from "./layouts/common/verify/VerifyCode";
import BlogTable from "./layouts/dashboard/blog/BlogTable";
import CategoryTable from "./layouts/dashboard/category/CategoryTable";
import BlogPage from "./layouts/LandingPage/Blog/BlogPage";
import BlogDetail from "./layouts/LandingPage/Blog/BlogDetail";
import ServiceList from "./layouts/LandingPage/Service/ServiceList";
import ProductPurchase from "./layouts/User/ProductPurchase";
import ProductCheckout from "./layouts/User/ProductCheckout";
import ProductDetail from "./layouts/LandingPage/Product/ProductDetail";
import ServiceDetail from "./layouts/LandingPage/Service/ServiceDetail";
import ServicePurchase from "./layouts/User/ServicePurchase";
import ResetPassword from "./layouts/User/ResetPassword";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import DashboardList from "./layouts/dashboard/DashboardList";
import Introduce from "./layouts/User/Introduce";
import ServiceCheckout from "./layouts/User/ServiceCheckout";

// import AdminLayout from "./layouts/dashboard/layouts/Admin"

const ROLES = {
  User: 2001,
  CUSTOMER: "customer",
  ADMIN: "admin",
  STAFF: "staff",
};

function App() {
  return (
    <>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <BrowserRouter>
          <Routes>
            <Route element={<RequireAuth allowedRoles={[ROLES.ADMIN, ROLES.STAFF]}/>}>
              <Route path="/dashboard" element={<Dashboard />}>
                <Route
                  path="/dashboard/dashboard-list"
                  element={<DashboardList />}
                />
                <Route path="/dashboard/user-list" element={<BasicTable />} />
                <Route path="/dashboard/order-list" element={<OrderTable />} />
                <Route
                  path="/dashboard/booking-list"
                  element={<BookingTable />}
                />
                <Route
                  path="/dashboard/service-list"
                  element={<ServiceTable />}
                />
                <Route path="/dashboard/pet-list" element={<PetTable />} />
                <Route
                  path="/dashboard/product-list"
                  element={<ProductTable />}
                />
                <Route
                  path="/dashboard/category-list"
                  element={<CategoryTable />}
                />
                <Route path="/dashboard/blog-list" element={<BlogTable />} />
              </Route>
            </Route>
            
            <Route path="/sign-up" element={<Register />} />
            <Route path="/sign-in" element={<Login />} />
            <Route path="/" element={<Header />}>
              <Route index element={<LandingPage />} />
              <Route path="service-homepage" element={<ServiceList />} />
              <Route path="product-homepage" element={<ProductList />} />
              <Route
                path="product-homepage/:productId"
                element={<ProductDetail />}
              />
              <Route
                path="service-homepage/:serviceId"
                element={<ServiceDetail />}
              />
              <Route path="blog-homepage" element={<BlogPage />} />
              <Route path="blog-homepage/:blogId" element={<BlogDetail />} />
              <Route path="cart-service" element={<CartService />} />
              <Route path="cart-product" element={<CartProduct />} />
              <Route path="user-profile" element={<UserPRofile />} />
              <Route path="change-password" element={<ChangePassword />} />
              <Route path="pet-user" element={<PetUser />} />
              <Route path="verify" element={<VerifyCode />} />
              <Route path="product-purchase" element={<ProductPurchase />} />
              <Route path="service-purchase" element={<ServicePurchase />} />
              <Route path="product-checkout" element={<ProductCheckout />} />
              <Route path="reset-password" element={<ResetPassword />} />
              <Route path="introduce-homepage" element={<Introduce />} />
              <Route path="service-checkout" element={<ServiceCheckout />} />
            </Route>
          </Routes>
        </BrowserRouter>

        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </LocalizationProvider>
    </>
  );
}

export default App;
