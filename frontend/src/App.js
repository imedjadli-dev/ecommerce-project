import React, { useState } from "react";
//import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadUser } from "./actions/userAction";

import Home from "./components/Home";
import Footer from "./components/layout/Footer";
import Header from "./components/layout/Header";
import ProductDetails from "./components/product/ProductDetails";
import { useLocation } from "react-router-dom";

import Login from "./components/user/Login";

import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Error from "./components/layout/Error";
import Cart from "./components/cart/Cart";
import ConfirmOrder from "./components/cart/ConfirmOrder";
import Shipping from "./components/cart/Shipping";
import Wishlist from "./components/layout/Wishlist";
import ListOrders from "./components/order/ListOrders";
import OrderDetails from "./components/order/OrderDetails";
import ForgotPassword from "./components/user/ForgotPassword";
import NewPassword from "./components/user/NewPassword";
import Profile from "./components/user/Profile";
import Register from "./components/user/Register";
import UpdatePassword from "./components/user/UpdatePassword";
import UpdateProfile from "./components/user/UpdateProfile";
// Admin
import BlogsList from "./components/admin/BlogsList";
import CategoriesList from "./components/admin/CategoriesList";
import CreateCategory from "./components/admin/CreateCategory";
import Dashboard from "./components/admin/Dashboard";
import NewBlog from "./components/admin/NewBlog";
import NewProduct from "./components/admin/NewProduct";
import OrdersList from "./components/admin/OrdersList";
import ProductReviews from "./components/admin/ProductReviews";
import ProductsList from "./components/admin/ProductsList";
import CouponsList from "./components/admin/CouponsList";
import CreateCoupon from "./components/admin/CreateCoupon";
import UpdateCoupon from "./components/admin/UpdateCoupon";
import StatusOrder from "./components/admin/StatusOrder";
import UpdateBlog from "./components/admin/UpdateBlog";
import UpdateCategory from "./components/admin/UpdateCategory";
import UpdateProduct from "./components/admin/UpdateProduct";
import UpdateUser from "./components/admin/UpdateUser";
import UsersList from "./components/admin/UsersList";
import Blogs from "./components/blog/Blogs";
import BlogDetails from "./components/blog/BlogsDetails";
import ProtectedRoute from "./components/route/ProtectedRoute";
import CategoriesProducts from "./components/admin/CategoriesProducts";
import ProfileAdmin from "./components/admin/ProfileAdmin";
import AdminPasswordUpdate from "./components/admin/AdminPasswordUpdate";

function App() {
  const { user, loading } = useSelector((state) => state.auth);

  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const isAdmin = user && user.role === "admin";

  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && !isAuthenticated) {
      dispatch(loadUser());
    }
  }, [dispatch, isAuthenticated]);

  return (
    <Router>
      {!isAdmin && <Header />}

      <Routes>
        <Route path="*" element={<Error />} />

        <Route path="/" element={<Home />} exact />
        <Route path="/search/:keyword" element={<Home />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route element={<Header />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/admin/me" element={<ProfileAdmin />} />
        <Route
          path="/admin/password/update"
          element={<AdminPasswordUpdate />}
        />
        <Route path="/me" element={<Profile />} exact />
        <Route path="/me/update" element={<UpdateProfile />} exact />
        <Route path="/password/update" element={<UpdatePassword />} exact />
        <Route path="/password/forgot" element={<ForgotPassword />} exact />
        <Route path="/password/reset/:token" element={<NewPassword />} exact />
        <Route path="/cart" element={<Cart />} exact />
        <Route path="/order/confirm" element={<ConfirmOrder />} />
        <Route path="/orders/me" element={<ListOrders />} />
        <Route path="/order/:id" element={<OrderDetails />} />
        <Route path="/blogs" element={<Blogs />} />
        <Route path="/blogs/blog/:id" element={<BlogDetails />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/shipping" element={<Shipping />} />

        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/categorie/:id" element={<CategoriesProducts />} />

        <Route path="/admin/coupons" element={<CouponsList />} />
        <Route path="/coupon/:id" element={<UpdateCoupon />} />

        <Route path="/admin/coupon/new" element={<CreateCoupon />} />

        <Route path="/admin/products" element={<ProductsList />} />
        <Route path="/admin/product/new" element={<NewProduct />} />
        <Route
          path="/admin/product/:id"
          isAdmin={true}
          element={<UpdateProduct />}
        />
        <Route path="/admin/orders" element={<OrdersList />} />
        <Route path="/admin/order/:id" element={<StatusOrder />} />
        <Route path="admin/users" element={<UsersList />} />
        <Route path="/admin/user/:id" element={<UpdateUser />} />
        <Route path="/admin/reviews/" element={<ProductReviews />} />
        <Route path="/admin/category" element={<CreateCategory />} />
        <Route path="/categories" element={<CategoriesList />} />
        <Route path="/category/:id" element={<UpdateCategory />} />

        <Route path="/admin/blogs" isAdmin={true} element={<BlogsList />} />
        <Route
          path="/admin/blogs/blog/:id"
          isAdmin={true}
          element={<UpdateBlog />}
        />
        <Route path="/admin/blog/new" isAdmin={true} element={<NewBlog />} />
      </Routes>
      {!isAdmin && <Footer />}
    </Router>
  );
}

export default App;
