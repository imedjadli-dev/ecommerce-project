import React, { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  clearErrors,
  getSingleCategory,
  updateCategory,
} from "../../actions/categoryActions";
import { UPDATE_CATEGORY_RESET } from "../../constants/categoryConstantes";
import Infos from "../layout/Infos";
import Sidebar from "./Sidebar";
import { toast } from "react-toastify";

const UpdateCategory = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [name, setName] = useState("");

  const {
    loading,
    error: updateError,
    isUpdated,
  } = useSelector((state) => state.category);
  const { error, category } = useSelector((state) => state.categoryDetails);

  /* Load category */
  useEffect(() => {
    if (!category || category._id !== id) {
      dispatch(getSingleCategory(id));
    } else {
      setName(category.name);
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
      toast.success("Category updated successfully");
      navigate("/admin/categories");
      dispatch({ type: UPDATE_CATEGORY_RESET });
    }
  }, [dispatch, error, updateError, isUpdated, category, id, navigate]);

  /* Submit */
  const submitHandler = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.set("name", name);

    dispatch(updateCategory(id, formData));
  };

  return (
    <Fragment>
      <Infos title="Update Category" />

      <div className="row">
        <div className="col-12 col-md-2">
          <Sidebar />
        </div>

        <div className="col-12 col-md-10">
          <div className="login-form border p-5">
            <h2 className="text-center mb-4">Update Category</h2>

            <form onSubmit={submitHandler} encType="multipart/form-data">
              <div className="form-group mb-4">
                <label>Category Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                className="btn btn-dark btn-block"
                disabled={loading}
              >
                {loading ? "Updating..." : "Update Category"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default UpdateCategory;
