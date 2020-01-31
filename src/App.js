import React, { useEffect, useState } from "react";

export default function App() {
  let [reminders, setReminders] = useState([]);

  useEffect(() => {
    // fetch("/api/reminders")
    //   .then(res => res.json())
    //   .then(json => {
    //     setReminders(json.reminders);
    //   });

    setReminders([
      { id: 1, text: "Take out the trash" },
      { id: 2, text: "Learn Mirage" },
      { id: 3, text: "Do laundry" }
    ]);
  }, []);

  return (
    <div>
      <h1>Reminders</h1>

      <form>
        <input type="text" placeholder="New reminder" />
      </form>

      <ul>
        {reminders.map(reminder => (
          <li key={reminder.id}>
            {reminder.text}
            <button>✖️</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
