export const safeDateToISOString = (date: string | number | Date) => {
  if (!date) return new Date().toISOString(); // fallback

  const d = new Date(date);
  if (isNaN(d.getTime())) return new Date().toISOString(); // fallback for invalid date

  return d.toISOString();
};

