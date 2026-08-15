import { renderHook, waitFor } from "@testing-library/react";
import axios from "axios";
import { useObligations } from "../useObligations";

jest.mock("axios");

describe("useObligations", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  test("starts with loading state and empty data", () => {
    axios.get.mockReturnValue(new Promise(() => {}));

    const { result } = renderHook(() => useObligations());

    expect(result.current.data).toEqual([]);
    expect(result.current.loading).toBe(true);
    expect(result.current.error).toBeNull();
  });

  test("fetches obligations successfully", async () => {
    const mockObligations = [
      { id: 1, title: "Payment Obligation" },
      { id: 2, title: "Renewal Obligation" },
    ];

    axios.get.mockResolvedValue({
      data: mockObligations,
    });

    const { result } = renderHook(() => useObligations());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).toEqual(mockObligations);
    expect(result.current.error).toBeNull();
  });

  test("uses default URL", async () => {
    axios.get.mockResolvedValue({
      data: [],
    });

    renderHook(() => useObligations());

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith(
        "/api/obligations",
        { headers: {} }
      );
    });
  });

  test("uses custom URL", async () => {
    axios.get.mockResolvedValue({
      data: [],
    });

    renderHook(() =>
      useObligations("/api/custom-obligations")
    );

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith(
        "/api/custom-obligations",
        { headers: {} }
      );
    });
  });

  test("sends authorization header when token exists", async () => {
    localStorage.setItem("token", "test-token");

    axios.get.mockResolvedValue({
      data: [],
    });

    renderHook(() => useObligations());

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith(
        "/api/obligations",
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

    const { result } = renderHook(() => useObligations());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe(mockError);
    expect(result.current.data).toEqual([]);
  });

  test("setData updates obligations", async () => {
    axios.get.mockResolvedValue({
      data: [],
    });

    const { result } = renderHook(() => useObligations());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    const newObligations = [
      { id: 3, title: "New Obligation" },
    ];

    result.current.setData(newObligations);

    await waitFor(() => {
      expect(result.current.data).toEqual(newObligations);
    });
  });

  test("refetches when URL changes", async () => {
    axios.get
      .mockResolvedValueOnce({
        data: [{ id: 1, title: "First Obligation" }],
      })
      .mockResolvedValueOnce({
        data: [{ id: 2, title: "Second Obligation" }],
      });

    const { result, rerender } = renderHook(
      ({ url }) => useObligations(url),
      {
        initialProps: {
          url: "/api/obligations/one",
        },
      }
    );

    await waitFor(() => {
      expect(result.current.data).toEqual([
        { id: 1, title: "First Obligation" },
      ]);
    });

    rerender({
      url: "/api/obligations/two",
    });

    await waitFor(() => {
      expect(result.current.data).toEqual([
        { id: 2, title: "Second Obligation" },
      ]);
    });

    expect(axios.get).toHaveBeenCalledTimes(2);
  });
});