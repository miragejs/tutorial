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
      list: belongsTo(),
      tags: hasMany()
    }),
    tag: Model
  },

  seeds(server) {
    let home = server.create("tag", { name: "Home" });
    let list = server.create("list");

    server.create("reminder", { text: "One", list, tags: [home] });
    server.create("reminder", { text: "Two", list });
    server.create("reminder", { text: "Three", list, tags: [home] });

    server.create("list");

    // server.create("reminder", { text: "One", listId: 1 });
  },

  routes() {
    // this.get("/api/reminders/:id/project", (schema, request) => {
    //   let reminderId = request.params.id;

    //   return schema.reminders.find(reminderId).project;
    // });

    // this.get("/api/projects/:id/reminders", (schema, request) => {
    //   let reminderId = request.params.id;

    //   return schema.reminders.find(reminderId).project;
    // });

    this.namespace = "api";

    this.get("/lists/:id/reminders", (schema, request) => {
      return schema.lists.find(request.params.id).reminders;
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
