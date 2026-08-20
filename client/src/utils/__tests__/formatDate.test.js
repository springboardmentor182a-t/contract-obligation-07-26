import { formatDate } from "../formatDate";

describe("formatDate", () => {
  test("converts a date to string", () => {
    expect(formatDate("2026-08-15")).toBe("2026-08-15");
  });

  test("converts Date object to string", () => {
    const date = new Date("2026-08-15T00:00:00.000Z");

    expect(formatDate(date)).toBe(String(date));
  });

  test("handles number", () => {
    expect(formatDate(20260815)).toBe("20260815");
  });

  test("handles zero", () => {
    expect(formatDate(0)).toBe("0");
  });

  test("handles null", () => {
    expect(formatDate(null)).toBe("null");
  });

  test("handles undefined", () => {
    expect(formatDate(undefined)).toBe("undefined");
  });

  test("keeps string unchanged", () => {
    expect(formatDate("15/08/2026")).toBe("15/08/2026");
  });
});