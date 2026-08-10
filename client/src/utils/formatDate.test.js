import { formatDate, daysRemaining } from "./formatDate";

describe("formatDate", () => {
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