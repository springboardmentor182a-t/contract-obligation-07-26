import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { vi } from "vitest";

import Dropdown from "../components/Buttons/Dropdown";

vi.mock("lucide-react", () => ({
  ChevronDown: () => <span>▼</span>,
}));
it("should call onSelect when an item is clicked", () => {
  const mockOnSelect = vi.fn();

  render(
    <Dropdown
      label="Select User"
      items={[
        { label: "Admin" },
        { label: "Manager" },
      ]}
      onSelect={mockOnSelect}
    />
  );

  fireEvent.click(
    screen.getByRole("button", {
      name: /Select User/i,
    })
  );

  fireEvent.click(screen.getByText("Manager"));

  expect(mockOnSelect).toHaveBeenCalledTimes(1);
  expect(mockOnSelect).toHaveBeenCalledWith({
    label: "Manager",
  });
});
describe("Dropdown Component", () => {
  it("should open the dropdown when the button is clicked", () => {
    render(
      <Dropdown
        label="Select User"
        items={[
          { label: "Admin" },
          { label: "Manager" },
          { label: "Employee" },
        ]}
      />
    );

    const button = screen.getByRole("button", {
      name: /Select User/i,
    });

    fireEvent.click(button);

    expect(screen.getByText("Admin")).toBeInTheDocument();
    expect(screen.getByText("Manager")).toBeInTheDocument();
    expect(screen.getByText("Employee")).toBeInTheDocument();
  });
});