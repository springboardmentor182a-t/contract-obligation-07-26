import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import UserTable from "./UserTable";

describe("UserTable Component", () => {
  const users = [
    {
      id: 1,
      name: "John Doe",
      role: "Admin",
      department: "IT",
      email: "john@example.com",
      status: "Active",
      last_login: "2026-08-10T10:00:00Z",
    },
  ];

  test("renders user information", () => {
    render(
      <UserTable
        users={users}
const mockUser = {
  id: 1,
  name: "John Doe",
  email: "john@example.com",
  role: "Admin",
  department: "IT",
  status: "Active",
  last_login: "2026-08-10T10:30:00",
};

describe("UserTable", () => {
  test("renders user information correctly", () => {
    render(
      <UserTable
        users={[mockUser]}
        setSelectedUser={jest.fn()}
        onEdit={jest.fn()}
        onDelete={jest.fn()}
      />
    );

    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("Admin")).toBeInTheDocument();
    expect(screen.getByText("IT")).toBeInTheDocument();
    expect(screen.getAllByText("john@example.com").length).toBeGreaterThan(0);
    expect(screen.getByText("Active")).toBeInTheDocument();
  });

  test("renders table headings", () => {
    render(
      <UserTable
        users={users}
    expect(screen.getAllByText("john@example.com")).toHaveLength(2);
    expect(screen.getByText("Admin")).toBeInTheDocument();
    expect(screen.getByText("IT")).toBeInTheDocument();
    expect(screen.getByText("Active")).toBeInTheDocument();
  });

  test("displays the first letter of the user's name", () => {
    render(
      <UserTable
        users={[mockUser]}
        setSelectedUser={jest.fn()}
        onEdit={jest.fn()}
        onDelete={jest.fn()}
      />
    );

    expect(screen.getByText("User")).toBeInTheDocument();
    expect(screen.getByText("Role")).toBeInTheDocument();
    expect(screen.getByText("Department")).toBeInTheDocument();
    expect(screen.getByText("Email")).toBeInTheDocument();
    expect(screen.getByText("Status")).toBeInTheDocument();
    expect(screen.getByText("Last Login")).toBeInTheDocument();
    expect(screen.getByText("Actions")).toBeInTheDocument();
  });

  test("shows No users found when list is empty", () => {
    expect(screen.getByText("J")).toBeInTheDocument();
  });

  test("displays No users found when users list is empty", () => {
    render(
      <UserTable
        users={[]}
        setSelectedUser={jest.fn()}
        onEdit={jest.fn()}
        onDelete={jest.fn()}
      />
    );

    expect(screen.getByText("No users found.")).toBeInTheDocument();
  });

  test("calls setSelectedUser when view icon is clicked", () => {
  test("calls setSelectedUser when view action is clicked", () => {
    const setSelectedUser = jest.fn();

    const { container } = render(
      <UserTable
        users={users}
        users={[mockUser]}
        setSelectedUser={setSelectedUser}
        onEdit={jest.fn()}
        onDelete={jest.fn()}
      />
    );

    const icons = container.querySelectorAll("svg");
    fireEvent.click(icons[0]);

    expect(setSelectedUser).toHaveBeenCalledWith(users[0]);
  });

  test("calls onEdit when edit icon is clicked", () => {
    const actionIcons = container.querySelectorAll(".actions svg");

    fireEvent.click(actionIcons[0]);

    expect(setSelectedUser).toHaveBeenCalledWith(mockUser);
  });

  test("calls onEdit when edit action is clicked", () => {
    const onEdit = jest.fn();

    const { container } = render(
      <UserTable
        users={users}
        users={[mockUser]}
        setSelectedUser={jest.fn()}
        onEdit={onEdit}
        onDelete={jest.fn()}
      />
    );

    const icons = container.querySelectorAll("svg");
    fireEvent.click(icons[1]);

    expect(onEdit).toHaveBeenCalledWith(users[0]);
  });

  test("calls onDelete when delete icon is clicked", () => {
    const actionIcons = container.querySelectorAll(".actions svg");

    fireEvent.click(actionIcons[1]);

    expect(onEdit).toHaveBeenCalledWith(mockUser);
  });

  test("calls onDelete when delete action is clicked", () => {
    const onDelete = jest.fn();

    const { container } = render(
      <UserTable
        users={users}
        users={[mockUser]}
        setSelectedUser={jest.fn()}
        onEdit={jest.fn()}
        onDelete={onDelete}
      />
    );

    const icons = container.querySelectorAll("svg");
    fireEvent.click(icons[2]);

    expect(onDelete).toHaveBeenCalledWith(users[0]);
    const actionIcons = container.querySelectorAll(".actions svg");

    fireEvent.click(actionIcons[2]);

    expect(onDelete).toHaveBeenCalledWith(mockUser);
  });
});