export default function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toISOString().slice(2, 10).replace(/-/g, "-");
}
