import React from "react";
import { render } from "@testing-library/react";
import Checkbox from "../Checkbox";

describe("Checkbox", () => {
  test("renders without crashing", () => {
    const { container } = render(<Checkbox />);

    expect(container).toBeInTheDocument();
  });

  test("returns no visible content", () => {
    const { container } = render(<Checkbox />);

    expect(container.firstChild).toBeNull();
  });

  test("accepts props without crashing", () => {
    const { container } = render(
      <Checkbox checked={true} onChange={() => {}} />
    );

    expect(container).toBeInTheDocument();
    expect(container.firstChild).toBeNull();
  });
});