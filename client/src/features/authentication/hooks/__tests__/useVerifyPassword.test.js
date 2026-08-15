import { renderHook } from "@testing-library/react";
import useVerifyPassword from "../useVerifyPassword";

describe("useVerifyPassword", () => {
  test("renders without crashing", () => {
    const { result } = renderHook(() => useVerifyPassword());

    expect(result.current).toEqual({});
  });

  test("returns an empty object", () => {
    const { result } = renderHook(() => useVerifyPassword());

    expect(result.current).toEqual({});
    expect(typeof result.current).toBe("object");
  });
});