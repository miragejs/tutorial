import React, { useEffect, useState } from "react";
import { Link } from "./UI";
import { useParams, useLocation } from "react-router-dom";
import { useQueryParam } from "use-query-params";
import { BooleanParam } from "./utils";

export default function () {
  let location = useLocation();
  let { listId } = useParams();

  let [reminders, setReminders] = useState(null);
  let [lists, setLists] = useState();
  let [error, setError] = useState();
  let [isAddingReminder, setIsAddingReminder] = useState();
  let [isAddingList, setIsAddingList] = useState();
  let [newReminderText, setNewReminderText] = useState("");
  let [newListName, setNewListName] = useState("");
  let [sidebarIsOpen, setSidebarIsOpen] = useQueryParam("open", BooleanParam);

  useEffect(() => {
    let isCurrent = true;
    setReminders(null);
    let url = listId ? `/api/lists/${listId}/reminders` : `/api/reminders`;

    fetch(url)
      .then((res) => res.json())
      .then((json) => {
        if (isCurrent) {
          setReminders(json.reminders);
        }
      })
      .catch((e) => {
        if (isCurrent) {
          setError("We couldn't load your reminders. Try again soon.");
          console.error(e);
        }
      });

    return () => {
      isCurrent = false;
    };
  }, [listId]);

  useEffect(() => {
    let isCurrent = true;

    if (sidebarIsOpen) {
      fetch(`/api/lists`)
        .then((res) => res.json())
        .then((json) => {
          if (isCurrent) {
            setLists(json.lists);
          }
        })
        .catch((e) => {
          console.error(e);
        });
    }

    return () => {
      isCurrent = false;
    };
  }, [sidebarIsOpen]);

  function createReminder(e) {
    e.preventDefault();

    fetch("/api/reminders", {
      method: "POST",
      body: JSON.stringify({
        text: newReminderText,
        ...(listId && { listId }),
      }),
    })
      .then((res) => res.json())
      .then((json) => {
        setNewReminderText("");
        setReminders((reminders) => [...reminders, json.reminder]);
        setIsAddingReminder(false);
      })
      .catch(() => {
        setError("Your Reminder wasn't saved. Try again.");
      });
  }

  function createList(e) {
    e.preventDefault();

    fetch("/api/lists", {
      method: "POST",
      body: JSON.stringify({
        name: newListName,
      }),
    })
      .then((res) => res.json())
      .then((json) => {
        setNewListName("");
        setLists((lists) => [...lists, json.list]);
        setIsAddingList(false);
      })
      .catch(() => {
        setError("Your List wasn't saved. Try again.");
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
            <div className="mt-10">
              {isAddingList ? (
                <form onSubmit={createList}>
                  <div className="px-4 text-xs flex rounded-md shadow-sm">
                    <div className="relative flex-grow focus-within:z-10">
                      <input
                        id="email"
                        autoFocus
                        className="form-input border-none block w-full rounded-none rounded-l-md pl-2 leading-tight transition ease-in-out duration-150 text-sm"
                        placeholder="List name..."
                        data-testid="new-reminder-text"
                        value={newListName}
                        onChange={(e) => setNewListName(e.target.value)}
                      />
                    </div>
                    <button
                      type="submit"
                      data-testid="save-new-reminder"
                      className="-ml-px relative inline-flex items-center px-2 py-1 bg-green-500 text-white font-medium rounded-r-md  hover:text-cool-gray-500 hover:bg-white focus:outline-none focus:shadow-outline-blue focus:border-blue-300 active:bg-cool-gray-100 active:text-cool-gray-700 transition ease-in-out duration-150"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        ></path>
                      </svg>
                    </button>
                  </div>
                </form>
              ) : (
                <button
                  onClick={() => setIsAddingList(true)}
                  className="mx-6 flex items-center text-xs text-cool-gray-400 focus:outline-none hover:text-white"
                >
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
              )}
            </div>
          </div>
        )}
        <div className="flex flex-1 bg-white w-md">
          <div className="w-12 flex items-center group">
            <button
              onClick={() => setSidebarIsOpen(!sidebarIsOpen)}
              className="bg-cool-gray-200 hover:bg-cool-gray-300 group-hover:block hidden ml-2 w-2 h-10 rounded-full focus:outline-none"
            ></button>
          </div>

          <div className="pt-12 pb-12 pr-12 flex-1">
            <div className="flex justify-between items-center mb-10">
              <h1 className="flex items-center justify-between text-3xl font-bold leading-none">
                Reminders
              </h1>

              <button
                data-testid="add-reminder"
                onClick={() => setIsAddingReminder(!isAddingReminder)}
                className="hover:border-cool-gray-300 border border-transparent rounded p-2 text-cool-gray-600 focus:outline-none"
              >
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </button>
            </div>

            <div>
              {isAddingReminder && (
                <form onSubmit={createReminder} className="mb-5">
                  <div>
                    <div className="flex rounded-md shadow-sm">
                      <div className="relative flex-grow focus-within:z-10">
                        <input
                          id="email"
                          autoFocus
                          className="form-input block w-full rounded-none rounded-l-md pl-4 transition ease-in-out duration-150 sm:text-sm sm:leading-5"
                          placeholder="New reminder..."
                          data-testid="new-reminder-text"
                          value={newReminderText}
                          onChange={(e) => setNewReminderText(e.target.value)}
                        />
                      </div>
                      <button
                        type="submit"
                        data-testid="save-new-reminder"
                        className="-ml-px relative inline-flex items-center px-4 py-2 border border-cool-gray-300 text-sm leading-5 font-medium rounded-r-md text-cool-gray-700 bg-cool-gray-50 hover:text-cool-gray-500 hover:bg-white focus:outline-none focus:shadow-outline-blue focus:border-blue-300 active:bg-cool-gray-100 active:text-cool-gray-700 transition ease-in-out duration-150"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                </form>
              )}

              {error && (
                <div className="fixed bottom-0 right-0 rounded-md border-b-4 border-red-500 bg-white shadow-xl mr-8 mb-8">
                  <div className="flex p-4 pr-5 rounded-md">
                    <div className="flex-shrink-0">
                      <svg
                        className="h-5 w-5 mr-1 text-red-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text leading-5 font-medium text-red-600">
                        Network error
                      </h3>
                      <div className="mt-2 text-sm leading-5">
                        <p>{error}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {reminders?.length > 0 ? (
                <ul className="divide-y divide-cool-gray-100">
                  {reminders.map((reminder) => (
                    <li
                      className="flex items-center justify-between py-3 group"
                      key={reminder.id}
                    >
                      <div>
                        {reminder.text}
                        {!listId && reminder.list && (
                          <span className="text-xs bg-cool-gray-100 px-2 py-1 font-medium rounded text-cool-gray-600 ml-3">
                            {reminder.list.name}
                          </span>
                        )}
                      </div>
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
                <p className="pt-3 font-medium text-cool-gray-400 pb-3">
                  All done!
                </p>
              ) : !error ? (
                <p className="pt-3 font-medium text-cool-gray-400 pb-3">
                  Loading...
                </p>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
