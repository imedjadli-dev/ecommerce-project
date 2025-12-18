import React, { Fragment, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import Infos from "../layout/Infos";
import Loader from "../layout/Loader";
import Sidebar from "./Sidebar";
import { getSingleCategory, clearErrors } from "../../actions/categoryActions";

const CategoriesProducts = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { loading, error, category } = useSelector(
    (state) => state.categoryDetails
  );

  useEffect(() => {
    if (id) {
      dispatch(getSingleCategory(id));
    }
    if (error) {
      console.error(error);
      dispatch(clearErrors());
    }
  }, [dispatch, id, error]);

  return (
    <Fragment>
      <Infos title={`Category: ${category?.name || ""}`} />
      <div className="row">
        <div className="col-12 col-md-2">
          <Sidebar />
        </div>

        <div className="col-12 col-md-10">
          {loading ? (
            <Loader />
          ) : (
            <Fragment>
              {/* No products */}
              {category?.products?.length === 0 && (
                <div className="row d-flex justify-content-around">
                  <div className="col-12">
                    <h1 className="my-5">
                      No products associated with this category:{" "}
                      <b>{category.name}</b>
                    </h1>
                  </div>
                </div>
              )}

              {/* Products exist */}
              {category?.products?.length > 0 && (
                <Fragment>
                  <div className="row d-flex justify-content-around">
                    <div className="col-12">
                      <h1 className="my-5">
                        List of products:{" "}
                        <b>{category.products.length} products</b>
                      </h1>
                    </div>
                  </div>

                  <div className="row d-flex justify-content-around">
                    <div className="col-12 col-lg-7">
                      <div className="cart-item my-1">
                        <section className="cart shopping page-wrapper">
                          <div className="container">
                            <div className="row justify-content-center">
                              <div className="col-lg-12">
                                <div className="product-list">
                                  <form className="cart-form">
                                    <table
                                      className="table shop_table shop_table_responsive cart"
                                      cellSpacing="0"
                                    >
                                      <thead>
                                        <tr>
                                          <th className="product-thumbnail">
                                            Image
                                          </th>
                                          <th className="product-name">
                                            Product Name
                                          </th>
                                          <th className="product-name">
                                            Action
                                          </th>
                                        </tr>
                                      </thead>

                                      <tbody>
                                        {category.products.map((product) => (
                                          <tr
                                            className="cart_item"
                                            key={product._id}
                                          >
                                            <td
                                              className="product-thumbnail"
                                              data-title="Thumbnail"
                                            >
                                              <Link
                                                to={`/product/${product._id}`}
                                              >
                                                <img
                                                  src={`http://localhost:4000/products/${product.images[0]}`}
                                                  className="attachment-woocommerce_thumbnail size-woocommerce_thumbnail"
                                                  alt={product.name}
                                                />
                                              </Link>
                                            </td>

                                            <td
                                              className="product-name"
                                              data-title="Product"
                                            >
                                              <Link
                                                to={`/product/${product._id}`}
                                              >
                                                {product.name}
                                              </Link>
                                            </td>

                                            <td
                                              className="product-remove"
                                              data-title="View"
                                            >
                                              <Link
                                                to={`/product/${product._id}`}
                                              >
                                                <i className="fa fa-eye"></i>
                                              </Link>
                                            </td>
                                          </tr>
                                        ))}
                                      </tbody>
                                    </table>
                                  </form>
                                </div>
                              </div>
                            </div>
                          </div>
                        </section>
                      </div>
                    </div>
                  </div>
                </Fragment>
              )}
            </Fragment>
          )}
        </div>
      </div>
    </Fragment>
  );
};

export default CategoriesProducts;
