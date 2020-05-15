import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Reminders from "./Reminders";
import { About } from "./About";
import { Link } from "./UI";

export default function App() {
  return (
    <Router>
      <div className="pt-12">
        <header className="max-w-md mx-auto">
          <nav className="mt-4 space-x-5">
            <Link
              activeClassName="text-cool-gray-900 border-b-2 border-cool-gray-600"
              inactiveClassName="text-cool-gray-500 hover:text-cool-gray-900"
              className="pb-1 font-medium text-sm"
              to="/"
              exact
            >
              Home
            </Link>
            <Link
              activeClassName="text-cool-gray-900 border-b-2 border-cool-gray-600"
              inactiveClassName="text-cool-gray-500 hover:text-cool-gray-900"
              className="pb-1 font-medium text-sm"
              to="/about"
            >
              About
            </Link>
          </nav>
        </header>

        <main className="mt-6">
          <Switch>
            <Route path="/" exact>
              <Reminders />
            </Route>
            <Route path="/final">
              <Reminders />
            </Route>
            <Route path="/about">
              <About />
            </Route>
          </Switch>
        </main>
      </div>
    </Router>
  );
}
