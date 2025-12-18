/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Fragment, useEffect, useState } from "react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";

import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Pagination from "react-js-pagination";
import { toast } from "react-toastify";

import { getProducts } from "../actions/productActions";
import { getAllCategories } from "../actions/categoryActions";

import Infos from "./layout/Infos";
import Loader from "./layout/Loader";
import Product from "./product/Product";
import Chatbot from "./Chatbot";

const { Range } = Slider;

const Home = () => {
  const dispatch = useDispatch();
  const { keyword } = useParams();

  const [currentPage, setCurrentPage] = useState(1);
  const [price, setPrice] = useState([1, 5000]);
  const [rating, setRating] = useState(null);
  const [category, setCategory] = useState("");

  const { loading, products, error, productsCount, resPerPage } = useSelector(
    (state) => state.products
  );

  const { categories } = useSelector((state) => state.allCategories);

  useEffect(() => {
    dispatch(getAllCategories());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }

    dispatch(getProducts(keyword, currentPage, price, category, rating));
  }, [dispatch, keyword, currentPage, price, category, rating, error]);

  const setCurrentPageNo = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleCategoryClick = (categoryName) => {
    setCategory(categoryName);
    setCurrentPage(1);
  };

  return (
    <Fragment>
      <Chatbot />

      <div className="home-container">
        {loading ? (
          <Loader />
        ) : (
          <Fragment>
            <Infos title="Buy Best Products" />

            {/*  Hero Section */}
            <section className="page-home1">
              <div className="overy"></div>
              <div className="container">
                <div className="row justify-content-center">
                  <div className="col-lg-6 text-center">
                    <h1 className="mt-2 mb-5">
                      <span className="text-color">Drop </span>Sell
                    </h1>
                  </div>
                </div>
              </div>
            </section>

            {/* Products Section */}
            <section className="section products-main">
              <div className="container">
                <div className="row justify-content-center mb-4">
                  <div className="col-lg-8 text-center">
                    <h2 className="text-color">Our Products</h2>
                    <p>The best quality</p>
                  </div>
                </div>

                <div className="row">
                  {keyword && (
                    <div className="col-md-3">
                      {/*  Categories */}
                      <h4>Categories</h4>
                      <ul className="list-unstyled">
                        <li
                          style={{
                            cursor: "pointer",
                            fontWeight: category === "" ? "bold" : "normal",
                          }}
                          onClick={() => handleCategoryClick("")}
                        >
                          All
                        </li>

                        {categories?.map((cat) => (
                          <li
                            key={cat._id}
                            style={{
                              cursor: "pointer",
                              fontWeight:
                                category === cat.name ? "bold" : "normal",
                            }}
                            onClick={() => handleCategoryClick(cat.name)}
                          >
                            {cat.name}
                          </li>
                        ))}
                      </ul>

                      <hr />

                      {/*  Price Filter */}
                      <h4>Price</h4>
                      <Range
                        marks={{ 1: "1DT", 5000: "5000DT" }}
                        min={1}
                        max={5000}
                        value={price}
                        onChange={setPrice}
                        tipFormatter={(value) => `${value} DT`}
                      />

                      <hr className="my-4" />

                      {/*  Rating Filter */}
                      <h4>Ratings</h4>
                      <ul className="list-unstyled">
                        {[5, 4, 3, 2, 1].map((star) => (
                          <li
                            key={star}
                            style={{
                              cursor: "pointer",
                              fontWeight: rating === star ? "bold" : "normal",
                            }}
                            onClick={() => setRating(star)}
                          >
                            <div className="rating-outer">
                              <div
                                className="rating-inner"
                                style={{ width: `${star * 20}%` }}
                              />
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/*  Products Grid */}
                  <div className={keyword ? "col-md-9" : "col-md-12"}>
                    <div className="row">
                      {products?.map((product) => (
                        <Product
                          key={product._id}
                          product={product}
                          col={keyword ? 4 : 3}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/*  Pagination */}
              {resPerPage < productsCount && (
                <div className="d-flex justify-content-center mt-5">
                  <Pagination
                    activePage={currentPage}
                    itemsCountPerPage={resPerPage}
                    totalItemsCount={productsCount}
                    onChange={setCurrentPageNo}
                    itemClass="page-item"
                    linkClass="page-link"
                  />
                </div>
              )}
            </section>

            {/*  Features */}
            <section className="features border-top">
              <div className="container">
                <div className="row text-center">
                  {[
                    ["Free Shipping", "For orders over 300DT"],
                    ["30 Days Return", "Money back guarantee"],
                    ["Secure Checkout", "100% protected"],
                    ["24/7 Support", "Always available"],
                  ].map(([title, desc], index) => (
                    <div key={index} className="col-lg-3 col-sm-6">
                      <div className="feature-block">
                        <h5>{title}</h5>
                        <p>{desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </Fragment>
        )}
      </div>
    </Fragment>
  );
};

export default Home;
