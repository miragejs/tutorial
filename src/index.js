import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "./App.css";
import { Server, Model, hasMany, belongsTo } from "miragejs";

window.server = new Server({
  models: {
    list: Model.extend({
      reminders: hasMany()
    }),

    reminder: Model.extend({
      list: belongsTo()
    })
  },

  seeds(server) {
    let list = server.create("list");

    server.create("reminder", { text: "One", list });
    server.create("reminder", { text: "Two", list });
    server.create("reminder", { text: "Three", list });

    server.create("list");
  },

  routes() {
    this.namespace = "api";

    this.get("/reminders", (schema, request) => {
      return schema.reminders.all();
    });

    this.get("/lists/:id/reminders", (schema, request) => {
      let listId = request.params.id;

      return schema.lists.find(listId).reminders;
    });

    this.post("/reminders", (schema, request) => {
      let attrs = JSON.parse(request.requestBody);

      return schema.reminders.create(attrs);
    });

    this.del("/reminders/:id", (schema, request) => {
      return schema.reminders.find(request.params.id).destroy();
    });
  }
});

ReactDOM.render(<App />, document.getElementById("root"));
