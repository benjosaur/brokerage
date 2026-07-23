const formatter = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

export function formatDate(iso: string): string {
  return formatter.format(new Date(iso));
}

// Converts YYYY-MM-DD to DD-MM-YYYY, Paddock's table dialect
// (client/src/utils/date.ts). Leaves other inputs unchanged.
export function formatYmdToDmy(value?: string | null): string {
  if (!value) return "";
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  return match ? `${match[3]}-${match[2]}-${match[1]}` : value;
}

export function daysUntil(iso: string): number {
  const ms = new Date(iso).getTime() - Date.now();
  return Math.ceil(ms / 86_400_000);
}

export function isWithinLastDays(iso: string, days: number): boolean {
  const age = Date.now() - new Date(iso).getTime();
  return age >= 0 && age < days * 86_400_000;
}

export type ExpiryStatus = "valid" | "expiring" | "expired";

/** Expiring = within 90 days, the typical renewal window WCN chases. */
export function expiryStatus(iso: string): ExpiryStatus {
  const days = daysUntil(iso);
  if (days < 0) return "expired";
  if (days <= 90) return "expiring";
  return "valid";
}
