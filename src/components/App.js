import React, { useState, useEffect, useRef } from "react";
import { Switch, Route, useLocation } from "react-router-dom";
import Reminders from "./Reminders";
import { About } from "./About";
import { Link } from "./UI";
import { AnimatePresence, motion, AnimateSharedLayout } from "framer-motion";

export default function App() {
  let location = useLocation();
  let aboutIsActive = location.pathname.match("/about");
  let remindersIsActive = !aboutIsActive;

  return (
    <div className="pt-12">
      <header className="max-w-md mx-auto">
        <nav className="mt-4 space-x-5">
          <Link
            className={`pb-px font-medium text-sm ${
              remindersIsActive
                ? "text-cool-gray-900 border-b-2 border-cool-gray-600"
                : "text-cool-gray-500 hover:text-cool-gray-900"
            }`}
            to={`/${location.search}`}
          >
            Reminders
          </Link>
          <Link
            className={`pb-px font-medium text-sm ${
              aboutIsActive
                ? "text-cool-gray-900 border-b-2 border-cool-gray-600"
                : "text-cool-gray-500 hover:text-cool-gray-900"
            }`}
            to={`/about${location.search}`}
          >
            About
          </Link>
        </nav>
      </header>

      <main className="mt-10">
        <Switch>
          <Route path="/about">
            <About />
          </Route>
          <Route path="/test">
            <Test />
          </Route>
          <Route path="/:listId?" exact>
            <Reminders />
          </Route>
        </Switch>
      </main>
    </div>
  );
}

let id = 1;

const makeItem = () => {
  let newId = id++;
  return { id: newId, name: `baz ${newId}` };
};

const spring = {
  duration: 0.3,
  // type: "spring",
  // damping: 10,
  // mass: 1,
  // stiffness: 50,
};

const Test = () => {
  let didRenderRef = useRef(false);
  useEffect(() => {
    didRenderRef.current = true;
  }, []);
  let [array, set] = useState(() => [makeItem(), makeItem(), makeItem()]);
  // let [array, set] = useState([]);

  const addItem = () => {
    set((array) => [...array, makeItem()]);
  };

  const removeItem = (id) => {
    set((array) => array.filter((el) => el.id !== id));
  };

  return (
    <div className="max-w-md mx-auto">
      <button
        className="px-3 py-2 text-white bg-blue-500 rounded"
        onClick={addItem}
      >
        Add
      </button>

      <AnimateSharedLayout>
        <motion.ul
          layout
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {
              height: 0,
            },
            visible: {
              height: "auto",
              transition: {
                delay: 0.1,
              },
            },
          }}
          className="mt-4 overflow-hidden bg-white rounded shadow"
        >
          <AnimatePresence>
            {array.map((obj, i) => (
              <motion.li
                layout
                custom={i}
                variants={{
                  hidden: {
                    opacity: 0,
                  },
                  visible: (i) => ({
                    opacity: 1,
                    transition: didRenderRef.current
                      ? { delay: 0.15, ...spring }
                      : { delay: 0.15 + i * 0.05, ...spring },
                  }),
                }}
                initial="hidden"
                animate="visible"
                exit="hidden"
                key={obj.id}
                className="p-4"
              >
                <button onClick={() => removeItem(obj.id)}>{obj.name}</button>
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>
      </AnimateSharedLayout>
    </div>
  );
};
