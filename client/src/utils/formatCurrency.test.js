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
import { formatCurrency } from './formatCurrency';

describe('formatCurrency', () => {
  test('formats a valid amount as USD currency', () => {
    expect(formatCurrency(2400000)).toBe('$2,400,000.00');
  });

  test('formats zero correctly', () => {
    expect(formatCurrency(0)).toBe('$0.00');
  });

  test('returns $0.00 for an invalid amount', () => {
    expect(formatCurrency('abc')).toBe('$0.00');
  });

  test('formats decimal amounts correctly', () => {
    expect(formatCurrency(1234.56)).toBe('$1,234.56');
  });
});