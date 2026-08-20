import React from "react";
import { render } from "@testing-library/react";
import Login from "../Login";

describe("Login", () => {
  test("renders without crashing", () => {
    const { container } = render(<Login />);

    expect(container).toBeInTheDocument();
  });

  test("renders no visible content", () => {
    const { container } = render(<Login />);

    expect(container.firstChild).toBeNull();
  });
});