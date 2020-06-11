import React from "react";
import { Switch, Route, useLocation } from "react-router-dom";
import Reminders from "./Reminders";
import { About } from "./About";
import { Link } from "./UI";

export default function App() {
  let location = useLocation();

  return (
    <div className="pt-12">
      <header className="max-w-md mx-auto">
        <nav className="mt-4 space-x-5">
          <Link
            activeClassName="text-cool-gray-900 border-b-2 border-cool-gray-600"
            inactiveClassName="text-cool-gray-500 hover:text-cool-gray-900"
            className="pb-px font-medium text-sm"
            to={`/${location.search}`}
            exact
            activeFor={[{ path: "/", exact: true }, { path: "/:id" }]}
          >
            Reminders
          </Link>
          <Link
            activeClassName="text-cool-gray-900 border-b-2 border-cool-gray-600"
            inactiveClassName="text-cool-gray-500 hover:text-cool-gray-900"
            className="pb-px font-medium text-sm"
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
          <Route path="/:listId?" exact>
            <Reminders />
          </Route>
        </Switch>
      </main>
    </div>
  );
}
