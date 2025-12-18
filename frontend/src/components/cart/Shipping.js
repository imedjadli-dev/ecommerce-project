import React, { Fragment, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { saveShippingInfo } from "../../actions/cartActions";
import Infos from "../layout/Infos";
import Checkout from "./Checkout";

const Shipping = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { shippingInfo } = useSelector((state) => state.cart);

  const [address, setAddress] = useState(shippingInfo?.address || "");
  const [city, setCity] = useState(shippingInfo?.city || "");
  const [phoneNumber, setPhoneNumber] = useState(
    shippingInfo?.phoneNumber || ""
  );

  const [errors, setErrors] = useState({
    address: "",
    city: "",
    phoneNumber: "",
  });

  const validate = () => {
    const newErrors = { address: "", city: "", phoneNumber: "" };
    let isValid = true;

    if (!address.trim()) {
      newErrors.address = "Address is required";
      isValid = false;
    } else if (address.trim().length < 4) {
      newErrors.address = "Address must be at least 4 characters";
      isValid = false;
    }

    if (!city.trim()) {
      newErrors.city = "City is required";
      isValid = false;
    } else if (city.trim().length < 2) {
      newErrors.city = "City must be at least 2 characters";
      isValid = false;
    }

    if (!phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required";
      isValid = false;
    } else if (!/^\d{8}$/.test(phoneNumber.trim())) {
      newErrors.phoneNumber = "Phone number must be 8 digits";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const submitHandler = (e) => {
    e.preventDefault();
    if (validate()) {
      dispatch(saveShippingInfo({ address, city, phoneNumber }));
      navigate("/order/confirm");
    }
  };

  return (
    <Fragment>
      <Infos title="Shipping Information" />
      <section className="page-shipping">
        <div className="overy"></div>
        <div className="container text-center">
          <h1 className="mt-2 mb-5">
            <span className="text-color">Shipping </span>Information
          </h1>
        </div>
      </section>

      <Checkout shipping />

      <div className="login-container">
        <div className="account section">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-6">
                <div className="login-form border p-5">
                  <h2 className="text-center mb-4">Shipping Information</h2>

                  <form onSubmit={submitHandler}>
                    <div className="form-group mb-3">
                      <label htmlFor="address_field">Address:</label>
                      <input
                        type="text"
                        id="address_field"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className={`form-control ${
                          errors.address ? "is-invalid" : ""
                        }`}
                        placeholder="Enter your address"
                      />
                      {errors.address && (
                        <div className="invalid-feedback">{errors.address}</div>
                      )}
                    </div>

                    <div className="form-group mb-3">
                      <label htmlFor="city_field">City:</label>
                      <input
                        type="text"
                        id="city_field"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className={`form-control ${
                          errors.city ? "is-invalid" : ""
                        }`}
                        placeholder="Enter your city"
                      />
                      {errors.city && (
                        <div className="invalid-feedback">{errors.city}</div>
                      )}
                    </div>

                    <div className="form-group mb-3">
                      <label htmlFor="phone_field">Phone Number:</label>
                      <input
                        type="text"
                        id="phone_field"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className={`form-control ${
                          errors.phoneNumber ? "is-invalid" : ""
                        }`}
                        placeholder="Enter your phone number"
                      />
                      {errors.phoneNumber && (
                        <div className="invalid-feedback">
                          {errors.phoneNumber}
                        </div>
                      )}
                    </div>

                    <button
                      type="submit"
                      className="btn btn-main btn-block mt-3"
                    >
                      Continue
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

export default Shipping;
