import { applyMiddleware, combineReducers, createStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunk from "redux-thunk";

/* ---------------- USER REDUCERS ---------------- */
import {
  allUsersReducer,
  authReducer,
  forgotPasswordReducer,
  userReducer,
  userDetailsReducer,
} from "./reducers/userReducers";

/* ---------------- PRODUCT REDUCERS ---------------- */
import {
  productsReducer,
  productDetailsReducer,
  newProductReducer,
  productReducer,
  postReviewReducer,
  productReviewsReducer,
  reviewReducer,
} from "./reducers/productReducer";

/* ---------------- ORDER REDUCERS ---------------- */
import {
  newOrderReducer,
  myOrdersReducer,
  orderDetailsReducer,
  orderReducer,
  allOrdersReducer,
} from "./reducers/orderReducer";

/* ---------------- CATEGORY REDUCERS ---------------- */
import {
  allCategoriesReducer,
  categoryDetailsReducer,
  categoryReducer,
  createCategoryReducer,
} from "./reducers/categoryReducer";

/* ---------------- COUPON REDUCERS ---------------- */
import {
  allCouponsReducer,
  couponReducer,
  createCouponReducer,
  couponDetailsReducer,
} from "./reducers/couponReducer";

/* ---------------- BLOG REDUCERS ---------------- */
import {
  blogsReducer,
  blogDetailsReducer,
  blogReducer,
  newBlogReducer,
} from "./reducers/blogReducer";

/* ---------------- CART REDUCER ---------------- */
import { cartReducer } from "./reducers/cartReducer";

/* ===================================================== */
/* =============== COMBINE ALL REDUCERS ================ */
/* ===================================================== */

const reducer = combineReducers({
  /* Products */
  products: productsReducer,
  productDetails: productDetailsReducer,
  newProduct: newProductReducer,
  product: productReducer,
  postReview: postReviewReducer,
  productReviews: productReviewsReducer,
  review: reviewReducer,

  /* Categories */
  allCategories: allCategoriesReducer,
  categoryDetails: categoryDetailsReducer,
  category: categoryReducer,
  newCategory: createCategoryReducer,

  /* Orders */
  newOrder: newOrderReducer,
  myOrders: myOrdersReducer,
  orderDetails: orderDetailsReducer,
  allOrders: allOrdersReducer,
  order: orderReducer,

  /* Users */
  auth: authReducer,
  user: userReducer,
  forgotPassword: forgotPasswordReducer,
  allUsers: allUsersReducer,
  userDetails: userDetailsReducer,

  /* Coupons */
  coupon: couponReducer,
  newCoupon: createCouponReducer,
  allCoupons: allCouponsReducer,
  couponDetails: couponDetailsReducer,

  /* Blogs */
  allBlogs: blogsReducer,
  blogDetails: blogDetailsReducer,
  blog: blogReducer,
  newBlog: newBlogReducer,

  /* Cart */
  cart: cartReducer,
});

/* ===================================================== */
/* ========= LOCAL STORAGE INITIAL STATE HANDLING ====== */
/* ===================================================== */

const getLocalStorage = (key, defaultValue) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultValue;
  } catch {
    return defaultValue;
  }
};

const initialState = {
  cart: {
    cartItems: getLocalStorage("cartItems", []),
    shippingInfo: getLocalStorage("shippingInfo", {
      address: "",
      city: "",
      phoneNumber: "",
    }),
    paymentInfo: getLocalStorage("paymentInfo", {
      shippingPrice: "",
      totalPrice: "",
    }),
  },
};

/* ===================================================== */
/* ================== MIDDLEWARE & STORE =============== */
/* ===================================================== */

const middleware = [thunk];

const store = createStore(
  reducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
);

export default store;
