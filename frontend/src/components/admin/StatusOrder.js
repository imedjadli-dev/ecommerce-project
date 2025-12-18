import { PDFDownloadLink } from "@react-pdf/renderer";
import React, { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import {
  clearErrors,
  getOrderDetails,
  updateOrder,
} from "../../actions/orderActions";
import { UPDATE_ORDER_RESET } from "../../constants/orderConstantes";
import Infos from "../layout/Infos";
import Loader from "../layout/Loader";
import GenerateInvoice from "./GenerateInvoice";
import Sidebar from "./Sidebar";
import { toast } from "react-toastify";

const StatusOrder = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const [status, setStatus] = useState("");
  const [statusError, setStatusError] = useState("");

  const { loading, order = {} } = useSelector((state) => state.orderDetails);
  const { error, isUpdated } = useSelector((state) => state.order);

  const {
    shippingInfo,
    orderItems,
    paymentInfo,
    user,
    totalPrice,
    orderStatus,
  } = order;

  /* Load order */
  useEffect(() => {
    dispatch(getOrderDetails(id));
  }, [dispatch, id]);

  /* Handle errors & success */
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }

    if (isUpdated) {
      toast.success("Order updated successfully");
      dispatch({ type: UPDATE_ORDER_RESET });
    }
  }, [dispatch, error, isUpdated]);

  /* Update order status */
  const updateOrderHandler = () => {
    setStatusError("");

    if (!status) {
      setStatusError("Status is required");
      return;
    }

    const formData = new FormData();
    formData.set("orderStatus", status);

    dispatch(updateOrder(id, formData));
  };

  const shippingDetails =
    shippingInfo && `${shippingInfo.address}, ${shippingInfo.city}`;

  return (
    <Fragment>
      <Infos title={`Order Status : ${order._id || ""}`} />

      <div className="row">
        <div className="col-12 col-md-2">
          <Sidebar />
        </div>

        <div className="col-12 col-md-10">
          {loading ? (
            <Loader />
          ) : (
            <div className="row d-flex justify-content-around">
              {/* Order Details */}
              <div className="col-12 col-lg-7 order-details">
                <h2 className="my-4">Order #{order._id}</h2>

                <h4>Shipping Info</h4>
                <p>
                  <b>Name:</b> {user?.name}
                </p>
                <p>
                  <b>Email:</b> {user?.email}
                </p>
                <p>
                  <b>Phone:</b> {shippingInfo?.phoneNumber}
                </p>
                <p>
                  <b>Address:</b> {shippingDetails}
                </p>

                <hr />

                <p>
                  <b>Total:</b> {totalPrice} DT
                </p>
                <p>
                  <b>Shipping:</b> {paymentInfo?.shippingPrice} DT
                </p>

                <hr />

                <h4>Order Status</h4>
                <p
                  className={
                    orderStatus === "Delivered" ? "greenColor" : "redColor"
                  }
                >
                  <b>{orderStatus}</b>
                </p>

                <hr />

                <h4>Order Items</h4>
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th>Image</th>
                      <th>Product</th>
                      <th>Price</th>
                      <th>Qty</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orderItems?.map((item) => (
                      <tr key={item.product}>
                        <td>
                          <img
                            src={`http://localhost:4000/products/${item.image}`}
                            alt={item.name}
                            width="50"
                          />
                        </td>
                        <td>
                          <Link to={`/product/${item.product}`}>
                            {item.name}
                          </Link>
                        </td>
                        <td>{item.price} DT</td>
                        <td>{item.quantity}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Status Update */}
              <div className="col-12 col-lg-3 mt-5">
                <h4>Update Status</h4>

                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className={`form-control mb-3 ${
                    statusError ? "is-invalid" : ""
                  }`}
                >
                  <option value="">Choose status</option>
                  <option value="Processing">Processing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                </select>

                {statusError && (
                  <div className="invalid-feedback d-block">{statusError}</div>
                )}

                <button
                  className="btn btn-primary btn-block mb-3"
                  onClick={updateOrderHandler}
                >
                  Update Status
                </button>

                <PDFDownloadLink
                  document={<GenerateInvoice order={order} />}
                  fileName={`invoice-${order._id}.pdf`}
                  className="btn btn-dark btn-block"
                >
                  {({ loading }) =>
                    loading ? "Generating PDF..." : "Download Invoice"
                  }
                </PDFDownloadLink>
              </div>
            </div>
          )}
        </div>
      </div>
    </Fragment>
  );
};

export default StatusOrder;
