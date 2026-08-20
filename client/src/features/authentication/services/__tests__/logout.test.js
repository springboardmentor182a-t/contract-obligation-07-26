import { logout } from "../logout";
import { apiFetch } from "../../../../utils/api";

jest.mock("../../../../utils/api", () => ({
  apiFetch: jest.fn(),
}));

describe("logout", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("calls apiFetch with the logout endpoint and POST method", async () => {
    const mockResponse = {
      message: "Logged out successfully",
    };

    apiFetch.mockResolvedValue(mockResponse);

    const result = await logout();

    expect(apiFetch).toHaveBeenCalledWith("/auth/logout", {
      method: "POST",
    });

    expect(result).toEqual(mockResponse);
  });

  test("propagates apiFetch errors", async () => {
    apiFetch.mockRejectedValue(new Error("Logout failed"));

    await expect(logout()).rejects.toThrow("Logout failed");
  });
});