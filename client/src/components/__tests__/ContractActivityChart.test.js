import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import ContractActivityChart from "../ContractActivityChart";

describe("ContractActivityChart", () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
test("renders chart title and fetches activity data", async () => {
  global.fetch.mockResolvedValue({
    json: jest.fn().mockResolvedValue({
      activePoints: [
        { x: 100, y: 150, label: "Jan", val: 20 },
      ],
      newPoints: [
        { x: 100, y: 180, label: "Jan", val: 10 },
      ],
    }),
  });

  render(<ContractActivityChart />);

  expect(
    screen.getByText("Contract Activity")
  ).toBeInTheDocument();

  await waitFor(() => {
    expect(global.fetch).toHaveBeenCalledWith(
      "http://127.0.0.1:8000/api/contracts/activity-chart"
    );
  });

  await waitFor(() => {
    expect(screen.getByText("Jan")).toBeInTheDocument();
  });

  expect(screen.getByText("Active")).toBeInTheDocument();
  expect(screen.getByText("New")).toBeInTheDocument();
});
  
  test("renders chart points from API response", async () => {
    global.fetch.mockResolvedValue({
      json: jest.fn().mockResolvedValue({
        activePoints: [
          { x: 100, y: 150, label: "Jan", val: 20 },
          { x: 200, y: 130, label: "Feb", val: 30 },
        ],
        newPoints: [
          { x: 100, y: 180, label: "Jan", val: 10 },
        ],
      }),
    });

    const { container } = render(<ContractActivityChart />);

    await waitFor(() => {
      expect(screen.getByText("Jan")).toBeInTheDocument();
    });

    expect(screen.getByText("Feb")).toBeInTheDocument();

    const circles = container.querySelectorAll("circle");
    expect(circles.length).toBeGreaterThan(0);
  });

  test("shows tooltip when an active chart point is hovered", async () => {
    global.fetch.mockResolvedValue({
      json: jest.fn().mockResolvedValue({
        activePoints: [
          { x: 100, y: 150, label: "Jan", val: 20 },
        ],
        newPoints: [],
      }),
    });

    const { container } = render(<ContractActivityChart />);

    await waitFor(() => {
      expect(screen.getByText("Jan")).toBeInTheDocument();
    });

    const pointGroup = container.querySelector(".chart-point-group");

    fireEvent.mouseEnter(pointGroup);

    expect(screen.getByText("Active Contracts")).toBeInTheDocument();
    expect(screen.getByText("20 Units (Jan)")).toBeInTheDocument();

    fireEvent.mouseLeave(pointGroup);

    expect(
      screen.queryByText("Active Contracts")
    ).not.toBeInTheDocument();
  });

  test("handles API failure without crashing", async () => {
    const consoleError = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    global.fetch.mockRejectedValue(new Error("Network error"));

    render(<ContractActivityChart />);

    expect(
      screen.getByText("Contract Activity")
    ).toBeInTheDocument();

    await waitFor(() => {
      expect(consoleError).toHaveBeenCalled();
    });

    consoleError.mockRestore();
  });
});