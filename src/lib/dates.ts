const formatter = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

export function formatDate(iso: string): string {
  return formatter.format(new Date(iso));
}

export function daysUntil(iso: string): number {
  const ms = new Date(iso).getTime() - Date.now();
  return Math.ceil(ms / 86_400_000);
}

export type ExpiryStatus = "valid" | "expiring" | "expired";

/** Expiring = within 90 days, the typical renewal window WCN chases. */
export function expiryStatus(iso: string): ExpiryStatus {
  const days = daysUntil(iso);
  if (days < 0) return "expired";
  if (days <= 90) return "expiring";
  return "valid";
}
