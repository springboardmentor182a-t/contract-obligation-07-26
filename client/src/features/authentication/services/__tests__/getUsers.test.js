import { getUsers } from "../getUsers";

import { apiFetch } from "../../../../utils/api";

jest.mock("../../../../utils/api", () => ({
  apiFetch: jest.fn(),
}));
describe("getUsers", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("calls apiFetch with /users/ endpoint", async () => {
    apiFetch.mockResolvedValue([]);

    await getUsers();

    expect(apiFetch).toHaveBeenCalledWith("/users/");
  });

  test("returns users returned by apiFetch", async () => {
    const mockUsers = [
      { id: 1, name: "User One" },
      { id: 2, name: "User Two" },
    ];

    apiFetch.mockResolvedValue(mockUsers);

    const result = await getUsers();

    expect(result).toEqual(mockUsers);
  });

  test("returns empty array when no users exist", async () => {
    apiFetch.mockResolvedValue([]);

    const result = await getUsers();

    expect(result).toEqual([]);
  });

  test("propagates apiFetch error", async () => {
    const error = new Error("API Error");

    apiFetch.mockRejectedValue(error);

    await expect(getUsers()).rejects.toThrow("API Error");
  });
});