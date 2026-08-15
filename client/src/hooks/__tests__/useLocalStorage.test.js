import React from "react";
import { renderHook } from "@testing-library/react";
import useLocalStorage from "../useLocalStorage";

describe("useLocalStorage", () => {
  test("renders without crashing", () => {
    const { result } = renderHook(() => useLocalStorage());

    expect(result.current).toEqual({});
  });

  test("returns an empty object", () => {
    const { result } = renderHook(() => useLocalStorage());

    expect(result.current).toEqual({});
    expect(typeof result.current).toBe("object");
  });
});