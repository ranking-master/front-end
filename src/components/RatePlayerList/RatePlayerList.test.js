import React from "react";

import ReactDOM from "react-dom";

import { MemoryRouter } from "react-router-dom";

import RatePlayerList from "./RatePlayerList";

it("renders without crashing", () => {
  const div = document.createElement("div");

  ReactDOM.render(
    <MemoryRouter>
      <RatePlayerList/>
    </MemoryRouter>,
    div
  );

  ReactDOM.unmountComponentAtNode(div);
});
