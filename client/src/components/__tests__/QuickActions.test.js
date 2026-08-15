import React from "react";
import { render, screen } from "@testing-library/react";
import QuickActions from "../QuickActions";

describe("QuickActions", () => {
  test("renders Quick Actions label", () => {
    render(<QuickActions />);

    expect(screen.getByText("QUICK ACTIONS:")).toBeInTheDocument();
  });

  test("renders Add User button", () => {
    render(<QuickActions />);

    expect(screen.getByRole("button", { name: "Add User" })).toBeInTheDocument();
  });

  test("renders Generate Report button", () => {
    render(<QuickActions />);

    expect(
      screen.getByRole("button", { name: "Generate Report" })
    ).toBeInTheDocument();
  });

  test("renders Review Risks button", () => {
    render(<QuickActions />);

    expect(
      screen.getByRole("button", { name: "Review Risks" })
    ).toBeInTheDocument();
  });

  test("renders Export Analytics button", () => {
    render(<QuickActions />);

    expect(
      screen.getByRole("button", { name: "Export Analytics" })
    ).toBeInTheDocument();
  });

  test("renders exactly four action buttons", () => {
    render(<QuickActions />);

    expect(screen.getAllByRole("button")).toHaveLength(4);
  });

  test("applies correct color classes", () => {
    render(<QuickActions />);

    expect(screen.getByRole("button", { name: "Add User" }))
      .toHaveClass("action-pill", "color-blue");

    expect(screen.getByRole("button", { name: "Generate Report" }))
      .toHaveClass("action-pill", "color-green");

    expect(screen.getByRole("button", { name: "Review Risks" }))
      .toHaveClass("action-pill", "color-orange");

    expect(screen.getByRole("button", { name: "Export Analytics" }))
      .toHaveClass("action-pill", "color-purple");
  });

  test("renders quick actions container", () => {
    const { container } = render(<QuickActions />);

    expect(
      container.querySelector(".quick-actions-bar")
    ).toBeInTheDocument();

    expect(
      container.querySelector(".quick-actions-buttons")
    ).toBeInTheDocument();
  });
});