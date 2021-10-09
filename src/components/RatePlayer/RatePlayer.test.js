import React from "react";

import ReactDOM from "react-dom";

import { MemoryRouter } from "react-router-dom";

import RatePlayer from "./RatePlayer";

it("renders without crashing", () => {
  const div = document.createElement("div");

  ReactDOM.render(
    <MemoryRouter>
      <RatePlayer/>
    </MemoryRouter>,
    div
  );

  ReactDOM.unmountComponentAtNode(div);
});
