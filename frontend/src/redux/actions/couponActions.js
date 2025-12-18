import axios from "axios";
import {
  ALL_COUPON_FAIL,
  ALL_COUPON_REQUEST,
  ALL_COUPON_SUCCESS,
  COUPON_DETAILS_FAIL,
  COUPON_DETAILS_REQUEST,
  COUPON_DETAILS_SUCCESS,
  CLEAR_ERRORS,
  CREATE_COUPON_FAIL,
  CREATE_COUPON_REQUEST,
  CREATE_COUPON_SUCCESS,
  DELETE_COUPON_FAIL,
  DELETE_COUPON_REQUEST,
  DELETE_COUPON_SUCCESS,
  UPDATE_COUPON_FAIL,
  UPDATE_COUPON_REQUEST,
  UPDATE_COUPON_SUCCESS,
} from "../constants/couponConstantes";

/* -------------------------------------------------------------------------- */
/*                               ADD NEW COUPON                                 */
/* -------------------------------------------------------------------------- */
export const addCoupon = (couponData) => async (dispatch) => {
  try {
    dispatch({ type: CREATE_COUPON_REQUEST });

    const config = {
      headers: { "Content-Type": "application/json" },
    };

    const { data } = await axios.post(
      "/api/v1/admin/coupon/new",
      couponData,
      config
    );

    dispatch({
      type: CREATE_COUPON_SUCCESS,
      payload: data.coupon,
    });
  } catch (error) {
    dispatch({
      type: CREATE_COUPON_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};

/* -------------------------------------------------------------------------- */
/*                               GET ALL COUPONS                                */
/* -------------------------------------------------------------------------- */
export const getAllCoupons = () => async (dispatch) => {
  try {
    dispatch({ type: ALL_COUPON_REQUEST });

    const { data } = await axios.get("/api/v1/admin/coupons");

    dispatch({
      type: ALL_COUPON_SUCCESS,
      payload: data.coupons,
    });
  } catch (error) {
    dispatch({
      type: ALL_COUPON_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};

/* -------------------------------------------------------------------------- */
/*                              GET SINGLE COUPON                               */
/* -------------------------------------------------------------------------- */
export const getSingleCoupon = (id) => async (dispatch) => {
  try {
    dispatch({ type: COUPON_DETAILS_REQUEST });

    const { data } = await axios.get(`/api/v1/admin/coupon/${id}`);

    dispatch({
      type: COUPON_DETAILS_SUCCESS,
      payload: data.coupon,
    });
  } catch (error) {
    dispatch({
      type: COUPON_DETAILS_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};

/* -------------------------------------------------------------------------- */
/*                               UPDATE COUPON                                  */
/* -------------------------------------------------------------------------- */
export const updateCoupon = (id, couponData) => async (dispatch) => {
  try {
    dispatch({ type: UPDATE_COUPON_REQUEST });

    const config = { headers: { "Content-Type": "application/json" } };

    const { data } = await axios.put(
      `/api/v1/admin/coupon/${id}`,
      couponData,
      config
    );

    dispatch({
      type: UPDATE_COUPON_SUCCESS,
      payload: data.success,
    });
  } catch (error) {
    dispatch({
      type: UPDATE_COUPON_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};

/* -------------------------------------------------------------------------- */
/*                               DELETE COUPON                                  */
/* -------------------------------------------------------------------------- */
export const deleteCoupon = (id) => async (dispatch) => {
  try {
    dispatch({ type: DELETE_COUPON_REQUEST });

    const { data } = await axios.delete(`/api/v1/admin/coupon/${id}`);

    dispatch({
      type: DELETE_COUPON_SUCCESS,
      payload: data.success,
    });
  } catch (error) {
    dispatch({
      type: DELETE_COUPON_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};

/* -------------------------------------------------------------------------- */
/*                               CLEAR ERRORS                                   */
/* -------------------------------------------------------------------------- */
export const clearErrors = () => async (dispatch) => {
  dispatch({ type: CLEAR_ERRORS });
};
