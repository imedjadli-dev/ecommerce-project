import React from "react";
import ReactDOM from "react-dom";
import App from "./App";

import { Provider } from "react-redux";
import store from "./store";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


ReactDOM.render(
  <Provider store={store}>
   
      <App />
      <ToastContainer position="bottom-right" />
    
  </Provider>,
  document.getElementById("root")
);
