import React, { Fragment, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../../actions/userAction";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCoins,
  faClipboard,
  faPlus,
  faProductHunt,
  faShoppingBasket,
  faUsers,
  faStar,
  faBlog,
  faTachometerAlt,
  faUser,
  faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";

const Sidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);

  const [openMenu, setOpenMenu] = useState(null);

  const toggleMenu = (menu) => {
    setOpenMenu(openMenu === menu ? null : menu);
  };

  const logoutHandler = () => {
    dispatch(logout());
    toast.success("Logged out successfully");
    navigate("/");
  };

  return (
    <Fragment>
      <div className="sidebar-wrapper">
        <nav id="sidebar">
          <ul className="list-unstyled components">
            {/* Dashboard */}
            <li>
              <Link to="/dashboard">
                <FontAwesomeIcon icon={faTachometerAlt} /> Dashboard
              </Link>
            </li>

            {/* User */}
            <li>
              <button
                className="dropdown-toggle sidebar-btn"
                onClick={() => toggleMenu("user")}
              >
                <FontAwesomeIcon icon={faUser} /> {user?.name}
              </button>

              {openMenu === "user" && (
                <ul className="list-unstyled submenu">
                  <li>
                    <button onClick={logoutHandler} className="sidebar-btn">
                      <FontAwesomeIcon icon={faSignOutAlt} /> Logout
                    </button>
                  </li>
                </ul>
              )}
            </li>

            {/* Blogs */}
            <li>
              <button
                className="dropdown-toggle sidebar-btn"
                onClick={() => toggleMenu("blogs")}
              >
                <FontAwesomeIcon icon={faBlog} /> Blogs
              </button>

              {openMenu === "blogs" && (
                <ul className="list-unstyled submenu">
                  <li>
                    <Link to="/admin/blogs">
                      <FontAwesomeIcon icon={faClipboard} /> All
                    </Link>
                  </li>
                  <li>
                    <Link to="/admin/blog/new">
                      <FontAwesomeIcon icon={faPlus} /> Create
                    </Link>
                  </li>
                </ul>
              )}
            </li>

            {/* Coupons */}
            <li>
              <button
                className="dropdown-toggle sidebar-btn"
                onClick={() => toggleMenu("coupons")}
              >
                <FontAwesomeIcon icon={faCoins} /> Coupons
              </button>

              {openMenu === "coupons" && (
                <ul className="list-unstyled submenu">
                  <li>
                    <Link to="/admin/coupons">
                      <FontAwesomeIcon icon={faClipboard} /> All
                    </Link>
                  </li>
                  <li>
                    <Link to="/admin/coupon/new">
                      <FontAwesomeIcon icon={faPlus} /> Create
                    </Link>
                  </li>
                </ul>
              )}
            </li>

            {/* Categories */}
            <li>
              <button
                className="dropdown-toggle sidebar-btn"
                onClick={() => toggleMenu("categories")}
              >
                <FontAwesomeIcon icon={faProductHunt} /> Categories
              </button>

              {openMenu === "categories" && (
                <ul className="list-unstyled submenu">
                  <li>
                    <Link to="/categories">
                      <FontAwesomeIcon icon={faClipboard} /> All
                    </Link>
                  </li>
                  <li>
                    <Link to="/admin/category">
                      <FontAwesomeIcon icon={faPlus} /> Create
                    </Link>
                  </li>
                </ul>
              )}
            </li>

            {/* Products */}
            <li>
              <button
                className="dropdown-toggle sidebar-btn"
                onClick={() => toggleMenu("products")}
              >
                <FontAwesomeIcon icon={faProductHunt} /> Products
              </button>

              {openMenu === "products" && (
                <ul className="list-unstyled submenu">
                  <li>
                    <Link to="/admin/products">
                      <FontAwesomeIcon icon={faClipboard} /> All
                    </Link>
                  </li>
                  <li>
                    <Link to="/admin/product/new">
                      <FontAwesomeIcon icon={faPlus} /> Create
                    </Link>
                  </li>
                </ul>
              )}
            </li>

            {/* Orders */}
            <li>
              <Link to="/admin/orders">
                <FontAwesomeIcon icon={faShoppingBasket} /> Orders
              </Link>
            </li>

            {/* Users */}
            <li>
              <Link to="/admin/users">
                <FontAwesomeIcon icon={faUsers} /> Users
              </Link>
            </li>

            {/* Reviews */}
            <li>
              <Link to="/admin/reviews">
                <FontAwesomeIcon icon={faStar} /> Reviews
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </Fragment>
  );
};

export default Sidebar;
