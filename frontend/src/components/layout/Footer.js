import React, { Fragment } from "react";
import "../../App.css";

function Footer() {
  return (
    <Fragment>
      <footer className="footer-container">
        <div className="footer">
          <div className="container">
            <div className="row">
              {/* About Section */}
              <div className="col-md-6 col-lg-4 col-sm-6 mb-5 mb-lg-0 text-center text-sm-left">
                <div className="footer-widget">
                  <h4 className="mb-4">DropSell</h4>
                  <p className="lead">Tunisian ecommerce platform.</p>
                  <p className="mb-0">
                    <strong>Location:</strong> Tunisia
                  </p>
                  <p>
                    <strong>Support Email:</strong> Dropsell.support@email.com
                  </p>
                </div>
              </div>

              {/* Useful Links */}
              <div className="col-md-6 col-lg-2 col-sm-6 mb-5 mb-lg-0 text-center text-sm-left">
                <div className="footer-widget">
                  <h4 className="mb-4">Useful Links</h4>
                  <ul className="list-unstyled mb-0">
                    <li>
                      <a href="#">Products</a>
                    </li>
                    <li>
                      <a href="#">Blogs</a>
                    </li>
                    <li>
                      <a href="#">Cart</a>
                    </li>
                    <li>
                      <a href="#">About Us</a>
                    </li>
                    <li>
                      <a href="#">Contact Us</a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-btm py-4">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-lg-6 text-center text-lg-start">
                <p className="mb-0">
                  &copy; {new Date().getFullYear()} DropSell. All Rights
                  Reserved.
                </p>
              </div>
              <div className="col-lg-6 text-center text-lg-end mt-2 mt-lg-0">
                <ul className="list-inline mb-0">
                  <li className="list-inline-item">
                    <a href="#">Privacy Policy</a>
                  </li>
                  <li className="list-inline-item">
                    <a href="#">Terms & Conditions</a>
                  </li>
                  <li className="list-inline-item">
                    <a href="#">Cookie Policy</a>
                  </li>
                  <li className="list-inline-item">
                    <a href="#">Terms of Sale</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </Fragment>
  );
}

export default Footer;
