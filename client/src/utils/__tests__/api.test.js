import { API_BASE_URL, apiFetch } from "../api";

describe("api", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("uses the correct API base URL", () => {
    expect(API_BASE_URL).toBe(
      process.env.REACT_APP_API_URL || "http://localhost:8000"
    );
  });

  test("fetches data successfully", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        status: 200,
        statusText: "OK",
        json: () =>
          Promise.resolve({
            message: "Success",
          }),
      })
    );

    const result = await apiFetch("/api/test");

    expect(global.fetch).toHaveBeenCalledWith(
      `${API_BASE_URL}/api/test`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    expect(result).toEqual({
      message: "Success",
    });
  });

  test("merges custom headers with default headers", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        status: 200,
        statusText: "OK",
        json: () => Promise.resolve({ success: true }),
      })
    );

    await apiFetch("/api/test", {
      headers: {
        Authorization: "Bearer test-token",
      },
    });

    expect(global.fetch).toHaveBeenCalledWith(
      `${API_BASE_URL}/api/test`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer test-token",
        },
      }
    );
  });

  test("passes request options to fetch", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        status: 200,
        statusText: "OK",
        json: () => Promise.resolve({ success: true }),
      })
    );

    await apiFetch("/api/test", {
      method: "POST",
      body: JSON.stringify({ name: "Test" }),
    });

    expect(global.fetch).toHaveBeenCalledWith(
      `${API_BASE_URL}/api/test`,
      {
        method: "POST",
        body: JSON.stringify({ name: "Test" }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  });

  test("throws error when response is not ok", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        status: 404,
        statusText: "Not Found",
      })
    );

    await expect(apiFetch("/api/test")).rejects.toThrow(
      "API error: 404 Not Found"
    );
  });

  test("returns null for 204 response", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        status: 204,
        statusText: "No Content",
      })
    );

    const result = await apiFetch("/api/test");

    expect(result).toBeNull();
  });

  test("returns JSON response", async () => {
    const data = {
      id: 1,
      name: "Contract",
    };

    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        status: 200,
        statusText: "OK",
        json: () => Promise.resolve(data),
      })
    );

    const result = await apiFetch("/api/contracts");

    expect(result).toEqual(data);
  });

  test("returns null when JSON parsing fails", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        status: 200,
        statusText: "OK",
        json: () => Promise.reject(new Error("Invalid JSON")),
      })
    );

    const result = await apiFetch("/api/test");

    expect(result).toBeNull();
  });
});