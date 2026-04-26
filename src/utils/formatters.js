export function formatOrderValue(value) {
  if (!value && value !== 0) return "—";
  const num = parseFloat(value);
  if (num >= 1_00_00_000) return `₹${(num / 1_00_00_000).toFixed(1)} Cr`;
  if (num >= 1_00_000) return `₹${(num / 1_00_000).toFixed(1)} L`;
  return `₹${num.toLocaleString("en-IN")}`;
}

export function formatPE(value) {
  if (!value && value !== 0) return "—";
  return `${parseFloat(value).toFixed(1)}x`;
}

export function formatPrice(value) {
  if (!value && value !== 0) return "—";
  return `₹${parseFloat(value).toLocaleString("en-IN")}`;
}

export function formatPChange(value) {
  if (!value && value !== 0) return "—";
  const num = parseFloat(value);
  return `${num > 0 ? "+" : ""}${num.toFixed(2)}%`;
}

export function formatVolume(value) {
  if (!value && value !== 0) return "—";
  const num = parseFloat(value);
  if (num >= 1_00_00_000) return `${(num / 1_00_00_000).toFixed(1)}Cr`;
  if (num >= 1_00_000) return `${(num / 1_00_000).toFixed(1)}L`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
  return `${num}`;
}

export function timeAgo(dateValue) {
  if (!dateValue) return "—";
  const diff = Math.floor((Date.now() - new Date(dateValue)) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export function orderPctColor(pct, threshold = 30) {
  const num = parseFloat(pct);
  if (num >= threshold) return { text: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/40" };
  if (num >= threshold / 2) return { text: "text-yellow-400", bg: "bg-yellow-500/10", border: "border-yellow-500/40" };
  return { text: "text-green-400", bg: "bg-green-500/10", border: "border-green-500/40" };
}
