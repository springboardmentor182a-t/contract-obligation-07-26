import React from "react";
import { render } from "@testing-library/react";
import Signup from "../Signup";

describe("Signup", () => {
  test("renders without crashing", () => {
    const { container } = render(<Signup />);

    expect(container).toBeInTheDocument();
  });

  test("renders no visible content", () => {
    const { container } = render(<Signup />);

    expect(container.firstChild).toBeNull();
  });
});