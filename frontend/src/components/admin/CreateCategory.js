import React, { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Infos from "../layout/Infos";
import Sidebar from "./Sidebar";

import { addCategory, clearErrors } from "../../actions/categoryActions";
import { CREATE_CATEGORY_RESET } from "../../constants/categoryConstantes";

const CreateCategory = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { error, loading, success } = useSelector((state) => state.newCategory);

  const [name, setName] = useState("");
  const [nameError, setNameError] = useState("");

  useEffect(() => {
    if (error) {
      toast.error(error.response?.data?.message || error);
      dispatch(clearErrors());
    }

    if (success) {
      toast.success("Category created successfully");
      dispatch({ type: CREATE_CATEGORY_RESET });
      navigate("/categories");
    }
  }, [dispatch, error, success, navigate]);

  const submitHandler = (e) => {
    e.preventDefault();

    setNameError("");

    if (!name.trim()) {
      setNameError("Name is required");
      return;
    }

    const formData = new FormData();
    formData.set("name", name);

    dispatch(addCategory(formData));
  };

  return (
    <Fragment>
      <Infos title="Create Category" />
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
                        <h2 className="mb-2">Create Category</h2>
                      </div>
                      <form
                        onSubmit={submitHandler}
                        encType="multipart/form-data"
                      >
                        <div className="form-group mb-4">
                          <label htmlFor="name_field">Name</label>
                          <input
                            type="text"
                            id="name_field"
                            name="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className={`form-control ${
                              nameError ? "is-invalid" : ""
                            }`}
                            placeholder="Enter category name"
                          />
                          {nameError && (
                            <div className="invalid-feedback">{nameError}</div>
                          )}
                        </div>

                        <button
                          id="create_category_button"
                          type="submit"
                          className="btn btn-dark btn-lg btn-block"
                          disabled={loading}
                        >
                          Create Category
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

export default CreateCategory;
