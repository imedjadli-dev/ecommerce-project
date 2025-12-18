import React, { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { saveShippingInfo } from "../../actions/cartActions";
import { clearErrors, createOrder } from "../../actions/orderActions";
import Infos from "../layout/Infos";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

const ConfirmOrder = () => {
  const [code, setCode] = useState("");
  const [discount, setDiscount] = useState(0);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { cartItems, shippingInfo } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);
  const { error } = useSelector((state) => state.newOrder);

  const itemsPrice = cartItems.length
    ? cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0)
    : 0;

  const shippingPrice = itemsPrice > 300 || !shippingInfo ? 0 : 7;
  const totalPrice = (
    (itemsPrice + shippingPrice) *
    (1 - discount / 100)
  ).toFixed(2);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }
  }, [dispatch, error]);

  // Apply coupon code
  const applyCoupon = async () => {
    try {
      const res = await fetch(`/api/v1/coupon/coupons?code=${code}`);
      const data = await res.json();

      if (!data.success && data.message) {
        toast.error(data.message);
        return;
      }

      const { coupon, usedCount, usageLimit } = data;

      if (usedCount >= usageLimit) {
        toast.error("Coupon has reached its usage limit.");
        return;
      }

      setDiscount(coupon.discount);
      toast.success("Coupon applied successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to apply the coupon.");
    }
  };

  const proceedToPaymentHandler = () => {
    const order = {
      orderItems: cartItems,
      shippingInfo,
      itemsPrice,
      paymentInfo: {
        shippingPrice,
        totalPrice,
      },
    };

    // Save shipping info and create order
    dispatch(saveShippingInfo(shippingInfo));
    dispatch(createOrder(order))
      .then(() => {
        toast.success("Order placed successfully!");
        localStorage.removeItem("cartItems"); // Clear cart after success
        navigate("/orders/me");
      })
      .catch((err) => {
        console.error(err);
        toast.error("Failed to place order.");
      });
  };

  return (
    <Fragment>
      <div className="checkout-container">
        <section className="page-shipping">
          <div className="overy"></div>
          <div className="container text-center">
            <h1 className="mt-2 mb-5">
              <span className="text-color">Confirm </span>Order
            </h1>
          </div>
        </section>

        <Infos title={"Order confirmation"} />

        <section className="cart shopping page-wrapper">
          <div className="container">
            {/* Cart Items */}
            <div className="row justify-content-center">
              <div className="col-lg-12">
                <div className="product-list">
                  <form className="cart-form">
                    <table
                      className="table shop_table shop_table_responsive cart"
                      cellSpacing="0"
                    >
                      <thead>
                        <tr>
                          <th className="product-thumbnail"> </th>
                          <th className="product-name">Product</th>
                          <th className="product-price">Price</th>
                        </tr>
                      </thead>

                      <tbody>
                        {cartItems.map((item) => (
                          <tr key={item.product} className="cart_item">
                            <td className="product-thumbnail">
                              <Link to={`/product/${item.product}`}>
                                <img
                                  src={`http://localhost:4000/products/${item.image}`}
                                  alt={item.name}
                                  className="attachment-woocommerce_thumbnail size-woocommerce_thumbnail"
                                />
                              </Link>
                            </td>
                            <td className="product-name">{item.name}</td>
                            <td className="product-price">
                              {item.quantity} x {item.price} DT ={" "}
                              <b>{item.quantity * item.price} DT</b>
                            </td>
                          </tr>
                        ))}

                        <tr>
                          <td colSpan="6" className="actions">
                            <div className="coupon d-flex">
                              <input
                                type="text"
                                name="coupon_code"
                                className="input-text form-control"
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                placeholder="Coupon code"
                              />
                              <button
                                type="button"
                                className="btn btn-black btn-small ml-3"
                                onClick={applyCoupon}
                              >
                                Apply coupon
                              </button>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </form>
                </div>
              </div>
            </div>

            {/* Shipping Info & Order Summary */}
            <div className="row justify-content-center mt-4">
              <div className="col-lg-6">
                <div className="cart-info card p-4">
                  <h4 className="mb-4">Shipping Information</h4>
                  <ul className="list-unstyled mb-4">
                    <li className="d-flex justify-content-between">
                      <h5>Name</h5>
                      <span>{user?.name}</span>
                    </li>
                    <li className="d-flex justify-content-between">
                      <h5>Address</h5>
                      <span>
                        {shippingInfo &&
                          `${shippingInfo.address}, ${shippingInfo.city}`}
                      </span>
                    </li>
                    <li className="d-flex justify-content-between">
                      <h5>Phone</h5>
                      <span>{shippingInfo?.phoneNumber}</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="col-lg-6">
                <div className="cart-info card p-4">
                  <h4 className="mb-4">Order Summary</h4>
                  <ul className="list-unstyled mb-4">
                    <li className="d-flex justify-content-between">
                      <h5>Items Price</h5>
                      <span>{itemsPrice} DT</span>
                    </li>
                    <li className="d-flex justify-content-between">
                      <h5>Shipping</h5>
                      <span>{shippingPrice} DT</span>
                    </li>
                    <li className="d-flex justify-content-between">
                      <h5>Total</h5>
                      <span>{totalPrice} DT</span>
                    </li>
                  </ul>
                  {user ? (
                    <button
                      className="btn btn-main btn-small"
                      onClick={proceedToPaymentHandler}
                    >
                      Confirm
                    </button>
                  ) : (
                    <div className="alert alert-danger">
                      Please log in to confirm your order.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Fragment>
  );
};

export default ConfirmOrder;
