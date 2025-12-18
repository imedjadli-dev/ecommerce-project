import React, { Fragment, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import { clearErrors, getOrderDetails } from "../../actions/orderActions";
import Infos from "../layout/Infos";
import Loader from "../layout/Loader";

const OrderDetails = () => {
  const dispatch = useDispatch();
  const { id } = useParams();

  const {
    loading,
    error,
    order = {},
  } = useSelector((state) => state.orderDetails);

  const {
    shippingInfo = {},
    orderItems = [],
    paymentInfo = {},
    user = {},
  } = order;

  /*  Fetch order details */
  useEffect(() => {
    dispatch(getOrderDetails(id));
  }, [dispatch, id]);

  /* Error handling */
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }
  }, [dispatch, error]);

  /*  Shipping details */
  const shippingDetails = useMemo(() => {
    if (!shippingInfo) return "";
    return `${shippingInfo.adress || ""}, ${shippingInfo.city || ""}`;
  }, [shippingInfo]);

  return (
    <Fragment>
      <Infos title={`Order Status : ${order._id || ""}`} />

      <div className="container">
        {loading ? (
          <Loader />
        ) : (
          <div className="row justify-content-center">
            <div className="col-12 col-lg-8 order-details">
              <h1 className="my-5">Order # {order._id}</h1>

              {/*  Shipping Info */}
              <h4 className="mb-4">Shipping Info</h4>
              <p>
                <b>Name:</b> {user.name}
              </p>
              <p>
                <b>Email:</b> {user.email}
              </p>
              <p>
                <b>Phone:</b> {shippingInfo.phoneNumber}
              </p>
              <p>
                <b>Address:</b> {shippingDetails}
              </p>

              {/*  Payment */}
              <p>
                <b>Amount:</b> {paymentInfo.totalPrice} DT
              </p>
              <p>
                <b>Shipping:</b> {paymentInfo.shippingPrice} DT
              </p>

              <hr />

              {/*  Order Status */}
              <h4 className="my-4">Order Status:</h4>
              <p
                className={
                  paymentInfo.orderStatus?.includes("Delivered")
                    ? "greenColor"
                    : "redColor"
                }
              >
                <b>{paymentInfo.orderStatus}</b>
              </p>

              <hr />

              {/*  Order Items */}
              <h4 className="my-4">Order Items:</h4>

              <div className="cart shopping page-wrapper">
                <div className="container">
                  <table className="table shop_table shop_table_responsive cart">
                    <thead>
                      <tr>
                        <th>Image</th>
                        <th>Product</th>
                        <th>Price</th>
                        <th>Quantity</th>
                      </tr>
                    </thead>

                    <tbody>
                      {orderItems.map((item) => (
                        <tr key={item.product}>
                          <td>
                            <Link to={`/product/${item.product}`}>
                              <img
                                src={`http://localhost:4000/products/${item.image}`}
                                alt={item.name}
                                width="60"
                              />
                            </Link>
                          </td>

                          <td>
                            <Link to={`/product/${item.product}`}>
                              {item.name}
                            </Link>
                          </td>

                          <td>{item.price} DT</td>
                          <td>{item.quantity} Item(s)</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Fragment>
  );
};

export default OrderDetails;
