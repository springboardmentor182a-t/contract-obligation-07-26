import React from "react";
import { render, screen } from "@testing-library/react";
import MetricsCard from "../MetricsCard";

jest.mock("lucide-react", () => ({
  TrendingUp: (props) => <svg data-testid="trending-up" {...props} />,
  TrendingDown: (props) => (
    <svg data-testid="trending-down" {...props} />
  ),
}));

const MockIcon = (props) => <svg data-testid="metric-icon" {...props} />;

describe("MetricsCard", () => {
  const defaultProps = {
    title: "Total Contracts",
    value: "120",
    trend: "+12%",
    trendSubtext: "vs last month",
    trendType: "positive",
    icon: MockIcon,
    iconColor: "#ffffff",
    iconBgColor: "#2563eb",
  };

  test("renders title and value", () => {
    render(<MetricsCard {...defaultProps} />);

    expect(screen.getByText("Total Contracts")).toBeInTheDocument();
    expect(screen.getByText("120")).toBeInTheDocument();
  });

  test("renders trend and trend subtext", () => {
    render(<MetricsCard {...defaultProps} />);

    expect(screen.getByText("+12%")).toBeInTheDocument();
    expect(screen.getByText("vs last month")).toBeInTheDocument();
  });

  test("renders positive trend icon", () => {
    render(<MetricsCard {...defaultProps} />);

    expect(screen.getByTestId("trending-up")).toBeInTheDocument();
    expect(screen.queryByTestId("trending-down")).not.toBeInTheDocument();
  });

  test("applies positive trend class", () => {
    render(<MetricsCard {...defaultProps} />);

    const trend = screen.getByText("+12%");
    expect(trend).toHaveClass("color-green");
  });

  test("renders warning trend correctly", () => {
    render(
      <MetricsCard
        {...defaultProps}
        trend="+5%"
        trendType="warning"
      />
    );

    expect(screen.getByTestId("trending-up")).toBeInTheDocument();

    const trend = screen.getByText("+5%");
    expect(trend).toHaveClass("color-red");
  });

  test("does not render trend icon for unsupported trend type", () => {
    render(
      <MetricsCard
        {...defaultProps}
        trend="+3%"
        trendType="neutral"
      />
    );

    expect(screen.queryByTestId("trending-up")).not.toBeInTheDocument();
    expect(screen.queryByTestId("trending-down")).not.toBeInTheDocument();

    expect(screen.getByText("+3%")).toHaveClass("text-muted");
  });

  test("renders placeholder when trend is missing", () => {
    render(
      <MetricsCard
        {...defaultProps}
        trend=""
      />
    );

    expect(
      document.querySelector(".kpi-trend-placeholder")
    ).toBeInTheDocument();

    expect(screen.queryByText("vs last month")).not.toBeInTheDocument();
  });

  test("renders custom metric icon", () => {
    render(<MetricsCard {...defaultProps} />);

    expect(screen.getByTestId("metric-icon")).toBeInTheDocument();
  });

  test("applies icon colors", () => {
    render(<MetricsCard {...defaultProps} />);

    const iconContainer = document.querySelector(".kpi-icon-circle");

    expect(iconContainer).toHaveStyle({
      backgroundColor: "#2563eb",
      color: "#ffffff",
    });
  });

  test("renders without trend subtext", () => {
    render(
      <MetricsCard
        {...defaultProps}
        trendSubtext=""
      />
    );

    expect(screen.getByText("+12%")).toBeInTheDocument();
    expect(screen.queryByText("vs last month")).not.toBeInTheDocument();
  });
});