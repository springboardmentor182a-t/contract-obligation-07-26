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
    <MemoryRouter>
      <UIProvider>
        <Login />
      </UIProvider>
    </MemoryRouter>
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
    "User Management",
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
    "/audit",
    "/user-management",
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
    screen.getByLabelText(/role/i)
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
    screen.getByRole("alert")
  ).toHaveTextContent(
    "Please enter your email and password."
  );

  expect(global.fetch).not.toHaveBeenCalled();
});


test("FE_AUTH_003: logs in successfully and redirects to the permitted default page", async () => {
  global.fetch.mockImplementation(async (url) => {
    if (url.includes("/api/auth/login")) {
      return {
        ok: true,
        json: async () => ({
          access_token: "test-access-token",
          token_type: "bearer",
          role: "Administrator",
          name: "Test Administrator",
        }),
      };
    }
    return {
      ok: true,
      json: async () => ({
        id: 1,
        email: "admin@example.com",
        name: "Test Administrator",
        role: "Administrator",
      }),
    };
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

  await user.selectOptions(
    screen.getByLabelText(/role/i),
    "Administrator"
  );

  await user.click(
    screen.getByRole("button", {
      name: /sign in to contractiq/i,
    })
  );

  await waitFor(() => {
    expect(global.fetch).toHaveBeenCalledWith(
      "/api/auth/login",
      expect.objectContaining({
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })
    );
  });

  expect(
    sessionStorage.getItem("token")
  ).toBe("test-access-token");

  expect(
    sessionStorage.getItem("role")
  ).toBe("Administrator");

  expect(
    sessionStorage.getItem("name")
  ).toBe("Test Administrator");

  await waitFor(() => {
    expect(mockNavigate).toHaveBeenCalledWith(
      "/dashboard"
    );
  });
});
