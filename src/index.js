import "tailwindcss/tailwind.css";
import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App";
import { BrowserRouter, Route } from "react-router-dom";
import { QueryParamProvider } from "use-query-params";
import makeServer from "./server";
import makeFinalServer from "./lib/server-final";

if (
  process.env.NODE_ENV === "development" &&
  typeof makeServer === "function"
) {
  makeServer(); // For people following the tutorial
} else if (
  process.env.NODE_ENV === "production" ||
  process.env.REACT_APP_DEMO
) {
  makeFinalServer(); // For a live demo when deploying to Vercel
}

ReactDOM.render(
  <BrowserRouter>
    <QueryParamProvider ReactRouterRoute={Route}>
      <App />
    </QueryParamProvider>
  </BrowserRouter>,
  document.getElementById("root")
);
