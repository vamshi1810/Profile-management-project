import "./index.css";
import App from "./App.tsx";
import { Provider } from "react-redux";
import Store from "./redux/Store.ts";
import React from "react";
import ReactDOM from "react-dom/client";

const root = ReactDOM.createRoot(document.getElementById("root")!);

root.render(
  <React.StrictMode>
    <Provider store={Store}>
      <App />
    </Provider>
  </React.StrictMode>
);
