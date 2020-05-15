import React, { useEffect, useState } from "react";

export default function () {
  let [reminders, setReminders] = useState();
  let [lists, setLists] = useState();
  let [newReminderText, setNewReminderText] = useState("");
  let [sidebarIsOpen, setSidebarIsOpen] = useState(true);

  useEffect(() => {
    fetch(`/api/reminders`)
      .then((res) => res.json())
      .then((json) => {
        setReminders(json.reminders);
      });
  }, []);

  useEffect(() => {
    if (sidebarIsOpen) {
      fetch(`/api/lists`)
        .then((res) => res.json())
        .then((json) => {
          setLists(json.lists);
        });
    }
  }, [sidebarIsOpen]);

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
    <div className="flex justify-center">
      <div className="rounded-md shadow-lg overflow-hidden flex mx-auto">
        {sidebarIsOpen && (
          <div className="bg-cool-gray-800 w-56 pb-4 pt-12 flex flex-col">
            <div className="flex-1 text-white">
              <a
                className="block text-sm bg-cool-gray-700 font-medium flex items-center justify-between py-1 px-6"
                href="#"
              >
                <span>No list</span>
                <span>{reminders?.length}</span>
              </a>
              {lists?.map((list) => (
                <a
                  key={list.id}
                  className="block text-sm font-medium flex items-center justify-between py-1 px-6"
                  href="#"
                >
                  <span>{list.name}</span>
                  <span>{1}</span>
                </a>
              ))}
            </div>
            <button className="mx-6 flex items-center text-sm text-cool-gray-300 focus:outline-none hover:text-white">
              <svg
                className="w-4 h-4 mr-1"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                  clipRule="evenodd"
                  fillRule="evenodd"
                ></path>
              </svg>
              Add List
            </button>
          </div>
        )}
        <div className="flex flex-1 bg-white min-w-md">
          <div className="bg-white w-12 flex items-center group">
            <button
              onClick={() => setSidebarIsOpen(!sidebarIsOpen)}
              className="bg-cool-gray-200 hover:bg-cool-gray-300 group-hover:block hidden ml-2 w-2 h-10 rounded-full focus:outline-none"
            ></button>
          </div>

          <div className="pt-12 pb-12 pr-12 flex-1">
            <h1 className="flex items-center justify-between mb-4 text-3xl font-bold leading-none">
              Reminders
            </h1>

            <div>
              <form onSubmit={handleSubmit} className="mt-8 mb-8">
                <div className="mt-1 relative rounded-md shadow-sm">
                  <input
                    className="form-input block w-full sm:text-sm sm:leading-5"
                    placeholder="New reminder"
                    value={newReminderText}
                    onChange={(e) => setNewReminderText(e.target.value)}
                  />
                </div>
              </form>

              {reminders && reminders.length > 0 ? (
                <ul className="divide-y divide-cool-gray-200">
                  {reminders.map((reminder) => (
                    <li
                      className="flex justify-between py-3 group"
                      key={reminder.id}
                    >
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
                <p className="font-medium text-cool-gray-500 text-center">
                  All done!
                </p>
              ) : (
                <p>Loading...</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
