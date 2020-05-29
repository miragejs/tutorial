/*
  Welcome to the tutorial! Write your code in this file.

  Feel free to delete this comment when you get started.
*/

import { createServer } from "miragejs";

let server = createServer();

server.get("/api/reminders", () => {
  return { reminders: [] };
});
