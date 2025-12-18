import React, { Fragment, useEffect, useState } from "react";
import { Carousel } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

import { addItemToCart } from "../../actions/cartActions";
import {
  clearErrors,
  getSingleProduct,
  postReview,
} from "../../actions/productActions";
import { REVIEW_RESET } from "../../constants/productConstantes";

import Loader from "../layout/Loader";
import ListReviews from "../review/ListReviews";

const ProductDetails = () => {
  const dispatch = useDispatch();
  const { id } = useParams();

  const [quantity, setQuantity] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const { user } = useSelector((state) => state.auth);
  const { loading, error, product } = useSelector(
    (state) => state.ProductDetails
  );
  const { error: reviewError, success } = useSelector(
    (state) => state.postReview
  );

  /*  Fetch Product */
  useEffect(() => {
    dispatch(getSingleProduct(id));
  }, [dispatch, id]);

  /*  Handle Errors & Review Success */
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }

    if (reviewError) {
      toast.error(reviewError);
      dispatch(clearErrors());
    }

    if (success) {
      toast.success("Review posted successfully");
      dispatch({ type: REVIEW_RESET });
      setRating(0);
      setComment("");
    }
  }, [dispatch, error, reviewError, success]);

  /* Cart */
  const addToCartHandler = () => {
    dispatch(addItemToCart(id, quantity));
    toast.success("Item added to cart");
  };

  /* ➕➖ Quantity */
  const increaseQuantity = () => {
    if (quantity >= product.stock) return;
    setQuantity((prev) => prev + 1);
  };

  const decreaseQuantity = () => {
    if (quantity <= 1) return;
    setQuantity((prev) => prev - 1);
  };

  /*  Rating Selection */
  const handleRatingClick = (value) => {
    setRating(value);
  };

  /*  Submit Review */
  const submitReview = () => {
    const formData = new FormData();
    formData.set("rating", rating);
    formData.set("comment", comment);
    formData.set("productId", id);

    dispatch(postReview(formData));
  };

  const imageBaseUrl = "http://localhost:4000/products";
  const ratingPercentage = (product?.ratings / 5) * 100 || 0;

  return (
    <Fragment>
      <div className="container-fluid">
        {loading ? (
          <Loader />
        ) : (
          <Fragment>
            {/* 🖼 Product Images */}
            <div className="row justify-content-around">
              <div className="col-12 col-lg-5 img-fluid">
                <Carousel pause="hover">
                  {product.images?.map((image, index) => (
                    <Carousel.Item key={index}>
                      <img
                        className="d-block w-100"
                        src={`${imageBaseUrl}/${image}`}
                        alt={product.name}
                      />
                    </Carousel.Item>
                  ))}
                </Carousel>
              </div>

              {/* ℹ Product Info */}
              <div className="col-12 col-lg-5 mt-5">
                <h3>{product.name}</h3>
                <p>Category: {product.category}</p>

                <div className="rating-outer">
                  <div
                    className="rating-inner"
                    style={{ width: `${ratingPercentage}%` }}
                  />
                </div>
                <span>({product.numOfReviews} Reviews)</span>

                <hr />

                <p className="h4">{product.price} DT</p>

                {/* Quantity */}
                <div className="stockCounter d-inline">
                  <button className="btn btn-danger" onClick={decreaseQuantity}>
                    -
                  </button>

                  <input
                    type="number"
                    className="form-control count d-inline mx-2"
                    value={quantity}
                    readOnly
                  />

                  <button
                    className="btn btn-primary"
                    onClick={increaseQuantity}
                  >
                    +
                  </button>

                  <button
                    className="btn btn-main btn-sm ml-4"
                    disabled={product.stock === 0}
                    onClick={addToCartHandler}
                  >
                    Add to Cart
                  </button>
                </div>

                <hr />

                <p>
                  Status:{" "}
                  <span
                    className={product.stock > 0 ? "greenColor" : "redColor"}
                  >
                    {product.stock > 0 ? "In Stock" : "Out Of Stock"}
                  </span>
                </p>

                <p>
                  Sold by: <strong>{product.seller}</strong>
                </p>

                {/* Review Button */}
                {user ? (
                  <button
                    className="btn btn-primary mt-3"
                    data-toggle="modal"
                    data-target="#ratingModal"
                  >
                    Submit Your Review
                  </button>
                ) : (
                  <div className="alert alert-danger mt-4">
                    Login to post a review
                  </div>
                )}
              </div>
            </div>

            {/* ⭐ Review Modal */}
            <div
              className="modal fade"
              id="ratingModal"
              tabIndex="-1"
              role="dialog"
            >
              <div className="modal-dialog" role="document">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Submit Review</h5>
                    <button className="close" data-dismiss="modal">
                      <span>&times;</span>
                    </button>
                  </div>

                  <div className="modal-body">
                    <ul className="stars">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <li
                          key={star}
                          className={`star ${rating >= star ? "orange" : ""}`}
                          onClick={() => handleRatingClick(star)}
                        >
                          <i className="fa fa-star" />
                        </li>
                      ))}
                    </ul>

                    <textarea
                      className="form-control mt-3"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                    />

                    <button
                      className="btn btn-main mt-3 float-right"
                      onClick={submitReview}
                      data-dismiss="modal"
                    >
                      Submit
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* 📄 Tabs */}
            <nav className="product-info-tabs mt-5 mb-5 bg-white">
              <div className="nav nav-tabs nav-fill">
                <a
                  className="nav-item nav-link active"
                  data-toggle="tab"
                  href="#description"
                >
                  Description
                </a>
                <a
                  className="nav-item nav-link"
                  data-toggle="tab"
                  href="#reviews"
                >
                  Reviews ({product.reviews?.length || 0})
                </a>
              </div>
            </nav>

            <div className="tab-content">
              <div className="tab-pane fade show active" id="description">
                <p
                  dangerouslySetInnerHTML={{
                    __html: product.description,
                  }}
                />
              </div>

              <div className="tab-pane fade" id="reviews">
                {product.reviews?.length > 0 && (
                  <ListReviews reviews={product.reviews} />
                )}
              </div>
            </div>
          </Fragment>
        )}
      </div>
    </Fragment>
  );
};

export default ProductDetails;
