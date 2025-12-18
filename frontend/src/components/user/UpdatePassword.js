import React, { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { updatePassword } from "../../actions/userAction";
import { UPDATE_PASSWORD_RESET } from "../../constants/userConstantes";
import Infos from "../layout/Infos";
import { toast } from "react-toastify";

const UpdatePassword = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [errors, setErrors] = useState({ oldPassword: "", newPassword: "" });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { error, isUpdated, loading } = useSelector((state) => state.user);

  useEffect(() => {
    if (isUpdated) {
      toast.success("Password updated!");
      navigate("/me");
      dispatch({ type: UPDATE_PASSWORD_RESET });
    }

    if (error) {
      toast.error(error);
    }
  }, [dispatch, error, isUpdated, navigate]);

  const validate = () => {
    let valid = true;
    const newErrors = { oldPassword: "", newPassword: "" };

    if (!oldPassword.trim()) {
      newErrors.oldPassword = "Old password is required";
      valid = false;
    }
    if (!newPassword.trim()) {
      newErrors.newPassword = "New password is required";
      valid = false;
    } else if (newPassword.length < 8) {
      newErrors.newPassword = "New password must be at least 8 characters";
      valid = false;
    } else if (newPassword === oldPassword) {
      newErrors.newPassword =
        "New password must be different from old password";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const submitHandler = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const formData = new FormData();
    formData.set("oldPassword", oldPassword);
    formData.set("password", newPassword);

    dispatch(updatePassword(formData));
  };

  return (
    <Fragment>
      <Infos title="Change Password" />
      <section className="vh-100">
        <div className="container py-5 h-100">
          <div className="row d-flex justify-content-center align-items-center h-100">
            <div className="col col-xl-10">
              <div className="card" style={{ borderRadius: "1rem" }}>
                <div className="row g-0">
                  <div className="col-md-6 col-lg-5 d-none d-md-block">
                    <img
                      src="/assets/images/update.jpg"
                      alt="Update Password"
                      className="img-fluid"
                      style={{ borderRadius: "1rem 0 0 1rem" }}
                    />
                  </div>
                  <div className="col-md-6 col-lg-7 d-flex align-items-center">
                    <div className="card-body p-4 p-lg-5 text-black">
                      <form onSubmit={submitHandler}>
                        <h5
                          className="fw-normal mb-3 pb-3"
                          style={{ letterSpacing: "1px" }}
                        >
                          Change your password
                        </h5>

                        <div className="form-outline mb-4">
                          <label htmlFor="old_password">Old Password</label>
                          <input
                            type="password"
                            id="old_password"
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                            className={`form-control form-control-lg ${
                              errors.oldPassword ? "is-invalid" : ""
                            }`}
                            placeholder="Old password"
                          />
                          {errors.oldPassword && (
                            <div className="invalid-feedback">
                              {errors.oldPassword}
                            </div>
                          )}
                        </div>

                        <div className="form-outline mb-4">
                          <label htmlFor="new_password">New Password</label>
                          <input
                            type="password"
                            id="new_password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className={`form-control form-control-lg ${
                              errors.newPassword ? "is-invalid" : ""
                            }`}
                            placeholder="New password"
                          />
                          {errors.newPassword && (
                            <div className="invalid-feedback">
                              {errors.newPassword}
                            </div>
                          )}
                        </div>

                        <div className="pt-1 mb-4">
                          <button
                            className="btn btn-dark btn-lg btn-block"
                            type="submit"
                            disabled={loading}
                          >
                            Update
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Fragment>
  );
};

export default UpdatePassword;
