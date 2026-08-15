import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import AIRecommendations from "../AIRecommendations";

jest.mock("lucide-react", () => ({
  Sparkles: () => <span data-testid="sparkles-icon" />,
  ArrowRight: () => <span data-testid="arrow-right-icon" />,
}));

describe("AIRecommendations", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("renders AI Recommendations heading", () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve([]),
      })
    );

    render(<AIRecommendations />);

    expect(screen.getByText("AI Recommendations")).toBeInTheDocument();
  });

  test("renders Sparkles icon", () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve([]),
      })
    );

    render(<AIRecommendations />);

    expect(screen.getByTestId("sparkles-icon")).toBeInTheDocument();
  });

  test("fetches recommendations from API", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve([]),
      })
    );

    render(<AIRecommendations />);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        `${process.env.REACT_APP_API_BASE_URL}/api/contracts/ai-recommendations`
      );
    });
  });

  test("renders recommendations returned by API", async () => {
    const mockRecommendations = [
      {
        icon: "⚠️",
        message: "Review contracts expiring soon",
        color: "orange",
      },
      {
        icon: "✅",
        message: "Update missing obligations",
        color: "green",
      },
    ];

    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve(mockRecommendations),
      })
    );

    render(<AIRecommendations />);

    await waitFor(() => {
      expect(
        screen.getByText("Review contracts expiring soon")
      ).toBeInTheDocument();

      expect(
        screen.getByText("Update missing obligations")
      ).toBeInTheDocument();
    });
  });

  test("renders recommendation icons", async () => {
    const mockRecommendations = [
      {
        icon: "⚠️",
        message: "Check contract risk",
        color: "orange",
      },
      {
        icon: "💡",
        message: "Renew contract",
        color: "blue",
      },
    ];

    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve(mockRecommendations),
      })
    );

    render(<AIRecommendations />);

    await waitFor(() => {
      expect(screen.getByText("⚠️")).toBeInTheDocument();
      expect(screen.getByText("💡")).toBeInTheDocument();
    });
  });

  test("applies recommendation color class", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve([
            {
              icon: "⚠️",
              message: "Check contract risk",
              color: "orange",
            },
          ]),
      })
    );

    render(<AIRecommendations />);

    await waitFor(() => {
      expect(screen.getByText("Check contract risk")).toBeInTheDocument();
    });

    const box = screen
      .getByText("Check contract risk")
      .closest(".rec-box");

    expect(box).toHaveClass("rec-box");
    expect(box).toHaveClass("orange");
  });

  test("renders ArrowRight icon", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve([
            {
              icon: "🔔",
              message: "Test recommendation",
              color: "blue",
            },
          ]),
      })
    );

    render(<AIRecommendations />);

    await waitFor(() => {
      expect(
        screen.getByText("Test recommendation")
      ).toBeInTheDocument();
    });

    expect(
      screen.getByTestId("arrow-right-icon")
    ).toBeInTheDocument();
  });

  test("renders empty list without crashing", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve([]),
      })
    );

    render(<AIRecommendations />);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
    });

    expect(
      screen.getByText("AI Recommendations")
    ).toBeInTheDocument();
  });

  test("handles API failure without crashing", async () => {
    global.fetch = jest.fn(() =>
      Promise.reject(new Error("API Error"))
    );

    const consoleError = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    render(<AIRecommendations />);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
    });

    expect(
      screen.getByText("AI Recommendations")
    ).toBeInTheDocument();

    consoleError.mockRestore();
  });
});