import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  NavLink,
  Link,
} from "react-router-dom";
import Reminders from "./Reminders";
import Part1 from "./tutorial/part-1";

export default function App() {
  return (
    <Router>
      {/* <header>
        <nav>
          <NavLink to="/" exact>
            Home
          </NavLink>
          <NavLink to="/about">About</NavLink>
        </nav>
      </header> */}

      <main>
        <Switch>
          <Route path="/" exact>
            <p>Welcome to the Mirage JS Tutorial!</p>
            <ul>
              <li>
                <Link className="font-medium text-blue-500" to="/part-1">
                  Part 1
                </Link>
              </li>
            </ul>
          </Route>
          <Route path="/part-1">
            <Part1 />
          </Route>
          <Route path="/final">
            <Reminders />
          </Route>

          {/* <Route path="/about">
            <About />
          </Route>
          <Route path="/:listId">
            <Reminders />
          </Route>
          <Route exact path="/">
            <Reminders />
          </Route> */}
        </Switch>
      </main>
    </Router>
  );
}

function About() {
  return (
    <div>
      <h1>About</h1>
      <p className="mt-6">
        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Nam sit
        aperiam, itaque possimus ut autem similique mollitia architecto
        quibusdam. Eveniet magni doloribus eligendi facilis ut ducimus error
        sunt aperiam impedit!
      </p>
    </div>
  );
}
