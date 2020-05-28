import { Server, Model, hasMany, belongsTo } from "miragejs";

window.server = new Server({
  models: {
    list: Model.extend({
      reminders: hasMany(),
    }),

    reminder: Model.extend({
      list: belongsTo(),
    }),
  },

  seeds(server) {
    server.create("reminder", { text: "Walk the dog" });
    server.create("reminder", { text: "Take out the trash" });
    server.create("reminder", { text: "Work out" });

    let homeList = server.create("list", { name: "Home" });
    server.create("reminder", { list: homeList, text: "Do taxes" });

    server.create("list", { name: "Work" });
  },

  routes() {
    this.get("/api/lists", (schema, request) => {
      return schema.lists.all();
    });

    this.get("/api/lists/:id/reminders", (schema, request) => {
      let list = schema.lists.find(request.params.id);

      return list.reminders;
    });

    this.get("/api/reminders", (schema) => {
      return schema.reminders.all();
    });

    this.post("/api/reminders", (schema, request) => {
      let attrs = JSON.parse(request.requestBody);

      return schema.reminders.create(attrs);
    });

    this.delete("/api/reminders/:id", (schema, request) => {
      let id = request.params.id;

      return schema.reminders.find(id).destroy();
    });
  },
});
