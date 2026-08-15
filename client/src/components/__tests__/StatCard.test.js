import React from "react";
import { render, screen } from "@testing-library/react";
import StatCard from "../StatCard";

describe("StatCard", () => {
  test("renders title and metric", () => {
    render(
      <StatCard
        title="Total Contracts"
        metric="120"
        icon="📄"
        colorTheme="blue"
      />
    );

    expect(screen.getByText("Total Contracts")).toBeInTheDocument();
    expect(screen.getByText("120")).toBeInTheDocument();
  });

  test("renders icon", () => {
    render(
      <StatCard
        title="Contracts"
        metric="50"
        icon="📄"
        colorTheme="blue"
      />
    );

    expect(screen.getByText("📄")).toBeInTheDocument();
  });

  test("renders trend text when provided", () => {
    render(
      <StatCard
        title="Contracts"
        metric="50"
        trendDirection="up"
        trendText="12% increase"
        icon="📄"
        colorTheme="green"
      />
    );

    expect(screen.getByText("12% increase")).toBeInTheDocument();

    expect(
      document.querySelector(".fa-arrow-up")
    ).toBeInTheDocument();
  });

  test("renders down trend correctly", () => {
    render(
      <StatCard
        title="Risks"
        metric="10"
        trendDirection="down"
        trendText="5% decrease"
        icon="⚠️"
        colorTheme="red"
      />
    );

    expect(screen.getByText("5% decrease")).toBeInTheDocument();

    expect(
      document.querySelector(".fa-arrow-down")
    ).toBeInTheDocument();
  });

  test("renders neutral trend correctly", () => {
    render(
      <StatCard
        title="Obligations"
        metric="25"
        trendDirection="neutral"
        trendText="No change"
        icon="✓"
        colorTheme="amber"
      />
    );

    expect(screen.getByText("No change")).toBeInTheDocument();

    expect(
      document.querySelector(".fa-minus")
    ).toBeInTheDocument();
  });

  test("does not render trend section when trendText is missing", () => {
    const { container } = render(
      <StatCard
        title="Contracts"
        metric="50"
        icon="📄"
        colorTheme="blue"
      />
    );

    expect(
      container.querySelector(".fa-arrow-up")
    ).not.toBeInTheDocument();

    expect(
      container.querySelector(".fa-arrow-down")
    ).not.toBeInTheDocument();

    expect(
      container.querySelector(".fa-minus")
    ).not.toBeInTheDocument();
  });

  test("applies selected color theme", () => {
    const { container } = render(
      <StatCard
        title="Contracts"
        metric="50"
        icon="📄"
        colorTheme="purple"
      />
    );

    const iconContainer = container.querySelector(".bg-purple-50");

    expect(iconContainer).toBeInTheDocument();
    expect(iconContainer).toHaveClass("text-purple-600");
  });

  test("falls back to blue theme for invalid color theme", () => {
    const { container } = render(
      <StatCard
        title="Contracts"
        metric="50"
        icon="📄"
        colorTheme="invalid"
      />
    );

    const iconContainer = container.querySelector(".bg-blue-50");

    expect(iconContainer).toBeInTheDocument();
    expect(iconContainer).toHaveClass("text-blue-600");
  });
});