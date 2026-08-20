import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Sidebar from "../Sidebar";

const renderSidebar = (props = {}) => {
  const defaultProps = {
    isOpen: false,
    setIsOpen: jest.fn(),
  };

  return render(
    <MemoryRouter initialEntries={["/dashboard"]}>
      <Sidebar {...defaultProps} {...props} />
    </MemoryRouter>
  );
};

describe("Sidebar", () => {
  test("renders ContractIQ brand", () => {
    renderSidebar();

    expect(screen.getByText("ContractIQ")).toBeInTheDocument();
  });

  test("renders Main Menu", () => {
    renderSidebar();

    expect(screen.getByText("Main Menu")).toBeInTheDocument();
  });

  test("renders all main navigation items", () => {
    renderSidebar();

    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Contracts")).toBeInTheDocument();
    expect(screen.getByText("Obligations")).toBeInTheDocument();
    expect(screen.getByText("Renewals")).toBeInTheDocument();
    expect(screen.getByText("Compliance")).toBeInTheDocument();
    expect(screen.getByText("Reports")).toBeInTheDocument();
    expect(screen.getByText("Notifications")).toBeInTheDocument();
    expect(screen.getByText("AI Fraud")).toBeInTheDocument();
  });

  test("renders system navigation items", () => {
    renderSidebar();

    expect(screen.getByText("System")).toBeInTheDocument();
    expect(screen.getByText("Transactions")).toBeInTheDocument();
    expect(screen.getByText("Tax Estimators")).toBeInTheDocument();
    expect(screen.getByText("User Management")).toBeInTheDocument();
    expect(screen.getByText("Settings")).toBeInTheDocument();
  });

  test("renders navigation links with correct paths", () => {
    renderSidebar();

    expect(screen.getByText("Dashboard").closest("a")).toHaveAttribute(
      "href",
      "/dashboard"
    );

    expect(screen.getByText("Contracts").closest("a")).toHaveAttribute(
      "href",
      "/contracts"
    );

    expect(screen.getByText("Obligations").closest("a")).toHaveAttribute(
      "href",
      "/obligations"
    );

    expect(screen.getByText("Renewals").closest("a")).toHaveAttribute(
      "href",
      "/renewals"
    );

    expect(screen.getByText("Compliance").closest("a")).toHaveAttribute(
      "href",
      "/compliance"
    );

    expect(screen.getByText("Reports").closest("a")).toHaveAttribute(
      "href",
      "/reports"
    );

    expect(
      screen.getByText("Notifications").closest("a")
    ).toHaveAttribute("href", "/notifications");

    expect(screen.getByText("AI Fraud").closest("a")).toHaveAttribute(
      "href",
      "/ai-analysis"
    );
  });

  test("renders settings links correctly", () => {
    renderSidebar();

    expect(
      screen.getByText("Transactions").closest("a")
    ).toHaveAttribute("href", "/transactions");

    expect(
      screen.getByText("Tax Estimators").closest("a")
    ).toHaveAttribute("href", "/tax-estimators");

    expect(
      screen.getByText("User Management").closest("a")
    ).toHaveAttribute("href", "/users");

    expect(screen.getByText("Settings").closest("a")).toHaveAttribute(
      "href",
      "/settings"
    );
  });

  test("calls setIsOpen when navigation link is clicked", () => {
    const setIsOpen = jest.fn();

    renderSidebar({
      setIsOpen,
    });

    fireEvent.click(screen.getByText("Contracts"));

    expect(setIsOpen).toHaveBeenCalledWith(false);
  });

  test("shows mobile overlay when sidebar is open", () => {
    const { container } = renderSidebar({
      isOpen: true,
    });

    expect(
      container.querySelector(".fixed.inset-0")
    ).toBeInTheDocument();
  });

  test("closes sidebar when mobile overlay is clicked", () => {
    const setIsOpen = jest.fn();

    const { container } = renderSidebar({
      isOpen: true,
      setIsOpen,
    });

    const overlay = container.querySelector(".fixed.inset-0");

    fireEvent.click(overlay);

    expect(setIsOpen).toHaveBeenCalledWith(false);
  });

  test("applies active class to current route", () => {
    render(
      <MemoryRouter initialEntries={["/contracts/details"]}>
        <Sidebar isOpen={false} setIsOpen={jest.fn()} />
      </MemoryRouter>
    );

    const contractsLink = screen.getByText("Contracts").closest("a");

    expect(contractsLink.className).toContain("bg-blue-600/20");
    expect(contractsLink.className).toContain("text-white");
  });

  test("closes sidebar when brand link is clicked", () => {
    const setIsOpen = jest.fn();

    renderSidebar({
      isOpen: true,
      setIsOpen,
    });

    fireEvent.click(screen.getByText("ContractIQ"));

    expect(setIsOpen).toHaveBeenCalledWith(false);
  });
});