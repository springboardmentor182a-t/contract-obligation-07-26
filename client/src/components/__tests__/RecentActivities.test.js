import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import RecentActivities from "../RecentActivities";

describe("RecentActivities", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  const mockActivities = [
    {
      icon: "📄",
      description: "New contract created",
      time: "10 minutes ago",
      color: "blue",
    },
    {
      icon: "✅",
      description: "Contract approved",
      time: "1 hour ago",
      color: "green",
    },
  ];

  test("renders Recent Activities heading", () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve([]),
      })
    );

    render(<RecentActivities />);

    expect(screen.getByText("Recent Activities")).toBeInTheDocument();
  });

  test("renders View all button", () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve([]),
      })
    );

    render(<RecentActivities />);

    expect(
      screen.getByRole("button", { name: "View all" })
    ).toBeInTheDocument();
  });

  test("fetches recent activities from API", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve([]),
      })
    );

    render(<RecentActivities />);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        `${process.env.REACT_APP_API_BASE_URL}/api/contracts/recent-activities`
      );
    });
  });

  test("renders activities returned by API", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve(mockActivities),
      })
    );

    render(<RecentActivities />);

    await waitFor(() => {
      expect(
        screen.getByText("New contract created")
      ).toBeInTheDocument();

      expect(
        screen.getByText("Contract approved")
      ).toBeInTheDocument();
    });

    expect(screen.getByText("10 minutes ago")).toBeInTheDocument();
    expect(screen.getByText("1 hour ago")).toBeInTheDocument();
  });

  test("renders activity icons", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve(mockActivities),
      })
    );

    render(<RecentActivities />);

    await waitFor(() => {
      expect(screen.getByText("📄")).toBeInTheDocument();
      expect(screen.getByText("✅")).toBeInTheDocument();
    });
  });

  test("applies activity color classes", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve(mockActivities),
      })
    );

    const { container } = render(<RecentActivities />);

    await waitFor(() => {
      expect(
        screen.getByText("New contract created")
      ).toBeInTheDocument();
    });

    const wrappers = container.querySelectorAll(
      ".activity-icon-wrapper"
    );

    expect(wrappers[0]).toHaveClass("blue");
    expect(wrappers[1]).toHaveClass("green");
  });

  test("renders empty state when there are no activities", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve([]),
      })
    );

    render(<RecentActivities />);

    await waitFor(() => {
      expect(
        screen.getByText("No recent activities available.")
      ).toBeInTheDocument();
    });
  });

  test("handles API failure without crashing", async () => {
    global.fetch = jest.fn(() =>
      Promise.reject(new Error("API Error"))
    );

    const consoleError = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    render(<RecentActivities />);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
    });

    expect(screen.getByText("Recent Activities")).toBeInTheDocument();

    consoleError.mockRestore();
  });
});