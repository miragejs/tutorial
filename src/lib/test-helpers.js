import React from "react";
import { render } from "@testing-library/react";
import { MemoryRouter, Route } from "react-router-dom";
import { QueryParamProvider } from "use-query-params";
import App from "../components/App";

export function visit(url) {
  return render(
    <MemoryRouter initialEntries={[url]}>
      <QueryParamProvider ReactRouterRoute={Route}>
        <App />
      </QueryParamProvider>
    </MemoryRouter>
  );
}
