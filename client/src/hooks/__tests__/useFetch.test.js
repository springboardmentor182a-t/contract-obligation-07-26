import { renderHook, waitFor } from "@testing-library/react";
import useFetch from "../useFetch";
import { apiFetch } from "../../utils/api";

jest.mock("../../utils/api", () => ({
  apiFetch: jest.fn(),
}));

describe("useFetch", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("starts with loading state", () => {
    apiFetch.mockReturnValue(new Promise(() => {}));

    const { result } = renderHook(() => useFetch("/api/test"));

    expect(result.current.data).toBeNull();
    expect(result.current.loading).toBe(true);
    expect(result.current.error).toBeNull();
  });

  test("fetches data successfully", async () => {
    const mockData = {
      id: 1,
      name: "Test Contract",
    };

    apiFetch.mockResolvedValue(mockData);

    const { result } = renderHook(() => useFetch("/api/contracts"));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).toEqual(mockData);
    expect(result.current.error).toBeNull();
  });

  test("calls apiFetch with endpoint and options", async () => {
    apiFetch.mockResolvedValue({ success: true });

    const options = {
      method: "POST",
      headers: {
        Authorization: "Bearer test-token",
      },
    };

    renderHook(() => useFetch("/api/contracts", options));

    await waitFor(() => {
      expect(apiFetch).toHaveBeenCalledWith(
        "/api/contracts",
        options
      );
    });
  });

  test("handles API error", async () => {
    const mockError = new Error("API Error");

    apiFetch.mockRejectedValue(mockError);

    const { result } = renderHook(() => useFetch("/api/test"));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe(mockError);
    expect(result.current.data).toBeNull();
  });

  test("sets loading to false after successful request", async () => {
    apiFetch.mockResolvedValue({
      message: "Success",
    });

    const { result } = renderHook(() => useFetch("/api/test"));

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
  });

  test("refetches when endpoint changes", async () => {
    apiFetch
      .mockResolvedValueOnce({ value: "first" })
      .mockResolvedValueOnce({ value: "second" });

    const { result, rerender } = renderHook(
      ({ endpoint }) => useFetch(endpoint),
      {
        initialProps: {
          endpoint: "/api/first",
        },
      }
    );

    await waitFor(() => {
      expect(result.current.data).toEqual({
        value: "first",
      });
    });

    rerender({
      endpoint: "/api/second",
    });

    await waitFor(() => {
      expect(result.current.data).toEqual({
        value: "second",
      });
    });

    expect(apiFetch).toHaveBeenCalledTimes(2);
  });

  test("does not update state after unmount", async () => {
    let resolveRequest;

    apiFetch.mockReturnValue(
      new Promise((resolve) => {
        resolveRequest = resolve;
      })
    );

    const { result, unmount } = renderHook(() =>
      useFetch("/api/test")
    );

    unmount();

    resolveRequest({
      data: "late response",
    });

    expect(result.current.data).toBeNull();
  });
});