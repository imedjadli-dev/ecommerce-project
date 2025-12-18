import React, { Fragment, useEffect, useMemo } from "react";
import { MDBDataTable } from "mdbreact";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

import { clearErrors, myOrders } from "../../actions/orderActions";
import Infos from "../layout/Infos";
import Loader from "../layout/Loader";

const ListOrders = () => {
  const dispatch = useDispatch();

  const {
    loading,
    error,
    orders = [],
  } = useSelector((state) => state.myOrders);

  /* Fetch Orders */
  useEffect(() => {
    dispatch(myOrders());
  }, [dispatch]);

  /*  Handle Errors */
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }
  }, [dispatch, error]);

  /*   Table Data */
  const tableData = useMemo(() => {
    return {
      columns: [
        { label: "Order ID", field: "id", sort: "asc" },
        { label: "Items", field: "numOfItems", sort: "asc" },
        { label: "Amount", field: "amount", sort: "asc" },
        { label: "Status", field: "status", sort: "asc" },
        { label: "Actions", field: "actions" },
      ],
      rows: orders.map((order) => ({
        id: order._id,
        numOfItems: order.orderItems?.length || 0,
        amount: `${order.paymentInfo?.totalPrice || 0} DT`,
        status: (
          <span
            style={{
              color: order.paymentInfo?.orderStatus?.includes("Delivered")
                ? "green"
                : "red",
              fontWeight: "bold",
            }}
          >
            {order.paymentInfo?.orderStatus || "Pending"}
          </span>
        ),
        actions: (
          <Link to={`/order/${order._id}`} className="btn btn-sm btn-primary">
            <i className="fa fa-eye" />
          </Link>
        ),
      })),
    };
  }, [orders]);

  return (
    <Fragment>
      <Infos title="My Orders" />

      <div className="container mt-5">
        <h1 className="mb-4">My Orders</h1>

        {loading ? (
          <Loader />
        ) : (
          <MDBDataTable
            data={tableData}
            bordered
            striped
            hover
            responsive
            className="px-3"
          />
        )}
      </div>
    </Fragment>
  );
};

export default ListOrders;
