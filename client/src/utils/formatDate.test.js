import { formatDate, daysRemaining } from "./formatDate";

describe("formatDate", () => {
  test("formats valid date", () => {
    expect(formatDate("2026-08-15")).toBe("Aug 15, 2026");
  });

  test("returns empty string for missing date", () => {
    expect(formatDate("")).toBe("");
  });

  test("returns empty string for null", () => {
    expect(formatDate(null)).toBe("");
  });
});

describe("daysRemaining", () => {
  test("returns 0 when date is missing", () => {
    expect(daysRemaining("")).toBe(0);
  });

  test("returns positive number for future date", () => {
    const result = daysRemaining("2099-01-01");

    expect(typeof result).toBe("number");
    expect(result).toBeGreaterThan(0);
  });

  test("returns negative number for past date", () => {
    const result = daysRemaining("2000-01-01");

    expect(typeof result).toBe("number");
    expect(result).toBeLessThan(0);
  });
});