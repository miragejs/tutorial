import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

export default function() {
  return (
    <div>
      <h1>Reminders</h1>

      <Reminders />
    </div>
  );
}

function Reminders() {
  let [reminders, setReminders] = useState();
  let [newReminderText, setNewReminderText] = useState("");

  useEffect(() => {
    fetch(`/api/reminders`)
      .then(res => res.json())
      .then(json => {
        setReminders(json.reminders);
      });
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
    fetch("/api/reminders", {
      method: "POST",
      body: JSON.stringify({ text: newReminderText })
    })
      .then(res => res.json())
      .then(json => {
        setNewReminderText("");
        setReminders(reminders => [...reminders, json.reminder]);
      });
  }

  function handleDelete(id) {
    fetch(`/api/reminders/${id}`, { method: "DELETE" });
    setReminders(reminders => reminders.filter(reminder => reminder.id !== id));
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="New reminder"
          value={newReminderText}
          onChange={e => setNewReminderText(e.target.value)}
        />
      </form>

      {reminders && reminders.length > 0 ? (
        <ul>
          {reminders.map(reminder => (
            <li key={reminder.id}>
              {reminder.text}
              <button onClick={() => handleDelete(reminder.id)}>✖️</button>
            </li>
          ))}
        </ul>
      ) : reminders ? (
        <p>No reminders</p>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

// function Lists() {
//   return (
//     <nav>
//       <NavLink to="/1">List 1</NavLink>
//       <NavLink to="/2">List 2</NavLink>
//     </nav>
//   );
// }
