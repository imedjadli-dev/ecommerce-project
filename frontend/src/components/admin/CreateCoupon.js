import React, { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Infos from "../layout/Infos";
import Sidebar from "./Sidebar";

import { addCoupon, clearErrors } from "../../actions/couponActions";
import { CREATE_COUPON_RESET } from "../../constants/couponConstantes";

const CreateCoupon = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { error, loading, success } = useSelector((state) => state.newCoupon);

  const [code, setCode] = useState("");
  const [discount, setDiscount] = useState("");
  const [usageLimit, setUsageLimit] = useState("");

  const [codeError, setCodeError] = useState("");
  const [discountError, setDiscountError] = useState("");
  const [usageLimitError, setUsageLimitError] = useState("");

  useEffect(() => {
    if (error) {
      toast.error(error.response?.data?.message || error);
      dispatch(clearErrors());
    }

    if (success) {
      toast.success("Coupon created successfully");
      dispatch({ type: CREATE_COUPON_RESET });
      navigate("/admin/coupons");
    }
  }, [dispatch, error, success, navigate]);

  const submitHandler = (e) => {
    e.preventDefault();

    // Reset errors
    setCodeError("");
    setDiscountError("");
    setUsageLimitError("");

    let isValid = true;

    if (!code.trim()) {
      setCodeError("Code is required");
      isValid = false;
    }

    if (!discount.trim()) {
      setDiscountError("Discount is required");
      isValid = false;
    }

    if (!usageLimit.trim()) {
      setUsageLimitError("Usage limit is required");
      isValid = false;
    }

    if (!isValid) return;

    const formData = new FormData();
    formData.set("code", code);
    formData.set("discount", discount);
    formData.set("usageLimit", usageLimit);

    dispatch(addCoupon(formData));
  };

  return (
    <Fragment>
      <Infos title="Create Coupon" />
      <div className="row">
        <div className="col-lg-3">
          <Sidebar />
        </div>
        <div className="col-lg-9">
          <div className="signUp-container">
            <div className="account section">
              <div className="container">
                <div className="row justify-content-center">
                  <div className="col-lg-12">
                    <div className="login-form border p-5">
                      <div className="text-center heading">
                        <h2 className="mb-2">Create Coupon</h2>
                      </div>
                      <form onSubmit={submitHandler}>
                        <div className="form-group mb-4">
                          <label htmlFor="code_field">Code</label>
                          <input
                            type="text"
                            id="code_field"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            className={`form-control ${
                              codeError ? "is-invalid" : ""
                            }`}
                            placeholder="Enter coupon code"
                          />
                          {codeError && (
                            <div className="invalid-feedback">{codeError}</div>
                          )}
                        </div>

                        <div className="form-group mb-4">
                          <label htmlFor="discount_field">Discount</label>
                          <input
                            type="text"
                            id="discount_field"
                            value={discount}
                            onChange={(e) => setDiscount(e.target.value)}
                            className={`form-control ${
                              discountError ? "is-invalid" : ""
                            }`}
                            placeholder="Enter discount amount"
                          />
                          {discountError && (
                            <div className="invalid-feedback">
                              {discountError}
                            </div>
                          )}
                        </div>

                        <div className="form-group mb-4">
                          <label htmlFor="usage_limit_field">Usage Limit</label>
                          <input
                            type="text"
                            id="usage_limit_field"
                            value={usageLimit}
                            onChange={(e) => setUsageLimit(e.target.value)}
                            className={`form-control ${
                              usageLimitError ? "is-invalid" : ""
                            }`}
                            placeholder="Enter usage limit"
                          />
                          {usageLimitError && (
                            <div className="invalid-feedback">
                              {usageLimitError}
                            </div>
                          )}
                        </div>

                        <button
                          id="create_coupon_button"
                          type="submit"
                          className="btn btn-dark btn-lg btn-block"
                          disabled={loading}
                        >
                          Create Coupon
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default CreateCoupon;
