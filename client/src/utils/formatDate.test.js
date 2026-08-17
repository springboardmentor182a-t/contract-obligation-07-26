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
  test("formats a valid date correctly", () => {
    expect(formatDate("2026-08-10")).toBe("Aug 10, 2026");
  });

  test("returns empty string when date is missing", () => {
    expect(formatDate("")).toBe("");
  });

  test("formats another valid date correctly", () => {
    expect(formatDate("2026-12-31")).toBe("Dec 31, 2026");
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
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2026-08-10T00:00:00"));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test("returns the number of days remaining", () => {
    expect(daysRemaining("2026-08-20")).toBe(10);
  });

  test("returns 0 when date is missing", () => {
    expect(daysRemaining("")).toBe(0);
  });

  test("returns negative days for a past date", () => {
    expect(daysRemaining("2026-08-05")).toBe(-5);
  });

  test("returns 0 when target date is today", () => {
    expect(daysRemaining("2026-08-10")).toBe(0);
  });
});