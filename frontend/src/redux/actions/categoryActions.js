import axios from "axios";
import {
  ALL_CATEGORY_FAIL,
  ALL_CATEGORY_REQUEST,
  ALL_CATEGORY_SUCCESS,
  CATEGORY_DETAILS_FAIL,
  CATEGORY_DETAILS_REQUEST,
  CATEGORY_DETAILS_SUCCESS,
  CLEAR_ERRORS,
  CREATE_CATEGORY_FAIL,
  CREATE_CATEGORY_REQUEST,
  CREATE_CATEGORY_SUCCESS,
  DELETE_CATEGORY_FAIL,
  DELETE_CATEGORY_REQUEST,
  DELETE_CATEGORY_SUCCESS,
  UPDATE_CATEGORY_FAIL,
  UPDATE_CATEGORY_REQUEST,
  UPDATE_CATEGORY_SUCCESS,
} from "../constants/categoryConstantes";

/* -------------------------------------------------------------------------- */
/*                               ADD NEW CATEGORY                               */
/* -------------------------------------------------------------------------- */
export const addCategory = (categoryData) => async (dispatch) => {
  try {
    dispatch({ type: CREATE_CATEGORY_REQUEST });

    const config = {
      headers: { "Content-Type": "application/json" },
    };

    const { data } = await axios.post(
      "/api/v1/category/new",
      categoryData,
      config
    );

    dispatch({
      type: CREATE_CATEGORY_SUCCESS,
      payload: data.category,
    });
  } catch (error) {
    dispatch({
      type: CREATE_CATEGORY_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};

/* -------------------------------------------------------------------------- */
/*                               GET ALL CATEGORIES                             */
/* -------------------------------------------------------------------------- */
export const getAllCategories = () => async (dispatch) => {
  try {
    dispatch({ type: ALL_CATEGORY_REQUEST });

    const { data } = await axios.get("/api/v1/categories");

    dispatch({
      type: ALL_CATEGORY_SUCCESS,
      payload: data.categories,
    });
  } catch (error) {
    dispatch({
      type: ALL_CATEGORY_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};

/* -------------------------------------------------------------------------- */
/*                               GET SINGLE CATEGORY                            */
/* -------------------------------------------------------------------------- */
export const getSingleCategory = (id) => async (dispatch) => {
  try {
    dispatch({ type: CATEGORY_DETAILS_REQUEST });

    const { data } = await axios.get(`/api/v1/category/${id}`);

    dispatch({
      type: CATEGORY_DETAILS_SUCCESS,
      payload: data.category,
    });
  } catch (error) {
    dispatch({
      type: CATEGORY_DETAILS_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};

/* -------------------------------------------------------------------------- */
/*                               UPDATE CATEGORY                                */
/* -------------------------------------------------------------------------- */
export const updateCategory = (id, categoryData) => async (dispatch) => {
  try {
    dispatch({ type: UPDATE_CATEGORY_REQUEST });

    const config = { headers: { "Content-Type": "application/json" } };

    const { data } = await axios.put(
      `/api/v1/category/${id}`,
      categoryData,
      config
    );

    dispatch({
      type: UPDATE_CATEGORY_SUCCESS,
      payload: data.success,
    });
  } catch (error) {
    dispatch({
      type: UPDATE_CATEGORY_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};

/* -------------------------------------------------------------------------- */
/*                               DELETE CATEGORY                                */
/* -------------------------------------------------------------------------- */
export const deleteCategory = (id) => async (dispatch) => {
  try {
    dispatch({ type: DELETE_CATEGORY_REQUEST });

    const { data } = await axios.delete(`/api/v1/category/${id}`);

    dispatch({
      type: DELETE_CATEGORY_SUCCESS,
      payload: data.success,
    });
  } catch (error) {
    dispatch({
      type: DELETE_CATEGORY_FAIL,
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
