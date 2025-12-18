import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Product = ({ product, col = 3 }) => {
  const [isSaved, setIsSaved] = useState(false);

  //  Sync wishlist state from localStorage
  useEffect(() => {
    const savedProducts = JSON.parse(localStorage.getItem("wishlist")) || [];
    const exists = savedProducts.some((p) => p._id === product._id);
    setIsSaved(exists);
  }, [product._id]);

  const handleSaveToWishlist = (e) => {
    e.preventDefault();

    const savedProducts = JSON.parse(localStorage.getItem("wishlist")) || [];
    const exists = savedProducts.some((p) => p._id === product._id);

    let updatedWishlist;

    if (exists) {
      updatedWishlist = savedProducts.filter((p) => p._id !== product._id);
    } else {
      updatedWishlist = [...savedProducts, product];
    }

    localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
    setIsSaved(!exists);
  };

  const imageBaseUrl = "http://localhost:4000/products";
  const ratingPercentage = (product.ratings / 5) * 100;

  return (
    <div className={`col-lg-${col} col-12 col-md-6 col-sm-6 mb-5`}>
      <div className="product">
        {/*  Product Images */}
        <div className="product-wrap">
          <Link to={`/product/${product._id}`}>
            <img
              className="img-fluid w-100 mb-3 img-first"
              src={`${imageBaseUrl}/${product.images?.[0]}`}
              alt={product.name}
              style={{ objectFit: "cover", height: "200px" }}
            />
          </Link>

          {product.images?.[1] && (
            <Link to={`/product/${product._id}`}>
              <img
                className="img-fluid w-100 mb-3 img-second"
                src={`${imageBaseUrl}/${product.images[1]}`}
                alt={product.name}
                style={{ objectFit: "cover", height: "200px" }}
              />
            </Link>
          )}
        </div>

        {/* Seller */}
        <span className="onsale">{product.seller}</span>

        {/*  Wishlist */}
        <div className="product-hover-overlay">
          <a href="/" onClick={handleSaveToWishlist}>
            <i
              className={
                isSaved
                  ? "tf-ion-ios-heart text-danger"
                  : "tf-ion-ios-heart-outline"
              }
            />
          </a>
        </div>

        {/* ℹ Product Info */}
        <div className="product-info">
          <h2 className="product-title h5 mb-0">
            <Link to={`/product/${product._id}`}>{product.name}</Link>
          </h2>

          {/* Rating */}
          <div className="rating mt-auto">
            <div className="rating-outer">
              <div
                className="rating-inner"
                style={{ width: `${ratingPercentage}%` }}
              />
            </div>
            <span id="no_of_reviews">{product.numOfReviews} Reviews</span>
          </div>

          {/*  Price */}
          <span className="price">{product.price} DT</span>

          {/*  Action */}
          <Link
            to={`/product/${product._id}`}
            className="btn btn-main mt-3 btn-block"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Product;
