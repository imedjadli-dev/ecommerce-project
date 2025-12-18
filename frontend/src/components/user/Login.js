import React, { Fragment, useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { clearErrors, login } from "../../actions/userAction";
import Infos from "../layout/Infos";
import Loader from "../layout/Loader";
import { toast } from "react-toastify";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { user, isAuthenticated, error, loading } = useSelector(
    (state) => state.auth
  );

  const redirect = location.search ? location.search.split("=")[1] : "/";

  const redirectToDashboard = useCallback(() => {
    if (user?.role === "admin") {
      navigate("/dashboard");
    } else {
      navigate(redirect);
    }
  }, [navigate, user, redirect]);

  useEffect(() => {
    if (isAuthenticated) {
      toast.success("Login successful! Welcome", { type: "success" });
      redirectToDashboard();
    }

    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }
  }, [dispatch, isAuthenticated, error, redirectToDashboard]);

  const submitHandler = (e) => {
    e.preventDefault();

    setEmailError("");
    setPasswordError("");

    let isValid = true;

    if (!email.trim()) {
      setEmailError("Email is required");
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError("Please enter a valid email address");
      isValid = false;
    }

    if (!password.trim()) {
      setPasswordError("Password is required");
      isValid = false;
    }

    if (!isValid) return;

    dispatch(login(email, password));
  };

  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <Infos title={"Login"} />

          <div className="login-container">
            <div className="account section">
              <div className="container">
                <div className="row justify-content-center">
                  <div className="col-lg-6">
                    <div className="login-form border p-5">
                      <div className="text-center heading">
                        <h2 className="mb-2">Login</h2>
                        <p className="lead">
                          Don’t have an account?{" "}
                          <Link to="/register">Create a free account</Link>
                        </p>
                      </div>

                      <form onSubmit={submitHandler}>
                        <div className="form-group mb-4">
                          <label htmlFor="email_field">Email Address</label>
                          <input
                            type="email"
                            id="email_field"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className={`form-control ${
                              emailError ? "is-invalid" : ""
                            }`}
                            placeholder="Enter your email"
                          />
                          {emailError && (
                            <div className="invalid-feedback">{emailError}</div>
                          )}
                        </div>

                        <div className="form-group">
                          <label htmlFor="password_field">Password</label>
                          <Link to="/password/forgot" className="float-right">
                            Forgot password?
                          </Link>

                          <input
                            type="password"
                            id="password_field"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className={`form-control ${
                              passwordError ? "is-invalid" : ""
                            }`}
                            placeholder="Enter your password"
                          />
                          {passwordError && (
                            <div className="invalid-feedback">
                              {passwordError}
                            </div>
                          )}
                        </div>

                        <button
                          type="submit"
                          className="btn btn-main mt-3 btn-block"
                        >
                          Login
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

export default Login;
