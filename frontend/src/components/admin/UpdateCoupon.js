import React, { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  clearErrors,
  getSingleCoupon,
  updateCoupon,
} from "../../actions/couponActions";
import { UPDATE_COUPON_RESET } from "../../constants/couponConstantes";
import Infos from "../layout/Infos";
import Sidebar from "./Sidebar";
import { toast } from "react-toastify";

const UpdateCoupon = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [code, setCode] = useState("");
  const [discount, setDiscount] = useState("");
  const [usageLimit, setUsageLimit] = useState("");

  const {
    loading,
    error: updateError,
    isUpdated,
  } = useSelector((state) => state.coupon);
  const { error, coupon } = useSelector((state) => state.couponDetails);

  /* Load coupon */
  useEffect(() => {
    if (!coupon || coupon._id !== id) {
      dispatch(getSingleCoupon(id));
    } else {
      setCode(coupon.code);
      setDiscount(coupon.discount);
      setUsageLimit(coupon.usageLimit);
    }

    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }

    if (updateError) {
      toast.error(updateError);
      dispatch(clearErrors());
    }

    if (isUpdated) {
      toast.success("Coupon updated successfully");
      navigate("/admin/coupons");
      dispatch({ type: UPDATE_COUPON_RESET });
    }
  }, [dispatch, error, updateError, isUpdated, coupon, id, navigate]);

  /* Submit */
  const submitHandler = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.set("code", code);
    formData.set("discount", discount);
    formData.set("usageLimit", usageLimit);

    dispatch(updateCoupon(id, formData));
  };

  return (
    <Fragment>
      <Infos title="Update Coupon" />

      <div className="row">
        <div className="col-12 col-md-2">
          <Sidebar />
        </div>

        <div className="col-12 col-md-10">
          <div className="login-form border p-5">
            <h2 className="text-center mb-4">Update Coupon</h2>

            <form onSubmit={submitHandler} encType="multipart/form-data">
              <div className="form-group mb-4">
                <label>Code</label>
                <input
                  type="text"
                  className="form-control"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  required
                />
              </div>

              <div className="form-group mb-4">
                <label>Discount (%)</label>
                <input
                  type="number"
                  className="form-control"
                  value={discount}
                  onChange={(e) => setDiscount(e.target.value)}
                  required
                />
              </div>

              <div className="form-group mb-4">
                <label>Usage Limit</label>
                <input
                  type="number"
                  className="form-control"
                  value={usageLimit}
                  onChange={(e) => setUsageLimit(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                className="btn btn-dark btn-block"
                disabled={loading}
              >
                {loading ? "Updating..." : "Update Coupon"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default UpdateCoupon;
