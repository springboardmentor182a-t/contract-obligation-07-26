import { formatCurrency } from "./formatCurrency";

describe("formatCurrency", () => {
  test("formats number as USD", () => {
    expect(formatCurrency(1000)).toBe("$1,000.00");
  });

  test("formats decimal value", () => {
    expect(formatCurrency(1234.56)).toBe("$1,234.56");
  });

  test("formats zero", () => {
    expect(formatCurrency(0)).toBe("$0.00");
  });
  test("handles invalid value", () => {
    expect(formatCurrency("invalid")).toBe("$0.00");
  });
});