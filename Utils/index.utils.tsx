export const safeDateToISOString = (date: string | number | Date) => {
  if (!date) return new Date().toISOString(); // fallback

  const d = new Date(date);
  if (isNaN(d.getTime())) return new Date().toISOString(); // fallback for invalid date

  return d.toISOString();
};

export const parseDate = (date: string | number | Date) => {
  if (!date) return null;
  const d = date instanceof Date ? date : new Date(date);
  return isNaN(d.getTime()) ? null : d;
};
