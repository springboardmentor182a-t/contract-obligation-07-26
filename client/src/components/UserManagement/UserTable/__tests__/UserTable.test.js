import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import UserTable from "../UserTable";

describe("UserTable", () => {
  const mockHandleEditClick = jest.fn();
  const mockHandleDeactivate = jest.fn();

  const users = [
    {
      id: 1,
      name: "John Doe",
      email: "john@company.com",
      role: "Admin",
      status: "Active",
      lastLogin: "Today",
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane@company.com",
      role: "User",
      status: "Inactive",
      lastLogin: "Yesterday",
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders table headers", () => {
    render(
      <UserTable
        filteredUsers={users}
        loading={false}
        handleEditClick={mockHandleEditClick}
        handleDeactivate={mockHandleDeactivate}
      />
    );

    expect(screen.getByRole("columnheader", { name: "User" })).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: "Role" })).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: "Status" })).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: "Last Login" })).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: "Actions" })).toBeInTheDocument();
  });

  test("shows loading message when loading", () => {
    render(
      <UserTable
        filteredUsers={[]}
        loading={true}
        handleEditClick={mockHandleEditClick}
        handleDeactivate={mockHandleDeactivate}
      />
    );

    expect(screen.getByText("Loading users...")).toBeInTheDocument();
  });

  test("shows no users message when list is empty", () => {
    render(
      <UserTable
        filteredUsers={[]}
        loading={false}
        handleEditClick={mockHandleEditClick}
        handleDeactivate={mockHandleDeactivate}
      />
    );

    expect(screen.getByText("No users found.")).toBeInTheDocument();
  });

  test("renders user information", () => {
    render(
      <UserTable
        filteredUsers={users}
        loading={false}
        handleEditClick={mockHandleEditClick}
        handleDeactivate={mockHandleDeactivate}
      />
    );

    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("john@company.com")).toBeInTheDocument();
    expect(screen.getByText("Jane Smith")).toBeInTheDocument();
    expect(screen.getByText("jane@company.com")).toBeInTheDocument();
  });

  test("renders user roles and statuses", () => {
    render(
      <UserTable
        filteredUsers={users}
        loading={false}
        handleEditClick={mockHandleEditClick}
        handleDeactivate={mockHandleDeactivate}
      />
    );

    expect(screen.getByText("Admin")).toBeInTheDocument();

    const userRole = screen
      .getAllByText("User")
      .find((element) => element.tagName.toLowerCase() === "span");

    expect(userRole).toBeInTheDocument();

    expect(screen.getByText("Active")).toBeInTheDocument();
    expect(screen.getByText("Inactive")).toBeInTheDocument();
  });

  test("renders last login information", () => {
    render(
      <UserTable
        filteredUsers={users}
        loading={false}
        handleEditClick={mockHandleEditClick}
        handleDeactivate={mockHandleDeactivate}
      />
    );

    expect(screen.getByText("Today")).toBeInTheDocument();
    expect(screen.getByText("Yesterday")).toBeInTheDocument();
  });

  test("uses Recent when lastLogin is missing", () => {
    const userWithoutLogin = [
      {
        id: 3,
        name: "Alex Brown",
        email: "alex@company.com",
        role: "User",
        status: "Active",
      },
    ];

    render(
      <UserTable
        filteredUsers={userWithoutLogin}
        loading={false}
        handleEditClick={mockHandleEditClick}
        handleDeactivate={mockHandleDeactivate}
      />
    );

    expect(screen.getByText("Recent")).toBeInTheDocument();
  });

  test("generates user initials", () => {
    render(
      <UserTable
        filteredUsers={users}
        loading={false}
        handleEditClick={mockHandleEditClick}
        handleDeactivate={mockHandleDeactivate}
      />
    );

    expect(screen.getByText("JD")).toBeInTheDocument();
    expect(screen.getByText("JS")).toBeInTheDocument();
  });

  test("calls handleEditClick with selected user", () => {
    render(
      <UserTable
        filteredUsers={users}
        loading={false}
        handleEditClick={mockHandleEditClick}
        handleDeactivate={mockHandleDeactivate}
      />
    );

    const editButtons = screen.getAllByTitle("Edit User");

    fireEvent.click(editButtons[0]);

    expect(mockHandleEditClick).toHaveBeenCalledWith(users[0]);
  });

  test("calls handleDeactivate with user id", () => {
    render(
      <UserTable
        filteredUsers={users}
        loading={false}
        handleEditClick={mockHandleEditClick}
        handleDeactivate={mockHandleDeactivate}
      />
    );

    const deactivateButtons = screen.getAllByTitle("Deactivate User");

    fireEvent.click(deactivateButtons[0]);

    expect(mockHandleDeactivate).toHaveBeenCalledWith(1);
  });

  test("uses user_id for deactivate when available", () => {
    const userWithUserId = [
      {
        user_id: 99,
        id: 1,
        name: "Test User",
        email: "test@company.com",
        role: "User",
        status: "Active",
      },
    ];

    render(
      <UserTable
        filteredUsers={userWithUserId}
        loading={false}
        handleEditClick={mockHandleEditClick}
        handleDeactivate={mockHandleDeactivate}
      />
    );

    fireEvent.click(screen.getByTitle("Deactivate User"));

    expect(mockHandleDeactivate).toHaveBeenCalledWith(99);
  });

  test("renders correct number of user rows", () => {
    const { container } = render(
      <UserTable
        filteredUsers={users}
        loading={false}
        handleEditClick={mockHandleEditClick}
        handleDeactivate={mockHandleDeactivate}
      />
    );

    const rows = container.querySelectorAll("tbody tr");

    expect(rows).toHaveLength(2);
  });
});