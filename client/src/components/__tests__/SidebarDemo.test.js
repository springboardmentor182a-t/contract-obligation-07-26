import React from "react";
import { render, screen } from "@testing-library/react";
import SidebarDemo from "../SidebarDemo";

jest.mock("../DashboardIcons", () => ({
  DashboardIcon: () => <span data-testid="dashboard-icon" />,
  ContractsIcon: () => <span data-testid="contracts-icon" />,
  ObligationsIcon: () => <span data-testid="obligations-icon" />,
  ComplianceIcon: () => <span data-testid="compliance-icon" />,
  SettingsIcon: () => <span data-testid="settings-icon" />,
}));

describe("SidebarDemo", () => {
  test("renders ContractIQ UI heading", () => {
    render(<SidebarDemo />);

    expect(screen.getByText("ContractIQ UI")).toBeInTheDocument();
  });

  test("renders all sidebar menu items", () => {
    render(<SidebarDemo />);

    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Contracts")).toBeInTheDocument();
    expect(screen.getByText("Obligations")).toBeInTheDocument();
    expect(screen.getByText("Compliance")).toBeInTheDocument();
    expect(screen.getByText("Settings")).toBeInTheDocument();
  });

  test("renders all sidebar icons", () => {
    render(<SidebarDemo />);

    expect(screen.getByTestId("dashboard-icon")).toBeInTheDocument();
    expect(screen.getByTestId("contracts-icon")).toBeInTheDocument();
    expect(screen.getByTestId("obligations-icon")).toBeInTheDocument();
    expect(screen.getByTestId("compliance-icon")).toBeInTheDocument();
    expect(screen.getByTestId("settings-icon")).toBeInTheDocument();
  });

  test("renders exactly five menu labels", () => {
    render(<SidebarDemo />);

    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Contracts")).toBeInTheDocument();
    expect(screen.getByText("Obligations")).toBeInTheDocument();
    expect(screen.getByText("Compliance")).toBeInTheDocument();
    expect(screen.getByText("Settings")).toBeInTheDocument();
  });
});