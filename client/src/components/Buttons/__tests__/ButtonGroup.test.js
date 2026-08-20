import React from "react";
import { render } from "@testing-library/react";
import ButtonGroup from "../ButtonGroup";

describe("ButtonGroup", () => {
  test("renders without crashing", () => {
    const { container } = render(<ButtonGroup />);

    expect(container).toBeInTheDocument();
  });

  test("returns no visible content", () => {
    const { container } = render(<ButtonGroup />);

    expect(container.firstChild).toBeNull();
  });

  test("accepts props without crashing", () => {
    const { container } = render(
      <ButtonGroup className="test-class" />
    );

    expect(container).toBeInTheDocument();
    expect(container.firstChild).toBeNull();
  });
});