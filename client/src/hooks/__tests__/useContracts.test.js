import { renderHook, waitFor } from "@testing-library/react";
import axios from "axios";
import { useContracts } from "../useContracts";

jest.mock("axios");

describe("useContracts", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  test("starts with loading state", () => {
    axios.get.mockReturnValue(new Promise(() => {}));

    const { result } = renderHook(() => useContracts());

    expect(result.current.data).toEqual([]);
    expect(result.current.loading).toBe(true);
    expect(result.current.error).toBeNull();
  });

  test("fetches contracts successfully", async () => {
    const mockContracts = [
      { id: 1, name: "Contract A" },
      { id: 2, name: "Contract B" },
    ];

    axios.get.mockResolvedValue({
      data: mockContracts,
    });

    const { result } = renderHook(() => useContracts());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).toEqual(mockContracts);
    expect(result.current.error).toBeNull();
  });

  test("uses default URL", async () => {
    axios.get.mockResolvedValue({
      data: [],
    });

    renderHook(() => useContracts());

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith(
        "/api/contracts/",
        { headers: {} }
      );
    });
  });

  test("uses custom URL", async () => {
    axios.get.mockResolvedValue({
      data: [],
    });

    renderHook(() => useContracts("/api/custom-contracts"));

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith(
        "/api/custom-contracts",
        { headers: {} }
      );
    });
  });

  test("sends authorization header when token exists", async () => {
    localStorage.setItem("token", "test-token");

    axios.get.mockResolvedValue({
      data: [],
    });

    renderHook(() => useContracts());

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith(
        "/api/contracts/",
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

    const { result } = renderHook(() => useContracts());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe(mockError);
    expect(result.current.data).toEqual([]);
  });

  test("setData updates contract data", async () => {
    axios.get.mockResolvedValue({
      data: [],
    });

    const { result } = renderHook(() => useContracts());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    const newData = [{ id: 3, name: "New Contract" }];

    result.current.setData(newData);

    await waitFor(() => {
      expect(result.current.data).toEqual(newData);
    });
  });

  test("refetches when URL changes", async () => {
    axios.get
      .mockResolvedValueOnce({
        data: [{ id: 1, name: "First Contract" }],
      })
      .mockResolvedValueOnce({
        data: [{ id: 2, name: "Second Contract" }],
      });

    const { result, rerender } = renderHook(
      ({ url }) => useContracts(url),
      {
        initialProps: {
          url: "/api/contracts/1",
        },
      }
    );

    await waitFor(() => {
      expect(result.current.data).toEqual([
        { id: 1, name: "First Contract" },
      ]);
    });

    rerender({ url: "/api/contracts/2" });

    await waitFor(() => {
      expect(result.current.data).toEqual([
        { id: 2, name: "Second Contract" },
      ]);
    });

    expect(axios.get).toHaveBeenCalledTimes(2);
  });
});