import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  NavLink,
} from "react-router-dom";
import Reminders from "./Reminders";

export default function App() {
  return (
    <Router>
      <div className="max-w-md pt-12 mx-auto">
        <header>
          <nav className="mt-4">
            <NavLink
              activeClassName="border-b border-cool-gray-500"
              className="pb-1 mr-4"
              to="/"
              exact
            >
              Home
            </NavLink>
            <NavLink
              activeClassName="border-b border-cool-gray-500"
              className="pb-1 mr-4"
              to="/about"
            >
              About
            </NavLink>
          </nav>
        </header>

        <main className="p-8 mt-6 bg-white rounded shadow-lg">
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

function About() {
  return (
    <div>
      <h1 className="mb-4 text-3xl font-bold leading-none">About</h1>
      <p className="mt-6">
        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Nam sit
        aperiam, itaque possimus ut autem similique mollitia architecto
        quibusdam. Eveniet magni doloribus eligendi facilis ut ducimus error
        sunt aperiam impedit!
      </p>
    </div>
  );
}
