import axios from "axios";
import {
  ADD_TO_CART,
  REMOVE_ITEM_CART,
  SAVE_PAYMENT_INFO,
  SAVE_SHIPPING_INFO,
} from "../constants/cartConstantes";

/* -------------------------------------------------------------------------- */
/*                               ADD ITEM TO CART                               */
/* -------------------------------------------------------------------------- */
export const addItemToCart = (id, quantity) => async (dispatch, getState) => {
  try {
    const { data } = await axios.get(`/api/v1/product/${id}`);

    dispatch({
      type: ADD_TO_CART,
      payload: {
        product: data.product._id,
        name: data.product.name,
        price: data.product.price,
        image: data.product.images[0]?.url || data.product.images[0],
        stock: data.product.stock,
        quantity,
      },
    });

    localStorage.setItem(
      "cartItems",
      JSON.stringify(getState().cart.cartItems)
    );
  } catch (error) {
    console.error("Failed to add item to cart:", error);
  }
};

/* -------------------------------------------------------------------------- */
/*                               REMOVE ITEM FROM CART                          */
/* -------------------------------------------------------------------------- */
export const removeItemCart = (id) => async (dispatch, getState) => {
  dispatch({
    type: REMOVE_ITEM_CART,
    payload: id,
  });

  localStorage.setItem("cartItems", JSON.stringify(getState().cart.cartItems));
};

/* -------------------------------------------------------------------------- */
/*                               SAVE SHIPPING INFO                             */
/* -------------------------------------------------------------------------- */
export const saveShippingInfo = (data) => async (dispatch) => {
  dispatch({
    type: SAVE_SHIPPING_INFO,
    payload: data,
  });

  localStorage.setItem("shippingInfo", JSON.stringify(data));
};

/* -------------------------------------------------------------------------- */
/*                               SAVE PAYMENT INFO                              */
/* -------------------------------------------------------------------------- */
export const savePaymentInfo = (data) => async (dispatch) => {
  dispatch({
    type: SAVE_PAYMENT_INFO,
    payload: data,
  });

  localStorage.setItem("paymentInfo", JSON.stringify(data));
};
