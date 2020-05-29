import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App";
import "tailwindcss/tailwind.css";

// Import ./server in dev for people following the tutorial
// Import ./server-final so there's a full live demo when deploying to Vercel
const importServer = () =>
  process.env.NODE_ENV === "production"
    ? import("./server-final")
    : import("./server");

importServer().then(() => {
  ReactDOM.render(<App />, document.getElementById("root"));
});
