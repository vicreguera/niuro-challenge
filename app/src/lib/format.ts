export const money = (n: number, cents = false) =>
  n.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: cents ? 2 : 0,
    maximumFractionDigits: cents ? 2 : 0,
  });

/** Words for screen readers: "162 dollars 50". */
export const moneySpoken = (n: number) => {
  const dollars = Math.floor(n);
  const cents = Math.round((n - dollars) * 100);
  return `${dollars.toLocaleString('en-US')} dollars${cents ? ` ${cents}` : ''}`;
};
