import axios from "axios";
import {
  ADMIN_BLOGS_FAIL,
  ADMIN_BLOGS_REQUEST,
  ADMIN_BLOGS_SUCCESS,
  ALL_BLOGS_FAIL,
  ALL_BLOGS_REQUEST,
  ALL_BLOGS_SUCCESS,
  BLOG_DETAILS_FAIL,
  BLOG_DETAILS_REQUEST,
  BLOG_DETAILS_SUCCESS,
  CLEAR_ERRORS,
  DELETE_BLOG_FAIL,
  DELETE_BLOG_REQUEST,
  DELETE_BLOG_SUCCESS,
  NEW_BLOG_FAIL,
  NEW_BLOG_REQUEST,
  NEW_BLOG_SUCCESS,
  UPDATE_BLOG_FAIL,
  UPDATE_BLOG_REQUEST,
  UPDATE_BLOG_SUCCESS,
} from "../constants/blogConstantes";

/* -------------------------------------------------------------------------- */
/*                              GET ALL BLOGS                                   */
/* -------------------------------------------------------------------------- */
export const getAllBlogs =
  (currentPage = 1) =>
  async (dispatch) => {
    try {
      dispatch({ type: ALL_BLOGS_REQUEST });

      const link = `/api/v1/blogs?page=${currentPage}`;
      const { data } = await axios.get(link);

      dispatch({
        type: ALL_BLOGS_SUCCESS,
        payload: {
          blogs: data.blogs,
          blogsCount: data.blogsCount,
          resPerPage: data.resPerPage,
        },
      });
    } catch (error) {
      dispatch({
        type: ALL_BLOGS_FAIL,
        payload: error.response?.data?.message || error.message,
      });
    }
  };

/* -------------------------------------------------------------------------- */
/*                              GET SINGLE BLOG                                 */
/* -------------------------------------------------------------------------- */
export const getSingleBlog = (id) => async (dispatch) => {
  try {
    dispatch({ type: BLOG_DETAILS_REQUEST });

    const { data } = await axios.get(`/api/v1/blogs/blog/${id}`);

    dispatch({
      type: BLOG_DETAILS_SUCCESS,
      payload: data.blog,
    });
  } catch (error) {
    dispatch({
      type: BLOG_DETAILS_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};

/* -------------------------------------------------------------------------- */
/*                                CREATE NEW BLOG                               */
/* -------------------------------------------------------------------------- */
export const newBlog = (blogData) => async (dispatch) => {
  try {
    dispatch({ type: NEW_BLOG_REQUEST });

    const config = { headers: { "Content-Type": "multipart/form-data" } };
    const { data } = await axios.post(
      "/api/v1/admin/blog/new",
      blogData,
      config
    );

    dispatch({
      type: NEW_BLOG_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: NEW_BLOG_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};

/* -------------------------------------------------------------------------- */
/*                                UPDATE BLOG                                   */
/* -------------------------------------------------------------------------- */
export const updateBlog = (id, blogData) => async (dispatch) => {
  try {
    dispatch({ type: UPDATE_BLOG_REQUEST });

    const config = { headers: { "Content-Type": "multipart/form-data" } };
    const { data } = await axios.put(
      `/api/v1/admin/blog/${id}`,
      blogData,
      config
    );

    dispatch({
      type: UPDATE_BLOG_SUCCESS,
      payload: data.success,
    });
  } catch (error) {
    dispatch({
      type: UPDATE_BLOG_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};

/* -------------------------------------------------------------------------- */
/*                                DELETE BLOG                                   */
/* -------------------------------------------------------------------------- */
export const deleteBlog = (id) => async (dispatch) => {
  try {
    dispatch({ type: DELETE_BLOG_REQUEST });

    const { data } = await axios.delete(`/api/v1/admin/blog/${id}`);

    dispatch({
      type: DELETE_BLOG_SUCCESS,
      payload: data.success,
    });
  } catch (error) {
    dispatch({
      type: DELETE_BLOG_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};

/* -------------------------------------------------------------------------- */
/*                               GET ADMIN BLOGS                                */
/* -------------------------------------------------------------------------- */
export const getAdminBlogs = () => async (dispatch) => {
  try {
    dispatch({ type: ADMIN_BLOGS_REQUEST });

    const { data } = await axios.get(`/api/v1/admin/blogs`);

    dispatch({
      type: ADMIN_BLOGS_SUCCESS,
      payload: data.blogs,
    });
  } catch (error) {
    dispatch({
      type: ADMIN_BLOGS_FAIL,
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
