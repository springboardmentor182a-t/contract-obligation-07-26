import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

const root = ReactDOM.createRoot(document.getElementById("root"));
const API_BASE_URL =
  process.env.REACT_APP_API_URL ||
  "http://127.0.0.1:8000/api";

const originalFetch = window.fetch.bind(window);

window.fetch = (input, options) => {
  if (typeof input === "string" && input.startsWith("/api")) {
    const apiPath = input.substring(4);

    return originalFetch(
      `${API_BASE_URL}${apiPath}`,
      options
    );
  }

  return originalFetch(input, options);
};
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();
