import React from "react";
import { render } from "@testing-library/react";
import FormSelect from "../FormSelect";

describe("FormSelect", () => {
  test("renders without crashing", () => {
    const { container } = render(<FormSelect />);

    expect(container).toBeInTheDocument();
  });

  test("returns no visible content", () => {
    const { container } = render(<FormSelect />);

    expect(container.firstChild).toBeNull();
  });

  test("accepts props without crashing", () => {
    const { container } = render(
      <FormSelect
        name="status"
        value=""
        options={[]}
        onChange={() => {}}
      />
    );

    expect(container).toBeInTheDocument();
    expect(container.firstChild).toBeNull();
  });
});