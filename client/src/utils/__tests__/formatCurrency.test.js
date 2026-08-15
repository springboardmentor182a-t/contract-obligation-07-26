import { formatCurrency } from "../formatCurrency";

describe("formatCurrency", () => {
  test("converts number to string", () => {
    expect(formatCurrency(1000)).toBe("1000");
  });

  test("converts decimal number to string", () => {
    expect(formatCurrency(1234.56)).toBe("1234.56");
  });

  test("keeps string value as string", () => {
    expect(formatCurrency("5000")).toBe("5000");
  });

  test("handles zero", () => {
    expect(formatCurrency(0)).toBe("0");
  });

  test("handles negative number", () => {
    expect(formatCurrency(-250)).toBe("-250");
  });

  test("handles null", () => {
    expect(formatCurrency(null)).toBe("null");
  });

  test("handles undefined", () => {
    expect(formatCurrency(undefined)).toBe("undefined");
  });
});