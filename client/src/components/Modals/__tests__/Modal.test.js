import React from "react";
import { render } from "@testing-library/react";
import Modal from "../Modal";

describe("Modal", () => {
  test("renders without crashing", () => {
    const { container } = render(<Modal />);

    expect(container).toBeInTheDocument();
  });

  test("returns no visible content", () => {
    const { container } = render(<Modal />);

    expect(container.firstChild).toBeNull();
  });

  test("accepts props without crashing", () => {
    const { container } = render(
      <Modal
        isOpen={true}
        title="Test Modal"
        onClose={() => {}}
      />
    );

    expect(container).toBeInTheDocument();
    expect(container.firstChild).toBeNull();
  });
});