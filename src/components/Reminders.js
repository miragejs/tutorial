import React, { useEffect, useState } from "react";
import { Link } from "./UI";
import { useParams, useLocation } from "react-router-dom";
import { useQueryParam } from "use-query-params";
import { BooleanParam } from "./utils";

export default function () {
  let location = useLocation();

  let [reminders, setReminders] = useState(null);
  let [lists, setLists] = useState();
  let [newReminderText, setNewReminderText] = useState("");
  let [sidebarIsOpen, setSidebarIsOpen] = useQueryParam("open", BooleanParam);
  let { listId } = useParams();

  useEffect(() => {
    setReminders(null);

    if (listId) {
      fetch(`/api/lists/${listId}/reminders`)
        .then((res) => res.json())
        .then((json) => {
          setReminders(json.reminders);
        });
    } else {
      fetch(`/api/reminders`)
        .then((res) => res.json())
        .then((json) => {
          setReminders(json.reminders);
        });
    }
  }, [listId]);

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
          <div className="bg-cool-gray-800 w-48 pb-4 pt-12 flex flex-col">
            <div className="flex-1">
              <Link
                className="block text-sm font-medium flex items-center justify-between py-2 px-6"
                activeClassName="bg-cool-gray-700 text-white"
                inactiveClassName="text-cool-gray-400 hover:text-white"
                to={`/${location.search}`}
                exact
              >
                <span>All</span>
              </Link>

              {lists?.map((list) => (
                <Link
                  key={list.id}
                  className="block text-sm font-medium flex items-center justify-between py-2 px-6"
                  activeClassName="bg-cool-gray-700 text-white"
                  inactiveClassName="text-cool-gray-400 hover:text-white"
                  to={`/${list.id}${location.search}`}
                >
                  <span>{list.name}</span>
                </Link>
              ))}
            </div>
            <button className="mx-6 flex items-center text-xs text-cool-gray-400 focus:outline-none hover:text-white">
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
              Add list
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
                <div className="mt-1 relative rounded-md -ml-3">
                  <input
                    className="form-input border-transparent placeholder-cool-gray-400 block w-full  sm:leading-5"
                    placeholder="New reminder..."
                    value={newReminderText}
                    onChange={(e) => setNewReminderText(e.target.value)}
                  />
                </div>
              </form>

              {reminders && reminders.length > 0 ? (
                <ul className="divide-y divide-cool-gray-200">
                  {reminders.map((reminder) => (
                    <li
                      className="flex items-center justify-between py-3 group"
                      key={reminder.id}
                    >
                      {reminder.text}
                      <button
                        className="flex items-center invisible opacity-50 hover:opacity-100 group-hover:visible"
                        onClick={() => handleDelete(reminder.id)}
                      >
                        <svg
                          className="w-4 h-4"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                            clipRule="evenodd"
                            fillRule="evenodd"
                          ></path>
                        </svg>
                        ️
                      </button>
                    </li>
                  ))}
                </ul>
              ) : reminders ? (
                <p className="pt-3 font-medium text-cool-gray-400 ">
                  All done!
                </p>
              ) : (
                <p className="pt-3 font-medium text-cool-gray-400 ">
                  Loading...
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
