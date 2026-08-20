import { renderHook, waitFor } from "@testing-library/react";
import axios from "axios";
import { useDashboardData } from "../useDashboardData";

jest.mock("axios");

describe("useDashboardData", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  test("starts with fallback data and loading state", () => {
    axios.get.mockReturnValue(new Promise(() => {}));

    const fallback = { total: 0 };

    const { result } = renderHook(() =>
      useDashboardData("/api/dashboard", fallback)
    );

    expect(result.current.data).toEqual(fallback);
    expect(result.current.loading).toBe(true);
    expect(result.current.error).toBeNull();
  });

  test("fetches dashboard data successfully", async () => {
    const mockData = {
      total: 25,
      active: 15,
      pending: 10,
    };

    axios.get.mockResolvedValue({
      data: mockData,
    });

    const { result } = renderHook(() =>
      useDashboardData("/api/dashboard")
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).toEqual(mockData);
    expect(result.current.error).toBeNull();
  });

  test("calls API with the provided URL", async () => {
    axios.get.mockResolvedValue({
      data: {},
    });

    renderHook(() =>
      useDashboardData("/api/dashboard/stats")
    );

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith(
        "/api/dashboard/stats",
        {
          headers: {},
        }
      );
    });
  });

  test("sends authorization header when token exists", async () => {
    localStorage.setItem("token", "test-token");

    axios.get.mockResolvedValue({
      data: {},
    });

    renderHook(() =>
      useDashboardData("/api/dashboard")
    );

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith(
        "/api/dashboard",
        {
          headers: {
            Authorization: "Bearer test-token",
          },
        }
      );
    });
  });

  test("handles API error", async () => {
    const mockError = new Error("API Error");

    axios.get.mockRejectedValue(mockError);

    const { result } = renderHook(() =>
      useDashboardData("/api/dashboard")
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe(mockError);
  });

  test("keeps fallback data when API request fails", async () => {
    const fallback = {
      total: 0,
      active: 0,
    };

    axios.get.mockRejectedValue(new Error("Network Error"));

    const { result } = renderHook(() =>
      useDashboardData("/api/dashboard", fallback)
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).toEqual(fallback);
  });

  test("refetches when URL changes", async () => {
    axios.get
      .mockResolvedValueOnce({
        data: { value: "first" },
      })
      .mockResolvedValueOnce({
        data: { value: "second" },
      });

    const { result, rerender } = renderHook(
      ({ url }) => useDashboardData(url),
      {
        initialProps: {
          url: "/api/dashboard/one",
        },
      }
    );

    await waitFor(() => {
      expect(result.current.data).toEqual({
        value: "first",
      });
    });

    rerender({
      url: "/api/dashboard/two",
    });

    await waitFor(() => {
      expect(result.current.data).toEqual({
        value: "second",
      });
    });

    expect(axios.get).toHaveBeenCalledTimes(2);
  });
});