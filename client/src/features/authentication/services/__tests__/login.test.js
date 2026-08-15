import { login } from "../login";
import { apiFetch } from "../../../../utils/api";

jest.mock("../../../../utils/api", () => ({
  apiFetch: jest.fn(),
}));

describe("login", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("calls apiFetch with login endpoint", async () => {
    apiFetch.mockResolvedValue({ token: "test-token" });

    const credentials = {
      email: "test@example.com",
      password: "password123",
    };

    await login(credentials);

    expect(apiFetch).toHaveBeenCalledWith("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
  });

  test("returns login response", async () => {
    const mockResponse = {
      token: "test-token",
      user: {
        id: 1,
        email: "test@example.com",
      },
    };

    apiFetch.mockResolvedValue(mockResponse);

    const credentials = {
      email: "test@example.com",
      password: "password123",
    };

    const result = await login(credentials);

    expect(result).toEqual(mockResponse);
  });

  test("sends the provided credentials", async () => {
    apiFetch.mockResolvedValue({ success: true });

    const credentials = {
      username: "anjali",
      password: "secret",
    };

    await login(credentials);

    expect(apiFetch).toHaveBeenCalledWith(
      "/auth/login",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify(credentials),
      })
    );
  });

  test("propagates apiFetch error", async () => {
    apiFetch.mockRejectedValue(new Error("Invalid credentials"));

    const credentials = {
      email: "wrong@example.com",
      password: "wrong",
    };

    await expect(login(credentials)).rejects.toThrow(
      "Invalid credentials"
    );
  });
});