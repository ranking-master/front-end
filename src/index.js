import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";

import * as Sentry from "@sentry/browser";
import * as serviceWorker from "./serviceWorker";
import "typeface-roboto";
import "./index.css";
import App from "./components/App";
import { store } from "./app/store";


Sentry.init({
  dsn: process.env.REACT_APP_SENTRY_DSN,
  release: `${process.env.REACT_APP_NAME}@${process.env.REACT_APP_VERSION}`,
});
ReactDOM.render(
  <Provider store={store}>
    <App/>
  </Provider>
  , document.getElementById("root"));
serviceWorker.register();
