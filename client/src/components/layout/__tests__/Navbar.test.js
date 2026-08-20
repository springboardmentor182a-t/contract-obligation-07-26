import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Navbar from "../Navbar";

const mockNavigate = jest.fn();
const mockToggleTheme = jest.fn();
const mockToggleSidebar = jest.fn();

jest.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
}));

jest.mock("axios");

jest.mock("../../../context/ThemeContext.jsx", () => ({
  useTheme: () => ({
    isDarkMode: false,
    toggleTheme: mockToggleTheme,
  }),
}));

jest.mock("../../../context/NotificationContext.jsx", () => ({
  useNotifications: () => ({
    notifications: [],
    unreadCount: 0,
    markAsRead: jest.fn(),
    markAllAsRead: jest.fn(),
  }),
}));

jest.mock("../../../features/authentication/services/logout", () => ({
  logout: jest.fn(),
}));

describe("Navbar", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  test("renders ContractIQ and Dashboard", () => {
    render(<Navbar toggleSidebar={mockToggleSidebar} />);

    expect(screen.getByText("ContractIQ")).toBeInTheDocument();
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
  });

  test("renders search input", () => {
    render(<Navbar toggleSidebar={mockToggleSidebar} />);

    expect(
      screen.getByPlaceholderText("Search contracts, obligations...")
    ).toBeInTheDocument();
  });

  test("renders Quick Action button", () => {
    render(<Navbar toggleSidebar={mockToggleSidebar} />);

    expect(screen.getByText("Quick Action")).toBeInTheDocument();
  });

  test("opens Quick Action menu", () => {
    render(<Navbar toggleSidebar={mockToggleSidebar} />);

    fireEvent.click(screen.getByText("Quick Action"));

    expect(screen.getByText("New Contract")).toBeInTheDocument();
    expect(screen.getByText("Add User")).toBeInTheDocument();
    expect(screen.getByText("Upload PDF")).toBeInTheDocument();
    expect(screen.getByText("Create Obligation")).toBeInTheDocument();
  });

  test("navigates to contracts", () => {
    render(<Navbar toggleSidebar={mockToggleSidebar} />);

    fireEvent.click(screen.getByText("Quick Action"));
    fireEvent.click(screen.getByText("New Contract"));

    expect(mockNavigate).toHaveBeenCalledWith("/contracts");
  });

  test("toggles theme", () => {
    render(<Navbar toggleSidebar={mockToggleSidebar} />);

    fireEvent.click(
      screen.getByTitle("Toggle Dark/Light Mode")
    );

    expect(mockToggleTheme).toHaveBeenCalled();
  });

  test("opens notifications", () => {
    render(<Navbar toggleSidebar={mockToggleSidebar} />);

    fireEvent.click(screen.getByTitle("Notifications"));

    expect(
      screen.getByText("Notifications (0 new)")
    ).toBeInTheDocument();

    expect(
      screen.getByText("No new notifications")
    ).toBeInTheDocument();
  });

  test("opens profile menu", () => {
    render(<Navbar toggleSidebar={mockToggleSidebar} />);

    fireEvent.click(screen.getByText("Admin User"));

    expect(screen.getByText("My Profile")).toBeInTheDocument();
    expect(screen.getByText("Account Settings")).toBeInTheDocument();
    expect(screen.getByText("Log Out")).toBeInTheDocument();
  });

  test("uses stored user name", () => {
    localStorage.setItem("userName", "Anjali");

    render(<Navbar toggleSidebar={mockToggleSidebar} />);

    expect(screen.getByText("Anjali")).toBeInTheDocument();
  });

  test("calls toggleSidebar", () => {
    render(<Navbar toggleSidebar={mockToggleSidebar} />);

    fireEvent.click(
      screen.getByLabelText("Toggle Sidebar")
    );

    expect(mockToggleSidebar).toHaveBeenCalled();
  });
});