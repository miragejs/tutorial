import { Server, Model } from "miragejs";

new Server({
  models: {
    reminder: Model,
  },

  seeds(server) {
    server.create("reminder", { text: "Walk the dog" });
    server.create("reminder", { text: "Take out the trash" });
    server.create("reminder", { text: "Work out" });
  },

  routes() {
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
