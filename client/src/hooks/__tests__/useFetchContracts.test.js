import { renderHook, waitFor } from "@testing-library/react";
import axios from "axios";
import { useFetchContracts } from "../useFetchContracts";

jest.mock("axios");

describe("useFetchContracts", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("starts with loading state and empty data", () => {
    axios.get.mockReturnValue(new Promise(() => {}));

    const { result } = renderHook(() => useFetchContracts());

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

    const { result } = renderHook(() => useFetchContracts());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).toEqual(mockContracts);
    expect(result.current.error).toBeNull();
  });

  test("uses default API URL", async () => {
    axios.get.mockResolvedValue({
      data: [],
    });

    renderHook(() => useFetchContracts());

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith("/api/contracts/");
    });
  });

  test("uses custom API URL", async () => {
    axios.get.mockResolvedValue({
      data: [],
    });

    renderHook(() => useFetchContracts("/api/custom-contracts"));

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith(
        "/api/custom-contracts"
      );
    });
  });

  test("handles API error", async () => {
    const mockError = new Error("API Error");

    axios.get.mockRejectedValue(mockError);

    const { result } = renderHook(() => useFetchContracts());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe(mockError);
    expect(result.current.data).toEqual([]);
  });

  test("sets loading to false after successful request", async () => {
    axios.get.mockResolvedValue({
      data: [],
    });

    const { result } = renderHook(() => useFetchContracts());

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
  });

  test("setData updates contract data", async () => {
    axios.get.mockResolvedValue({
      data: [],
    });

    const { result } = renderHook(() => useFetchContracts());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    const newContracts = [
      { id: 3, name: "New Contract" },
    ];

    result.current.setData(newContracts);

    await waitFor(() => {
      expect(result.current.data).toEqual(newContracts);
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
      ({ url }) => useFetchContracts(url),
      {
        initialProps: {
          url: "/api/contracts/one",
        },
      }
    );

    await waitFor(() => {
      expect(result.current.data).toEqual([
        { id: 1, name: "First Contract" },
      ]);
    });

    rerender({
      url: "/api/contracts/two",
    });

    await waitFor(() => {
      expect(result.current.data).toEqual([
        { id: 2, name: "Second Contract" },
      ]);
    });

    expect(axios.get).toHaveBeenCalledTimes(2);
  });
});