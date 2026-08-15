import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import RiskDistributionChart from "../RiskDistributionChart";

describe("RiskDistributionChart", () => {
  test("renders Risk Distribution heading", () => {
    render(<RiskDistributionChart />);

    expect(screen.getByText("Risk Distribution")).toBeInTheDocument();
  });

  test("renders donut chart", () => {
    const { container } = render(<RiskDistributionChart />);

    expect(container.querySelector("svg")).toBeInTheDocument();
    expect(container.querySelectorAll("circle")).toHaveLength(5);
  });

  test("shows total cases by default", () => {
    render(<RiskDistributionChart />);

    expect(screen.getByText("60")).toBeInTheDocument();
    expect(screen.getByText("Total Cases")).toBeInTheDocument();
  });

  test("renders all risk legends", () => {
    render(<RiskDistributionChart />);

    expect(screen.getByText("Low Risk")).toBeInTheDocument();
    expect(screen.getByText("Medium Risk")).toBeInTheDocument();
    expect(screen.getByText("High Risk")).toBeInTheDocument();
    expect(screen.getByText("Critical Risk")).toBeInTheDocument();
  });

  test("renders correct risk values", () => {
    render(<RiskDistributionChart />);

    expect(screen.getByText("34")).toBeInTheDocument();
    expect(screen.getByText("18")).toBeInTheDocument();
    expect(screen.getByText("6")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
  });

  test("shows Low Risk when hovered", () => {
    render(<RiskDistributionChart />);

    const lowRisk = screen.getAllByText("Low Risk")[0];

    fireEvent.mouseEnter(lowRisk);

    expect(screen.queryByText("Total Cases")).not.toBeInTheDocument();
    expect(screen.getAllByText("Low Risk")).toHaveLength(2);
    expect(screen.getAllByText("34")).toHaveLength(2);
  });

  test("shows Medium Risk when hovered", () => {
    render(<RiskDistributionChart />);

    const mediumRisk = screen.getAllByText("Medium Risk")[0];

    fireEvent.mouseEnter(mediumRisk);

    expect(screen.queryByText("Total Cases")).not.toBeInTheDocument();
    expect(screen.getAllByText("Medium Risk")).toHaveLength(2);
    expect(screen.getAllByText("18")).toHaveLength(2);
  });

  test("shows High Risk when hovered", () => {
    render(<RiskDistributionChart />);

    const highRisk = screen.getAllByText("High Risk")[0];

    fireEvent.mouseEnter(highRisk);

    expect(screen.queryByText("Total Cases")).not.toBeInTheDocument();
    expect(screen.getAllByText("High Risk")).toHaveLength(2);
    expect(screen.getAllByText("6")).toHaveLength(2);
  });

  test("shows Critical Risk when hovered", () => {
    render(<RiskDistributionChart />);

    const criticalRisk = screen.getAllByText("Critical Risk")[0];

    fireEvent.mouseEnter(criticalRisk);

    expect(screen.queryByText("Total Cases")).not.toBeInTheDocument();
    expect(screen.getAllByText("Critical Risk")).toHaveLength(2);
    expect(screen.getAllByText("2")).toHaveLength(2);
  });

  test("returns to total cases after mouse leaves", () => {
    render(<RiskDistributionChart />);

    const lowRisk = screen.getAllByText("Low Risk")[0];

    fireEvent.mouseEnter(lowRisk);
    fireEvent.mouseLeave(lowRisk);

    expect(screen.getByText("Total Cases")).toBeInTheDocument();
    expect(screen.getByText("60")).toBeInTheDocument();
  });
});