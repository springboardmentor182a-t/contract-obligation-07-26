import { renderHook } from "@testing-library/react";
import useSignup from "../useSignup";

describe("useSignup", () => {
  test("renders without crashing", () => {
    const { result } = renderHook(() => useSignup());

    expect(result.current).toEqual({});
  });

  test("returns an empty object", () => {
    const { result } = renderHook(() => useSignup());

    expect(result.current).toEqual({});
    expect(typeof result.current).toBe("object");
  });
});