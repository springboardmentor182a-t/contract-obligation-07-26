import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import ActivityChart from "../ActivityChart";

jest.mock("recharts", () => ({
  ResponsiveContainer: ({ children }) => (
    <div data-testid="responsive-container">{children}</div>
  ),
  LineChart: ({ children }) => <div data-testid="line-chart">{children}</div>,
  Line: ({ dataKey }) => <div data-testid={`line-${dataKey}`} />,
  XAxis: () => <div data-testid="x-axis" />,
  YAxis: () => <div data-testid="y-axis" />,
  CartesianGrid: () => <div data-testid="cartesian-grid" />,
  Tooltip: () => <div data-testid="tooltip" />,
}));

describe("ActivityChart", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve([
            { month: "Jan", drafts: 10, executed: 5 },
            { month: "Feb", drafts: 15, executed: 8 },
          ]),
      })
    );
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("shows loading message initially", () => {
    global.fetch.mockImplementation(
      () => new Promise(() => {})
    );

    render(<ActivityChart />);

    expect(
      screen.getByText("Loading activity...")
    ).toBeInTheDocument();
  });

  test("fetches activity data from the API", async () => {
    render(<ActivityChart />);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        "/api/dashboard/activity"
      );
    });
  });

  test("renders chart after activity data is loaded", async () => {
    render(<ActivityChart />);

    expect(
      await screen.findByText("Contract Activity Overview")
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        "Volume of contracts processed over the last 6 months"
      )
    ).toBeInTheDocument();

    expect(
      screen.getByTestId("line-chart")
    ).toBeInTheDocument();
  });

  test("renders Drafts and Executed legends", async () => {
    render(<ActivityChart />);

    await screen.findByText("Contract Activity Overview");

    expect(screen.getByText("Drafts")).toBeInTheDocument();
    expect(screen.getByText("Executed")).toBeInTheDocument();
  });

  test("renders both chart lines", async () => {
    render(<ActivityChart />);

    await screen.findByText("Contract Activity Overview");

    expect(screen.getByTestId("line-drafts")).toBeInTheDocument();
    expect(screen.getByTestId("line-executed")).toBeInTheDocument();
  });

  test("handles API failure without crashing", async () => {
    global.fetch.mockRejectedValueOnce(new Error("API error"));

    const consoleError = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    render(<ActivityChart />);

    expect(
      screen.getByText("Loading activity...")
    ).toBeInTheDocument();

    await waitFor(() => {
      expect(consoleError).toHaveBeenCalled();
    });

    consoleError.mockRestore();
  });
});
