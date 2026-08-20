import React from "react";
import { render } from "@testing-library/react";
import Settings from "../Settings";

describe("Settings", () => {
  test("renders without crashing", () => {
    const { container } = render(<Settings />);

    expect(container).toBeInTheDocument();
  });

  test("renders no visible content", () => {
    const { container } = render(<Settings />);

    expect(container.firstChild).toBeNull();
  });
});