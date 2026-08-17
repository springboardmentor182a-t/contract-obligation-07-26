import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import MetricsCard from "../MetricsCard";

describe("MetricsCard Component", () => {
  test("renders the title and value", () => {
    render(
      <MetricsCard
        title="Total Contracts"
        value="100"
      />
    );

    expect(screen.getByText("Total Contracts")).toBeInTheDocument();
    expect(screen.getByText("100")).toBeInTheDocument();
  });

  test("renders percentage when provided", () => {
    render(
      <MetricsCard
        title="Renewing Soon"
        value="20"
        percentage="+10%"
      />
    );

    expect(screen.getByText("+10%")).toBeInTheDocument();
  });

  test("does not render percentage when not provided", () => {
    render(
      <MetricsCard
        title="Expired"
        value="5"
      />
    );

    expect(screen.queryByText(/%/)).not.toBeInTheDocument();
  });

  test("renders different metric titles correctly", () => {
    const { rerender } = render(
      <MetricsCard
        title="Auto Renewal"
        value="30"
      />
    );

    expect(screen.getByText("Auto Renewal")).toBeInTheDocument();

    rerender(
      <MetricsCard
        title="Manual Renewal"
        value="15"
      />
    );

    expect(screen.getByText("Manual Renewal")).toBeInTheDocument();
    expect(screen.getByText("15")).toBeInTheDocument();
  });
});