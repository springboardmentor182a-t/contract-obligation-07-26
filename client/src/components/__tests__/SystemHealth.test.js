import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import SystemHealth from "../SystemHealth";

jest.mock("lucide-react", () => ({
  Zap: () => <span data-testid="zap-icon" />,
}));

describe("SystemHealth", () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders System Health heading", () => {
    global.fetch.mockResolvedValueOnce({
      json: async () => [],
    });

    render(<SystemHealth />);

    expect(screen.getByText("System Health")).toBeInTheDocument();
  });

  test("renders Zap icon", () => {
    global.fetch.mockResolvedValueOnce({
      json: async () => [],
    });

    render(<SystemHealth />);

    expect(screen.getByTestId("zap-icon")).toBeInTheDocument();
  });

  test("fetches system health from API", async () => {
    global.fetch.mockResolvedValueOnce({
      json: async () => [],
    });

    render(<SystemHealth />);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        "http://127.0.0.1:8000/api/contracts/system-health"
      );
    });
  });

  test("renders health items returned by API", async () => {
    global.fetch.mockResolvedValueOnce({
      json: async () => [
        {
          label: "Database",
          status: "Healthy",
          color: "green",
        },
        {
          label: "API Server",
          status: "Operational",
          color: "blue",
        },
        {
          label: "Authentication",
          status: "Healthy",
          color: "green",
        },
      ],
    });

    render(<SystemHealth />);

    expect(await screen.findByText("Database")).toBeInTheDocument();
    expect(screen.getByText("API Server")).toBeInTheDocument();
    expect(screen.getByText("Authentication")).toBeInTheDocument();

    expect(screen.getAllByText("Healthy")).toHaveLength(2);
    expect(screen.getByText("Operational")).toBeInTheDocument();
  });

  test("applies health status colors", async () => {
    global.fetch.mockResolvedValueOnce({
      json: async () => [
        {
          label: "Database",
          status: "Healthy",
          color: "green",
        },
      ],
    });

    const { container } = render(<SystemHealth />);

    await screen.findByText("Database");

    const status = container.querySelector(".health-status");
    const dot = container.querySelector(".status-ping-dot");

    expect(status).toHaveClass("green");
    expect(dot).toHaveClass("green");
  });

  test("renders empty list without crashing", async () => {
    global.fetch.mockResolvedValueOnce({
      json: async () => [],
    });

    const { container } = render(<SystemHealth />);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
    });

    expect(
      container.querySelector(".system-health-list")
    ).toBeInTheDocument();
  });

  test("handles API failure without crashing", async () => {
    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    global.fetch.mockRejectedValueOnce(
      new Error("API error")
    );

    render(<SystemHealth />);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
    });

    expect(
      screen.getByText("System Health")
    ).toBeInTheDocument();

    consoleSpy.mockRestore();
  });
});