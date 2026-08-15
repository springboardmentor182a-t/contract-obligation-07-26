import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "../ProtectedRoute";

describe("ProtectedRoute", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  test("redirects to login when token is missing", () => {
    render(
      <MemoryRouter initialEntries={["/dashboard"]}>
        <Routes>
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <div>Protected Content</div>
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<div>Login Page</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText("Login Page")).toBeInTheDocument();
    expect(screen.queryByText("Protected Content")).not.toBeInTheDocument();
  });

  test("renders children when token exists", () => {
    localStorage.setItem("token", "test-token");

    render(
      <MemoryRouter initialEntries={["/dashboard"]}>
        <Routes>
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <div>Protected Content</div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText("Protected Content")).toBeInTheDocument();
  });

  test("renders Outlet when token exists and no children are provided", () => {
    localStorage.setItem("token", "test-token");

    render(
      <MemoryRouter initialEntries={["/dashboard"]}>
        <Routes>
          <Route element={<ProtectedRoute />}>
            <Route
              path="/dashboard"
              element={<div>Outlet Content</div>}
            />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText("Outlet Content")).toBeInTheDocument();
  });

  test("does not render protected content without token", () => {
    render(
      <MemoryRouter initialEntries={["/protected"]}>
        <Routes>
          <Route
            path="/protected"
            element={
              <ProtectedRoute>
                <div>Secret Content</div>
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<div>Login Page</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.queryByText("Secret Content")).not.toBeInTheDocument();
    expect(screen.getByText("Login Page")).toBeInTheDocument();
  });
});