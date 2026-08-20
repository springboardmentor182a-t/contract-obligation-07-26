import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import AddUserModal from "../AddUserModal";

describe("AddUserModal", () => {
  const mockSetAddingUser = jest.fn();
  const mockHandleAddUserSubmit = jest.fn((e) => e.preventDefault());

  const user = {
    name: "",
    email: "",
    role: "User",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("does not render when addingUser is null", () => {
    render(
      <AddUserModal
        addingUser={null}
        setAddingUser={mockSetAddingUser}
        handleAddUserSubmit={mockHandleAddUserSubmit}
      />
    );

    expect(screen.queryByText("Add New User")).not.toBeInTheDocument();
  });

  test("renders modal when addingUser is provided", () => {
    render(
      <AddUserModal
        addingUser={user}
        setAddingUser={mockSetAddingUser}
        handleAddUserSubmit={mockHandleAddUserSubmit}
      />
    );

    expect(screen.getByText("Add New User")).toBeInTheDocument();
    expect(screen.getByText("Full Name")).toBeInTheDocument();
    expect(screen.getByText("Email Address")).toBeInTheDocument();
    expect(screen.getByText("Access Role")).toBeInTheDocument();
  });

  test("renders name and email inputs", () => {
    render(
      <AddUserModal
        addingUser={user}
        setAddingUser={mockSetAddingUser}
        handleAddUserSubmit={mockHandleAddUserSubmit}
      />
    );

    expect(
      screen.getByPlaceholderText("e.g. Sarah Jenkins")
    ).toBeInTheDocument();

    expect(
      screen.getByPlaceholderText("s.jenkins@company.com")
    ).toBeInTheDocument();
  });

  test("renders role options", () => {
    render(
      <AddUserModal
        addingUser={user}
        setAddingUser={mockSetAddingUser}
        handleAddUserSubmit={mockHandleAddUserSubmit}
      />
    );

    expect(screen.getByRole("option", { name: "Admin" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Manager" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "User" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Auditor" })).toBeInTheDocument();
  });

  test("updates name when typing", () => {
    render(
      <AddUserModal
        addingUser={user}
        setAddingUser={mockSetAddingUser}
        handleAddUserSubmit={mockHandleAddUserSubmit}
      />
    );

    fireEvent.change(
      screen.getByPlaceholderText("e.g. Sarah Jenkins"),
      { target: { value: "Sarah Jenkins" } }
    );

    expect(mockSetAddingUser).toHaveBeenCalledWith({
      ...user,
      name: "Sarah Jenkins",
    });
  });

  test("updates email when typing", () => {
    render(
      <AddUserModal
        addingUser={user}
        setAddingUser={mockSetAddingUser}
        handleAddUserSubmit={mockHandleAddUserSubmit}
      />
    );

    fireEvent.change(
      screen.getByPlaceholderText("s.jenkins@company.com"),
      { target: { value: "sarah@company.com" } }
    );

    expect(mockSetAddingUser).toHaveBeenCalledWith({
      ...user,
      email: "sarah@company.com",
    });
  });

  test("updates role when selected", () => {
    render(
      <AddUserModal
        addingUser={user}
        setAddingUser={mockSetAddingUser}
        handleAddUserSubmit={mockHandleAddUserSubmit}
      />
    );

    fireEvent.change(screen.getByRole("combobox"), {
      target: { value: "Admin" },
    });

    expect(mockSetAddingUser).toHaveBeenCalledWith({
      ...user,
      role: "Admin",
    });
  });

  test("calls setAddingUser with null when Cancel is clicked", () => {
    render(
      <AddUserModal
        addingUser={user}
        setAddingUser={mockSetAddingUser}
        handleAddUserSubmit={mockHandleAddUserSubmit}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));

    expect(mockSetAddingUser).toHaveBeenCalledWith(null);
  });

  test("calls submit handler when Create Account is clicked", () => {
    render(
      <AddUserModal
        addingUser={user}
        setAddingUser={mockSetAddingUser}
        handleAddUserSubmit={mockHandleAddUserSubmit}
      />
    );

    fireEvent.click(
      screen.getByRole("button", { name: "Create Account" })
    );

    expect(mockHandleAddUserSubmit).toHaveBeenCalledTimes(1);
  });

  test("renders Create Account button", () => {
    render(
      <AddUserModal
        addingUser={user}
        setAddingUser={mockSetAddingUser}
        handleAddUserSubmit={mockHandleAddUserSubmit}
      />
    );

    expect(
      screen.getByRole("button", { name: "Create Account" })
    ).toBeInTheDocument();
  });
});