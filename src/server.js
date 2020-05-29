import {
  Model,
  hasMany,
  belongsTo,
  RestSerializer,
  createServer,
  Factory,
} from "miragejs";

createServer({
  serializers: {
    reminder: RestSerializer.extend({
      include: ["list"],
      embed: true,
    }),
  },

  models: {
    list: Model.extend({
      reminders: hasMany(),
    }),

    reminder: Model.extend({
      list: belongsTo(),
    }),
  },

  // factories: {
  //   list: Factory.extend({
  //     name(i) {
  //       return `List ${i}`;
  //     },

  //     afterCreate(list, server) {
  //       server.createList("reminder", 5, { list });
  //     },
  //   }),

  //   reminder: Factory.extend({
  //     text(i) {
  //       return `Reminder ${i}`;
  //     },
  //   }),
  // },

  seeds(server) {
    // server.create("list", { name: "Home" });
    // server.create("list", { name: "Office" });
    // server.create("list", { name: "Gym" });
    // server.create("list", { name: "Gym" });
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
