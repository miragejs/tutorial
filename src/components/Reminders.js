import React, { useEffect, useRef, useState } from "react";
import { Link } from "./UI";
import { useParams, useLocation, useHistory } from "react-router-dom";
import { useQueryParam } from "use-query-params";
import { BooleanParam } from "../lib/utils";
import { AnimatePresence, motion } from "framer-motion";

export default function () {
  let history = useHistory();
  let location = useLocation();
  let { listId } = useParams();

  let [reminders, setReminders] = useState(null);
  let [lists, setLists] = useState();
  let [error, setError] = useState();
  let [isAddingReminder, setIsAddingReminder] = useState();
  let [isSavingReminder, setIsSavingReminder] = useState();
  let [isAddingList, setIsAddingList] = useState();
  let [isSavingList, setIsSavingList] = useState();
  let [newReminderText, setNewReminderText] = useState("");
  let [newListName, setNewListName] = useState("");
  let [sidebarIsOpen, setSidebarIsOpen] = useQueryParam("open", BooleanParam);

  let activeList = listId && lists?.find((list) => list.id === listId);

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

    if (!newReminderText) {
      return;
    }

    setIsSavingReminder(true);

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
      .catch((e) => {
        setError("Your Reminder wasn't saved. Try again.");
        console.error(e);
      })
      .finally(() => {
        setIsSavingReminder(false);
      });
  }

  function createList(e) {
    e.preventDefault();

    if (!newListName) {
      return;
    }

    setIsSavingList(true);

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
        history.push(`/${json.list.id}${location.search}`);
      })
      .catch(() => {
        setError("Your List wasn't saved. Try again.");
      })
      .finally(() => {
        setIsSavingList(false);
      });
  }

  function deleteReminder(id) {
    fetch(`/api/reminders/${id}`, { method: "DELETE" });
    setReminders((reminders) =>
      reminders.filter((reminder) => reminder.id !== id)
    );
  }

  function deleteList() {
    fetch(`/api/lists/${listId}`, { method: "DELETE" });
    setLists((lists) => lists?.filter((list) => list.id !== listId));
    history.push(`/${location.search}`);
  }

  let hasRenderedRemindersRef = useRef(false);
  useEffect(() => {
    if (reminders) {
      hasRenderedRemindersRef.current = true;
    } else {
      hasRenderedRemindersRef.current = false;
    }
  }, [reminders]);

  return (
    <div className="flex justify-center">
      <div className="flex mx-auto overflow-hidden rounded-md shadow-lg">
        <AnimatePresence initial={false}>
          {sidebarIsOpen && (
            <motion.div
              animate={{ width: 192 }}
              initial={{ width: 0 }}
              exit={{ width: 0 }}
              className="flex flex-col bg-cool-gray-800"
            >
              <div className="flex flex-col flex-1 w-48 pt-12 pb-4 bg-cool-gray-800">
                <div className="flex-1">
                  <div>
                    <Link
                      className="flex items-center justify-between px-6 py-2 text-sm font-medium"
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
                        className="flex items-center justify-between px-6 py-2 text-sm font-medium"
                        activeClassName="bg-cool-gray-700 text-white"
                        inactiveClassName="text-cool-gray-400 hover:text-white"
                        to={`/${list.id}${location.search}`}
                      >
                        <span>{list.name}</span>
                      </Link>
                    ))}
                  </div>

                  {isAddingList && (
                    <form
                      onSubmit={createList}
                      className={`${
                        isSavingList ? "opacity-50 pointer-events-none" : ""
                      }`}
                    >
                      <div className="relative">
                        <input
                          autoFocus
                          value={newListName}
                          onChange={(e) => setNewListName(e.target.value)}
                          className="block w-full py-2 pl-6 text-sm font-medium text-white border-transparent rounded-none pr-9 focus:shadow-none form-input bg-cool-gray-700"
                          type="text"
                          placeholder="New list..."
                          data-testid="new-list-text"
                        />
                        <button
                          className="absolute inset-y-0 right-0 flex items-center px-3 text-cool-gray-400 hover:text-cool-gray-200"
                          data-testid="save-new-list"
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
                  )}
                </div>
                <div className="mt-10">
                  <button
                    onClick={() => setIsAddingList(!isAddingList)}
                    className="flex items-center mx-6 text-xs text-cool-gray-400 hover:text-white"
                    data-testid="add-list"
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
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex flex-1 bg-white w-md">
          <div className="flex items-center w-12 group">
            <button
              onClick={() => setSidebarIsOpen(!sidebarIsOpen)}
              className="hidden w-2 h-10 ml-2 rounded-full bg-cool-gray-200 hover:bg-cool-gray-300 group-hover:block"
              data-testid="toggle-sidebar"
            ></button>
          </div>

          <div className="flex-1 pt-12 pb-12 pr-12">
            <div className="flex items-center justify-between mb-10">
              <h1
                className="flex items-center justify-between text-3xl font-bold leading-none"
                data-testid="active-list-title"
              >
                {activeList?.name || "Reminders"}
              </h1>

              <button
                data-testid="add-reminder"
                onClick={() => setIsAddingReminder(!isAddingReminder)}
                className="p-2 border border-transparent rounded hover:border-cool-gray-300 text-cool-gray-600"
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
              {error && (
                <div className="fixed bottom-0 right-0 mb-8 mr-8 bg-white border-b-4 border-red-500 rounded-md shadow-xl">
                  <div className="flex p-4 pr-5 rounded-md">
                    <div className="flex-shrink-0">
                      <svg
                        className="w-5 h-5 mr-1 text-red-500"
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
                      <h3 className="font-medium leading-5 text-red-600 text">
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
                <div>
                  <ul className="divide-y divide-cool-gray-100">
                    <AnimatePresence>
                      {reminders.map((reminder, i) => (
                        <motion.li
                          variants={{
                            hidden: (i) => ({
                              opacity: 0,
                              y: -50 * i,
                            }),
                            visible: (i) => ({
                              opacity: 1,
                              y: 0,
                              transition: {
                                delay: i * 0.025,
                              },
                            }),
                            removed: {
                              opacity: 0,
                            },
                          }}
                          initial={
                            hasRenderedRemindersRef.current
                              ? "visible"
                              : "hidden"
                          }
                          animate="visible"
                          exit="removed"
                          custom={i}
                          className="flex items-center justify-between py-2 group"
                          key={reminder.id}
                          data-testid="reminder"
                        >
                          <div>
                            {reminder.text}
                            {!listId && reminder.list && (
                              <span
                                className="px-2 py-1 ml-3 text-xs font-medium rounded bg-cool-gray-100 text-cool-gray-600"
                                data-testid="list-tag"
                              >
                                {reminder.list.name}
                              </span>
                            )}
                          </div>
                          <button
                            className="flex items-center invisible px-2 py-1 opacity-50 hover:opacity-100 group-hover:visible"
                            onClick={() => deleteReminder(reminder.id)}
                            data-testid="delete-reminder"
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
                        </motion.li>
                      ))}
                    </AnimatePresence>
                  </ul>
                </div>
              ) : reminders ? (
                <p className="pt-3 pb-3 font-medium text-cool-gray-400">
                  All done!
                </p>
              ) : !error ? (
                <p className="pt-3 pb-3 font-medium text-cool-gray-400">
                  Loading...
                </p>
              ) : null}

              {isAddingReminder && (
                <form
                  onSubmit={createReminder}
                  className={`-mx-3 ${
                    isSavingReminder ? "opacity-50 pointer-events-none" : ""
                  }`}
                >
                  <div>
                    <div className="relative py-1">
                      <input
                        id="email"
                        autoFocus
                        className="block w-full py-2 transition duration-150 ease-in-out border-2 border-transparent focus form-input focus:shadow-none focus:border-blue-300 sm:leading-5"
                        placeholder="New reminder..."
                        data-testid="new-reminder-text"
                        value={newReminderText}
                        onChange={(e) => setNewReminderText(e.target.value)}
                      />
                      <div className="absolute inset-y-0 right-0 flex py-1">
                        <button
                          type="submit"
                          data-testid="save-new-reminder"
                          className="items-center px-4 text-sm text-cool-gray-700 hover:text-cool-gray-400"
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
                    </div>
                  </div>
                </form>
              )}
            </div>

            {listId && (
              <div className="mt-20 text-right">
                <button
                  onClick={deleteList}
                  className="px-2 text-sm font-medium text-cool-gray-400 hover:text-cool-gray-600"
                  data-testid="delete-list"
                >
                  Delete list
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
