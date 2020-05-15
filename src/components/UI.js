import React from "react";
import { NavLink, useRouteMatch } from "react-router-dom";

export function Link({
  className = "",
  inactiveClassName = "",
  activeClassName = "",
  to,
  exact = false,
  children,
}) {
  let match = useRouteMatch(to);
  console.log({ match });

  let isActive = match && (exact ? match.isExact : true);
  let classes = `${className} ${
    isActive ? activeClassName : inactiveClassName
  }`;

  return (
    <NavLink className={classes} to={to} exact={exact}>
      {children}
    </NavLink>
  );
}
