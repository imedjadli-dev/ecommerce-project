import React, { Fragment, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addItemToCart, removeItemCart } from "../../actions/cartActions";
import Infos from "../layout/Infos";

const Cart = () => {
  const [discount, setDiscount] = useState(0);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { cartItems } = useSelector((state) => state.cart);
  const { isAuthenticated } = useSelector((state) => state.auth);

  const increaseQuantity = (id, quantity, stock) => {
    const newQty = quantity + 1;
    if (newQty > stock) return;
    dispatch(addItemToCart(id, newQty));
  };

  const decreaseQuantity = (id, quantity) => {
    const newQty = quantity - 1;
    if (newQty <= 0) return;
    dispatch(addItemToCart(id, newQty));
  };

  const removeItem = (id) => {
    dispatch(removeItemCart(id));
  };

  const checkoutHandler = () => {
    if (isAuthenticated) {
      const totalPrice = cartItems
        .reduce((acc, item) => acc + item.quantity * item.price, 0)
        .toFixed(2);
      localStorage.setItem("paymentInfo", JSON.stringify({ totalPrice }));
      navigate("/shipping", { replace: true });
    } else {
      navigate("/login?redirect=shipping");
    }
  };

  const totalItems = cartItems.reduce(
    (acc, item) => acc + Number(item.quantity),
    0
  );
  const totalPrice = (
    cartItems.reduce((acc, item) => acc + item.quantity * item.price, 0) *
    (1 - discount)
  ).toFixed(2);

  return (
    <Fragment>
      <div className="checkout-container">
        <section className="page-cart">
          <div className="overy"></div>
          <div className="container text-center">
            <h1 className="mt-2 mb-5">
              <span className="text-color">Cart</span> Information
            </h1>
          </div>
        </section>

        <Infos title="Your Cart" />

        {cartItems.length === 0 ? (
          <h2 className="mt-5 text-center">Your Cart is Empty</h2>
        ) : (
          <Fragment>
            <h2 className="mt-5 text-center">
              Cart: <b>{cartItems.length} items</b>
            </h2>

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
                              <th> </th>
                              <th>Product</th>
                              <th>Price</th>
                              <th>Quantity</th>
                              <th>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {cartItems.map((item) => (
                              <tr key={item.product} className="cart_item">
                                <td>
                                  <a href={`/product/${item.product}`}>
                                    <img
                                      src={`http://localhost:4000/products/${item.image}`}
                                      alt={item.name}
                                      className="attachment-woocommerce_thumbnail size-woocommerce_thumbnail"
                                    />
                                  </a>
                                </td>
                                <td>{item.name}</td>
                                <td>{item.price} DT</td>
                                <td>
                                  <div className="quantity">
                                    <button
                                      type="button"
                                      className="btn btn-danger"
                                      onClick={() =>
                                        decreaseQuantity(
                                          item.product,
                                          item.quantity
                                        )
                                      }
                                    >
                                      -
                                    </button>
                                    <input
                                      type="number"
                                      value={item.quantity}
                                      readOnly
                                      className="input-text qty text"
                                    />
                                    <button
                                      type="button"
                                      className="btn btn-primary"
                                      onClick={() =>
                                        increaseQuantity(
                                          item.product,
                                          item.quantity,
                                          item.stock
                                        )
                                      }
                                    >
                                      +
                                    </button>
                                  </div>
                                </td>
                                <td>
                                  <button
                                    type="button"
                                    className="btn btn-danger"
                                    onClick={() => removeItem(item.product)}
                                  >
                                    ×
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </form>
                    </div>
                  </div>
                </div>

                <div className="row justify-content-end">
                  <div className="col-lg-4">
                    <div className="cart-info card p-4 mt-4">
                      <h4 className="mb-4">Cart totals</h4>
                      <ul className="list-unstyled mb-4">
                        <li className="d-flex justify-content-between pb-2 mb-3">
                          <h5>Items Number</h5>
                          <span>{totalItems} Item(s)</span>
                        </li>
                        <li className="d-flex justify-content-between pb-2">
                          <h5>Total</h5>
                          <span>{totalPrice} DT</span>
                        </li>
                      </ul>
                      <button
                        className="btn btn-main btn-small"
                        onClick={checkoutHandler}
                      >
                        Proceed to checkout
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </Fragment>
        )}
      </div>
    </Fragment>
  );
};

export default Cart;
