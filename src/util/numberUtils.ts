export const formatNumber = (amount: number): string => {
  const formatter = new Intl.NumberFormat('en', { notation: 'compact' });
  return formatter.format(amount);
}

// split number into parts and add remainder to last element
export const splitNumber = (num: number, parts: number): Array<number> => {
  const quotient = Math.floor(num / parts);
  const remainder = num % parts;
  const result = Array(parts).fill(quotient);
  // Distribute the remainder to the last element
  result[parts - 1] += remainder;
  return result;
}