import React from "react";
import { Link } from "react-router-dom";

const CheckoutStep = ({ active, label, to }) => {
  if (active) {
    return (
      <Link to={to} className="float-right">
        <div className="triangle2-active"></div>
        <div className="step active-step">{label}</div>
        <div className="triangle-active"></div>
      </Link>
    );
  }

  return (
    <div
      className="float-right"
      aria-disabled="true"
      style={{ pointerEvents: "none" }}
    >
      <div className="triangle2-incomplete"></div>
      <div className="step incomplete">{label}</div>
      <div className="triangle-incomplete"></div>
    </div>
  );
};

const Checkout = ({ shipping, confirmOrder }) => {
  return (
    <div className="checkout-progress d-flex justify-content-center mt-5">
      <CheckoutStep active={shipping} label="Shipping" to="/shipping" />
      <CheckoutStep
        active={confirmOrder}
        label="Confirm Order"
        to="/order/confirm"
      />
    </div>
  );
};

export default Checkout;
