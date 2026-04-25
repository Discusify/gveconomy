export function formatMoneyFromCents(
  value: bigint | number | string
) {
  const numberValue = typeof value === "bigint" ? Number(value) : Number(value);

  const amount = numberValue / 100;

  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function moneyToCents(value: string): bigint {
  // limpia input tipo "10.50"
  const normalized = value.replace(",", ".");

  const [whole, decimals = "0"] = normalized.split(".");

  const safeDecimals = (decimals + "00").slice(0, 2);

  return BigInt(whole + safeDecimals);
}