// src/reducers/cartReducer.js

import {
  ADD_TO_CART,
  REMOVE_ITEM_CART,
  SAVE_PAYMENT_INFO,
  SAVE_SHIPPING_INFO,
} from "../constants/cartConstants";

const initialState = {
  cartItems: [],
  shippingInfo: {},
  paymentInfo: {},
};

export const cartReducer = (state = initialState, action) => {
  switch (action.type) {
    //
    // ─── ADD ITEM TO CART ─────────────────────────────────────────
    //
    case ADD_TO_CART: {
      const item = action.payload;

      const existingItem = state.cartItems.find(
        (i) => i.product === item.product
      );

      return {
        ...state,
        cartItems: existingItem
          ? state.cartItems.map((i) =>
              i.product === existingItem.product ? item : i
            )
          : [...state.cartItems, item],
      };
    }

    //
    // ─── REMOVE ITEM FROM CART ─────────────────────────────────────────
    //
    case REMOVE_ITEM_CART:
      return {
        ...state,
        cartItems: state.cartItems.filter((i) => i.product !== action.payload),
      };

    //
    // ─── SAVE SHIPPING INFO ─────────────────────────────────────────
    //
    case SAVE_SHIPPING_INFO:
      return {
        ...state,
        shippingInfo: action.payload,
      };

    //
    // ─── SAVE PAYMENT INFO ─────────────────────────────────────────
    //
    case SAVE_PAYMENT_INFO:
      return {
        ...state,
        paymentInfo: action.payload,
      };

    //
    // ─── DEFAULT ─────────────────────────────────────────
    //
    default:
      return state;
  }
};
