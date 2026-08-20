import React from "react";
import { render } from "@testing-library/react";
import FormInput from "../FormInput";

describe("FormInput", () => {
  test("renders without crashing", () => {
    const { container } = render(<FormInput />);

    expect(container).toBeInTheDocument();
  });

  test("returns no visible content", () => {
    const { container } = render(<FormInput />);

    expect(container.firstChild).toBeNull();
  });

  test("accepts props without crashing", () => {
    const { container } = render(
      <FormInput
        type="text"
        name="email"
        value=""
        onChange={() => {}}
        placeholder="Enter email"
      />
    );

    expect(container).toBeInTheDocument();
    expect(container.firstChild).toBeNull();
  });
});