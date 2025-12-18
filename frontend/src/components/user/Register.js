import React, { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { clearErrors, register } from "../../actions/userAction";
import Infos from "../layout/Infos";
import { toast } from "react-toastify";

const Register = () => {
  const [errors, setErrors] = useState({ name: "", email: "", password: "" });
  const [user, setUser] = useState({ name: "", email: "", password: "" });
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(
    "/assets/images/avatar.png"
  );

  const { name, email, password } = user;

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isAuthenticated, error } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      toast.success("Account created! Welcome to DropSell!");
      navigate("/");
    }
    if (error) {
      toast.error(error.response?.data?.message || error);
      dispatch(clearErrors());
    }
  }, [isAuthenticated, error, dispatch, navigate]);

  const onChange = (e) => {
    if (e.target.name === "avatar") {
      const file = e.target.files[0];
      if (file) {
        setAvatar(file);
        setAvatarPreview(URL.createObjectURL(file));
      }
    } else {
      setUser({ ...user, [e.target.name]: e.target.value });
    }
  };

  const validate = () => {
    const newErrors = { name: "", email: "", password: "" };
    let isValid = true;

    if (!name.trim()) {
      newErrors.name = "Name is required";
      isValid = false;
    }
    if (!email.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
    }
    if (!password) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
      isValid = false;
    } else if (password === name || password === email) {
      newErrors.password = "Password must be different from name and email";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const submitHandler = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const formData = new FormData();
    formData.set("name", name);
    formData.set("email", email);
    formData.set("password", password);
    if (avatar) formData.append("avatar", avatar);

    dispatch(register(formData));
  };

  return (
    <Fragment>
      <Infos title="Register User" />
      <div className="signUp-container">
        <div className="account section">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-6">
                <div className="login-form border p-5">
                  <div className="text-center heading">
                    <h2 className="mb-2">Sign Up</h2>
                    <p className="lead">
                      Already have an account? <a href="/login">Login now</a>
                    </p>
                  </div>

                  <form onSubmit={submitHandler} encType="multipart/form-data">
                    <div className="form-group mb-4">
                      <label>Email Address</label>
                      <input
                        type="email"
                        name="email"
                        value={email}
                        onChange={onChange}
                        className={`form-control ${
                          errors.email ? "is-invalid" : ""
                        }`}
                        placeholder="Email address"
                      />
                      {errors.email && (
                        <div className="invalid-feedback">{errors.email}</div>
                      )}
                    </div>

                    <div className="form-group mb-4">
                      <label>Username</label>
                      <input
                        type="text"
                        name="name"
                        value={name}
                        onChange={onChange}
                        className={`form-control ${
                          errors.name ? "is-invalid" : ""
                        }`}
                        placeholder="Full name"
                      />
                      {errors.name && (
                        <div className="invalid-feedback">{errors.name}</div>
                      )}
                    </div>

                    <div className="form-group mb-4">
                      <label>Password</label>
                      <input
                        type="password"
                        name="password"
                        value={password}
                        onChange={onChange}
                        className={`form-control ${
                          errors.password ? "is-invalid" : ""
                        }`}
                        placeholder="Password"
                      />
                      {errors.password && (
                        <div className="invalid-feedback">
                          {errors.password}
                        </div>
                      )}
                    </div>

                    <div className="form-group mb-4">
                      <label>Upload Avatar</label>
                      <div className="d-flex align-items-center">
                        <figure className="avatar mr-3">
                          <img
                            src={avatarPreview}
                            alt="Avatar Preview"
                            className="rounded-circle"
                            style={{ width: "50px", height: "50px" }}
                          />
                        </figure>
                        <input
                          type="file"
                          name="avatar"
                          accept="image/*"
                          onChange={onChange}
                          className="form-control-file"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="btn btn-dark btn-lg btn-block"
                    >
                      Register
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Register;
