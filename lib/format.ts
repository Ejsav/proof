const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const num = new Intl.NumberFormat("en-US");

export function formatPrice(value: number): string {
  return usd.format(value);
}

export function formatMiles(value: number): string {
  return `${num.format(value)} mi`;
}
