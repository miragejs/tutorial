import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  useLocation,
} from "react-router-dom";
import Reminders from "./Reminders";
import { About } from "./About";
import { Link } from "./UI";
import { QueryParamProvider } from "use-query-params";

export default function AppWrapper() {
  return (
    <Router>
      <QueryParamProvider ReactRouterRoute={Route}>
        <App />
      </QueryParamProvider>
    </Router>
  );
}

function App() {
  let location = useLocation();

  return (
    <div className="pt-12">
      <header className="max-w-md mx-auto">
        <nav className="mt-4 space-x-5">
          <Link
            activeClassName="text-cool-gray-900 border-b-2 border-cool-gray-600"
            inactiveClassName="text-cool-gray-500 hover:text-cool-gray-900"
            className="pb-1 font-medium text-sm"
            to={`/${location.search}`}
            exact
            activeFor="/"
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
