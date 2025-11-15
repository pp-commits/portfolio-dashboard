
export function formatCurrency(num?: number | null) {
  if (num === null || num === undefined || Number.isNaN(num)) return '—';
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(num);
}
