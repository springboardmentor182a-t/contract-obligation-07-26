import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import EditUserModal from "../EditUserModal";

describe("EditUserModal", () => {
  const mockSetEditingUser = jest.fn();
  const mockHandleUpdateUser = jest.fn((e) => e.preventDefault());

  const user = {
    name: "John Doe",
    email: "john@company.com",
    role: "User",
    status: "Active",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("does not render when editingUser is null", () => {
    render(
      <EditUserModal
        editingUser={null}
        setEditingUser={mockSetEditingUser}
        handleUpdateUser={mockHandleUpdateUser}
      />
    );

    expect(screen.queryByText("Edit User Profile")).not.toBeInTheDocument();
  });

  test("renders modal when editingUser is provided", () => {
    render(
      <EditUserModal
        editingUser={user}
        setEditingUser={mockSetEditingUser}
        handleUpdateUser={mockHandleUpdateUser}
      />
    );

    expect(screen.getByText("Edit User Profile")).toBeInTheDocument();
    expect(screen.getByText("Full Name")).toBeInTheDocument();
    expect(screen.getByText("Email Address")).toBeInTheDocument();
    expect(screen.getByText("Access Role")).toBeInTheDocument();
    expect(screen.getByText("Status")).toBeInTheDocument();
  });

  test("renders existing user information", () => {
    render(
      <EditUserModal
        editingUser={user}
        setEditingUser={mockSetEditingUser}
        handleUpdateUser={mockHandleUpdateUser}
      />
    );

    expect(screen.getByDisplayValue("John Doe")).toBeInTheDocument();
    expect(screen.getByDisplayValue("john@company.com")).toBeInTheDocument();
  });

  test("renders role options", () => {
    render(
      <EditUserModal
        editingUser={user}
        setEditingUser={mockSetEditingUser}
        handleUpdateUser={mockHandleUpdateUser}
      />
    );

    expect(screen.getByRole("option", { name: "Admin" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Manager" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "User" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Auditor" })).toBeInTheDocument();
  });

  test("renders status options", () => {
    render(
      <EditUserModal
        editingUser={user}
        setEditingUser={mockSetEditingUser}
        handleUpdateUser={mockHandleUpdateUser}
      />
    );

    expect(screen.getByRole("option", { name: "Active" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Inactive" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Pending" })).toBeInTheDocument();
  });

  test("updates name when typing", () => {
    render(
      <EditUserModal
        editingUser={user}
        setEditingUser={mockSetEditingUser}
        handleUpdateUser={mockHandleUpdateUser}
      />
    );

    fireEvent.change(screen.getByDisplayValue("John Doe"), {
      target: { value: "Jane Doe" },
    });

    expect(mockSetEditingUser).toHaveBeenCalledWith({
      ...user,
      name: "Jane Doe",
    });
  });

  test("updates email when typing", () => {
    render(
      <EditUserModal
        editingUser={user}
        setEditingUser={mockSetEditingUser}
        handleUpdateUser={mockHandleUpdateUser}
      />
    );

    fireEvent.change(screen.getByDisplayValue("john@company.com"), {
      target: { value: "jane@company.com" },
    });

    expect(mockSetEditingUser).toHaveBeenCalledWith({
      ...user,
      email: "jane@company.com",
    });
  });

  test("updates role when selected", () => {
    render(
      <EditUserModal
        editingUser={user}
        setEditingUser={mockSetEditingUser}
        handleUpdateUser={mockHandleUpdateUser}
      />
    );

    const selects = screen.getAllByRole("combobox");

    fireEvent.change(selects[0], {
      target: { value: "Admin" },
    });

    expect(mockSetEditingUser).toHaveBeenCalledWith({
      ...user,
      role: "Admin",
    });
  });

  test("updates status when selected", () => {
    render(
      <EditUserModal
        editingUser={user}
        setEditingUser={mockSetEditingUser}
        handleUpdateUser={mockHandleUpdateUser}
      />
    );

    const selects = screen.getAllByRole("combobox");

    fireEvent.change(selects[1], {
      target: { value: "Inactive" },
    });

    expect(mockSetEditingUser).toHaveBeenCalledWith({
      ...user,
      status: "Inactive",
    });
  });

  test("calls setEditingUser with null when Cancel is clicked", () => {
    render(
      <EditUserModal
        editingUser={user}
        setEditingUser={mockSetEditingUser}
        handleUpdateUser={mockHandleUpdateUser}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));

    expect(mockSetEditingUser).toHaveBeenCalledWith(null);
  });

  test("calls update handler when Save Changes is clicked", () => {
    render(
      <EditUserModal
        editingUser={user}
        setEditingUser={mockSetEditingUser}
        handleUpdateUser={mockHandleUpdateUser}
      />
    );

    fireEvent.click(
      screen.getByRole("button", { name: "Save Changes" })
    );

    expect(mockHandleUpdateUser).toHaveBeenCalledTimes(1);
  });

  test("renders Save Changes button", () => {
    render(
      <EditUserModal
        editingUser={user}
        setEditingUser={mockSetEditingUser}
        handleUpdateUser={mockHandleUpdateUser}
      />
    );

    expect(
      screen.getByRole("button", { name: "Save Changes" })
    ).toBeInTheDocument();
  });
});