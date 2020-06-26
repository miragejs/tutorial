/*
  This is the final solution for Part 9 of the Tutorial that tests the Reminders app.
*/
import { visit } from "../lib/test-helpers";
import { screen, waitForElementToBeRemoved } from "@testing-library/react";
import makeServer from "../server";
import userEvent from "@testing-library/user-event";

let server;

beforeEach(() => {
  server = makeServer({ environment: "test" });
});

afterEach(() => {
  server.shutdown();
});

test("it shows a message when there are no reminders", async () => {
  visit("/");

  await waitForElementToBeRemoved(() => screen.getByText("Loading..."));

  expect(screen.getByText("All done!")).toBeInTheDocument();
});

test("it shows existing reminders", async () => {
  server.create("reminder", { text: "Walk the dog" });
  server.create("reminder", { text: "Take out the trash" });
  server.create("reminder", { text: "Work out" });

  visit("/");
  await waitForElementToBeRemoved(() => screen.getByText("Loading..."));

  expect(screen.getByText("Walk the dog")).toBeInTheDocument();
  expect(screen.getByText("Take out the trash")).toBeInTheDocument();
  expect(screen.getByText("Work out")).toBeInTheDocument();
});

test("the all screen shows tags for associated reminders", async () => {
  server.create("reminder", { text: "Unassociated reminder" });

  let list = server.create("list", { name: "List 1" });
  server.create("reminder", { text: "Associated reminder", list });

  visit("/");
  await waitForElementToBeRemoved(() => screen.getByText("Loading..."));

  let [reminder1, reminder2] = screen.getAllByTestId("reminder");
  expect(reminder1).toHaveTextContent("Unassociated reminder");
  expect(reminder2).toHaveTextContent("Associated reminder");
  expect(reminder2.querySelector("[data-testid=list-tag]")).toHaveTextContent(
    "List 1"
  );
});

test("it can delete a reminder", async () => {
  server.create("reminder", { text: "Work out" });

  visit("/");
  await waitForElementToBeRemoved(() => screen.getByText("Loading..."));

  userEvent.click(screen.getByTestId("delete-reminder"));

  expect(screen.queryByText("Work out")).not.toBeInTheDocument();
  expect(server.db.reminders.length).toEqual(0);
});

test("it can create a list", async () => {
  visit("/");
  await waitForElementToBeRemoved(() => screen.getByText("Loading..."));

  userEvent.click(screen.getByTestId("toggle-sidebar"));
  userEvent.click(screen.getByTestId("add-list"));
  await userEvent.type(screen.getByTestId("new-list-text"), "Home");
  userEvent.click(screen.getByTestId("save-new-list"));

  await waitForElementToBeRemoved(() => screen.getByTestId("new-list-text"));
  await waitForElementToBeRemoved(() => screen.getByText("Loading..."));

  expect(screen.getByTestId("active-list-title")).toHaveTextContent("Home");
  expect(server.db.lists.length).toEqual(1);
});

test("a list shows reminders for only that list", async () => {
  // Unassociated reminder
  server.create("reminder");

  // List with 3 associated reminders
  let list = server.create("list", {
    reminders: server.createList("reminder", 3),
  });

  visit(`/${list.id}?open`);
  await waitForElementToBeRemoved(() => screen.getByText("Loading..."));

  expect(screen.getAllByTestId("reminder").length).toEqual(3);
});

test("it can add a reminder to a list", async () => {
  let list = server.create("list");

  visit(`/${list.id}?open`);
  await waitForElementToBeRemoved(() => screen.getByText("Loading..."));

  userEvent.click(screen.getByTestId("add-reminder"));
  userEvent.type(screen.getByTestId("new-reminder-text"), "Work out{enter}");
  userEvent.click(screen.getByTestId("save-new-reminder"));

  await waitForElementToBeRemoved(() =>
    screen.getByTestId("new-reminder-text")
  );

  expect(screen.getByText("Work out")).toBeInTheDocument();
  expect(server.db.reminders.length).toEqual(1);
  expect(server.db.reminders[0].listId).toEqual(list.id);
});

test("it can delete a list", async () => {
  // One unassociated Reminder
  server.create("reminder");

  // A List with three associated Reminders
  let list = server.create("list", {
    reminders: server.createList("reminder", 3),
  });
  visit(`/${list.id}?open`);
  await waitForElementToBeRemoved(() => screen.getByText("Loading..."));

  userEvent.click(screen.getByTestId("delete-list"));

  await waitForElementToBeRemoved(() => screen.getByText("Loading..."));

  expect(screen.getByTestId("active-list-title")).toHaveTextContent(
    "Reminders"
  );
  expect(screen.getAllByTestId("reminder").length).toEqual(1);
  expect(server.db.lists.length).toEqual(0);
  expect(server.db.reminders.length).toEqual(1); // The associated reminders should have been destroyed
});
