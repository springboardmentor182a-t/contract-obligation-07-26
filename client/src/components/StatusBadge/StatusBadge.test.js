import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import StatusBadge from "./StatusBadge";

describe("StatusBadge Component", () => {
  test("renders Active status", () => {
    render(<StatusBadge status="Active" />);
    const badge = screen.getByText("Active");

    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass("badge", "success");
  });

  test("renders Review status", () => {
    render(<StatusBadge status="Review" />);
    const badge = screen.getByText("Review");

    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass("badge", "warning");
  });

  test("renders Draft status", () => {
    render(<StatusBadge status="Draft" />);
    const badge = screen.getByText("Draft");

    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass("badge", "draft");
  });

  test("renders unknown status", () => {
    render(<StatusBadge status="Pending" />);

    expect(screen.getByText("Pending")).toBeInTheDocument();
describe("StatusBadge", () => {
  test("renders Active status with success class", () => {
    render(<StatusBadge status="Active" />);

    const badge = screen.getByText("Active");

    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass("badge");
    expect(badge).toHaveClass("success");
  });

  test("renders Review status with warning class", () => {
    render(<StatusBadge status="Review" />);

    const badge = screen.getByText("Review");

    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass("badge");
    expect(badge).toHaveClass("warning");
  });

  test("renders Draft status with draft class", () => {
    render(<StatusBadge status="Draft" />);

    const badge = screen.getByText("Draft");

    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass("badge");
    expect(badge).toHaveClass("draft");
  });
});