import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "./App.css";
import { Server } from "miragejs";

new Server({
  routes() {
    this.get("/api/reminders", () => {
      return {
        reminders: [
          { id: 1, text: "Take out the trash" },
          { id: 2, text: "Learn Mirage" },
          { id: 3, text: "Do laundry" }
        ]
      };
    });
  }
});

ReactDOM.render(<App />, document.getElementById("root"));
