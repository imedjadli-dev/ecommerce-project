import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { clearErrors, forgotPassword } from "../../actions/userAction";
import { toast } from "react-toastify";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { error, message, loading } = useSelector(
    (state) => state.forgotPassword
  );

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }

    if (message) {
      toast.success(message);
    }
  }, [dispatch, error, message]);

  const submitHandler = (e) => {
    e.preventDefault();
    setEmailError("");

    let isValid = true;

    if (!email.trim()) {
      setEmailError("Email is required");
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError("Please enter a valid email address");
      isValid = false;
    }

    if (!isValid) return;

    const formData = new FormData();
    formData.set("email", email);

    dispatch(forgotPassword(formData));
  };

  return (
    <div className="forgot-password-container">
      <div className="account section">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-6">
              <div className="login-form border p-5">
                <div className="text-center heading mb-4">
                  <h3 className="mb-2">Password Recovery</h3>
                  <p className="lead">
                    Enter the email address for your account. A verification
                    code will be sent to you. Once received, you can set a new
                    password.
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

                  <button
                    type="submit"
                    className="btn btn-main mt-3 btn-block"
                    disabled={loading}
                  >
                    {loading ? "Processing..." : "Reset Password"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
