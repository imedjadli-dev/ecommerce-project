import React, { Fragment, useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import Infos from "../layout/Infos";

const Wishlist = () => {
  const [savedProducts, setSavedProducts] = useState([]);

  /*  Load wishlist from localStorage */
  useEffect(() => {
    const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    setSavedProducts(wishlist);
  }, []);

  /*  Remove item */
  const removeFromWishlist = useCallback((productId) => {
    setSavedProducts((prev) => {
      const updated = prev.filter((product) => product._id !== productId);
      localStorage.setItem("wishlist", JSON.stringify(updated));
      return updated;
    });
  }, []);

  return (
    <Fragment>
      <section className="page-cart">
        <div className="container text-center">
          <h1 className="mt-5 mb-5">
            <span className="text-color">Wishlist</span> Information
          </h1>
        </div>
      </section>

      <Infos title="Your Wishlist" />

      {savedProducts.length === 0 ? (
        <h2 className="mt-5 text-center">
          No products saved in the wishlist yet!
        </h2>
      ) : (
        <Fragment>
          <h2 className="mt-5 text-center">
            Wishlist: <b>{savedProducts.length} items</b>
          </h2>

          <section className="cart shopping page-wrapper">
            <div className="container">
              <table className="table shop_table shop_table_responsive cart">
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Product</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {savedProducts.map((product) => (
                    <tr key={product._id}>
                      <td>
                        <Link to={`/product/${product._id}`}>
                          <img
                            src={`http://localhost:4000/products/${product.images?.[0]}`}
                            alt={product.name}
                            width="60"
                          />
                        </Link>
                      </td>

                      <td>
                        <Link to={`/product/${product._id}`}>
                          {product.name}
                        </Link>
                      </td>

                      <td>
                        <button
                          type="button"
                          className="btn btn-danger btn-sm"
                          onClick={() => removeFromWishlist(product._id)}
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </Fragment>
      )}
    </Fragment>
  );
};

export default Wishlist;
