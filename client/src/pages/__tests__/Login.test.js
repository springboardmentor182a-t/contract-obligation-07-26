import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";

import Login from "../Login";
import { UIProvider } from "../../context/UIContext";
import {
  canAccessRoute,
  getDefaultRouteForRole,
  isKnownRole,
  sidebarPermissions,
} from "../../utils/sidebarPermissions";

const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => {
  const actual = jest.requireActual("react-router-dom");

  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

function renderLogin() {
  return render(
    <UIProvider>
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    </UIProvider>
  );
}

beforeEach(() => {
  mockNavigate.mockClear();
  localStorage.clear();
  sessionStorage.clear();

  global.fetch = jest.fn();
});

afterEach(() => {
  jest.restoreAllMocks();
});


test("FE_RBAC_001: Employee has full configured sidebar and route access", () => {
  const expectedPermissions = [
    "Dashboard",
    "Contract Repository",
    "Obligation Tracker",
    "Renewal Dashboard",
    "Compliance",
    "Reports & Analytics",
    "Notifications",
    "Quick Actions",
    "Calendar",
    "Audit Logs",
    "Organization Management",
    "Settings",
  ];
  const expectedRoutes = [
    "/dashboard",
    "/repository",
    "/contract-repository",
    "/obligations",
    "/renewal-dashboard",
    "/compliance",
    "/reports",
    "/notifications",
    "/quick-actions",
    "/calendar",
    "/audit",
    "/organizations",
    "/settings",
  ];

  expect(sidebarPermissions.Employee).toEqual(expectedPermissions);
  expect(isKnownRole("Employee")).toBe(true);
  expect(getDefaultRouteForRole("Employee")).toBe("/dashboard");
  expectedRoutes.forEach((route) => {
    expect(canAccessRoute("Employee", route)).toBe(true);
  });
});


test("FE_AUTH_001: renders the login page", () => {
  renderLogin();

  expect(
    screen.getByRole("heading", {
      name: /welcome back/i,
    })
  ).toBeInTheDocument();

  expect(
    screen.getByLabelText(/email address/i)
  ).toBeInTheDocument();

  expect(
    screen.getByLabelText(/^password$/i)
  ).toBeInTheDocument();

  expect(
    screen.getByRole("button", {
      name: /sign in to contractiq/i,
    })
  ).toBeInTheDocument();
});


test("FE_AUTH_002: shows validation for empty email and password", async () => {
  const user = userEvent.setup();

  renderLogin();

  const signInButton = screen.getByRole("button", {
    name: /sign in to contractiq/i,
  });

  await user.click(signInButton);

  expect(
    screen.getByText("Email is required")
  ).toBeInTheDocument();

  expect(
    screen.getByText("Password is required")
  ).toBeInTheDocument();

  expect(global.fetch).not.toHaveBeenCalled();
});


test("FE_AUTH_003: logs in successfully and redirects to the permitted default page", async () => {
  global.fetch
    .mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        access_token: "test-access-token",
        token_type: "bearer",
        role: "Administrator",
        name: "Test Administrator",
      }),
    })
    .mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        full_name: "Test Administrator",
        role: "Administrator",
        email: "admin@example.com",
      }),
    });

  const user = userEvent.setup();

  renderLogin();

  await user.type(
    screen.getByLabelText(/email address/i),
    "admin@example.com"
  );

  await user.type(
    screen.getByLabelText(/^password$/i),
    "ValidPassword@123"
  );

  await user.click(
    screen.getByRole("button", {
      name: /sign in to contractiq/i,
    })
  );

  await waitFor(() => {
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining("/auth/login"),
      expect.objectContaining({
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })
    );
  });

  expect(
    localStorage.getItem("token") || sessionStorage.getItem("token")
  ).toBe("test-access-token");

  await waitFor(() => {
    expect(mockNavigate).toHaveBeenCalledWith(
      "/dashboard"
    );
  });
});
