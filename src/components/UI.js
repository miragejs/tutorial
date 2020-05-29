import React from "react";
import {
  Link as ReactRouterLink,
  matchPath,
  useLocation,
} from "react-router-dom";

export function Link({
  className = "",
  inactiveClassName = "",
  activeClassName = "",
  to,
  exact = false,
  children,
  activeFor = [],
}) {
  let location = useLocation();
  let isActive;

  if (activeFor.length > 0) {
    isActive = activeFor.find((matcher) => {
      return matchPath(location.pathname, {
        path: matcher.path,
        exact: matcher.exact,
      });
    });
    // isActive = matchPath(location.path, { path: to.split("?")[0] });
  } else {
    let match = matchPath(location.pathname, { path: to.split("?")[0] });
    isActive = match && (exact ? match.isExact : true);
  }

  // let urlToMatch = activeFor || to.split("?")[0];
  // let match = useRouteMatch(urlToMatch);

  // if (activeFor.length > 0) {
  //   isActive = match;
  // } else {
  //   isActive = match && (exact ? match.isExact : true);
  // }

  let classes = `${className} ${
    isActive ? activeClassName : inactiveClassName
  }`;

  return (
    <ReactRouterLink className={classes} to={to} exact={exact ? 1 : 0}>
      {children}
    </ReactRouterLink>
  );
}
