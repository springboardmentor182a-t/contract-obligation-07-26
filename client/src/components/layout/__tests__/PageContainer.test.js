import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import PageContainer from "../PageContainer";

jest.mock("../Sidebar.jsx", () => ({
  __esModule: true,
  default: ({ isOpen }) => (
    <div data-testid="sidebar">
      {isOpen ? "Sidebar Open" : "Sidebar Closed"}
    </div>
  ),
}));

jest.mock("../Navbar.jsx", () => ({
  __esModule: true,
  default: ({ toggleSidebar }) => (
    <button data-testid="navbar" onClick={toggleSidebar}>
      Navbar
    </button>
  ),
}));

describe("PageContainer", () => {
  test("renders Sidebar", () => {
    render(
      <PageContainer>
        <div>Test Content</div>
      </PageContainer>
    );

    expect(screen.getByTestId("sidebar")).toBeInTheDocument();
  });

  test("renders Navbar", () => {
    render(
      <PageContainer>
        <div>Test Content</div>
      </PageContainer>
    );

    expect(screen.getByTestId("navbar")).toBeInTheDocument();
  });

  test("renders children", () => {
    render(
      <PageContainer>
        <div>Test Content</div>
      </PageContainer>
    );

    expect(screen.getByText("Test Content")).toBeInTheDocument();
  });

  test("sidebar is closed initially", () => {
    render(
      <PageContainer>
        <div>Test Content</div>
      </PageContainer>
    );

    expect(screen.getByText("Sidebar Closed")).toBeInTheDocument();
  });

  test("opens sidebar when Navbar is clicked", () => {
    render(
      <PageContainer>
        <div>Test Content</div>
      </PageContainer>
    );

    fireEvent.click(screen.getByTestId("navbar"));

    expect(screen.getByText("Sidebar Open")).toBeInTheDocument();
  });

  test("closes sidebar when Navbar is clicked again", () => {
    render(
      <PageContainer>
        <div>Test Content</div>
      </PageContainer>
    );

    fireEvent.click(screen.getByTestId("navbar"));
    fireEvent.click(screen.getByTestId("navbar"));

    expect(screen.getByText("Sidebar Closed")).toBeInTheDocument();
  });
});