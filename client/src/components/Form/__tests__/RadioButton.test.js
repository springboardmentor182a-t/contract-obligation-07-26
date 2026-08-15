import React from "react";
import { render } from "@testing-library/react";
import RadioButton from "../RadioButton";

describe("RadioButton", () => {
  test("renders without crashing", () => {
    const { container } = render(<RadioButton />);

    expect(container).toBeInTheDocument();
  });

  test("returns no visible content", () => {
    const { container } = render(<RadioButton />);

    expect(container.firstChild).toBeNull();
  });

  test("accepts props without crashing", () => {
    const { container } = render(
      <RadioButton
        name="status"
        value="active"
        checked={true}
        onChange={() => {}}
      />
    );

    expect(container).toBeInTheDocument();
    expect(container.firstChild).toBeNull();
  });
});