export function formatCurrency(value, { currency = "USD", emptyDash = true } = {}) {
  if (emptyDash && (value === 0 || value === null || value === undefined)) return "\u2014";
  try {
    return new Intl.NumberFormat("en-US", { style: "currency", currency, maximumFractionDigits: 0 }).format(value);
  } catch (err) {
    return "$" + Number(value || 0).toLocaleString();
  }
}

export default formatCurrency;
