import React, { Fragment, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import Search from "./Search";
import { logout } from "../../actions/userAction";

import "../../App.css";

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { cartItems } = useSelector((state) => state.cart);
  const { user, loading } = useSelector((state) => state.auth);

  const [wishlistCount, setWishlistCount] = useState(0);

  // Update wishlist count from localStorage
  const updateWishlistCount = () => {
    const savedProducts = JSON.parse(localStorage.getItem("wishlist")) || [];
    setWishlistCount(savedProducts.length);
  };

  useEffect(() => {
    updateWishlistCount();

    // Listen for wishlist changes across tabs
    window.addEventListener("storage", updateWishlistCount);
    return () => window.removeEventListener("storage", updateWishlistCount);
  }, []);

  const logoutHandler = () => {
    dispatch(logout());
    toast.success("Logged out successfully.");
  };

  const handleHomeClick = () => {
    navigate("/");
  };

  return (
    <Fragment>
      <nav className="navbar navbar-expand-lg navbar-light bg-white w-100 navigation">
        <div className="container">
          <Link
            className="navbar-brand font-weight-bold"
            to="/"
            onClick={handleHomeClick}
          >
            DropSell
          </Link>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#main-navbar"
            aria-controls="main-navbar"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="main-navbar">
            <ul className="navbar-nav mx-auto">
              <li className="nav-item">
                <Link className="nav-link" to="/">
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/about">
                  About Us
                </Link>
              </li>

              <li className="nav-item dropdown">
                <Link
                  className="nav-link dropdown-toggle"
                  to="#!"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Pages
                </Link>
                <ul className="dropdown-menu">
                  <li>
                    <Link className="dropdown-item" to="/blogs">
                      Blog
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/contact">
                      Contact
                    </Link>
                  </li>
                </ul>
              </li>

              <li className="nav-item dropdown">
                <Link
                  className="nav-link dropdown-toggle"
                  to="#!"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Shop
                </Link>
                <ul className="dropdown-menu">
                  <li>
                    <Link className="dropdown-item" to="/">
                      Products
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/cart">
                      Cart
                    </Link>
                  </li>
                </ul>
              </li>

              <li className="nav-item dropdown">
                {user ? (
                  <div className="dropdown">
                    <Link
                      to="#!"
                      className="btn dropdown-toggle d-flex align-items-center"
                      role="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      <figure className="avatar avatar-nav me-2">
                        <img
                          src={`${process.env.REACT_APP_API_URL}/avatars/${user.avatar}`}
                          alt={user.name}
                          className="rounded-circle"
                          style={{ width: "30px", height: "30px" }}
                        />
                      </figure>
                      <span>{user.name}</span>
                    </Link>

                    <ul className="dropdown-menu">
                      {user.role === "admin" && (
                        <li>
                          <Link className="dropdown-item" to="/dashboard">
                            Dashboard
                          </Link>
                        </li>
                      )}
                      <li>
                        <Link className="dropdown-item" to="/orders/me">
                          Orders
                        </Link>
                      </li>
                      <li>
                        <Link className="dropdown-item" to="/me">
                          Profile
                        </Link>
                      </li>
                      <li>
                        <button
                          className="dropdown-item text-danger"
                          onClick={logoutHandler}
                        >
                          Logout
                        </button>
                      </li>
                    </ul>
                  </div>
                ) : (
                  !loading && (
                    <Link className="nav-link" to="/login">
                      Account
                    </Link>
                  )
                )}
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <div className="container-fluid py-3">
        <div className="row align-items-center px-xl-5">
          <div className="col-lg-3 d-none d-lg-block"></div>
          <div className="col-lg-6 col-6 text-left">
            <Search />
          </div>
          <div className="col-lg-3 col-6 text-end">
            <Link to="/cart" className="btn position-relative me-2">
              <i className="tf-ion-android-cart"></i>
              {cartItems.length > 0 && (
                <span className="badge position-absolute top-0 start-100 translate-middle">
                  {cartItems.length}
                </span>
              )}
            </Link>

            <Link to="/wishlist" className="btn position-relative">
              <i className="fa fa-heart"></i>
              {wishlistCount > 0 && (
                <span className="badge position-absolute top-0 start-100 translate-middle">
                  {wishlistCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Header;
