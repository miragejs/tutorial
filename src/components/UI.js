import React from "react";
import { Link as ReactRouterLink, useRouteMatch } from "react-router-dom";

export function Link({
  className = "",
  inactiveClassName = "",
  activeClassName = "",
  to,
  exact = false,
  children,
  activeFor,
}) {
  let isActive;
  let urlToMatch = activeFor || to.split("?")[0];
  let match = useRouteMatch(urlToMatch);

  if (activeFor) {
    isActive = match;
  } else {
    isActive = match && (exact ? match.isExact : true);
  }

  let classes = `${className} ${
    isActive ? activeClassName : inactiveClassName
  }`;

  return (
    <ReactRouterLink className={classes} to={to} exact={exact ? 1 : 0}>
      {children}
    </ReactRouterLink>
  );
}
