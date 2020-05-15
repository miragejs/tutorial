import React, { useEffect, useState } from "react";

export default function () {
  return (
    <div>
      <h1 className="flex items-center justify-between mb-4 text-3xl font-bold leading-none">
        Reminders
      </h1>

      <Reminders />
    </div>
  );
}

function Reminders() {
  let [reminders, setReminders] = useState();
  let [newReminderText, setNewReminderText] = useState("");

  useEffect(() => {
    fetch(`/api/reminders`)
      .then((res) => res.json())
      .then((json) => {
        setReminders(json.reminders);
      });
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
    fetch("/api/reminders", {
      method: "POST",
      body: JSON.stringify({ text: newReminderText }),
    })
      .then((res) => res.json())
      .then((json) => {
        setNewReminderText("");
        setReminders((reminders) => [...reminders, json.reminder]);
      });
  }

  function handleDelete(id) {
    fetch(`/api/reminders/${id}`, { method: "DELETE" });
    setReminders((reminders) =>
      reminders.filter((reminder) => reminder.id !== id)
    );
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="mt-8 mb-8">
        <input
          type="text"
          placeholder="New reminder"
          value={newReminderText}
          onChange={(e) => setNewReminderText(e.target.value)}
          className="w-full px-3 py-2 border rounded shadow focus:shadow-outline focus:outline-none"
        />
      </form>

      {reminders && reminders.length > 0 ? (
        <ul className="divide-y divide-cool-gray-200">
          {reminders.map((reminder) => (
            <li className="flex justify-between py-3 group" key={reminder.id}>
              {reminder.text}
              <button
                className="hidden opacity-50 hover:opacity-100 group-hover:block"
                onClick={() => handleDelete(reminder.id)}
              >
                ✖️
              </button>
            </li>
          ))}
        </ul>
      ) : reminders ? (
        <p className="font-medium text-cool-gray-500 text-center">All done!</p>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
