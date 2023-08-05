export const formatNumber = (amount: number): string => {
  const formatter = new Intl.NumberFormat('en', { notation: 'compact' });
  return formatter.format(amount);
}