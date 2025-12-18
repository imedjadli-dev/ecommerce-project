import React, { Fragment, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Sidebar from "./Sidebar";
import Loader from "../layout/Loader";
import Infos from "../layout/Infos";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBagShopping,
  faCoins,
  faBoxOpen,
  faBlog,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";

import { getAdminProducts } from "../../actions/productActions";
import { allOrders } from "../../actions/orderActions";
import { allUsers } from "../../actions/userAction";
import { getAllCategories } from "../../actions/categoryActions";
import { getAllCoupons } from "../../actions/couponActions";
import { getAllBlogs } from "../../actions/blogActions";

const Dashboard = () => {
  const dispatch = useDispatch();

  const { products } = useSelector((state) => state.products);
  const { orders, totalAmount, loading } = useSelector(
    (state) => state.allOrders
  );
  const { categories } = useSelector((state) => state.allCategories);
  const { coupons } = useSelector((state) => state.allCoupons);
  const { blogs } = useSelector((state) => state.allBlogs);
  const { users } = useSelector((state) => state.allUsers);

  const availablePro = products?.filter((product) => product.stock > 0).length;
  const adminUsers = users?.filter((user) => user.role === "admin").length;
  const customerUsers = users?.filter((user) => user.role === "user").length;
  const processingOrders = orders?.filter(
    (order) => order?.paymentInfo?.orderStatus === "Processing"
  ).length;
  const shippedOrders = orders?.filter(
    (order) => order?.paymentInfo?.orderStatus === "Shipped"
  ).length;
  const deliveredOrders = orders?.filter(
    (order) => order?.paymentInfo?.orderStatus === "Delivered"
  ).length;

  const outOfStock =
    products?.filter((product) => product.stock === 0).length || 0;

  useEffect(() => {
    dispatch(getAdminProducts());
    dispatch(allOrders());
    dispatch(allUsers());
    dispatch(getAllCategories());
    dispatch(getAllCoupons());
    dispatch(getAllBlogs());
  }, [dispatch]);

  return (
    <Fragment>
      <div className="row">
        <div className="col-12 col-md-2">
          <Sidebar />
        </div>

        <div className="container">
          <h1 className="my-4">Dashboard</h1>

          {loading ? (
            <Loader />
          ) : (
            <Fragment>
              <Infos title="Admin dashboard" />

              {/* Total Income */}
              <div className="row pr-4">
                <div className="col-xl-12 col-sm-6 mb-3">
                  <div className="card text-white bg-c-blue o-hidden h-100">
                    <div className="card-body text-center">
                      Total Income
                      <br /> {totalAmount} DT
                    </div>
                  </div>
                </div>
              </div>

              {/* Orders, Products, Users */}
              <div className="row pr-4 mt-5">
                {/* Orders Card */}
                <div className="col-xl-4 col-sm-6 mb-3">
                  <div className="card bg-c-green order-card">
                    <div className="card-body text-center">
                      <h6>Orders</h6>
                      <h2>
                        <FontAwesomeIcon
                          icon={faBagShopping}
                          className="f-left"
                          style={{ fontSize: "20px" }}
                        />
                        <span>{orders?.length}</span>
                      </h2>
                      <hr />
                      <p>
                        Delivered Orders{" "}
                        <span className="float-right">{deliveredOrders}</span>
                      </p>
                      <p>
                        Shipped Orders{" "}
                        <span className="float-right">{shippedOrders}</span>
                      </p>
                      <p>
                        Processing Orders{" "}
                        <span className="float-right">{processingOrders}</span>
                      </p>
                    </div>
                    <Link
                      className="card-footer text-white clearfix small z-1"
                      to="/admin/orders"
                    >
                      <span className="float-left">View Details</span>
                      <span className="float-right">
                        <i className="fa fa-angle-right"></i>
                      </span>
                    </Link>
                  </div>
                </div>

                {/* Products Card */}
                <div className="col-xl-4 col-sm-6 mb-3">
                  <div className="card bg-c-green order-card">
                    <div className="card-body text-center">
                      <h6>Products</h6>
                      <h2>
                        <FontAwesomeIcon
                          icon={faBoxOpen}
                          className="f-left"
                          style={{ fontSize: "20px" }}
                        />
                        <span>{products?.length}</span>
                      </h2>
                      <hr />
                      <p>
                        On Stock{" "}
                        <span className="float-right">{availablePro}</span>
                      </p>
                      <p>
                        Out of Stock{" "}
                        <span className="float-right">{outOfStock}</span>
                      </p>
                    </div>
                    <Link
                      className="card-footer text-white clearfix small z-1"
                      to="/admin/products"
                    >
                      <span className="float-left">View Details</span>
                      <span className="float-right">
                        <i className="fa fa-angle-right"></i>
                      </span>
                    </Link>
                  </div>
                </div>

                {/* Users Card */}
                <div className="col-xl-4 col-sm-6 mb-3">
                  <div className="card bg-c-green order-card">
                    <div className="card-body text-center">
                      <h6>Users</h6>
                      <h2>
                        <FontAwesomeIcon
                          icon={faUsers}
                          className="f-left"
                          style={{ fontSize: "20px" }}
                        />
                        <span>{users?.length}</span>
                      </h2>
                      <hr />
                      <p>
                        Admin Users{" "}
                        <span className="float-right">{adminUsers}</span>
                      </p>
                      <p>
                        Customer Users{" "}
                        <span className="float-right">{customerUsers}</span>
                      </p>
                    </div>
                    <Link
                      className="card-footer text-white clearfix small z-1"
                      to="/admin/users"
                    >
                      <span className="float-left">View Details</span>
                      <span className="float-right">
                        <i className="fa fa-angle-right"></i>
                      </span>
                    </Link>
                  </div>
                </div>
              </div>

              {/* Categories, Blogs, Coupons */}
              <div className="row pr-4 mt-5">
                {/* Categories */}
                <div className="col-xl-4 col-sm-6 mb-3">
                  <div className="card bg-c-pink order-card">
                    <div className="card-body text-center">
                      <h6>Categories</h6>
                      <h2>
                        <FontAwesomeIcon
                          icon={faBoxOpen}
                          className="f-left"
                          style={{ fontSize: "20px" }}
                        />
                        <span>{categories?.length}</span>
                      </h2>
                    </div>
                    <Link
                      className="card-footer text-white clearfix small z-1"
                      to="/admin/categories"
                    >
                      <span className="float-left">View Details</span>
                      <span className="float-right">
                        <i className="fa fa-angle-right"></i>
                      </span>
                    </Link>
                  </div>
                </div>

                {/* Blogs */}
                <div className="col-xl-4 col-sm-6 mb-3">
                  <div className="card bg-c-pink order-card">
                    <div className="card-body text-center">
                      <h6>Blogs</h6>
                      <h2>
                        <FontAwesomeIcon
                          icon={faBlog}
                          className="f-left"
                          style={{ fontSize: "20px" }}
                        />
                        <span>{blogs?.length}</span>
                      </h2>
                    </div>
                    <Link
                      className="card-footer text-white clearfix small z-1"
                      to="/admin/blogs"
                    >
                      <span className="float-left">View Details</span>
                      <span className="float-right">
                        <i className="fa fa-angle-right"></i>
                      </span>
                    </Link>
                  </div>
                </div>

                {/* Coupons */}
                <div className="col-xl-4 col-sm-6 mb-3">
                  <div className="card bg-c-pink order-card">
                    <div className="card-body text-center">
                      <h6>Coupons</h6>
                      <h2>
                        <FontAwesomeIcon
                          icon={faCoins}
                          className="f-left"
                          style={{ fontSize: "20px" }}
                        />
                        <span>{coupons?.length}</span>
                      </h2>
                    </div>
                    <Link
                      className="card-footer text-white clearfix small z-1"
                      to="/admin/coupons"
                    >
                      <span className="float-left">View Details</span>
                      <span className="float-right">
                        <i className="fa fa-angle-right"></i>
                      </span>
                    </Link>
                  </div>
                </div>
              </div>
            </Fragment>
          )}
        </div>
      </div>
    </Fragment>
  );
};

export default Dashboard;
