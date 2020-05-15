import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  NavLink,
} from "react-router-dom";
import Reminders from "./Reminders";
import { About } from "./About";

export default function App() {
  return (
    <Router>
      <div className="pt-12">
        <header className="max-w-md mx-auto">
          <nav className="mt-4 space-x-4">
            <NavLink
              activeClassName="border-b border-cool-gray-600"
              className="pb-1 text-cool-gray-900"
              to="/"
              exact
            >
              Home
            </NavLink>
            <NavLink
              activeClassName="border-b border-cool-gray-600"
              className="pb-1 text-cool-gray-900"
              to="/about"
            >
              About
            </NavLink>
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
