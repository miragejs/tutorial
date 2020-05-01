import React, { useState, useEffect } from "react";
import { Server } from "miragejs";

new Server();

export default function Part1() {
  let [reminders, setReminders] = useState();
  let [state, setState] = useState("loading");

  useEffect(() => {
    fetch(`/api/reminders`)
      .then((res) => res.json())
      .then((json) => {
        setState("success");
        setReminders(json.reminders);
      })
      .catch(() => setState("error"));
  }, []);

  return (
    <div>
      <h1>Reminders</h1>

      {state === "loading" ? (
        <p>Loading...</p>
      ) : state === "error" ? (
        <p>Woops! The API request failed.</p>
      ) : reminders.length === 0 ? (
        <p>No reminders</p>
      ) : (
        <ul>
          {reminders.map((reminder) => (
            <li key={reminder.id}>{reminder.text}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
