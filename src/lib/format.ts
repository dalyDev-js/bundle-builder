const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

/** 27.98 -> "$27.98" */
export const currency = (value: number): string => usd.format(value);

/** 9.99, "/mo" -> "$9.99/mo" */
export const withUnit = (value: number, unit = ""): string =>
  `${currency(value)}${unit}`;
