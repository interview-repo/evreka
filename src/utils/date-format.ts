export function formatDate(date: Date | string): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return dateObj.toLocaleDateString("tr-TR", {
    month: "short",
    day: "numeric",
    year: "2-digit",
  });
}
