import React from "react";

import ReactDOM from "react-dom";

import { MemoryRouter } from "react-router-dom";

import UnAuthenticated from "./UnAuthenticated";

it("renders without crashing", () => {
  const div = document.createElement("div");

  ReactDOM.render(
    <MemoryRouter>
      <UnAuthenticated/>
    </MemoryRouter>,
    div
  );

  ReactDOM.unmountComponentAtNode(div);
});
