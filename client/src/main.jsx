import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

import axios from "axios";
import App from "./App.jsx";
import { Provider } from "react-redux";
import { store } from "./redux/store.js";
axios.defaults.withCredentials = true;
createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <App />
  </Provider>,
);
