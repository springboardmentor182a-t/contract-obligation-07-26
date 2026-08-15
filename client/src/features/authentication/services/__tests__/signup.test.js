import { signup } from "../signup";
import { apiFetch } from "../../../../utils/api";

jest.mock("../../../../utils/api", () => ({
  apiFetch: jest.fn(),
}));

describe("signup", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("calls apiFetch with signup endpoint", async () => {
    apiFetch.mockResolvedValue({ success: true });

    const userData = {
      name: "Anjali",
      email: "anjali@example.com",
      password: "password123",
    };

    await signup(userData);

    expect(apiFetch).toHaveBeenCalledWith("/auth/signup", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  });

  test("returns signup response", async () => {
    const mockResponse = {
      success: true,
      message: "Account created successfully",
    };

    apiFetch.mockResolvedValue(mockResponse);

    const userData = {
      name: "Anjali",
      email: "anjali@example.com",
      password: "password123",
    };

    const result = await signup(userData);

    expect(result).toEqual(mockResponse);
  });

  test("propagates apiFetch error", async () => {
    apiFetch.mockRejectedValue(new Error("Signup failed"));

    const userData = {
      name: "Test User",
      email: "test@example.com",
      password: "wrong",
    };

    await expect(signup(userData)).rejects.toThrow("Signup failed");
  });
});