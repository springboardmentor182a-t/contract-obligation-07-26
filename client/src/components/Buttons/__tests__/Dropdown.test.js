import React from "react";
import { render } from "@testing-library/react";
import Dropdown from "../Dropdown";

describe("Dropdown", () => {
  test("renders without crashing", () => {
    const { container } = render(<Dropdown />);

    expect(container).toBeInTheDocument();
  });

  test("returns no visible content", () => {
    const { container } = render(<Dropdown />);

    expect(container.firstChild).toBeNull();
  });

  test("accepts props without crashing", () => {
    const { container } = render(
      <Dropdown options={[]} value="" onChange={() => {}} />
    );

    expect(container).toBeInTheDocument();
    expect(container.firstChild).toBeNull();
  });
});