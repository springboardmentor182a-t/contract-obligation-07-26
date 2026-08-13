import { MONTH_NAMES } from "../data/constants";

export function formatDate(input, { style = "short" } = {}) {
  const d = input instanceof Date ? input : new Date(input + (typeof input === "string" && input.length === 10 ? "T00:00:00" : ""));
  if (isNaN(d.getTime())) return "";
  const month = MONTH_NAMES[d.getMonth()];
  if (style === "long") return month + " " + d.getDate() + ", " + d.getFullYear();
  return month.slice(0, 3) + " " + d.getDate() + ", " + d.getFullYear();
}

export function pad2(n) {
  return n < 10 ? "0" + n : "" + n;
}

export function dateKey(y, m, d) {
  return y + "-" + pad2(m) + "-" + pad2(d);
}

export function daysInMonth(y, m) {
  return new Date(y, m, 0).getDate();
}

export default formatDate;
