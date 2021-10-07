import React from "react";

import ReactDOM from "react-dom";

import { MemoryRouter } from "react-router-dom";

import JoinGroup from "./JoinGroup";

it("renders without crashing", () => {
  const div = document.createElement("div");

  ReactDOM.render(
    <MemoryRouter>
      <JoinGroup/>
    </MemoryRouter>,
    div
  );

  ReactDOM.unmountComponentAtNode(div);
});
